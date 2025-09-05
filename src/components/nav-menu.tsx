"use client";

import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Button } from "./ui/button";

type NavMenuProps = {
  bookingLink: string;
  className: string;
};

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

export default function NavMenu({ bookingLink, className }: NavMenuProps) {
  const pathname = usePathname();
  return (
    <NavigationMenuList
      className={twMerge(
        "flex flex-col items-baseline md:items-center py-6 pl-4 gap-4 lg:pl-0 lg:py-0 lg:gap-3 lg:flex-row lg:items-center xl:gap-6",
        className
      )}
    >
      {NAV_LINKS.map(({ name, path }, index) => {
        const isActive =
          path === "/" ? pathname === "/" : pathname.startsWith(path);
        return (
          <NavigationMenuItem key={path + index}>
            <NavigationMenuLink
              asChild
              className={twMerge(
                "text-lg lg:text-sm xl:text-lg font-semibold",
                isActive
                  ? "text-primary font-extrabold"
                  : "font-semibold opacity-60"
              )}
            >
              <Link href={path}>{name}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        );
      })}
      <NavigationMenuItem>
        <Button
          asChild
          className="text-lg lg:text-sm xl:text-lg font-semibold "
        >
          <Link href={bookingLink} rel="noopener noreferrer">
            Book an Appointment
          </Link>
        </Button>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}
