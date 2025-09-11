import Link from "next/link";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";

import { Service } from "@/payload-types";

import CMSImage from "./cms-image";
import { getBaseUrl } from "@/lib/utils";

type ServiceTileProps = {
  service: Service;
  index: number;
  className?: string;
  variant?: "default" | "carousel";
};

export default function ServiceTile({
  variant = "default",
  service: { slug, id, name, thumbnail, description, article },
  className,
  index,
}: ServiceTileProps) {
  const hasArticle = !!article && typeof article !== "number";
  const Wrapper = hasArticle ? Link : "div";

  return (
    <li key={id} className="list-none">
      <Wrapper
        {...{
          href: `${getBaseUrl()}/articles/${hasArticle && article.slug}`,
          className: twMerge(
            "flex size-full bg-white rounded-md shadow-md border border-primary/50 flex items-center overflow-hidden",
            className
          ),
        }}
      >
        {/* Thumbnail */}
        <div
          className={twMerge(
            "relative w-1/3 bg-primary/10",
            variant === "default" ? "h-full" : "h-32"
          )}
        >
          <CMSImage
            priority={index < 6}
            media={thumbnail}
            sizes="(min-width: 640px) 110px, (min-width: 1024) 125px, (min-width: 1540) 155px, 30vw"
            className="object-center object-cover"
          />
        </div>
        <div className="flex flex-1 h-full flex-col justify-start p-2 gap-2 lg:p-4 lg:gap-4">
          <h3
            className={twMerge(
              "font-bold",
              variant === "default"
                ? "text-start text-base lg:text-lg"
                : "text-center line-clamp-3 lg:text-lg"
            )}
          >
            {name}
          </h3>
          {variant === "default" && (
            <>
              <p className="[text-wrap:balance] text-sm lg:text-base">
                {description}
              </p>
              {hasArticle && (
                <div className="text-primary text-sm hover:underline underline-offset-2 font-semibold">
                  Read more
                </div>
              )}
            </>
          )}
        </div>
      </Wrapper>
    </li>
  );
}
