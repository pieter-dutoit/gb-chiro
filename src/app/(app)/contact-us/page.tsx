import { parsePhoneNumber } from "libphonenumber-js/min";
import { Metadata } from "next";

import Breadcrumbs from "@/components/breadcrumbs";
import CallToAction from "@/components/call-to-action";
import ContactDetails from "@/components/contact-details";
import { getBusinessDetails, getContactUsPageData } from "@/lib/data";
import createMetadataConfig from "@/lib/utils/generate-metadata";
import { createStructuredData } from "@/lib/utils/create-structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContactUsPageData();
  if (!seo) return {};
  return createMetadataConfig(seo);
}

export default async function ContactUs() {
  const { phone, email, bookingLink } = await getBusinessDetails();
  const number = parsePhoneNumber(phone, "AU");

  const jsonLd = await createStructuredData({
    type: "ContactPage",
    identifier: "contact-us",
    name: "Contact Us",
    slug: "/contact-us",
    crumbs: [
      { name: "Home", slug: "" },
      { name: "Contact us", slug: "/contact-us" },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs crumbs={[{ name: "Contact us", item: "/contact-us" }]} />
      <ContactDetails />
      <CallToAction
        miniHeading="Book an Appointment or Ask a Question"
        heading="Have a question? Reach out."
        description="Call, email, or book a time that suits you."
        ctas={[
          {
            label: number.formatNational(),
            href: `tel:${number.number}`,
          },
          {
            label: email,
            href: `mailto:${email}`,
          },
          {
            variant: "default",
            label: "Book an Appointment",
            href: bookingLink,
          },
        ]}
      />
    </>
  );
}
