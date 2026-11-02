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
  console.log('Startup gate closing');
  return new Promise((resolve) => {
    gate.close(() => {
      console.log('Startup gate closed');
      resolve();
    });
    // Hostinger keeps the proxy connection open. Without this, close() never
    // finishes and Strapi never binds the port.
    if (typeof gate.closeAllConnections === 'function') gate.closeAllConnections();
  });
}

async function boot() {
  const strapi = require('@strapi/strapi');
  const app = strapi.createStrapi();
  console.log('Strapi load starting');
  await app.load();
  console.log('Strapi load finished');
  await closeGate();
  console.log('Strapi listen starting');
  await app.start();
}

boot().catch((error) => {
  console.error(error);
  process.exit(1);
});
