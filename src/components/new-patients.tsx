import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getHomePageData, getWhatToExpectPageData } from "@/lib/data";

import CMSImage from "./cms-image";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";
import { RichText } from "./rich-text";

export default async function NewPatients() {
  const { whatToExpectImage } = await getHomePageData();
  const { steps } = await getWhatToExpectPageData();

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
              your first <span className="sr-only">Chiropractic</span> visit
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
            {steps?.map((step) => {
              if (typeof step === "number") return null;
              const { icon, title, overview } = step;

              return (
                <li key={overview} className="flex flex-col items-center gap-2">
                  <span className="mt-1">
                    <div className="size-5 relative">
                      <CMSImage
                        media={icon}
                        sizes=""
                        className="object-center object-contain"
                      />
                    </div>
                  </span>

                  <div className="font-extrabold text-lg text-center">
                    <RichText data={title} />
                  </div>
                  <p className="text-center max-w-[30ch]">{overview}</p>
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
            <Link href="/what-to-expect" className="xl:text-lg">
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
            sizes="(min-width: 768px) 50vw, 100vw"
            className="absolute min-w-[100vw] left-1/2 -translate-x-1/2 md:-translate-x-0 object-center object-cover opacity-90 -z-0 md:absolute md:left-0 md:top-0 md:bottom-0 md:min-w-[50vw] 3xl:block 3xl:min-w-auto"
          />
        </div>
      </div>
    </section>
  );
}
