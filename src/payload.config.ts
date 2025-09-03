import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { fileURLToPath } from "url";
import path from "path";
import { s3Storage } from "@payloadcms/storage-s3";
import { Media } from "./cms-config/collections/media";
import { BusinessDetails } from "./cms-config/globals/business-details";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  editor: lexicalEditor(),
  globals: [BusinessDetails],
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
      fileSize: 10 * 1024 * 1024, // 10MB in bytes
    },
  },
});
