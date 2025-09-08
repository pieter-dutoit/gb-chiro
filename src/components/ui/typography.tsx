import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type ElementTag = "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const typographyVariants = cva("", {
  variants: {
    variant: {
      default: "text-base",
      pageTitle:
        "leading-tight text-center text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-extrabold [text-wrap:balance]",
      sectionTitle: "font-light text-center lg:text-left text-3xl xl:text-5xl",
      paragraphs:
        "flex flex-col gap-4 text-base leading-6 xl:text-lg xl:leading-8 tracking-[0.005em] text-center lg:text-start [text-wrap:balance]",
    },
    tone: {
      default: "text-black/90",
      primary: "text-primary",
    },
  },
  defaultVariants: {
    variant: "default",
    tone: "default",
  },
});

type TypographyProps<E extends ElementTag = "div"> = {
  as?: E; // default element
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<E>, "as" | "className"> &
  VariantProps<typeof typographyVariants>;

export const Typography = React.forwardRef(
  <E extends ElementTag = "div">({
    as,
    variant,
    tone,
    className,
    ...props
  }: TypographyProps<E>) => {
    const Comp = (as ?? "div") as ElementTag;
    return (
      <Comp
        data-slot="typography"
        className={cn(typographyVariants({ variant, tone }), className)}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";
