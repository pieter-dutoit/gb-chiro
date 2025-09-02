import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { fileURLToPath } from "url";
import path from "path";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  editor: lexicalEditor(),
  collections: [],
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
});
