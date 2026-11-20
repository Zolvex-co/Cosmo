<div align="center">

<h1>COSMO</h1>

<p><b>A Simple Multi-Device WhatsApp Bot Built with Node.js.</b><br>
Deploy anywhere and explore everything WhatsApp can do.</p>

<p>
  <a href="https://cosmo-xd.vercel.app"><img src="https://cosmo-shuhaiiiiib.onrender.com/f/tut26cQ3.jpg" alt="COSMO" height="28"><img src="https://img.shields.io/badge/WEBSITE-000000?style=for-the-badge" alt="WEBSITE"></a>
  <a href="https://whatsapp.com/channel/0029VbBrgjMISTkI2ZQaxh3G"><img src="https://img.shields.io/badge/CHANNEL-000000?style=for-the-badge&logo=whatsapp&logoColor=white" alt="CHANNEL"></a>
  <a href="https://chat.whatsapp.com/GyOhPKkdZiyDEhDJa2raov"><img src="https://img.shields.io/badge/GROUP-000000?style=for-the-badge&logo=whatsapp&logoColor=white" alt="GROUP"></a>
</p>

</div>

---

***COSMO is a modular, multi-device WhatsApp bot built with Node.js and Baileys.***

---

## Features

- **Modular by design.** Every command is a plugin, so you can add or remove features without touching the core.
- **200+ community plugins.** Browse and share plugins from the website.
- **Quick pairing.** Link WhatsApp with a QR code or a pairing code and get a short session ID (`COSMO~XXXXXXXX`).
- **Deploy anywhere.** Render, Koyeb, Heroku, Railway or your own VPS.
- **Simple configuration.** A handful of environment variables controls the prefix, mode, menu and language.

---

## Quick Start

| Step | Action |
|:---:|---|
| **1** | Open **[cosmo-xd.vercel.app](https://cosmo-xd.vercel.app)** and pair your WhatsApp to get a session ID (`COSMO~XXXXXXXX`). |
| **2** | **Fork** this repository to your GitHub account. |
| **3** | **Deploy** it on a host below and add your variables. |
| **4** | Send `.menu` to your bot on WhatsApp. |

> [!IMPORTANT]
> Keep your session ID private, and never run the same session in two places at once. A session used twice gets disconnected and you will have to pair again.

---

## Deployment

**Render** is the recommended host. Open any host below for its steps.

<details>
<summary><b>Render</b> (recommended)</summary>
<br>

1. **New > Blueprint**, then pick your repo.
2. Fill `SESSION_ID`, `OWNER_NUMBER` and `RENDER_API_KEY`.
3. Deploy.

</details>

<details>
<summary><b>Koyeb</b></summary>
<br>

1. **Create Service > GitHub**, pick your repo, builder **Dockerfile**.
2. Port `3000` (HTTP), health check path `/`.
3. Add `SESSION_ID`, `OWNER_NUMBER` and `KOYEB_API_TOKEN`, then deploy.

</details>

<details>
<summary><b>Heroku</b></summary>
<br>

1. Create the app and run `heroku stack:set container -a <app>`.
2. Add `SESSION_ID`, `OWNER_NUMBER`, `HEROKU_API_KEY` and `HEROKU_APP_NAME`.
3. Deploy the repo and turn on the **worker** dyno.

</details>

<details>
<summary><b>Railway</b></summary>
<br>

1. **New Project > Deploy from GitHub repo**.
2. Add `SESSION_ID`, `OWNER_NUMBER` and `RAILWAY_API_TOKEN`, then deploy.

</details>

<details>
<summary><b>VPS</b></summary>
<br>

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
cp .env.example .env        # fill SESSION_ID and OWNER_NUMBER
npm install --omit=dev
pm2 start npm --name cosmo -- start
```

Useful PM2 commands:

```bash
pm2 logs cosmo        # live logs
pm2 restart cosmo     # restart the bot
pm2 save && pm2 startup   # start automatically after a reboot
```

</details>

---

## Configuration

Set these as environment variables on your host (or in `.env` on a VPS).

| Variable | Required | Description |
|---|:---:|---|
| `SESSION_ID` | Yes | Your `COSMO~...` session ID. |
| `OWNER_NUMBER` | Yes | Your number with country code, digits only (for example `919876543210`). |
| `PREFIX` | No | Command prefix. Default `.` |
| `MODE` | No | `public` (everyone) or `private` (owner only). |
| `PING` | No | Word the ping command replies with. |
| `MENU_INFO` | No | Menu header in the format `Name,Owner,image-url`. |
| `BOT_LANG` | No | Reply language. |

**Host API keys.** Your host needs its own key so the bot can manage itself:

| Host | Variable(s) |
|---|---|
| Render | `RENDER_API_KEY` |
| Koyeb | `KOYEB_API_TOKEN` |
| Heroku | `HEROKU_API_KEY`, `HEROKU_APP_NAME` |
| Railway | `RAILWAY_API_TOKEN` |

<details>
<summary><b>Example <code>.env</code></b></summary>
<br>

```env
SESSION_ID=COSMO~XXXXXXXX
OWNER_NUMBER=919876543210
PREFIX=.
MODE=public
PING=Pong!
MENU_INFO=COSMO,Shuhaib,https://example.com/menu.jpg
BOT_LANG=en
```

</details>

---

## Troubleshooting

| Problem | What to check |
|---|---|
| Bot does not reply | Confirm `SESSION_ID` is correct, the prefix matches `PREFIX`, and `MODE` is not `private` when someone other than the owner is chatting. |
| Disconnected or logged out | The same session is probably running in two places. Stop the extra deployment, then pair again for a fresh session ID. |
| Invalid session | Re-copy the full ID, including the `COSMO~` part, or generate a new one on the website. |
| Bot goes offline on a free host | Free plans can sleep when idle. Keep the service awake with a monitor such as UptimeRobot, or use a paid plan or a VPS. |

Still stuck? Ask in the [WhatsApp group](https://chat.whatsapp.com/GyOhPKkdZiyDEhDJa2raov).

---

## Safety Notice

> [!WARNING]
> Group add and remove actions used too often can get your WhatsApp number banned. Use them sparingly, avoid bulk actions, and prefer a secondary number for the bot.

This project is not affiliated with or endorsed by WhatsApp or Meta. Use it at your own risk.

---

## Community

> [!TIP]
> **Join COSMO to get updates, new plugins and help from other users.**
>
> - **Website:** https://cosmo-xd.vercel.app
> - **WhatsApp Channel:** https://whatsapp.com/channel/0029VbBrgjMISTkI2ZQaxh3G
> - **WhatsApp Group:** https://chat.whatsapp.com/GyOhPKkdZiyDEhDJa2raov

---

## Developer

<div align="center">

<h3>Shuhaib</h3>
<p>Creator and maintainer of COSMO</p>

<p>
  <a href="https://github.com/shuhbap"><img src="https://img.shields.io/badge/GitHub-shuhbap-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="https://whatsapp.com/channel/0029VbBrgjMISTkI2ZQaxh3G"><img src="https://img.shields.io/badge/Follow-Channel-FF2A2A?style=for-the-badge&logo=whatsapp&logoColor=white&labelColor=000000" alt="Follow the channel"></a>
</p>

<p><i>If COSMO helps you, give the repo a star. It keeps the project going.</i></p>

</div>

---

<div align="center">

Powered by [Baileys](https://github.com/WhiskeySockets/Baileys) &nbsp;|&nbsp; Crafted by **Shuhaib**

</div>
