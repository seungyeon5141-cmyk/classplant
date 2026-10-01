// For direct (non-Git) Vercel deployments: download the service source at a pinned
// commit from the public GitHub repo and verify each file's SHA-1 before building.
// In a Git checkout the files already exist and nothing is downloaded.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const manifest = JSON.parse(readFileSync(new URL('./source-manifest.json', import.meta.url), 'utf8'));
const base = `https://raw.githubusercontent.com/${manifest.repo}/${manifest.commit}/vercel/`;
// Static output folder (kept empty so source files are not served as static files).
mkdirSync('public', { recursive: true });
writeFileSync('public/robots.txt', 'User-agent: *\nDisallow: /\n');

for (const [path, sha1] of Object.entries(manifest.files)) {
  if (existsSync(path)) continue;
  const res = await fetch(base + path);
  if (!res.ok) throw new Error(`download failed ${path}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const got = createHash('sha1').update(buf).digest('hex');
  if (got !== sha1) throw new Error(`checksum mismatch ${path}: ${got} != ${sha1}`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buf);
  console.log('fetched', path, sha1);
}
