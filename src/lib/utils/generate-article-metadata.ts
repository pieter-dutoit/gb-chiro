import { Metadata } from "next";

import type { Article } from "@/lib/site-types";

import { getBaseUrl } from ".";
import { createMediaUrl, getMediaVariants } from "./media-url";

interface ArticleMetaOptions {
  description?: string;
  tags?: string[];
  siteName?: string;
  canonicalPath?: string;
}

export function generateArticleMetadata(
  article: Article,
  opts: ArticleMetaOptions = {}
): Metadata {
  const { title, slug, author, createdAt, updatedAt } = article;

  const siteName =
    opts.siteName ?? "GB Chiropractic – Chiropractor in Griffith";
  const baseUrl = getBaseUrl();

  const thumbnail = article.thumbnail;

  const preferredWidths = [750, 640, 384, 256, 128, 96, 64, 48] as const;

  let ogUrl: string | undefined;
  let ogWidth: number | undefined;
  let ogHeight: number | undefined;
  const ogAlt: string | undefined =
    (thumbnail && thumbnail?.alt) || title || undefined;

  if (thumbnail) {
    const variants = getMediaVariants(thumbnail);

    for (const width of preferredWidths) {
      const candidate = variants.find((variant) => variant.width === width);

      if (!candidate?.filename) {
        continue;
      }

      ogUrl = createMediaUrl(candidate.filename, "media");
      ogWidth = candidate.width ?? undefined;
      ogHeight = candidate.height ?? undefined;
      break;
    }
  }

  // Fallback to the original thumbnail URL
  if (!ogUrl && thumbnail && thumbnail?.filename) {
    ogUrl = createMediaUrl(thumbnail.filename, "media");
    ogWidth = thumbnail.width ?? undefined;
    ogHeight = thumbnail.height ?? undefined;
  }

  // Final fallback: no image
  const ogImages = ogUrl
    ? [{ url: ogUrl, width: ogWidth, height: ogHeight, alt: ogAlt }]
    : [];

  // Authors can be string or array
  const authors =
    typeof author === "string" ? [author] : Array.isArray(author) ? author : [];

  const publishedTime = createdAt
    ? new Date(createdAt).toISOString()
    : undefined;
  const modifiedTime = updatedAt
    ? new Date(updatedAt).toISOString()
    : undefined;

  // Default description
  const description =
    opts.description ?? article.description ?? `${title} - an article from ${siteName}.`;

  // Canonical URL (optional but recommended)
  const canonical =
    opts.canonicalPath ??
    (slug ? `/treatment-and-care/${encodeURIComponent(slug)}` : undefined);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${title} | ${siteName}`,
      template: "%s",
    },
    description,
    applicationName: siteName,
    robots: {
      index: true,
      follow: true,
    },
    alternates: canonical
      ? { canonical: new URL(canonical, baseUrl).toString() }
      : undefined,
    openGraph: {
      type: "article",
      siteName,
      title: `${title} | ${siteName}`,
      description,
      // og:article specific fields:
      authors,
      publishedTime,
      modifiedTime,
      tags: opts.tags,
      images: ogImages,
      url: canonical ? new URL(canonical, baseUrl).toString() : undefined,
    },
  };
}
