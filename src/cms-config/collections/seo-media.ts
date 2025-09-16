import type { CollectionConfig } from "payload";

export const SEOMedia: CollectionConfig = {
  slug: "seo-media",
  labels: {
    singular: "SEO Media",
    plural: "SEO Media",
  },
  access: { read: () => true },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Brief image description",
      required: true,
    },
  ],
  upload: {
    staticDir: "seo-media",
    mimeTypes: ["image/*"],
    formatOptions: {
      format: "jpeg",
      options: {
        quality: 75,
      },
    },
    resizeOptions: {
      width: 1200,
      height: 630,
      fit: "cover",
      position: "center",
    },
    adminThumbnail: "thumbnail",
    imageSizes: [
      {
        name: "thumbnail",
        fit: "cover",
        width: 600,
        height: 315,
        formatOptions: {
          format: "jpeg",
          options: {
            quality: 75,
          },
        },
      },
    ],
  },
};
