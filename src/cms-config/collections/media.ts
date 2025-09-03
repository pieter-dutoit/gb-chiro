import type {
  CollectionConfig,
  ImageSize,
  ImageUploadFormatOptions,
} from "payload";

const webpFormat: ImageUploadFormatOptions = {
  format: "webp",
  options: {
    quality: 75,
  },
};

const resizeConfig: Pick<
  ImageSize,
  "position" | "formatOptions" | "withoutEnlargement" | "generateImageName"
> = {
  position: "center",
  formatOptions: webpFormat,
  generateImageName: ({ originalName, sizeName, extension }) => {
    const slug = originalName
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "") // drop original extension if present
      .replace(/[^a-z0-9]+/g, "-") // kebab-case
      .replace(/^-+|-+$/g, ""); // trim dashes

    return `gb-chiropractic-${slug}-${sizeName}.${extension}`;
  },
};

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alternative text",
      required: true,
    },
  ],
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    formatOptions: {
      format: "jpeg",
      options: {
        quality: 75,
      },
    },
    imageSizes: [
      { name: "200w", width: 200, ...resizeConfig },
      { name: "320w", width: 320, ...resizeConfig },
      { name: "480w", width: 480, ...resizeConfig },
      { name: "768w", width: 768, ...resizeConfig },
      { name: "1024w", width: 1024, ...resizeConfig },
      { name: "1280w", width: 1280, ...resizeConfig },
      { name: "1536w", width: 1536, ...resizeConfig },
      { name: "1920w", width: 1920, ...resizeConfig },
      { name: "2560w", width: 2560, ...resizeConfig },
      { name: "3200w", width: 3200, ...resizeConfig },
      { name: "3840w", width: 3840, ...resizeConfig },
    ],
  },
};
