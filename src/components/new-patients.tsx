import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  FileText,
} from "lucide-react";

import { WHAT_TO_EXPECT_STEPS } from "@/lib/constants";
import { getHomePageData } from "@/lib/data";

import CMSImage from "./cms-image";
import { Typography } from "./ui/typography";
import Link from "next/link";
import { Button } from "./ui/button";

const ICON_MAP = {
  clipboard: ClipboardList,
  calender: CalendarCheck,
  filetext: FileText,
};

export default async function NewPatients() {
  const { whatToExpectImage } = await getHomePageData();
  return (
    <section className="flex flex-col items-center relative bg-emerald-900/5 overflow-hidden">
      {/* Container */}
      <div className="flex flex-col-reverse md:flex-row container mx-auto">
        {/* Left block */}
        <div className="flex flex-1 flex-col items-center px-4 md:px-12 gap-12 md:gap-20 py-16 md:py-24 xl:py-30">
          {/* Heading */}
          <div className="flex flex-col gap-4 items-center">
            <Typography
              as="h2"
              variant="sectionTitle"
              className="font-extrabold text-center lg:text-center"
            >
              What to expect at <br />
              your first visit
            </Typography>
            <Typography
              as="p"
              className="text-xl font-light text-center max-w-[45ch]"
            >
              A clear, step-by-step process tailored to you, so you know exactly
              what happens next.
            </Typography>
          </div>
          {/* Steps */}
          <ul className="grid gap-8 flex-col items-center ">
            {WHAT_TO_EXPECT_STEPS.map(({ icon, heading, tldr }) => {
              const Icon = ICON_MAP[icon];
              return (
                <li key={heading} className="flex flex-col items-center gap-2">
                  <span className="mt-1">
                    <Icon className="size-5 text-primary" />
                  </span>

                  <h3 className="font-extrabold text-lg text-center">
                    {heading}
                  </h3>
                  <p className="text-center">{tldr}</p>
                </li>
              );
            })}
          </ul>

          <Button
            variant="outline"
            size="lg"
            className="font-bold shadow-lg"
            asChild
          >
            <Link href="/what-to-expect" className="lg:text-lg">
              Read the full guide
              <ArrowRight />
            </Link>
          </Button>
        </div>

        {/* Right Block */}
        <div
          className="flex-1 relative w-full bg-primary/5 pointer-events-none aspect-12/16 md:aspect-auto"
          tabIndex={-1}
        >
          <CMSImage
            media={whatToExpectImage}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-center object-cover opacity-90 -z-0 "
          />
        </div>
      </div>
    </section>
  );
}
