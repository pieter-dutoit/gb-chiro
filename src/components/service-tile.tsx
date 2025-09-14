import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { Service } from "@/payload-types";
import { getBaseUrl } from "@/lib/utils";

import CMSImage from "./cms-image";

type ServiceTileProps = {
  service: Service;
  index: number;
  className?: string;
  variant?: "default" | "carousel";
};

export default function ServiceTile({
  variant = "default",
  service: { id, name, thumbnail, description, article },
  className,
  index,
}: ServiceTileProps) {
  const hasArticle = !!article && typeof article !== "number";
  const Wrapper = hasArticle ? Link : "div";

  return (
    <li key={id} className="list-none">
      <Wrapper
        {...{
          href: `${getBaseUrl()}/treatment-and-care/${hasArticle && article.slug}`,
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
        <div
          className={twMerge(
            "flex flex-1 h-full flex-col justify-start p-2 gap-2",
            variant === "default" ? "lg:p-4 lg:gap-4 justify-between" : ""
          )}
        >
          <h3
            className={twMerge(
              "font-bold",
              variant === "default"
                ? "text-start text-base lg:text-lg"
                : "text-center line-clamp-3 xl:text-lg"
            )}
          >
            {name}
          </h3>
          {variant === "default" && (
            <p className="[text-wrap:balance] text-sm lg:text-base">
              {description}
            </p>
          )}

          {hasArticle && (
            <div
              className={twMerge(
                "text-primary text-sm hover:underline underline-offset-2 font-semibold text-center",
                variant === "default" ? "text-start mt-auto" : "text-center"
              )}
            >
              Read more
            </div>
          )}
        </div>
      </Wrapper>
    </li>
  );
}
