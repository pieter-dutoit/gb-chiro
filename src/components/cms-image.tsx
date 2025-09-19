/* eslint-disable @next/next/no-img-element */

import { Media } from "@/payload-types";
import { ImageProps } from "next/image";
import { twMerge } from "tailwind-merge";

const BASE_URL = "/images";

type CMSImageProps = Omit<ImageProps, "src" | "alt"> & {
  media: Media | number;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export default function CMSImage({
  media,
  sizes,
  className,
  priority,
}: CMSImageProps) {
  if (!media || typeof media === "number" || !media.url) {
    return null;
  }

  const srcSet =
    media.sizes &&
    Object.entries(media.sizes)
      .filter((entry) => Boolean(entry[1]?.url))
      .map(([size, { filename }]) => `${BASE_URL}/${filename} ${size}`)
      .join(", ");

  return (
    <img
      fetchPriority={priority ? "high" : "low"}
      loading={priority ? "eager" : "lazy"}
      src={`${BASE_URL}/${media.filename}`}
      srcSet={srcSet?.length ? srcSet : undefined}
      alt={media.alt}
      className={twMerge(
        "absolute inset-0 size-full object-contain",
        className
      )}
      sizes={sizes?.length ? sizes : "100vw"}
    />
  );
}
