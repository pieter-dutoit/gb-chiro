import sharp from "sharp";
import { buildConfig } from "payload";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";

import { fileURLToPath } from "url";
import path from "path";

import { Media } from "./cms-config/collections/media";
import { BusinessDetailsGlobal } from "./cms-config/globals/business-details";
import { Graphics } from "./cms-config/globals/graphics";
import { AboutUsPage } from "./cms-config/globals/about-us-page";
import { HomePage } from "./cms-config/globals/home-page";
import { Services } from "./cms-config/collections/services";
import { NewPatientSteps } from "./cms-config/collections/new-patient-steps";
import { WhatToExpectPage } from "./cms-config/globals/what-to-expect-page";
import { TreatmentAndCarePage } from "./cms-config/globals/treatment-and-care-page";
import { Article } from "./cms-config/collections/articles";
import { SocialMediaPlatforms } from "./cms-config/collections/social-media-platforms";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  editor: lexicalEditor({}),
  globals: [
    BusinessDetailsGlobal,
    Graphics,
    HomePage,
    AboutUsPage,
    TreatmentAndCarePage,
    WhatToExpectPage,
  ],
  collections: [
    Media,
    Services,
    NewPatientSteps,
    Article,
    SocialMediaPlatforms,
  ],
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
