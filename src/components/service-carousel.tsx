import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getGraphics, getTreatmentAndCareData } from "@/lib/data";

import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import CMSImage from "./cms-image";
import ServiceTile from "./service-tile";

export default async function ServicesCarousel() {
  const { services } = await getTreatmentAndCareData();
  const { backgroundGraphic } = await getGraphics();
  return (
    <section className="flex flex-col items-center container mx-auto px-0 md:px-12 py-16 lg:py-24 xl:py-30 gap-12 lg:gap-20 relative">
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
        <Typography as="h2" variant="miniHeading" tone="light">
          Chiropractic Services in Griffith
        </Typography>
        <Typography
          as="p"
          variant="sectionTitle"
          className="font-extrabold text-center"
        >
          Services We Provide
        </Typography>
        <Typography className="text-xl font-light text-center max-w-[25ch]">
          Explore the problems we assess and the care we provide.
        </Typography>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="font-bold shadow-lg"
        asChild
      >
        <Link href="/treatment-and-care" className="xl:text-lg">
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
        <CarouselContent className="lg:-ml-6">
          {services?.map((service, index) => {
            if (typeof service === "number") return null;
            return (
              <CarouselItem
                key={service.id}
                className="lg:pl-6 basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ServiceTile
                  variant="carousel"
                  service={service}
                  index={index}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
