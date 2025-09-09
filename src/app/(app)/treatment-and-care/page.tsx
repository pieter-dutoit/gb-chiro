import CallToAction from "@/components/call-to-action";
import Services from "@/components/services";
import { getBusinessDetails } from "@/lib/data";

export default async function TreatmentAndCarePage() {
  const { bookingLink } = await getBusinessDetails();
  return (
    <>
      <Services />
      <CallToAction
        heading="Need help with something specific?"
        description="Reach out and we’ll recommend the best next step"
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
