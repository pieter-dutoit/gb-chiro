import CallToAction from "@/components/call-to-action";
import Hero from "@/components/hero";
import HomeAbout from "@/components/home-about";
import NewPatients from "@/components/new-patients";
import ServicesCarousel from "@/components/service-carousel";

import { getBusinessDetails, getHomePageData } from "@/lib/data";
import { createStructuredData } from "@/lib/utils/create-structured-data";

export default async function Home() {
  const { bookingLink } = await getBusinessDetails();
  const { landingImage, whatToExpectImage } = await getHomePageData();

  const jsonLd = await createStructuredData({
    identifier: "home",
    slug: "",
    primaryImage: landingImage,
    otherImages: [whatToExpectImage],
    crumbs: [{ name: "Home", slug: "" }],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ServicesCarousel />
      <NewPatients />
      <HomeAbout />
      <CallToAction
        withMap
        miniHeading="Find Our Clinic"
        heading="Local Care, Easy To Reach"
        description="Find our clinic in Griffith with ease — or book your appointment in just a few clicks."
        ctas={[
          {
            label: "Book an Appointment",
            href: bookingLink,
          },
        ]}
      />
    </>
  );
}
