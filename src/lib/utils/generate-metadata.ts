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

  return {
    // Basic fields:
    metadataBase: new URL(getBaseUrl()),
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
      images: ogImages.map(({ url, alt, height, width }) => ({
        url: url ?? "",
        alt,
        height: height ?? 0,
        width: width ?? 0,
      })),
    },
  };
}
