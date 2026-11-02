'use strict';

// Hostinger kills the process unless listen() runs within 3 seconds.
// Strapi opens its port only after the database and bootstrap finish, so a
// placeholder holds the port first and is closed just before Strapi binds it.
const http = require('http');

const port = Number(process.env.PORT) || 1337;
const host = process.env.HOST || '0.0.0.0';

const gate = http.createServer((_req, res) => {
  res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Starting');
});

gate.listen(port, host, () => {
  console.log(`Startup gate listening on ${host}:${port}`);
});

function closeGate() {
  if (!gate.listening) return Promise.resolve();
  return new Promise((resolve, reject) => {
    gate.close((error) => (error ? reject(error) : resolve()));
  });
}

async function boot() {
  const strapi = require('@strapi/strapi');
  const app = strapi.createStrapi();
  await app.load();
  await closeGate();
  await app.start();
}

boot().catch((error) => {
  console.error(error);
  process.exit(1);
});
