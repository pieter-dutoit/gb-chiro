import CallToAction from "@/components/call-to-action";
import WhatToExpect from "@/components/what-to-expect";

import { getBusinessDetails } from "@/lib/data";

export default async function WhatToExpectPage() {
  const { bookingLink } = await getBusinessDetails();

  return (
    <>
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
