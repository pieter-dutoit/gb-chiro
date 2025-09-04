import sharp from "sharp";
import { buildConfig } from "payload";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";

import { fileURLToPath } from "url";
import path from "path";

import { Media } from "./cms-config/collections/media";
import { BusinessDetailsGlobal } from "./cms-config/globals/business-details";
import { Logo } from "./cms-config/globals/logo";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  editor: lexicalEditor(),
  globals: [BusinessDetailsGlobal, Logo],
  collections: [Media],
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    schemaName: "payload",
    disableCreateDatabase: true,
  }),
  sharp,
  typescript: {
    autoGenerate: true,
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: [
    s3Storage({
      clientUploads: true,
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
  upload: {
    limits: {
      fileSize: 20 * 1024 * 1024, // 20mb
    },
  },
});
