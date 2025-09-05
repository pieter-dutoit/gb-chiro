import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { Button } from "./ui/button";

type OversizedLinkProps = {
  href: string;
  label: string;
  iconType?: "phone" | "email";
  variant?: "default" | "outline";
};

const ICON_MAP = {
  phone: Phone,
  email: Mail,
};

const VARIANTS = {
  default: "bg-yellow-600",
  outline: "bg-transparent",
};

export default function OversizedLink({
  label,
  href,
  iconType,
  variant = "default",
}: OversizedLinkProps) {
  const Icon = iconType !== undefined && ICON_MAP[iconType];
  return (
    <Button
      asChild
      variant="outline"
      className={twMerge(
        "lg:h-14 text-md lg:text-xl gap-2 lg:gap-4",
        VARIANTS[variant]
      )}
    >
      <Link href={href}>
        {Icon ? <Icon className="size-4 lg:size-6" /> : null}
        {label}
      </Link>
    </Button>
  );
}
