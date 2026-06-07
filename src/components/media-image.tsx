/* eslint-disable @next/next/no-img-element */

import type { ImgHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import type { SiteMedia } from "@/lib/site-types";
import { createMediaSrcSet, createMediaUrl } from "@/lib/utils/media-url";

type MediaImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "sizes" | "srcSet"
> & {
  media: SiteMedia | null | undefined | false;
  sizes: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
};

export default function MediaImage({
  media,
  sizes,
  className,
  fill: _fill,
  priority,
  ...imgProps
}: MediaImageProps) {
  void _fill;

  if (!media || !media.filename) return null;

  const srcSet = createMediaSrcSet(media);

  return (
    <img
      {...imgProps}
      fetchPriority={priority ? "high" : "low"}
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
