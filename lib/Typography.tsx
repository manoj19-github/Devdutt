import React, { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";
import { cva, VariantProps } from "class-variance-authority";

const TypographyVariants = cva("tracking-tight", {
  variants: {
    component: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-16 text-3xl font-bold tracking-tight lg:text-4xl",
      h3: "scroll-m-12 text-2xl font-semibold tracking-tight lg:text-3xl",
      h4: "scroll-m-10 text-xl font-medium tracking-tight lg:text-2xl",
      h5: "scroll-m-8 text-lg font-normal tracking-tight lg:text-xl",
      h6: "scroll-m-6 text-base font-normal tracking-tight lg:text-lg",
      p: "scroll-m-4 text-sm font-normal tracking-tight lg:text-base",
    },
  },
  defaultVariants: {
    component: "p",
  },
});

type TypographyProps = {
  className?: string;

  children: ReactNode;
} & HTMLAttributes<HTMLElement> &
  VariantProps<typeof TypographyVariants>;

const Typography: FC<TypographyProps> = ({
  children,
  component,
  className,
  ...props
}): JSX.Element => {
  const combinedClassName = cn(TypographyVariants({ component }), className);
  const Tag = component ?? "p";
  return (
    <Tag className={combinedClassName} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;
