import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { parsePhoneNumber } from "libphonenumber-js/min";

import { getBusinessDetails } from "@/lib/data";

import { Button } from "./ui/button";

export default async function Hero() {
  const { phone, address, bookingLink } = await getBusinessDetails();

  const number = parsePhoneNumber(phone, "AU");

  return (
    <section className="w-screen h-[80vh] flex items-center relative bg-primary">
      {/* Graphics */}
      <div className="absolute w-full h-full opacity-10 overflow-hidden">
        <Image
          unoptimized
          src="/api/media/file/spine-background.svg"
          alt="bg"
          fill
          className="scale-200 -z-0 translate-x-1/3"
        />
      </div>

      {/* Container */}
      <div className="container mx-auto z-10">
        {/* Left */}
        <div className="flex flex-col gap-10 text-white w-4/6 max-w-[50rem] items-baseline">
          <div>
            <h1 className="opacity-80 text-lg font-bold">
              Chiropractor in Griffith
            </h1>
            {/* Title */}
            <p className="text-8xl font-bold tracking-tight whitespace-pre-wrap">
              {`Move Better, \nFeel Better`}
            </p>
          </div>

          {/* Address */}
          <Link
            href={address.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full px-4 py-2 text-white bg-white/10 hover:bg-white/14 ring-1 ring-white/25 hover:ring-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
          >
            <MapPin className="size-5" />
            <span className="font-semibold">
              {address.street}, {address.suburb}, {address.state.toUpperCase()},{" "}
              {address.code}
            </span>
          </Link>

          {/* Overview */}
          <p className="text-2xl whitespace-pre-wrap">
            {`Relief for back, neck and joint pain — right here in Griffith. \nEvidence-based care and a clear plan to help you move well again.`}
          </p>
          {/* CTAs */}
          <div className="flex flex-row items-center gap-6">
            {/* Booking Link */}
            <Button
              asChild
              variant="outline"
              className="w-60 h-14 text-primary text-xl"
            >
              <Link href={bookingLink} rel="noopener noreferrer">
                Book an Appointment
              </Link>
            </Button>
            {/* Phone Link */}
            <Button
              asChild
              variant="outline"
              className="w-60 h-14  text-xl bg-transparent text-white gap-4"
            >
              <Link href={`tel:${number.number}`}>
                <Phone className="size-6" />
                {number.formatNational()}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
