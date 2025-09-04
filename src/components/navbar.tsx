import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import type { Media } from "@/payload-types";

import { Button } from "./ui/button";
import Image from "next/image";

const NAV_LINKS = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Meet the Chiro",
    path: "/meet-the-chiropractor",
  },
  {
    name: "Practice",
    path: "/practice",
  },
  {
    name: "Testimonials",
    path: "/testimonials",
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
];

type NavbarProps = {
  logo: Media | number;
  bookingLink: string;
};

export default function Navbar({ logo, bookingLink }: NavbarProps) {
  return (
    <NavigationMenu className="bg-white min-w-full">
      <div className="mx-auto container flex flex-row w-full items-center justify-between h-16">
        {/* Left: Logo */}
        <Link href="/" className="font-bold h-14 w-36 relative">
          {typeof logo !== "number" && (
            <Image
              fill
              src={logo.sizes?.["480w"]?.url ?? ""}
              alt="logo"
              className="object-contain object-left"
            />
          )}
        </Link>

        {/* Right: Nav links */}
        <NavigationMenuList className="flex items-center gap-6">
          {NAV_LINKS.map(({ name, path }, index) => {
            return (
              <NavigationMenuItem key={path + index}>
                <NavigationMenuLink asChild className="text-md font-semibold">
                  <Link href={path}>{name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
          <NavigationMenuItem>
            <Button asChild className="text-md font-semibold ">
              <Link href={bookingLink} rel="noopener noreferrer">
                Book an Appointment
              </Link>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}
