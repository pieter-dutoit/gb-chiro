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
      miniHeading: "font-extrabold text-sm md:text-base",
      paragraphs:
        "flex flex-col gap-4 text-base leading-6 xl:text-lg xl:leading-8 tracking-[0.005em] text-center lg:text-start [text-wrap:balance]",
      articleH1:
        "font-bold max-w-[40ch] [text-wrap:balance] text-2xl sm:text-3xl md:text-4xl mb-3",
      articleH2:
        "font-semibold max-w-[45ch] [text-wrap:balance] text-xl sm:text-2xl md:text-3xl mb-3",
      articleH3:
        "font-semibold max-w-[50ch] [text-wrap:balance] text-lg sm:text-xl md:text-2xl mb-3",
      articleH4:
        "font-medium max-w-[55ch] [text-wrap:balance] text-base sm:text-lg md:text-xl mb-3",
      articleH5:
        "font-medium max-w-[60ch] [text-wrap:balance] text-sm sm:text-base md:text-lg mb-3",
      articleH6:
        "font-medium max-w-[60ch] tracking-wide [text-wrap:balance] text-xs sm:text-sm md:text-base mb-3",
      articleParagraph:
        "text-base leading-6 md:leading-7 tracking-[0.005em] max-w-[65ch] [text-wrap:balance] mb-4",
    },
    tone: {
      default: "text-black/90",
      primary: "text-primary",
      light: "text-primary/70",
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

export const Typography = <E extends ElementTag = "div">({
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
};

Typography.displayName = "Typography";
