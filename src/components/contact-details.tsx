import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { parsePhoneNumber } from "libphonenumber-js/min";

import { formatOperatingHours } from "@/lib/utils";
import { getBusinessDetails, getSocials } from "@/lib/data";

import { Typography } from "./ui/typography";
import SocialLink from "./social-link";

export default async function ContactDetails() {
  const {
    phone,
    email,
    operatingHours,
    address: { street, suburb, state, code, mapsLink },
  } = await getBusinessDetails();

  const socials = await getSocials();

  const number = parsePhoneNumber(phone, "AU");

  return (
    <section className="bg-gradient-to-b from-primary/10 to-white">
      <div className="container flex flex-col mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-20 lg:gap-30 relative">
        <div className="flex flex-col items-center gap-4">
          <Typography as="h1" variant="miniHeading" tone="light">
            Contact GB Chiropractic in Griffith
          </Typography>
          <Typography as="p" variant="pageTitle">
            How To Reach Us
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Email & Phone Card */}
          <div className="rounded-lg bg-white p-6 shadow-md flex flex-col gap-10">
            <div>
              <h2 className="text-xl font-semibold text-primary">
                Contact Information
              </h2>
              <div className="mt-2 space-y-2">
                <Link
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 hover:underline underline-offset-2"
                >
                  <Mail className="size-4 text-primary" />
                  <span>{email}</span>
                </Link>
                <Link
                  href={`tel:${number.number}`}
                  className="flex items-center gap-2 hover:underline underline-offset-2"
                >
                  <Phone className="size-4 text-primary" />
                  <span>{number.formatNational()}</span>
                </Link>
              </div>

              <h3 className="font-bold mt-4 text-primary">Follow us</h3>
              <ul className="mt-2 space-y-2">
                {socials.map((platform) => (
                  <li key={platform.id}>
                    <SocialLink {...platform} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-semibold text-primary">Address</h3>
              <div className="mt-2 flex flex-col gap-4">
                <p>
                  {street}, {suburb}, {state.toUpperCase()}, {code}
                </p>
                <Link
                  href={mapsLink}
                  className="flex items-center gap-1 hover:underline underline-offset-2"
                  target="_blank"
                >
                  <MapPin className="size-6" />
                  Get Directions
                </Link>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-xl font-semibold text-primary">
                Operating Hours
              </h3>
              <ul className="mt-2 flex flex-col">
                {formatOperatingHours(operatingHours).map((hrs, index) => {
                  const note = operatingHours[index]?.note ?? null;
                  return (
                    <li key={hrs}>
                      {hrs} {note && <sup>*</sup>}
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
          </div>

          {/* Maps Card */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold text-primary">
              Our Location in Griffith
            </h2>
            <div className="w-full h-[28rem] mt-4">
              <iframe
                title="Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3298.597713281765!2d146.0460939757263!3d-34.281409573071585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b1fae72bfdebe37%3A0xdeaaad55252d45cf!2s2%20Noorebar%20Ave%2C%20Griffith%20NSW%202680!5e0!3m2!1sen!2sau!4v1757483283999!5m2!1sen!2sau"
                width="600"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full rounded-md md:min-h-80"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
