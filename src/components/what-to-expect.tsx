import { getWhatToExpectPageData } from "@/lib/data";

import { Typography } from "./ui/typography";
import { RichText } from "./rich-text";

export default async function WhatToExpect() {
  const { steps } = await getWhatToExpectPageData();
  return (
    <section className="flex flex-col items-center container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-20 lg:gap-30 relative overflow-hidden">
      <div className="flex flex-col items-center gap-4 lg:gap-12">
        <Typography as="h1" variant="pageTitle" tone="primary">
          Our Care Process
        </Typography>
        {/* Main content */}

        <Typography
          as="h2"
          className="text-center text-lg md:text-xl lg:text-2xl font-light max-w-[30ch]"
        >
          At GB Chiropractic, we take a holistic approach to your care.
        </Typography>
      </div>

      <ol className="flex flex-col gap-16 lg:gap-20 ">
        {steps?.map((step, index) => {
          if (typeof step === "number") return null;
          const { title, description, overview } = step;

          return (
            <li
              id={overview}
              key={overview}
              className="relative flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1 relative text-xl sm:text-2xl lg:text-3xl">
                {/* Ghost text */}
                <div className="text-[3em] text-primary/5 font-extrabold leading-[1] absolute -left-[0.2ch] lg:-left-[2.5ch] -top-[1.1ch] lg:-top-[0.3ch]">
                  0{index + 1}
                </div>
                {/* Title */}
                <Typography className="font-bold max-w-[30ch] text-xl sm:text-2xl lg:text-3xl">
                  <RichText data={title} />
                </Typography>

                <div className="opacity-60 font-semibold text-sm lg:text-base">
                  {overview}
                </div>
              </div>

              {/* Content */}
              <Typography
                variant="paragraphs"
                className="text-left max-w-[65ch] lg:text-lg"
              >
                <RichText data={description} className="" />
              </Typography>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
