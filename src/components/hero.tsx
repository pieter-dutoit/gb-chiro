import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import { parsePhoneNumber } from "libphonenumber-js/min";

import { getBusinessDetails, getHomePageData } from "@/lib/data";
import { formatOperatingHours } from "@/lib/utils";

import CMSImage from "./cms-image";
import OversizedLink from "./oversized-link";

export default async function Hero() {
  const { phone, email, address, bookingLink, operatingHours } =
    await getBusinessDetails();
  const { landingImage } = await getHomePageData();

  const number = parsePhoneNumber(phone, "AU");

  return (
    <section className="w-screen py-16 lg:py-24 xl:py-32 flex items-center relative">
      {/* Graphics */}
      <div className=" absolute w-full h-full overflow-hidden -z-10">
        <CMSImage
          priority
          media={landingImage}
          sizes="70vw"
          className="object-cover w-[70vw]  ml-auto"
        />
        <div className="absolute inset-0 size-full bg-gradient-to-r from-[#014335] sm:from-[#00271e] via-[#014335]  via-[30%] to-[#014335]/90 sm:to-[#000000]/0" />
      </div>

      {/* Container */}
      <div className="container mx-auto px-4 md:px-12 z-10">
        {/* Left */}
        <div className="flex flex-col gap-8 lg:gap-12 xl:gap-16 text-white w-full items-baseline">
          <div>
            <h1 className="opacity-80 text-lg lg:text-xl font-bold ">
              Chiropractor in Griffith
            </h1>
            {/* Title */}
            <p className="text-5xl md:text-6xl xl:text-8xl font-bold tracking-tight whitespace-pre-wrap mt-2 ">
              Move Better{`\n`}
              <span>Live Freely</span>
            </p>
          </div>

          {/* Overview */}
          <p className="text-lg xl:text-2xl max-w-[50ch]">
            Relief for back, neck and joint pain — right here in Griffith.{" "}
            <br />
            Evidence-based care and a clear plan to help you move well again.
          </p>

          {/* CTAs */}
          <div className="flex flex-row flex-wrap items-center gap-3 lg:gap-4">
            {/* Booking Link */}
            <OversizedLink label="Book an Appointment" href={bookingLink} />
            {/* Phone Link */}
            <OversizedLink
              label={number.formatNational()}
              href={`tel:${number.number}`}
              iconType="phone"
              variant="outline"
            />

            {/* Email Link */}
            <OversizedLink
              label={email}
              href={`mailto:${email}`}
              iconType="email"
              variant="outline"
            />
          </div>

          {/* Address & Hours */}
          <div className="flex flex-col gap-2">
            {/* Operating Hours */}
            <div className="flex flex-row gap-2 items-center">
              <CalendarClock size={20} />
              <ul>
                {formatOperatingHours(operatingHours).map((hrs) => (
                  <li key={hrs}>{hrs}</li>
                ))}
              </ul>
            </div>

            {/* Maps link */}
            <Link
              className="flex flex-row items-center gap-2 underline underline-offset-2"
              href={address.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin size={20} />
              <span>
                {address.street}, {address.suburb},{" "}
                {address.state.toUpperCase()}, {address.code}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
