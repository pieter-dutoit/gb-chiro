import About from "@/components/about";
import CMSImage from "@/components/cms-image";
import MeetTheChiro from "@/components/meet-the-chiro";
import Practice from "@/components/practice";
import { getGraphics } from "@/lib/data";

export default async function AboutUsPage() {
  const { backgroundGraphic } = await getGraphics();
  return (
    <div className="relative">
      {/* Page content */}
      <About />
      <MeetTheChiro />
      <Practice />

      {/* Graphics */}
      <div className="absolute overflow-hidden inset-0 -z-10" tabIndex={-1}>
        <div className="absolute w-50 h-100 lg:w-75 lg:h-150 -left-24 lg:-left-50 top-1/4 opacity-7 rotate-15">
          <CMSImage media={backgroundGraphic} sizes="" />
        </div>
        <div className="absolute w-100 h-200 top-5/12 -right-70 lg:-right-80 opacity-12">
          <CMSImage media={backgroundGraphic} sizes="" />
        </div>
      </div>
    </div>
  );
}
