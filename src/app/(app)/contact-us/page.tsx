import CallToAction from "@/components/call-to-action";

import { getBusinessDetails } from "@/lib/data";

export default async function ContactUs() {
  const { bookingLink } = await getBusinessDetails();
  return <></>;
}
