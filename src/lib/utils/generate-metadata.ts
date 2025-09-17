import { Metadata } from "next";

import { MetadataField, OpenGraphField } from "@/payload-types";

import { getBaseUrl } from ".";

interface SEO {
  meta: MetadataField;
  open_graph: OpenGraphField;
}

export default function createMetadataConfig(seo: SEO): Metadata {
  const { meta, open_graph } = seo;

  const ogImages = open_graph.image.filter(
    (item) => !!item && typeof item !== "number"
  );

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
      title: open_graph.title,
      description: open_graph.description,
      siteName: open_graph.site_name,
      type: "website",
      images: ogImages.map(({ filename, alt, height, width }) => ({
        url: filename ? `${baseUrl}/seo-images/${filename}` : "",
        alt,
        height: height ?? 0,
        width: width ?? 0,
      })),
    },
  };
}
