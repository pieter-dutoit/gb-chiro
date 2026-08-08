import { Metadata } from "next";

import type { SiteSEO } from "@/lib/site-types";

import { getBaseUrl } from ".";
import { createMediaUrl } from "./media-url";

export default function createMetadataConfig(seo: SiteSEO): Metadata {
  const { meta, openGraph } = seo;

  const baseUrl = getBaseUrl();

  return {
    // Basic fields:
    metadataBase: new URL("", baseUrl),
    generator: "Next.js",
    applicationName: "GB Chiropractic",
    referrer: "strict-origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    // Meta:
    title: {
      default: meta.title,
      template: "%s",
    },
    description: meta.description,
    // OpenGraph:
    openGraph: {
      title: openGraph.title,
      description: openGraph.description,
      siteName: openGraph.siteName,
      type: "website",
      images: openGraph.image.map(({ filename, alt, height, width }) => ({
        url: createMediaUrl(filename, "seo-media"),
        alt,
        height: height ?? 0,
        width: width ?? 0,
      })),
    },
  };
}
