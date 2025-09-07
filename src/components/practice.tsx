import Link from "next/link";
import { CalendarClock, Home, MapPin } from "lucide-react";

import { getAboutUsPageData, getBusinessDetails } from "@/lib/data";
import { formatOperatingHours } from "@/lib/utils";

import CMSImage from "./cms-image";
import { Typography } from "./ui/typography";

export default async function Practice() {
  const { practiceImages } = await getAboutUsPageData();
  const { operatingHours, address } = await getBusinessDetails();

  return (
    <section className="bg-gradient-to-b from-primary/20 to-white">
      <div className="flex flex-col items-center container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-10">
        <Typography variant="sectionTitle">Practice</Typography>
        {/* About paragraphs */}
        <Typography variant="paragraphs">
          <p className="text-center">
            A calm, family-friendly clinic with private treatment rooms and easy
            access.
          </p>
        </Typography>

        {/* Address & Hours */}
        <div className="flex flex-col gap-8 items-center">
          {/* Operating Hours */}
          <div className="flex flex-col gap-1 items-center">
            <CalendarClock size={20} />
            <ul className="flex flex-col items-center">
              {formatOperatingHours(operatingHours).map((hrs) => (
                <li key={hrs}>{hrs}</li>
              ))}
            </ul>
          </div>

          {/* Maps link */}
          <Typography className="flex flex-col items-center gap-1 text-center">
            <Home size={20} />
            <span>
              {address.street}, {address.suburb}, {address.state.toUpperCase()},{" "}
              {address.code}
            </span>
          </Typography>

          <Link
            className="flex flex-row items-center gap-1 underline underline-offset-2"
            href={address.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin size={20} />
            Get directions
          </Link>
        </div>

        {/* Gallery */}
        <ul className="grid md:grid-cols-2 gap-4 lg:gap-8 mt-8 w-full">
          {practiceImages.map((media) => (
            <li
              key={typeof media === "number" ? `${media}` : media.id}
              className="relative aspect-[4/3] bg-primary/20 rounded-lg overflow-hidden shadow-lg opacity-95"
            >
              <CMSImage
                media={media}
                className="object-center object-cover filter contrast-[.96] saturate-[.92] brightness-[1.02]"
                sizes="(min-width: 1540px) 696px, (min-width: 1280px) 570px, (min-width: 1024px) 440px, (min-width: 770px) 670px, 80vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
