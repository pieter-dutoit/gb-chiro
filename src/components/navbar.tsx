import Link from "next/link";
import { NavigationMenu } from "@/components/ui/navigation-menu";

import CMSImage from "./cms-image";

import MobileNav from "./mobile-nav";
import { getBusinessDetails, getGraphics } from "@/lib/data";
import NavMenu from "./nav-menu";

export default async function Navbar() {
  const { horizontalLogo } = await getGraphics();
  const { bookingLink } = await getBusinessDetails();
  return (
    <NavigationMenu className="bg-white min-w-full z-[90] shadow-sm">
      <div className="container mx-auto px-4 md:px-12 flex flex-row w-full items-center justify-between h-20">
        {/* Left: Logo */}
        <Link href="/" className="font-bold h-12 w-50 max-w-[80vw] relative">
          <CMSImage
            priority
            media={horizontalLogo}
            fill
            className="object-contain object-left"
            sizes="9rem"
          />
        </Link>

        {/* Right: Nav links */}
        <div>
          {/* Mobile nav */}
          <MobileNav>
            <NavMenu bookingLink={bookingLink} className="lg:hidden" />
          </MobileNav>
          {/* Desktop nav */}
          <NavMenu bookingLink={bookingLink} className="hidden lg:flex" />
        </div>
      </div>
    </NavigationMenu>
  );
}
