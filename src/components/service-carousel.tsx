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
        <Link href="/treatments">
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
        <CarouselContent className="lg:-ml-2">
          {services.map(({ id, name, slug }) => {
            return (
              <CarouselItem
                key={id}
                className="lg:pl-2 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex items-center justify-center"
              >
                <Link
                  href={`/treatments#${slug}`}
                  className="relative flex items-center justify-center h-11/12 w-11/12 border-2 border-primary rounded-2xl bg-white hover:scale-105 transition-transform"
                >
                  <div className="bg-gradient-to-br from-primary/15 to-primary/8 size-full px-2 py-4 pb-12 lg:px-4 lg:pt-6 lg:pb-14">
                    {/* Title */}
                    <Typography className="text-lg xl:text-xl leading-tight font-bold text-center line-clamp-2">
                      {name}
                    </Typography>

                    {/* Read more overlay */}
                    <Button
                      size="sm"
                      variant="link"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2"
                    >
                      Read more
                    </Button>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
