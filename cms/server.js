'use strict';

// Hostinger allows one listen() call, and it has to happen within 3 seconds.
// Strapi opens its port only after startup finishes, so this process opens the
// port immediately and gives that same server to Strapi.
const http = require('http');

const port = Number(process.env.PORT) || 1337;
const host = process.env.HOST || '0.0.0.0';

let strapiListener = null;
let ready = false;
const queued = [];

const server = http.createServer((req, res) => {
  if (!ready || !strapiListener) {
    queued.push([req, res]);
    return;
  }
  strapiListener(req, res);
});

server.listen(port, host, () => {
  console.log(`Listening on ${host}:${port}`);
});

const createServer = http.createServer.bind(http);
let handedOver = false;
http.createServer = function createStrapiServer(...args) {
  if (handedOver) return createServer(...args);
  handedOver = true;
  const listener = args.find((arg) => typeof arg === 'function');
  if (listener) strapiListener = listener;
  return server;
};

async function boot() {
  const strapi = require('@strapi/strapi');
  const app = strapi.createStrapi();
  console.log('Strapi load starting');
  await app.load();
  ready = true;
  console.log('Strapi load finished');
  for (const [req, res] of queued.splice(0)) {
    if (!res.writableEnded && !res.destroyed) strapiListener(req, res);
  }
}

boot().catch((error) => {
  console.error(error);
  process.exit(1);
});
