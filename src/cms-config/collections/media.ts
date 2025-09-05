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

export const IMAGE_SIZES = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
  3840,
];

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
    imageSizes: IMAGE_SIZES.map((size) => ({
      name: `${size}w`,
      width: size,
      ...resizeConfig,
    })),
  },
};
