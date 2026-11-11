import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { Payload } from 'payload';

export async function verifyStoredMedia(payload: Payload) {
  const client = new S3Client({ endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION || 'auto', credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! } });
  let count = 0;
  try {
    for (const collection of ['media', 'seo-media'] as const) {
      const { docs } = await payload.find({ collection, pagination: false, overrideAccess: true });
      for (const image of docs) {
        for (const filename of [image.filename, ...Object.values(image.sizes ?? {}).map(size => size?.filename)]) {
          if (!filename) continue;
          const key = [image.prefix, image._objectKey, filename].filter(Boolean).join('/');
          await client.send(new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
          count++;
        }
        const publicImage = await fetch(image.url!, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
        if (!publicImage.ok) throw new Error(`Public image unavailable: ${collection}/${image.id} (${publicImage.status})`);
      }
    }
  } finally { client.destroy(); }
  return count;
}
