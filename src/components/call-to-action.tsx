import Link from "next/link";

import { getGraphics } from "@/lib/data";
import CMSImage from "./cms-image";

import { Button } from "./ui/button";
import { Typography } from "./ui/typography";
import { twMerge } from "tailwind-merge";

type CallToActionProps = {
  withMap?: boolean;
  heading: string;
  description: string;
  ctas: {
    label: string;
    href: string;
    variant?: "default" | "ghost" | "link" | "outline";
  }[];
};

export default async function CallToAction({
  withMap = false,
  heading,
  description,
  ctas,
}: CallToActionProps) {
  const { backgroundGraphic } = await getGraphics();
  return (
    <section
      className={twMerge(
        "w-screen bg-gradient-to-r from-primary/12 to-primary/27 overflow-hidden",
        withMap ? "to-primary/40" : "to-primary/27"
      )}
    >
      <div
        className={twMerge(
          "w-full container mx-auto grid grid-cols-1 relative",
          withMap ? "sm:grid-cols-2" : ""
        )}
      >
        {/* Graphic */}
        <div
          className={twMerge(
            "absolute h-full top-0 left-1/12 w-1/2 sm:w-1/4 lg:w-2/12 overflow-hidden scale-110 ",
            withMap ? "opacity-5" : "opacity-6 lg:opacity-10"
          )}
        >
          <CMSImage media={backgroundGraphic} sizes="" />
        </div>
        {/* Container */}
        <div className="flex flex-col container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-8 lg:gap-12 relative">
          {/* Heading */}
          <div className="flex flex-col items-center text-center gap-4">
            <Typography
              as="h3"
              variant="sectionTitle"
              className="font-bold lg:text-center"
            >
              {heading}
            </Typography>
            <p className="text-lg md:text-xl lg:text-2xl">{description}</p>
          </div>

          {/* Links and buttons */}
          <ul className="flex flex-row gap-2 flex-wrap justify-center">
            {ctas.map(({ label, href, variant = "outline" }) => (
              <li key={label}>
                <Button
                  asChild
                  variant={variant}
                  size="lg"
                  className="font-semibold text-lg"
                >
                  <Link href={href}>{label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {withMap && (
          <div className="w-full p-8 h-[26rem] mt-4">
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
        )}
      </div>
    </section>
  );
}
