'use strict';

/**
 * Cosmo-Bot — single entry point (`npm start`, Docker and every host run `node index.js`).
 *
 * This one file plays two roles:
 *
 *   supervisor   (default)        keeps the bot alive. It starts the bot again after .restart,
 *                                 after variable changes (.setping, .setprefix ...) and after a crash.
 *   bot          (COSMO_CHILD=1)  the WhatsApp bot itself. The supervisor starts it with that flag.
 *
 * Exit codes of the bot:
 *   1   fatal (logged out, session replaced)  -> supervisor stops, no loop
 *   64  .shutdown                             -> supervisor stops
 *   any other code or a crash                 -> started again after a short pause
 */

// Every date / time in the bot uses Indian time (IST), whatever the server's own timezone is.
process.env.TZ = 'Asia/Kolkata';

// Baileys 7 is an ES module; require() of it needs Node 20.19 or newer.
const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
if (nodeMajor < 20 || (nodeMajor === 20 && nodeMinor < 19)) {
  console.error(`Node ${process.versions.node} is too old. Cosmo-Bot needs Node 20.19 or newer (Node 22 recommended).`);
  process.exit(1);
}

/* ════════════════════════════════════════════════════════════
 *  SUPERVISOR
 * ════════════════════════════════════════════════════════════ */
function supervise() {
  const { spawn } = require('child_process');

  const STOP_CODES = new Set([1, 64]);
  const MIN_UPTIME_MS = 15 * 1000; // a bot that dies faster than this is "crash looping"

  let child = null;
  let stopping = false;
  let fastCrashes = 0;

  const run = () => {
    const startedAt = Date.now();
    child = spawn(process.execPath, [__filename], {
      stdio: 'inherit',
      env: { ...process.env, COSMO_CHILD: '1' }
    });

    child.on('exit', (code, signal) => {
      child = null;
      if (stopping) return process.exit(code || 0);
      if (code !== null && STOP_CODES.has(code)) return process.exit(code);

      fastCrashes = Date.now() - startedAt < MIN_UPTIME_MS ? fastCrashes + 1 : 0;
      const wait = Math.min(2000 * (fastCrashes + 1), 30000);
      console.log(`[supervisor] bot exited (${signal || code}). Starting again in ${wait / 1000}s`);
      setTimeout(run, wait);
    });
  };

  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => {
      stopping = true;
      if (child) child.kill(sig);
      else process.exit(0);
      setTimeout(() => process.exit(0), 5000).unref();
    });
  }

  run();
}

/* ════════════════════════════════════════════════════════════
 *  BOT
 * ════════════════════════════════════════════════════════════ */
function startBot() {
  const config = require('./config');
  const logger = require('./lib/utils/utils').logger;
  const { startServer } = require('./lib/session/system');
  const { loadPlugins } = require('./lib/handlers/handler');
  const { createClient } = require('./lib/session/session');
  const { registerEvents } = require('./lib/events/events');
  const { stopAutoBio, stopUpdateWatcher } = require('./lib/events/tasks');
  const pollCore = require('./lib/functions/poll');
  const store = require('./lib/session/system');
  const { platformName } = store;

  // Baileys helpers for pollCore (tries both common package names)
  let baileys;
  try { baileys = require('@whiskeysockets/baileys'); }
  catch { baileys = require('baileys'); }

  let sock = null;
  let server = null;
  let restartTimer = null;
  let shuttingDown = false;

  function dispose(old) {
    if (!old) return;
    try { old.ev.removeAllListeners(); } catch { /* already gone */ }
    try { old.end(undefined); } catch { /* already closed */ }
  }

  async function connect() {
    dispose(sock);
    sock = await createClient();
    pollCore.init(sock, {
      getAggregateVotesInPollMessage: baileys.getAggregateVotesInPollMessage,
      decryptPollVote: baileys.decryptPollVote,
      BufferJSON: baileys.BufferJSON,
      jidNormalizedUser: baileys.jidNormalizedUser
    });
    registerEvents(sock, { onRestart: scheduleRestart });
  }

  function scheduleRestart(delay = 3000) {
    if (shuttingDown || restartTimer) return;
    restartTimer = setTimeout(() => {
      restartTimer = null;
      connect().catch((e) => {
        logger.error('Restart failed:', e.message);
        scheduleRestart(10000);
      });
    }, delay);
  }

  function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received, shutting down...`);
    clearTimeout(restartTimer);
    stopAutoBio();
    stopUpdateWatcher();
    store.save(); // keep sent messages so retry requests still work after the restart
    dispose(sock);
    if (server) server.close();
    setTimeout(() => process.exit(0), 500).unref();
  }

  async function main() {
    const { errors, warnings } = config.validate();
    warnings.forEach((w) => logger.warn(w));
    // An existing auth/ folder is allowed to start without SESSION_ID; the session loader decides.
    errors.forEach((e) => logger.warn(e));

    server = startServer();
    loadPlugins();

    // On a redeploy the old container can still be running for a few seconds. Two bots on one
    // session break the encryption keys ("Bad MAC", "Waiting for this message"), so cloud
    // hosts wait before connecting. Change with STARTUP_DELAY (seconds), 0 turns it off.
    const cloud = ['Render', 'Koyeb', 'Heroku', 'Railway'].includes(platformName);
    const delay = Number(process.env.STARTUP_DELAY ?? (cloud ? 8 : 0));
    if (delay > 0) {
      logger.info(`Waiting ${delay}s so an old instance can stop first`);
      await new Promise((r) => setTimeout(r, delay * 1000));
    }
    await connect();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (e) => logger.error('Unhandled promise rejection:', e && e.message));

  main().catch((e) => {
    logger.error('Fatal start error:', e.message);
    process.exit(2); // the supervisor tries again; exit code 1 is reserved for "logged out"
  });
}

if (process.env.COSMO_CHILD === '1') startBot();
else supervise();
