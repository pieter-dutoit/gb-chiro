import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface Props {
  crumbs: BreadcrumbItem[];
}

export default function Breadcrumbs({ crumbs }: Props) {
  return (
    <nav
      className="absolute top-24 right-0 left-0 flex w-full z-50"
      aria-label="Breadcrumb"
    >
      <ol className="container mx-auto px-4 md:px-12 inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary/80"
          >
            Home
          </Link>
        </li>
        {crumbs.map(({ name, item }, index) => (
          <li key={index + name}>
            <div className="flex items-center">
              <ChevronRight className="size-4 text-gray-400" />
              <Link
                href={item}
                className={twMerge(
                  `ml-1 text-sm font-medium hover:text-primary/80 md:ml-2 line-clamp-1`,
                  index === crumbs.length - 1
                    ? "text-primary/80"
                    : "text-gray-700"
                )}
              >
                {name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
