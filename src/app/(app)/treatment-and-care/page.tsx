import { Metadata } from "next";

import Breadcrumbs from "@/components/breadcrumbs";
import CallToAction from "@/components/call-to-action";
import Services from "@/components/services";
import {
  getBusinessDetails,
  getServices,
  getTreatmentAndCareData,
} from "@/lib/data";
import createMetadataConfig from "@/lib/utils/generate-metadata";
import {
  createStructuredData,
  createTreatmentEntity,
} from "@/lib/utils/create-structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getTreatmentAndCareData();
  if (!seo) return {};
  return createMetadataConfig(seo);
}

export default async function TreatmentAndCarePage() {
  const { bookingLink } = await getBusinessDetails();
  const services = await getServices();

  const jsonLd = await createStructuredData({
    type: "MedicalWebPage",
    identifier: "treatment-and-care",
    slug: "/treatment-and-care",
    name: "Our Services",
    crumbs: [
      { name: "Home", slug: "" },
      { name: "Treatment & Care", slug: "/treatment-and-care" },
    ],
    additionalData: {
      mainEntity: services.map(createTreatmentEntity),
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        crumbs={[{ name: "Treatment & Care", item: "/treatment-and-care" }]}
      />
      <Services />
      <CallToAction
        miniHeading="Chiropractic Services"
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
