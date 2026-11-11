import nextEnv from '@next/env';
// CLI defaults to the same isolated environment as `next dev`. Production
// commands must explicitly opt in with CMS_ENV=production.
nextEnv.loadEnvConfig(process.cwd(), process.env.CMS_ENV !== 'production');
