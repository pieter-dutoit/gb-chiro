import { twMerge } from "tailwind-merge";
import { Service } from "@/payload-types";
import CMSImage from "./cms-image";

type ServiceTileProps = {
  service: Service;
  index: number;
  className?: string;
  variant?: "default" | "carousel";
};

export default function ServiceTile({
  variant = "default",
  service: { slug, id, name, thumbnail, description },
  className,
  index,
}: ServiceTileProps) {
  return (
    <li
      id={slug ?? ""}
      key={id}
      className={twMerge(
        "rounded-md shadow-sm border border-primary/50 flex items-center overflow-hidden",
        className
      )}
    >
      {/* Thumbnail */}
      <div
        className={twMerge(
          "relative w-1/3",
          variant === "default" ? "h-full" : "h-30"
        )}
      >
        <CMSImage
          priority={index < 6}
          media={thumbnail}
          sizes="(min-width: 640px) 110px, (min-width: 1024) 125px, (min-width: 1540) 155px, 30vw"
          className="object-center object-cover bg-primary/10"
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
          <p className="[text-wrap:balance] text-sm lg:text-base">
            {description}
          </p>
        )}
      </div>
    </li>
  );
}
