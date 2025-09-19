import { ExternalLink } from "lucide-react";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getReviews } from "@/lib/data";

import { Typography } from "./ui/typography";
import { twMerge } from "tailwind-merge";

function getSlideClasses(count?: number) {
  switch (count) {
    case 1:
      return "basis-full max-w-md mx-auto";
    case 2:
      return "basis-full md:basis-1/2 lg:basis-1/2";
    case 3:
      return "basis-full md:basis-1/2 lg:basis-1/3";
    default: // 4 or more
      return "basis-full md:basis-1/2 lg:basis-1/3";
  }
}

export default async function Reviews() {
  const reviews = await getReviews();

  if (!reviews || reviews.length < 1) {
    return null;
  }

  return (
    <section className="flex flex-col items-center container mx-auto px-0 md:px-12 py-16 lg:py-24 xl:py-30 gap-12 lg:gap-20 relative">
      {/* Main content */}
      <div className="flex flex-col gap-4 items-center px-4">
        <Typography
          as="h2"
          variant="sectionTitle"
          className="font-extrabold text-center"
        >
          Patient Feedback
        </Typography>
        <Typography className="text-xl font-light text-center max-w-[25ch]">
          Read what patients have shared on independent platforms.
        </Typography>
      </div>

      <Carousel
        className="w-full"
        opts={{
          align: "center",
          loop: (reviews?.length ?? 0) > 1,
        }}
      >
        <CarouselPrevious className="hidden md:flex" />
        <CarouselContent className="lg:-ml-6">
          {reviews?.map((review) => {
            if (typeof review === "number") return null;
            const { id, platform, text, name, link } = review;
            return (
              <CarouselItem
                key={id}
                className={twMerge("lg:pl-6", getSlideClasses(reviews.length))}
              >
                <li className="flex flex-col h-full items-center text-center px-4 justify-center">
                  <p className="text-gray-500 italic lg:text-lg ">“{text}”</p>
                  <strong className="mt-2 font-extrabold md:mt-4">
                    {name}
                  </strong>

                  {link ? (
                    <Link
                      href={link}
                      className="flex items-center text-xs underline underline-offset-2"
                      target="_blank"
                    >
                      Read {platform ? `on ${platform}` : null}{" "}
                      <ExternalLink size={12} className="ml-2" />
                    </Link>
                  ) : null}
                </li>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
