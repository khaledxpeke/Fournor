/**
 * Local stand-in for the GitHub repository_dispatch endpoint.
 * Start: node scripts/webhook-listener.js
 * Then start Strapi with WEBHOOK_URL=http://127.0.0.1:8787/ and WEBHOOK_TOKEN set.
 * Captured requests are printed. Nothing is sent to GitHub.
 */
const http = require('http');

const port = Number(process.env.WEBHOOK_LISTENER_PORT || 8787);
const requests = [];

const server = http.createServer((request, response) => {
  const chunks = [];
  request.on('data', (chunk) => chunks.push(chunk));
  request.on('end', () => {
    const captured = {
      at: new Date().toISOString(),
      method: request.method,
      url: request.url,
      headers: {
        authorization: request.headers.authorization || '',
        accept: request.headers.accept || '',
        'content-type': request.headers['content-type'] || '',
        'x-github-api-version': request.headers['x-github-api-version'] || '',
      },
      body: Buffer.concat(chunks).toString('utf8'),
    };
    requests.push(captured);
    console.log(JSON.stringify(captured));
    response.writeHead(204);
    response.end();
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`webhook listener on http://127.0.0.1:${port}/`);
});
