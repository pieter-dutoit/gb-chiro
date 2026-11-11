import Link from "next/link";
import { Facebook, Globe, Instagram, LucideIcon } from "lucide-react";

import type { SocialPlatform } from "@/lib/site-types";

type SocialName = SocialPlatform["name"];

const ICON_MAP = {
  facebook: Facebook,
  instagram: Instagram,
} as const satisfies Partial<Record<SocialName, LucideIcon>>;

type SocialLinkProps = Pick<SocialPlatform, "name" | "link">;

export default function SocialLink({ name, link }: SocialLinkProps) {
  const Icon = (ICON_MAP as Partial<Record<SocialName, LucideIcon>>)[name] ?? Globe;

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="inline-flex items-center gap-2 hover:underline underline-offset-2"
    >
      <Icon className="size-4" aria-hidden="true" />
      <span className="capitalize">{name}</span>
    </Link>
  );
}
