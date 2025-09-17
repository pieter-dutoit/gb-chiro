import { getAboutUsPageData } from "@/lib/data";
import CMSImage from "./cms-image";
import { Typography } from "./ui/typography";

export default async function About() {
  const { welcomeImage } = await getAboutUsPageData();

  return (
    <section className="flex flex-col container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-20 lg:gap-30 relative">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4">
        <Typography as="h1" variant="miniHeading" tone="light">
          About GB Chiropractic in Griffith
        </Typography>
        <Typography as="p" variant="pageTitle">
          Welcome to <br />
          GB Chiropractic
        </Typography>
      </div>

      <div className="flex flex-col-reverse gap-12 lg:flex-row justify-between items-center">
        <div className="flex flex-col gap-8 w-full lg:w-6/12">
          <Typography
            as="h2"
            variant="sectionTitle"
            className="font-bold max-w-[15ch] mx-auto lg:mx-0"
          >
            Your Partner in Better Health
          </Typography>

          {/* About paragraphs */}
          <Typography variant="paragraphs">
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
          </Typography>
        </div>
        {/* Image */}
        <div className="relative w-full lg:w-6/12 aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
          <CMSImage
            media={welcomeImage}
            className="object-cover"
            priority
            sizes="(min-width: 1540px) 696px, (min-width: 1280px) 570px, (min-width: 1024px) 440px, (min-width: 770px) 670px, 80vw"
          />
        </div>
      </div>
    </section>
  );
}
