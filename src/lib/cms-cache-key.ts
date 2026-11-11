import { createHash } from 'node:crypto';

// Next's persistent data cache may survive a local environment switch or a
// reused build cache. Credentials are not part of the cache identity.
export function cmsCacheKey(env: Record<string, string | undefined>): string {
  const database = new URL(env.DATABASE_URL ?? '');
  return createHash('sha256').update(JSON.stringify({
    host: database.hostname.replace(/-pooler(?=\.)/, ''),
    database: database.pathname,
    schema: env.CMS_DB_SCHEMA,
    storage: env.S3_PREFIX,
    publicURL: env.CF_PUBLIC_URL,
  })).digest('hex');
}
