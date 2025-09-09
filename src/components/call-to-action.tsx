import Link from "next/link";
import { Button } from "./ui/button";
import { Typography } from "./ui/typography";

type CallToActionProps = {
  heading: string;
  description: string;
  ctas: {
    label: string;
    href: string;
    variant?: "default" | "ghost" | "link" | "outline";
  }[];
};

export default function CallToAction({
  heading,
  description,
  ctas,
}: CallToActionProps) {
  return (
    <section className="w-screen relative bg-primary/20">
      {/* Container */}
      <div className="flex flex-col container mx-auto px-4 md:px-12 py-16 lg:py-24 xl:py-30 gap-8 lg:gap-12 relative">
        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-4">
          <Typography
            as="h3"
            variant="sectionTitle"
            className="font-bold lg:text-center"
          >
            {heading}
          </Typography>
          <p className="text-lg md:text-xl lg:text-2xl">{description}</p>
        </div>

        {/* Links and buttons */}
        <ul className="flex flex-row gap-2 flex-wrap justify-center">
          {ctas.map(({ label, href, variant = "outline" }) => (
            <li key={label}>
              <Button
                asChild
                variant={variant}
                size="lg"
                className="font-semibold text-lg"
              >
                <Link href={href}>{label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
