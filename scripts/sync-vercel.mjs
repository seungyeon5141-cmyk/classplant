// Copies the service source (worker-src) into the self-contained Vercel deployment folder.
import { copyFileSync, mkdirSync } from 'node:fs';
const files = ['index.js', 'html.js', 'client.js', 'styles.js'];
mkdirSync('vercel/worker-src', { recursive: true });
for (const f of files) copyFileSync(`worker-src/${f}`, `vercel/worker-src/${f}`);
console.log('synced worker-src -> vercel/worker-src');
