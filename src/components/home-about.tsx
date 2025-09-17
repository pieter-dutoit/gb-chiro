import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getAboutUsPageData } from "@/lib/data";

import CMSImage from "./cms-image";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";

export default async function HomeAbout() {
  const { meetTheChiroImage } = await getAboutUsPageData();

  return (
    <section className="bg-gradient-to-b to-primary/10 from-white">
      {/* Container */}
      <div className="flex flex-col items-center container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-16 lg:gap-24 xl:gap-30">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
          {/* Left content */}
          <div className="relative w-full max-w-[25rem] lg:max-w-[35rem] aspect-square rounded-xl overflow-hidden bg-primary/100 mx-auto shadow-lg">
            <CMSImage
              media={meetTheChiroImage}
              sizes="(min-width: 430px) 400px, (min-width: 768px) 320px, (min-width: 1024px) 450px, (min-width: 1290px) 550px 80vw"
              className="object-center object-cover"
            />
          </div>
          {/* Right content */}
          <div className="size-full flex flex-col items-center justify-center gap-8 lg:gap-12 xl:gap-16">
            {/* Heading */}
            <div className="w-full flex flex-col items-center gap-4">
              <Typography as="h2" tone="light" variant="miniHeading">
                Griffith Chiropractor
              </Typography>
              <Typography
                as="h3"
                variant="sectionTitle"
                className="font-extrabold text-center max-w-[20ch] lg:text-center"
              >
                At GB Chiropractic, your wellbeing is our priority.
              </Typography>
            </div>

            <Typography variant="paragraphs">
              <p className="text-center lg:text-lg xl:text-xl max-w-[50ch]">
                We draw on professional training and practical experience to
                provide safe, effective chiropractic care you can rely on. Our
                focus is on helping you recover, move with confidence, and
                maintain long-term health. Choosing GB Chiropractic means
                placing your care in skilled and trusted hands.
              </p>
            </Typography>

            <Button
              variant="outline"
              size="lg"
              className="font-bold shadow-lg"
              asChild
            >
              <Link href="/about-us" className="xl:text-lg">
                More about GB Chiropractic
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
