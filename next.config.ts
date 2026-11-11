import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const mediaURL = process.env.CF_PUBLIC_URL ? new URL(process.env.CF_PUBLIC_URL) : undefined;
const nextConfig: NextConfig = {
  images: {
    remotePatterns: mediaURL ? [{ protocol: 'https', hostname: mediaURL.hostname, pathname: `${mediaURL.pathname.replace(/\/$/, '')}/**` }] : [],
    qualities: [75],
  },
};
export default withPayload(nextConfig);
