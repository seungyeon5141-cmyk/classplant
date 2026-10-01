// Adapters that give worker-src the same env.DB (D1) and env.BUCKET (R2) interface on Vercel.
import { neon } from '@neondatabase/serverless';
import { put, get, del } from '@vercel/blob';
import { SCHEMA_SQL } from './schema.js';

// D1 uses "?" placeholders; Postgres uses $1, $2, ...
export function toPg(sql) {
  let n = 0, out = '', quoted = false;
  for (const c of sql) {
    if (c === "'") quoted = !quoted;
    out += c === '?' && !quoted ? '$' + (++n) : c;
  }
  return out;
}

async function migrate(client) {
  const rows = await client.query("SELECT to_regclass('public.sessions') AS t");
  if (rows[0] && rows[0].t) return;
  for (const statement of SCHEMA_SQL) await client.query(statement);
}

// client: { query(text, params) -> Promise<rows>, transaction(queries) }  (the neon() HTTP client)
export function makeDB(client) {
  let ready = null;
  const ensure = () => ready || (ready = migrate(client).catch((e) => { ready = null; throw e; }));
  const statement = (text, params) => ({
    bind: (...values) => statement(text, values.map((v) => (v === undefined ? null : v))),
    async all() { await ensure(); return { results: await client.query(text, params) }; },
    async first() { await ensure(); const rows = await client.query(text, params); return rows[0] || null; },
    async run() { await ensure(); await client.query(text, params); return { success: true }; },
    lazy: () => client.query(text, params),
  });
  return {
    prepare: (sql) => statement(toPg(sql), []),
    async batch(list) {
      await ensure();
      await client.transaction(list.map((s) => s.lazy()));
      return list.map(() => ({ success: true }));
    },
  };
}

// blob: { put, get, del } from @vercel/blob (private store)
export function makeBucket(blob) {
  return {
    async put(key, value, options) {
      const contentType = options && options.httpMetadata && options.httpMetadata.contentType;
      await blob.put(key, value, { access: 'private', contentType, addRandomSuffix: false, allowOverwrite: true });
    },
    async get(key) {
      const result = await blob.get(key, { access: 'private' }).catch(() => null);
      if (!result || result.statusCode !== 200) return null;
      return {
        body: result.stream,
        httpEtag: result.blob.etag,
        writeHttpMetadata(headers) { headers.set('content-type', result.blob.contentType || 'application/octet-stream'); },
      };
    },
    async delete(key) {
      await blob.del(key).catch((e) => console.error('blob delete failed', key, e));
    },
  };
}

export function createEnv(vars) {
  const url = vars.DATABASE_URL || vars.POSTGRES_URL;
  return {
    DB: url ? makeDB(neon(url)) : null,
    BUCKET: vars.BLOB_READ_WRITE_TOKEN ? makeBucket({ put, get, del }) : null,
    TEACHER_SIGNUP_CODE: vars.TEACHER_SIGNUP_CODE || '',
  };
}
