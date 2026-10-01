// Vercel entry: runs the same Worker code (worker-src) with Postgres/Blob adapters in place of D1/R2.
// vercel.json rewrites every path to /api/index?__path=<original path>; restore it before routing.
let app;

async function load() {
  const [{ default: worker }, { createEnv }] = await Promise.all([
    import('../worker-src/index.js'),
    import('../lib/vercel-env.js'),
  ]);
  return { worker, env: createEnv(process.env) };
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
      app = app || (await load());
    } catch (e) {
      app = null;
      console.error('failed to load app', e);
      return new Response('앱을 불러오지 못했어요: ' + String(e && e.message || e), { status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    }
    const req = originalRequest(request);
    if (new URL(req.url).pathname === '/api/health') return health(app.env);
    return app.worker.fetch(req, app.env);
  },
};
