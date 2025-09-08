import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getGraphics, getServicesData } from "@/lib/data";

import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import CMSImage from "./cms-image";

export default async function ServicesCarousel() {
  const services = await getServicesData();
  const { backgroundGraphic } = await getGraphics();
  return (
    <div className="flex flex-col items-center container mx-auto px-0 md:px-12 py-16 lg:py-24 xl:py-30 gap-12 lg:gap-20 relative">
      {/* Graphic */}

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        tabIndex={-1}
      >
        <CMSImage
          media={backgroundGraphic}
          sizes=""
          className="scale-200 object-contain opacity-4 -z-10 translate-x-1/4"
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-4 items-center px-4">
        <Typography
          as="h2"
          variant="sectionTitle"
          className="font-extrabold text-center"
        >
          Services We Provide
        </Typography>
        <Typography className="text-xl font-light text-center">
          Explore the problems we assess and the care we provide
        </Typography>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="font-bold shadow-lg"
        asChild
      >
        <Link href="/treatment-and-care">
          View all services
          <ArrowRight />
        </Link>
      </Button>

      <Carousel
        className="w-full"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselPrevious className="hidden md:flex" />
        <CarouselContent className="lg:-ml-2">
          {services.map(({ id, slug, name, thumbnail }) => {
            return (
              <CarouselItem
                key={id}
                className="lg:pl-2 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex items-center justify-center"
              >
                {/* Card */}
                <Link
                  href={`/treatment-and-care#${slug}`}
                  className="focus:scale-110 relative flex items-center justify-center h-11/12 w-11/12 border-2 border-primary rounded-2xl overflow-hidden bg-white hover:scale-105 transition-transform"
                >
                  {/* Background */}
                  <CMSImage
                    media={thumbnail}
                    sizes="(min-width: 640px) 192px, (min-width: 1540px) 250px, 40vw"
                    className="pointer-events-auto -z-0 object-cover blur-[0.1em] opacity-80"
                    tabIndex={-1}
                  />

                  {/* Card content */}
                  <div className="relative size-full bg-primary/80 px-2 py-4 pb-12 lg:px-4 lg:pt-6 lg:pb-14">
                    {/* Title */}
                    <Typography className="text-lg xl:text-xl leading-tight font-bold text-center line-clamp-2 text-white">
                      {name}
                    </Typography>

                    {/* Read more overlay */}
                    <Button
                      size="sm"
                      variant="link"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white/70"
                      asChild
                    >
                      <span>Read more</span>
                    </Button>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
}
