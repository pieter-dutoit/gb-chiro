import { Metadata } from "next";

import { Article } from "@/payload-types";

import { getBaseUrl } from ".";

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

  const thumbnail =
    !!article.thumbnail &&
    typeof article.thumbnail !== "number" &&
    article.thumbnail;

  const preferredOrder = [
    "750w",
    "640w",
    "384w",
    "256w",
    "128w",
    "96w",
    "64w",
    "48w",
  ] as const;

  let ogUrl: string | undefined;
  let ogWidth: number | undefined;
  let ogHeight: number | undefined;
  const ogAlt: string | undefined =
    (thumbnail && thumbnail?.alt) || title || undefined;

  if (thumbnail && thumbnail?.sizes) {
    for (const key of preferredOrder) {
      const candidate = thumbnail.sizes[key];
      if (candidate?.filename) {
        ogUrl = new URL(`images/${candidate.filename}`, baseUrl).toString();
        ogWidth = candidate.width ?? undefined;
        ogHeight = candidate.height ?? undefined;
        break;
      }
    }
  }

  // Fallback to the original thumbnail URL
  if (!ogUrl && thumbnail && thumbnail?.filename) {
    ogUrl = new URL(`images/${thumbnail.filename}`, baseUrl).toString();
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
    opts.description ?? `${title} – an article from ${siteName}.`;

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
