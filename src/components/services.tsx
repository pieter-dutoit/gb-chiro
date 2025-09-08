import { getAboutUsPageData, getServicesData } from "@/lib/data";

import CMSImage from "./cms-image";
import { Typography } from "./ui/typography";
import ServiceTile from "./service-tile";

export default async function Services() {
  const services = await getServicesData();

  return (
    <section className="flex flex-col items-center container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-20 lg:gap-30 relative">
      <div className="flex flex-col items-center gap-4 lg:gap-12">
        <Typography as="h1" variant="pageTitle" tone="primary">
          Treatment & Care
        </Typography>
        {/* Main content */}

        <Typography
          as="h2"
          className="text-center text-lg md:text-xl lg:text-2xl font-light max-w-[30ch]"
        >
          Targeted chiropractic care to restore how you move and feel.
        </Typography>
      </div>

      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
        {services.map((service, index) => {
          return (
            <ServiceTile key={service.id} index={index} service={service} />
          );
        })}
      </ul>
    </section>
  );
}
