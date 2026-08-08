/* eslint-disable @next/next/no-img-element */

import type { ImgHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import type { SiteMedia } from "@/lib/site-types";
import {
  createMediaSrcSet,
  createMediaUrl,
  getMediaVariants,
} from "@/lib/utils/media-url";

type MediaImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "sizes" | "srcSet"
> & {
  media: SiteMedia | null | undefined | false;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export default function MediaImage({
  media,
  sizes,
  className,
  priority,
  ...imgProps
}: MediaImageProps) {
  if (!media || !media.filename) return null;

  const srcSet = createMediaSrcSet(media);
  const deployedImage = getMediaVariants(media).at(-1) ?? media;

  return (
    <img
      {...imgProps}
      width={deployedImage.width}
      height={deployedImage.height}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
      src={createMediaUrl(media.filename, "media")}
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
