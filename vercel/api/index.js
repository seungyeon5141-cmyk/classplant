// Vercel entry: runs the same Worker code (worker-src) with Postgres/Blob adapters in place of D1/R2.
import worker from '../worker-src/index.js';
import { createEnv } from '../lib/vercel-env.js';

let env;
export default {
  async fetch(request) {
    env = env || createEnv(process.env);
    return worker.fetch(request, env);
  },
};
