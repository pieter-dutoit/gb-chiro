import CallToAction from "@/components/call-to-action";
import Hero from "@/components/hero";
import HomeAbout from "@/components/home-about";
import NewPatients from "@/components/new-patients";
import ServicesCarousel from "@/components/service-carousel";
import { getBusinessDetails } from "@/lib/data";

export default async function Home() {
  const { bookingLink } = await getBusinessDetails();
  return (
    <>
      <Hero />
      <ServicesCarousel />
      <NewPatients />
      <HomeAbout />
      <CallToAction
        withMap
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
