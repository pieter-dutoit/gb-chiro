import { Metadata } from "next";

import Breadcrumbs from "@/components/breadcrumbs";
import CallToAction from "@/components/call-to-action";
import Services from "@/components/services";
import { getBusinessDetails, getTreatmentAndCareData } from "@/lib/data";
import createMetadataConfig from "@/lib/utils/generate-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getTreatmentAndCareData();
  if (!seo) return {};
  return createMetadataConfig(seo);
}

export default async function TreatmentAndCarePage() {
  const { bookingLink } = await getBusinessDetails();
  return (
    <>
      <Breadcrumbs
        crumbs={[{ name: "Treatment & Care", item: "/treatment-and-care" }]}
      />
      <Services />
      <CallToAction
        miniHeading="Chiropractic Services Griffith"
        heading="Need Help Choosing the Right Chiropractic Care?"
        description="Reach out and we’ll recommend the best next step."
        ctas={[
          {
            label: "Contact us",
            href: "/contact-us",
            variant: "link",
          },
          {
            label: "Book an Appointment",
            href: bookingLink,
            variant: "outline",
          },
        ]}
      />
    </>
  );
}
