import type { MediaSize, SiteMedia } from "@/lib/site-types";
import { mediaVariants } from "@/lib/media-variants";

type MediaPrefix = "media" | "seo-media";

const LARGE_IMAGE_WIDTHS = [384, 640, 828, 1200, 1920];
const SERVICE_IMAGE_WIDTHS = [128, 256, 384];

// Only these pre-generated variants are deployed with the static site. The
// original source files remain in the private CMS export archive.
const PRODUCTION_WIDTHS: Record<string, number[]> = {
  "Logo.jpg": [128, 256, 384],
  "logo-horizontal.jpg": [200, 384, 480],
  "About GB Chiro-1.jpg": LARGE_IMAGE_WIDTHS,
  "Home Page.jpg": LARGE_IMAGE_WIDTHS,
  "Meet the chiro-1.jpg": LARGE_IMAGE_WIDTHS,
  "New patients-1.jpg": LARGE_IMAGE_WIDTHS,
  "What to expect.jpg": LARGE_IMAGE_WIDTHS,
  "Reception.jpg": LARGE_IMAGE_WIDTHS,
  "Room.jpg": LARGE_IMAGE_WIDTHS,
  "Practice Entry.jpg": LARGE_IMAGE_WIDTHS,
  "Street View.jpg": LARGE_IMAGE_WIDTHS,
  "Headache and migraine care.jpg": SERVICE_IMAGE_WIDTHS,
  "Sports Injury Management.jpg": SERVICE_IMAGE_WIDTHS,
  "Spinal adjustment and manipulation.jpg": SERVICE_IMAGE_WIDTHS,
  "Pregnancy chiropractic care.jpg": SERVICE_IMAGE_WIDTHS,
  "Rehab & strengthening exercises.jpg": SERVICE_IMAGE_WIDTHS,
  "Wellness and preventative care.jpg": SERVICE_IMAGE_WIDTHS,
  "Joint pain and mobility support.jpg": SERVICE_IMAGE_WIDTHS,
  "Paediatric chiropractic care-2.jpg": SERVICE_IMAGE_WIDTHS,
  "Posture correction.jpg": SERVICE_IMAGE_WIDTHS,
  "Neck and back pain relief 1.jpg": [384, 640, 828],
};

function encodeFilename(filename: string): string {
  return filename.split("/").map(encodeURIComponent).join("/");
}

function localUrl(filename: string, prefix: MediaPrefix): string {
  const directory = prefix === "seo-media" ? "/images/seo" : "/images";
  return `${directory}/${encodeFilename(filename)}`;
}

function parseWidthKey(size: string): number | undefined {
  const match = size.match(/^(\d+)w$/);
  return match ? Number(match[1]) : undefined;
}

export function getMediaVariants(
  media: SiteMedia | null | undefined | false
): MediaSize[] {
  if (!media || !media.filename) return [];

  const widths = PRODUCTION_WIDTHS[media.filename];
  if (!widths) return [];

  return [...(mediaVariants[media.filename] ?? [])]
    .filter((variant) => variant.width && widths.includes(variant.width))
    .sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
}

export function createMediaUrl(
  filename: string | null | undefined,
  prefix: MediaPrefix = "media"
): string {
  if (!filename) return "";
  if (prefix === "seo-media") return localUrl(filename, prefix);

  const variants = getMediaVariants({ filename } as SiteMedia);
  const largest = variants.at(-1)?.filename;
  return localUrl(largest ?? filename, prefix);
}

export function createMediaSrcSet(
  media: SiteMedia | null | undefined | false
): string | undefined {
  const srcSet = getMediaVariants(media)
    .filter((variant) => variant.filename && variant.width)
    .map(
      (variant) =>
        `${localUrl(variant.filename, "media")} ${variant.width}w`
    )
    .join(", ");

  return srcSet || undefined;
}

export function createMediaSizeUrl(
  media: SiteMedia | null | undefined | false,
  size: string
): string {
  if (!media) return "";

  const variants = getMediaVariants(media);
  const requestedWidth = parseWidthKey(size);
  const variant = requestedWidth
    ? variants.find((item) => (item.width ?? 0) >= requestedWidth) ??
      variants.at(-1)
    : variants.at(-1);

  return localUrl(variant?.filename ?? media.filename, "media");
}
