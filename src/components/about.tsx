import { getAboutUs } from "@/lib/data";
import CMSImage from "./cms-image";

export default async function About() {
  const { welcomeImage } = await getAboutUs();

  return (
    <section className="flex flex-col container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-20 lg:gap-30 relative">
      {/* Header */}
      <h1 className="whitespace-pre text-center text-4xl md:text-5xl lg:text-6xl font-extrabold leading-snug text-primary">
        Welcome to {`\n`}GB Chiropractic
      </h1>

      <div className="flex flex-col-reverse gap-12 lg:flex-row justify-between items-center">
        <div className="flex flex-col gap-8 w-full lg:w-6/12">
          <h2 className="text font-light text-center lg:text-left text-3xl xl:text-4xl">
            Your Partner in Better Health
          </h2>
          {/* About paragraphs */}
          <div className="flex flex-col gap-4 text-base leading-6 xl:text-lg xl:leading-8 tracking-[0.005em] text-center lg:text-start [text-wrap:balance]">
            <p>
              At GB Chiropractic in Griffith, we are passionate about helping
              our community live healthier, more active, and pain-free lives.
              Our personalised approach focuses on understanding your unique
              needs, addressing the root cause of discomfort, and restoring
              optimal movement and function.
            </p>

            <p>
              Whether you’re seeking relief from back or neck pain, recovering
              from an injury, or looking to improve your posture and overall
              wellbeing, we provide gentle, effective chiropractic care tailored
              to all ages and lifestyles.
            </p>

            <p>
              With a commitment to evidence-based techniques and a warm,
              family-friendly environment, GB Chiropractic is here to support
              your health journey, so you can get back to doing what you love,
              feeling your best every step of the way.
            </p>
          </div>
        </div>
        {/* Image */}
        <div className="relative w-full lg:w-6/12 aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
          <CMSImage media={welcomeImage} sizes="" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
