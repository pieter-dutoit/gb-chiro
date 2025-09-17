import { getTreatmentAndCareData } from "@/lib/data";

import { Typography } from "./ui/typography";
import ServiceTile from "./service-tile";

export default async function Services() {
  const { services } = await getTreatmentAndCareData();

  return (
    <section className="flex flex-col items-center container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-20 lg:gap-30 relative">
      <div className="flex flex-col items-center gap-4 lg:gap-12">
        <div className="flex flex-col items-center text-center">
          <Typography as="h1" variant="miniHeading" tone="light">
            Chiropractic Care in Griffith
          </Typography>
          <Typography as="p" variant="pageTitle">
            Treatment & Care
          </Typography>
        </div>
        {/* Main content */}

        <Typography
          as="h2"
          className="text-center text-lg md:text-xl lg:text-2xl font-light max-w-[30ch]"
        >
          Targeted chiropractic care to restore how you move and feel.
        </Typography>
      </div>

      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-3 xl:gap-6">
        {services?.map((service, index) => {
          if (typeof service === "number") return null;
          return (
            <ServiceTile key={service.id} index={index} service={service} />
          );
        })}
      </ul>
    </section>
  );
}
