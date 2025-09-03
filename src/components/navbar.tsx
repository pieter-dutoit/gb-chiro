import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

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
    name: "About Us",
    path: "/about-us",
  },
  {
    name: "Testimonials",
    path: "/testimonials",
  },
  {
    name: "Book Now",
    path: "https://gbchiro.bookings.pracsuite.com",
    external: true,
  },
];

export default function Navbar() {
  return (
    <NavigationMenu className="bg-slate-100 min-w-full">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <NavigationMenuList className="flex items-center gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="font-bold">
                Logo here
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* Right: Nav links */}
        <NavigationMenuList className="flex items-center gap-6">
          {NAV_LINKS.map(({ name, path }) => {
            return (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href={path}>{name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
}
