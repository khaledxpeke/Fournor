// Requests every old URL and checks the 301 target.
// After deployment, from web/:
//   node scripts/test-redirects.mjs https://www.fournor.com
import { redirectCases } from '../redirects.mjs';

const base = (process.argv[2] || 'http://127.0.0.1/fournor-redirects').replace(/\/$/, '');

function pathOf(location, requestUrl) {
  const url = new URL(location, requestUrl);
  return `${url.pathname}${url.search}`;
}

let failed = 0;
for (const [from, expected] of redirectCases) {
  const requestUrl = `${base}/${from}`;
  const response = await fetch(requestUrl, { redirect: 'manual' });
  const location = response.headers.get('location') || '';
  const actual = location ? pathOf(location, requestUrl) : '';
  const ok = response.status === 301 && actual === expected;
  if (!ok) failed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${response.status} ${from} -> ${actual || '(no location)'} ${ok ? '' : `(expected ${expected})`}`);
}

console.log(`${redirectCases.length - failed}/${redirectCases.length} passed`);
if (failed) process.exit(1);
