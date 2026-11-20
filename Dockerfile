# Cosmo-Bot image: one Dockerfile for Render, Koyeb, Railway and Heroku (container stack).
FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    TZ=Asia/Kolkata \
    NPM_CONFIG_UPDATE_NOTIFIER=false

RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates ffmpeg fontconfig fonts-dejavu-core fonts-noto-color-emoji \
 && rm -rf /var/lib/apt/lists/* \
 && git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" \
 && git config --global --add url."https://github.com/".insteadOf "git@github.com:"

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

RUN mkdir -p data auth && chown -R node:node /app
USER node

EXPOSE 3000

# index.js supervises the bot: it restarts it after .restart and after variable changes (.setping, .setprefix ...)
CMD ["node", "index.js"]
