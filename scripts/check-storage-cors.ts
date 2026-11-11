import './env';
import { S3Client, GetBucketCorsCommand } from '@aws-sdk/client-s3';
const client = new S3Client({ endpoint: process.env.S3_ENDPOINT, region: 'auto', credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! } });
try { const result = await client.send(new GetBucketCorsCommand({ Bucket: process.env.S3_BUCKET })); console.log(JSON.stringify(result.CORSRules, null, 2)); }
catch (error) { console.log('CORS inspection:', (error as Error).name); }
finally { client.destroy(); }
