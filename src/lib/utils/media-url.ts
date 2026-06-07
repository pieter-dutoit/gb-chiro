import type { MediaSize, SiteMedia } from "@/lib/site-types";
import { mediaVariants } from "@/lib/media-variants";

type MediaPrefix = "media" | "seo-media";

const MEDIA_PREFIX_PATHS: Record<MediaPrefix, string> = {
  media: "media",
  "seo-media": "media/seo",
};

function getMediaEndpoint(): string {
  const endpoint = process.env.NEXT_PUBLIC_MEDIA_ENDPOINT?.replace(/\/+$/, "");

  if (!endpoint) {
    throw new Error("Missing NEXT_PUBLIC_MEDIA_ENDPOINT");
  }

  try {
    const url = new URL(endpoint);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid NEXT_PUBLIC_MEDIA_ENDPOINT protocol");
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_MEDIA_ENDPOINT");
  }
}

function encodeFilename(filename: string): string {
  return filename.split("/").map(encodeURIComponent).join("/");
}

function parseWidthKey(size: string): number | undefined {
  const match = size.match(/^(\d+)w$/);
  return match ? Number(match[1]) : undefined;
}

export function createMediaUrl(
  filename: string | null | undefined,
  prefix: MediaPrefix = "media"
): string {
  if (!filename) return "";

  const endpoint = getMediaEndpoint();
  const prefixPath = MEDIA_PREFIX_PATHS[prefix];

  return `${endpoint}/${prefixPath}/${encodeFilename(filename)}`;
}

export function getMediaVariants(
  media: SiteMedia | null | undefined | false
): MediaSize[] {
  if (!media || !media.filename) return [];

  return [...(mediaVariants[media.filename] ?? [])].sort(
    (a, b) => (a.width ?? 0) - (b.width ?? 0)
  );
}

export function createMediaSrcSet(
  media: SiteMedia | null | undefined | false
): string | undefined {
  const srcSet = getMediaVariants(media)
    .filter((variant) => variant.filename && variant.width)
    .map(
      (variant) =>
        `${createMediaUrl(variant.filename, "media")} ${variant.width}w`
    )
    .join(", ");

  return srcSet.length ? srcSet : undefined;
}

export function createMediaSizeUrl(
  media: SiteMedia | null | undefined | false,
  size: string
): string {
  if (!media) return "";

  const requestedWidth = parseWidthKey(String(size));
  const variant = requestedWidth
    ? getMediaVariants(media).find((item) => item.width === requestedWidth)
    : undefined;

  return createMediaUrl(variant?.filename ?? media.filename, "media");
}
