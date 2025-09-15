import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { parsePhoneNumber } from "libphonenumber-js/min";

import { getBusinessDetails } from "@/lib/data";
import { formatOperatingHours } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "./ui/button";

export default async function Footer() {
  const {
    email,
    phone,
    address: { street, suburb, state, code, mapsLink },
    operatingHours,
    bookingLink,
  } = await getBusinessDetails();

  const number = parsePhoneNumber(phone, "AU");

  return (
    <footer className="bg-black/95 text-white flex flex-col gap-10 py-10 sm:py-16 xl:py-18">
      <ul className="container mx-auto px-4 md:px-12 gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Col 1: Business details */}
        <li className="flex flex-col gap-4">
          {/* Logo */}
          <h3 className="font-semibold text-2xl">
            GB Chiropractic <span className="sr-only">in Griffith</span>
          </h3>

          {/* Contact details */}
          <h4 className="sr-only">Contact details</h4>
          <ul className="flex flex-col gap-2 font-light opacity-70">
            <li>
              <Link
                href={`tel:${number.number}`}
                className="flex items-center gap-2 hover:underline underline-offset-2"
              >
                <Phone className="size-4" />
                {number.formatNational()}
              </Link>
            </li>
            <li>
              <Link
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:underline underline-offset-2"
              >
                <Mail className="size-4" />
                {email}
              </Link>
            </li>
          </ul>

          {/* Address */}
          <h4 className="sr-only">Address</h4>
          <ul className="flex flex-col gap-2 font-light opacity-70">
            <li>
              <p className="font-light">
                {street}, {suburb}, {state.toUpperCase()}, {code}
              </p>
            </li>
            <li>
              <Link
                href={mapsLink}
                className="flex items-center gap-2 hover:underline underline-offset-2"
              >
                <MapPin className="size-4" />
                Get Directions
              </Link>
            </li>
          </ul>

          {/* Hours */}
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold">Operating Hours</h4>
            <ul className="opacity-70 font-light">
              {formatOperatingHours(operatingHours).map((hrs, index) => {
                const note = operatingHours[index]?.note ?? null;

                return (
                  <li key={hrs}>
                    {hrs}
                    {note && <sup>*</sup>}
                  </li>
                );
              })}
            </ul>
            <ul className="mt-2 text-sm opacity-60">
              {operatingHours
                .filter(({ note }) => Boolean(note))
                .map(({ note }) => (
                  <li key={note}>
                    <sup>*</sup>
                    {note}
                  </li>
                ))}
            </ul>
          </div>
        </li>

        {/* Col 3: CTAs */}
        <li className="flex flex-col gap-4">
          <div className="font-semibold text-2xl">Make an Appointment</div>
          <ul className="flex flex-col gap-1 ">
            <li>
              <Button asChild className="bg-blue-600 xl:text-lg">
                <Link href={bookingLink}>Book Online</Link>
              </Button>
            </li>
          </ul>
        </li>

        {/* Content Col 2: Business */}
        <li className="flex flex-col gap-4">
          {/* Business details */}

          {/* Logo */}
          <div className="font-semibold text-2xl">Links</div>

          <ul className="flex flex-col gap-3 opacity-70 font-light">
            {NAV_LINKS.map(({ name, path }) => {
              return (
                <li key={path}>
                  <Link
                    href={path}
                    className="flex items-center gap-2 hover:underline underline-offset-2"
                  >
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>

      {/* Copyright */}
      <div className="w-full text-center text-gray-300">
        &copy; {new Date().getFullYear()} GB Chiropractic
      </div>
    </footer>
  );
}
