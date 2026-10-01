// Vercel entry: runs the same Worker code (worker-src) with Postgres/Blob adapters in place of D1/R2.
// vercel.json rewrites every path to /api/index?__path=<original path>; restore it before routing.
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createEnv } from '../lib/vercel-env.js';
import manifest from '../scripts/source-manifest.js';

let app;

const sha1 = (buf) => createHash('sha1').update(buf).digest('hex');
// Native dynamic import that a build step cannot rewrite into require().
const importModule = new Function('specifier', 'return import(specifier)');

// Direct deployments do not carry worker-src, so fetch it once per instance from the
// pinned GitHub commit and verify every file's SHA-1 before importing it.
async function fetchWorker() {
  const dir = '/tmp/plant-src-v2-' + manifest.commit.slice(0, 12);
  await mkdir(dir + '/worker-src', { recursive: true });
  const base = `https://raw.githubusercontent.com/${manifest.repo}/${manifest.commit}/vercel/`;
  for (const [path, hash] of Object.entries(manifest.files)) {
    if (!path.startsWith('worker-src/')) continue;
    // Saved as .mjs so every Node version loads them as ES modules.
    const target = dir + '/' + path.replace(/\.js$/, '.mjs');
    if (await readFile(target).catch(() => null)) continue;
    const res = await fetch(base + path);
    if (!res.ok) throw new Error(`download failed ${path}: ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (sha1(buf) !== hash) throw new Error(`checksum mismatch ${path}`);
    const code = buf.toString('utf8').replace(/from '\.\/(html|styles|client)\.js'/g, "from './$1.mjs'");
    await writeFile(target + '.tmp', code);
    await rename(target + '.tmp', target);
  }
  return (await importModule(pathToFileURL(dir + '/worker-src/index.mjs').href)).default;
}

async function loadWorker() {
  try {
    return (await importModule(new URL('../worker-src/index.js', import.meta.url).href)).default;
  } catch {
    return fetchWorker();
  }
}

function originalRequest(request) {
  const url = new URL(request.url);
  const path = url.searchParams.get('__path');
  if (path === null) return request;
  url.searchParams.delete('__path');
  url.pathname = path.startsWith('/') ? path : '/' + path;
  return new Request(url, request);
}

// Shows whether each part is ready, without revealing any secret values.
async function health(env) {
  const out = {
    database: env.DB ? 'configured' : 'missing DATABASE_URL',
    photos: env.BUCKET ? 'configured' : 'missing BLOB_READ_WRITE_TOKEN',
    teacherSignupCode: env.TEACHER_SIGNUP_CODE ? 'configured' : 'missing TEACHER_SIGNUP_CODE',
    region: process.env.VERCEL_REGION || null,
  };
  if (env.DB) {
    try { await env.DB.prepare('SELECT COUNT(*) AS n FROM accounts').first(); out.database = 'ok'; }
    catch (e) { out.database = 'error: ' + String(e && e.message || e).replace(/postgres(ql)?:\/\/\S+/gi, '[url]'); }
  }
  return new Response(JSON.stringify(out, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

export default {
  async fetch(request) {
    try {
      app = app || { worker: await loadWorker(), env: createEnv(process.env) };
    } catch (e) {
      app = null;
      console.error('failed to load app', e);
      const where = String(e && e.stack || '').split('\n').slice(0, 4).join('\n');
      return new Response('앱을 불러오지 못했어요: ' + String(e && e.message || e) + '\n\n' + where, { status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
    const req = originalRequest(request);
    if (new URL(req.url).pathname === '/api/health') return health(app.env);
    return app.worker.fetch(req, app.env);
  },
};
