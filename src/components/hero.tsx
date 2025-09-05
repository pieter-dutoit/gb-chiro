import Link from "next/link";
import { MapPin } from "lucide-react";
import { parsePhoneNumber } from "libphonenumber-js/min";

import { getBusinessDetails, getHomePageData } from "@/lib/data";

import CMSImage from "./cms-image";
import OversizedLink from "./oversized-link";

export default async function Hero() {
  const { phone, email, address, bookingLink } = await getBusinessDetails();
  const { landingImage } = await getHomePageData();

  const number = parsePhoneNumber(phone, "AU");

  return (
    <section className="w-screen py-16 lg:py-24 xl:py-30 flex items-center relative">
      {/* Graphics */}
      <div className="absolute w-full h-full overflow-hidden -z-10">
        <CMSImage
          media={landingImage}
          sizes=""
          className="object-cover object-center md:object-contain md:object-top-right"
        />
        <div className="absolute inset-0 size-full bg-gradient-to-r from-[#023b2e] via-[#023b2e] via-[30%] to-[#023b2e]/90 sm:to-primary/60" />
      </div>

      {/* Container */}
      <div className="container mx-auto px-4 md:px-12 z-10">
        {/* Left */}
        <div className="flex flex-col gap-6 lg:gap-10 text-white w-full lg:w-4/6 max-w-[45rem] items-baseline">
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
          <p className="text-lg xl:text-2xl">
            Relief for back, neck and joint pain — right here in Griffith.
            Evidence-based care and a clear plan to help you move well again.
          </p>

          {/* Address */}
          <Link
            href={address.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-full text-white bg-white/5 hover:bg-white/10 ring-1 ring-white/25 hover:ring-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
          >
            <MapPin className="size-5" />
            <span className="font-semibold xl:text-lg">
              {address.street}, {address.suburb}, {address.state.toUpperCase()},{" "}
              {address.code}
            </span>
          </Link>

          {/* CTAs */}
          <div className="flex flex-row flex-wrap items-center gap-3 lg:gap-6">
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
        </div>
      </div>
    </section>
  );
}
