import Link from "next/link";
import type { MDXComponents } from "mdx/types";

import { Typography } from "@/components/ui/typography";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <Typography as="h1" variant="articleH1" {...props} />,
    h2: (props) => <Typography as="h2" variant="articleH2" {...props} />,
    h3: (props) => <Typography as="h3" variant="articleH3" {...props} />,
    h4: (props) => <Typography as="h4" variant="articleH4" {...props} />,
    h5: (props) => <Typography as="h5" variant="articleH5" {...props} />,
    h6: (props) => <Typography as="h6" variant="articleH6" {...props} />,
    p: (props) => (
      <Typography as="p" variant="articleParagraph" {...props} />
    ),
    ul: (props) => (
      <ul
        className="list-disc space-y-2 pl-6 text-base leading-6 md:leading-7 mb-5"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="list-decimal space-y-2 pl-6 text-base leading-6 md:leading-7 mb-5"
        {...props}
      />
    ),
    li: (props) => <li className="pl-1" {...props} />,
    a: ({ href = "", ...props }) => (
      <Link
        href={href}
        className="font-semibold text-primary underline underline-offset-2"
        {...props}
      />
    ),
    strong: (props) => <strong className="font-semibold" {...props} />,
    ...components,
  };
}
