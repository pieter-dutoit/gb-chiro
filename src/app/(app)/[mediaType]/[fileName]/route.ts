export const dynamic = "force-static";

import { getBaseUrl } from "@/lib/utils";
import { NextRequest } from "next/server";

const MEDIA_TYPE_MAP = {
  images: "media",
  "seo-images": "seo-media",
} as const;

type MediaType = keyof typeof MEDIA_TYPE_MAP;

function isMediaType(v: string): v is MediaType {
  return v in MEDIA_TYPE_MAP;
}

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/[mediaType]/[fileName]">
) {
  try {
    const { mediaType, fileName } = await ctx.params;
    const origin = getBaseUrl();

    if (!isMediaType(mediaType)) {
      return new Response("Unsupported media type", { status: 400 });
    }

    const prefix = MEDIA_TYPE_MAP[mediaType];

    const upstreamUrl = `${origin}/api/${prefix}/file/${encodeURIComponent(fileName)}`;
    const upstream = await fetch(upstreamUrl, {
      cache: "force-cache",
    });

    console.log("upstream url: ", upstreamUrl);
    console.log("upstream response: ", upstream);

    if (!upstream.ok) {
      return new Response(
        `Failed to fetch image ${fileName} from ${upstreamUrl}: ${upstream.statusText}`,
        { status: upstream.status }
      );
    }
    const contentType = upstream.headers.get("Content-Type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`Invalid image content type: ${contentType}`);
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
