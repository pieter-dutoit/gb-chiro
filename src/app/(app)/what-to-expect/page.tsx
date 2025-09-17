import { Metadata } from "next";

import Breadcrumbs from "@/components/breadcrumbs";
import CallToAction from "@/components/call-to-action";
import WhatToExpect from "@/components/what-to-expect";

import { getBusinessDetails, getWhatToExpectPageData } from "@/lib/data";
import createMetadataConfig from "@/lib/utils/generate-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getWhatToExpectPageData();
  if (!seo) return {};
  return createMetadataConfig(seo);
}

export default async function WhatToExpectPage() {
  const { bookingLink } = await getBusinessDetails();

  return (
    <>
      <Breadcrumbs
        crumbs={[{ name: "What to Expect", item: "/what-to-expect" }]}
      />
      <WhatToExpect />
      <CallToAction
        heading="Ready for your first visit?"
        description="Start with an Initial Consult. If you’ve got a question first, we’re here to help."
        ctas={[
          {
            label: "Book Initial Consult",
            href: bookingLink,
            variant: "outline",
          },
          {
            label: "Ask a Question",
            href: "/contact-us",
            variant: "link",
          },
        ]}
      />
    </>
  );
}
