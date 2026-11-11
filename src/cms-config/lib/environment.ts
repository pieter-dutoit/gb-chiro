export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function storagePrefix() {
  const prefix = requiredEnv('S3_PREFIX').replace(/^\/+|\/+$/g, '');
  if (!/^[a-zA-Z0-9/_-]+$/.test(prefix)) throw new Error('Invalid S3_PREFIX');
  if (process.env.VERCEL_ENV === 'preview' && prefix === 'production') {
    throw new Error('Preview deployments must use their own S3_PREFIX');
  }
  return prefix;
}

export function databaseSchema() {
  const schema = requiredEnv('CMS_DB_SCHEMA');
  if (!/^[a-z][a-z0-9_]*$/.test(schema)) throw new Error('Invalid CMS_DB_SCHEMA');
  return schema;
}

export function serverURL() {
  return process.env.CMS_SERVER_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
}
