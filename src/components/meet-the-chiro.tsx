import { getAboutUsPageData } from "@/lib/data";
import CMSImage from "./cms-image";

export default async function MeetTheChiro() {
  const { meetTheChiroImage } = await getAboutUsPageData();
  return (
    <section className="bg-gradient-to-b from-primary/20 to-white">
      <div className="flex flex-col container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-20 lg:gap-30 relative">
        <div className="flex flex-col-reverse gap-12 lg:flex-row-reverse justify-between items-center">
          <div className="flex flex-col gap-8 w-full lg:w-6/12">
            <h2 className="text font-light text-center lg:text-left text-3xl xl:text-4xl">
              Meet the Chiropractor
            </h2>
            {/* About paragraphs */}
            <div className="flex flex-col gap-4 text-base leading-6 xl:text-lg xl:leading-8 tracking-[0.005em] text-center lg:text-start [text-wrap:balance]">
              <p>
                Hi, I’m Dr Garret, your local chiropractor here in Griffith.
                I’ve always been passionate about helping people feel their
                best, whether that’s getting you out of pain, improving how your
                body moves, or helping you get back to the activities you love.
              </p>

              <p>
                I studied a <strong>Bachelor of Chiropractic Science</strong>{" "}
                and a <strong>Master of Chiropractic</strong> at{" "}
                <strong>Macquarie University</strong>, and since then I’ve
                worked with people of all ages, from kids and athletes to
                tradies, office workers, and retirees. No matter who walks
                through the door, my goal is the same: to listen, understand
                your needs, and create a plan that works for you
              </p>

              <p>
                When I’m not in the clinic, you’ll usually find me playing
                tennis, going for a run, or swimming laps. Staying active is a
                big part of my life, and I love helping my patients do the same,
                because life’s simply better when you can move well and feel
                great.
              </p>
            </div>
          </div>
          {/* Image */}
          <div className="relative w-full lg:w-6/12 aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <CMSImage
              media={meetTheChiroImage}
              sizes=""
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
