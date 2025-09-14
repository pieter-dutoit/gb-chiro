import { JSXConverters } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { SquareCheck, SquareX } from "lucide-react";

import type { Media } from "@/payload-types";

import {
  SerializedHeadingNode,
  SerializedParagraphNode,
  SerializedLinkNode,
  SerializedListNode,
  SerializedListItemNode,
  SerializedUploadNode,
} from "@payloadcms/richtext-lexical";

import { Typography } from "@/components/ui/typography";
import CMSImage from "@/components/cms-image";

const TAG_TO_VARIANT = {
  h1: "articleH1",
  h2: "articleH2",
  h3: "articleH3",
  h4: "articleH4",
  h5: "articleH5",
  h6: "articleH6",
} as const;

export const headingConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const text = nodesToJSX({ nodes: node.children });
    const variant = TAG_TO_VARIANT[node.tag];

    return (
      <Typography as={node.tag} variant={variant}>
        {text}
      </Typography>
    );
  },
};

export const paragraphConverter: JSXConverters<SerializedParagraphNode> = {
  paragraph: ({ node, nodesToJSX }) => {
    const text = nodesToJSX({ nodes: node.children });

    return (
      <Typography as="p" variant="articleParagraph">
        {text}
      </Typography>
    );
  },
};

export const linkConverter: JSXConverters<SerializedLinkNode> = {
  link: ({ node, nodesToJSX }) => {
    const text = nodesToJSX({ nodes: node.children });
    const { url, linkType, newTab } = node.fields;

    if (!url || linkType === "internal") return null;
    return (
      <Link
        href={url}
        className="text-blue-800 hover:not-active:opacity-70 underline underline-offset-2 font-semibold"
        {...(newTab && { target: "_blank" })}
      >
        {text}
      </Link>
    );
  },
};

export const listConverter: JSXConverters<SerializedListNode> = {
  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });

    return (
      <node.tag
        className={twMerge(
          "flex flex-col gap-2 list-inside mb-6 ml-2",
          node.listType === "number"
            ? "list-decimal"
            : node.listType === "bullet"
              ? "list-disc"
              : "list-none"
        )}
      >
        {children}
      </node.tag>
    );
  },
};

export const listItemConverter: JSXConverters<SerializedListItemNode> = {
  listitem: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const isBullet = typeof node.checked === "boolean";

    return isBullet ? (
      <li className="font-semibold opacity-70 text-sm">
        <span className="inline-block align-middle">
          {isBullet && (node.checked ? <SquareCheck /> : <SquareX />)}
        </span>
        <span className="inline-block align-middle ml-1">{children}</span>
      </li>
    ) : (
      <li className="font-semibold opacity-70 text-sm">{children}</li>
    );
  },
};

function isMedia(value: unknown): value is Media {
  return (
    typeof value === "object" &&
    value !== null &&
    "mimeType" in value &&
    "filename" in value &&
    "sizes" in value
  );
}

export const uploadConverter: JSXConverters<SerializedUploadNode> = {
  upload: ({ node }) => {
    if (!isMedia(node.value)) return null;
    return (
      <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-6 bg-primary/10">
        {/* Blur bg */}
        <CMSImage
          media={node.value}
          sizes="(min-width: 660px) 576px, 90vw"
          className="object-cover object-center -z-0 blur-xl scale-125"
        />

        <CMSImage
          media={node.value}
          sizes="(min-width: 660px) 576px, 90vw"
          className="object-contain object-center z-10"
        />
      </div>
    );
  },
};
