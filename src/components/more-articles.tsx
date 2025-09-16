import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getTreatmentAndCareData } from "@/lib/data";

import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import ServiceTile from "./service-tile";

type MoreArticlesCarouselProps = {
  slugToExclude: string;
};

export default async function MoreArticlesCarousel({
  slugToExclude,
}: MoreArticlesCarouselProps) {
  const { services } = await getTreatmentAndCareData();

  const toShow = services?.filter(
    (service) =>
      typeof service !== "number" &&
      typeof service.article !== "number" &&
      service.article?.slug !== slugToExclude
  );

  return (
    <section className=" py-12 lg:py-16 xl:py-18 relative bg-primary/80">
      <div className="container flex flex-col items-center mx-auto px-0 md:px-12 gap-8 lg:gap-12">
        {/* Title */}
        <Typography
          as="h2"
          variant="sectionTitle"
          className="font-extrabold text-center text-white px-4"
        >
          Explore Other Treatments & Care
        </Typography>

        <Button
          variant="outline"
          size="lg"
          className="font-bold shadow-lg"
          asChild
        >
          <Link href="/treatment-and-care" className="xl:text-lg">
            View all <span className="sr-only">services</span>
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
            {toShow?.map((service, index) => {
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
      </div>
    </section>
  );
}
