import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { buildConfig, type CollectionConfig, type Field } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { Media } from './cms-config/collections/media';
import { SEOMedia } from './cms-config/collections/seo-media';
import { Users } from './cms-config/collections/users';
import { Services } from './cms-config/collections/services';
import { NewPatientSteps } from './cms-config/collections/new-patient-steps';
import { Article } from './cms-config/collections/articles';
import { SocialMediaPlatforms } from './cms-config/collections/social-media-platforms';
import { Reviews } from './cms-config/collections/reviews';
import { Graphics } from './cms-config/globals/graphics';
import { BusinessDetailsGlobal } from './cms-config/globals/business-details';
import { HomePage } from './cms-config/globals/home-page';
import { AboutUsPage } from './cms-config/globals/about-us-page';
import { TreatmentAndCarePage } from './cms-config/globals/treatment-and-care-page';
import { WhatToExpectPage } from './cms-config/globals/what-to-expect-page';
import { ContactUsPage } from './cms-config/globals/contact-us-page';
import { databaseSchema, requiredEnv, serverURL, storagePrefix } from './cms-config/lib/environment';

const dirname = path.dirname(fileURLToPath(import.meta.url));
// Internal, immutable migration identity makes interrupted imports resumable.
const sourceID: Field = { name: 'sourceID', type: 'text', unique: true, index: true, admin: { hidden: true }, access: { create: () => false, update: () => false } };
const importable = (collection: CollectionConfig): CollectionConfig => ({ ...collection, fields: [...collection.fields, sourceID] });
const prefix = storagePrefix();
const publicURL = requiredEnv('CF_PUBLIC_URL').replace(/\/$/, '');
const generateFileURL = ({ filename, prefix: filePrefix }: { filename: string; prefix?: string }) =>
  `${publicURL}/${[filePrefix, filename].filter(Boolean).join('/').split('/').map(encodeURIComponent).join('/')}`;

export default buildConfig({
  serverURL: serverURL(),
  cors: [serverURL()], csrf: [serverURL()],
  admin: { user: 'users', importMap: { baseDir: dirname } },
  editor: lexicalEditor(),
  email: () => ({
    name: 'disabled', defaultFromAddress: 'noreply@gbchiropractic.com.au', defaultFromName: 'GB Chiropractic',
    sendEmail: async () => { throw new Error('Email delivery is not configured. Use the administrative password-reset command.'); },
  }),
  secret: requiredEnv('PAYLOAD_SECRET'),
  db: postgresAdapter({
    pool: { connectionString: requiredEnv('DATABASE_URL'), max: 5, connectionTimeoutMillis: 15000 },
    schemaName: databaseSchema(), disableCreateDatabase: true, push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  collections: [Users, ...[Media, SEOMedia, Services, NewPatientSteps, Article, SocialMediaPlatforms, Reviews].map(importable)],
  globals: [BusinessDetailsGlobal, Graphics, HomePage, AboutUsPage, TreatmentAndCarePage, WhatToExpectPage, ContactUsPage],
  plugins: [s3Storage({
    clientUploads: true,
    collections: {
      media: { prefix: `${prefix}/media`, generateFileURL },
      'seo-media': { prefix: `${prefix}/media/seo`, generateFileURL },
    },
    bucket: requiredEnv('S3_BUCKET'),
    config: {
      endpoint: requiredEnv('S3_ENDPOINT'), region: process.env.S3_REGION || 'auto', forcePathStyle: true,
      credentials: { accessKeyId: requiredEnv('S3_ACCESS_KEY_ID'), secretAccessKey: requiredEnv('S3_SECRET_ACCESS_KEY') },
    },
  })],
  upload: { limits: { fileSize: 20 * 1024 * 1024 } },
});
