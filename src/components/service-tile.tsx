import Link from "next/link";
import { twMerge } from "tailwind-merge";

import type { Service } from "@/lib/site-types";

import MediaImage from "./media-image";

type ServiceTileProps = {
  service: Service;
  className?: string;
  variant?: "default" | "carousel";
};

export default function ServiceTile({
  variant = "default",
  service: { id, name, thumbnail, description, article },
  className,
}: ServiceTileProps) {
  const classNames = twMerge(
    "flex size-full bg-white rounded-md shadow-md border border-primary/50 flex items-center overflow-hidden",
    className
  );

  const content = (
    <>
      {/* Thumbnail */}
      <div
        className={twMerge(
          "relative w-1/3 bg-primary/10",
          variant === "default" ? "h-full" : "h-32"
        )}
      >
        <MediaImage
          media={thumbnail}
          sizes="(min-width: 1540px) 155px, (min-width: 1024px) 125px, (min-width: 640px) 110px, 30vw"
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

        <div>
          {article && (
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
      </div>
    </>
  );

  return (
    <li key={id} className="list-none">
      {article ? (
        <Link href={`/treatment-and-care/${article.slug}`} className={classNames}>
          {content}
        </Link>
      ) : (
        <div className={classNames}>{content}</div>
      )}
    </li>
  );
}
