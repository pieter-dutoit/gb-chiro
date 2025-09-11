import CallToAction from "@/components/call-to-action";
import ContactDetails from "@/components/contact-details";
import { getBusinessDetails } from "@/lib/data";
import { parsePhoneNumber } from "libphonenumber-js/min";

export default async function ContactUs() {
  const { phone, email, bookingLink } = await getBusinessDetails();
  const number = parsePhoneNumber(phone, "AU");

  return (
    <>
      <ContactDetails />
      <CallToAction
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
