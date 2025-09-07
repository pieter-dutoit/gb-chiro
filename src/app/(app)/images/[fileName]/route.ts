export const dynamic = "force-static";

const originFromEnv = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  console.log("0");
  try {
    console.log("1");
    const { fileName } = await params;
    console.log("2");
    const origin = originFromEnv();
    console.log("3");

    const upstreamUrl = `${origin}/api/media/file/${encodeURIComponent(fileName)}`;
    console.log("4");
    console.log("upstream: ", upstreamUrl);
    const upstream = await fetch(upstreamUrl, {
      cache: "force-cache",
    });
    console.log("5");

    if (!upstream.ok) {
      console.log("6");
      return new Response(
        `Failed to fetch image ${fileName} from ${upstreamUrl}: ${upstream.statusText}`,
        { status: upstream.status }
      );
    }
    console.log("7");
    const contentType = upstream.headers.get("Content-Type") || "";
    if (!contentType.startsWith("image/")) {
      console.log("8");
      throw new Error(`Invalid image content type: ${contentType}`);
    }
    console.log("9");

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    console.log("10");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  } catch (error) {
    console.log("12");
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
  console.log("12");
}
