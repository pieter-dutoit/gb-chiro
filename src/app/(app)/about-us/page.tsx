import { Metadata } from "next";

import About from "@/components/about";
import Breadcrumbs from "@/components/breadcrumbs";
import CallToAction from "@/components/call-to-action";
import CMSImage from "@/components/cms-image";
import MeetTheChiro from "@/components/meet-the-chiro";
import Practice from "@/components/practice";

import {
  getAboutUsPageData,
  getBusinessDetails,
  getGraphics,
} from "@/lib/data";
import createMetadataConfig from "@/lib/utils/generate-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutUsPageData();
  if (!seo) return {};
  return createMetadataConfig(seo);
}

export default async function AboutUsPage() {
  const { backgroundGraphic } = await getGraphics();
  const { bookingLink } = await getBusinessDetails();
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "About us", item: "/about-us" }]} />
      <div className="relative">
        {/* Page content */}
        <About />
        <MeetTheChiro />
        <Practice />
        <CallToAction
          miniHeading="Personalised Chiropractic Care"
          heading="Personalised care you can trust"
          description="Learn more about the care we provide."
          ctas={[
            {
              variant: "link",
              label: "View our services",
              href: "/treatment-and-care",
            },

            {
              variant: "default",
              label: "Book an Appointment",
              href: bookingLink,
            },
          ]}
        />

        {/* Graphics */}
        <div
          className="absolute overflow-hidden inset-0 -z-10 pointer-events-none"
          tabIndex={-1}
        >
          <div className="absolute w-50 h-100 lg:w-75 lg:h-150 -left-24 lg:-left-50 top-1/4 opacity-7 rotate-15">
            <CMSImage media={backgroundGraphic} sizes="" />
          </div>
          <div className="absolute w-100 h-200 top-5/12 -right-70 lg:-right-80 opacity-12">
            <CMSImage media={backgroundGraphic} sizes="" />
          </div>
        </div>
      </div>
    </>
  );
}
