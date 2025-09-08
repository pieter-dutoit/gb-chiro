export const dynamic = "force-static";

import { getBaseUrl } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;
    const origin = getBaseUrl();

    const upstreamUrl = `${origin}/api/media/file/${encodeURIComponent(fileName)}`;
    const upstream = await fetch(upstreamUrl, {
      cache: "force-cache",
    });

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
