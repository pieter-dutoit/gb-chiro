import Link from "next/link";
import { Facebook, Globe, Instagram, LucideIcon } from "lucide-react";

import { SocialMediaPlatform } from "@/payload-types";

type SocialName = SocialMediaPlatform["name"];

const ICON_MAP = {
  facebook: Facebook,
  instagram: Instagram,
} as const satisfies Partial<Record<SocialName, LucideIcon>>;

function getIcon(name: SocialName): LucideIcon {
  return (ICON_MAP as Record<string, LucideIcon | undefined>)[name] ?? Globe;
}

type SocialLinkProps = Pick<SocialMediaPlatform, "name" | "link">;

export default function SocialLink({ name, link }: SocialLinkProps) {
  const Icon = getIcon(name);

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
