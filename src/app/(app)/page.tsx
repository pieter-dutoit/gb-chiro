import Hero from "@/components/hero";
import NewPatients from "@/components/new-patients";
import ServicesCarousel from "@/components/service-carousel";

export default async function Home() {
  return (
    <>
      <Hero />
      <ServicesCarousel />
      <NewPatients />
    </>
  );
}
