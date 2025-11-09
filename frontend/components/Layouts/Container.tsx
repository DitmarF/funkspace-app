import type { ComponentPropsWithoutRef, ElementType } from "react";

type ContainerWidth =
  | "xs"
  | "sm"
  | "narrow"
  | "sm-medium"
  | "medium"
  | "default"
  | "wide"
  | "full";
type ContainerAlign = "left" | "center" | "right";
type ContainerSpacing = "none" | "tight" | "normal" | "medium" | "loose";
type ContainerPadding = "none" | "sm" | "md" | "lg";

type ContainerElement =
  | "div"
  | "section"
  | "article"
  | "main"
  | "header"
  | "footer"
  | "aside"
  | "nav";

type ContainerPropsBase = {
  /**
   * The HTML element to render. Use semantic elements for better accessibility.
   * - `div`: Default, for layout-only containers
   * - `section`: For distinct sections of content
   * - `article`: For standalone content
   * - `main`: For main page content
   * - `header`: For header content
   * - `footer`: For footer content
   * - `aside`: For sidebar content
   * - `nav`: For navigation
   */
  as?: ContainerElement;
  /**
   * Maximum width constraint for the container.
   * - `xs`: 20rem (320px)
   * - `sm`: 24rem (384px)
   * - `narrow`: 36rem (576px)
   * - `sm-medium`: 42rem (672px)
   * - `medium`: 56rem (896px)
   * - `default`: 64rem (1024px)
   * - `wide`: 80rem (1280px)
   * - `full`: 100% width (no max-width constraint)
   */
  width?: ContainerWidth;
  /**
   * Horizontal alignment of content within the container.
   * - `left`: Content aligned to the left
   * - `center`: Content centered (default)
   * - `right`: Content aligned to the right
   */
  align?: ContainerAlign;
  /**
   * Vertical spacing between child elements.
   * - `none`: No spacing
   * - `tight`: 0.5rem (8px)
   * - `normal`: 1rem (16px)
   * - `medium`: 1.5rem (24px)
   * - `loose`: 2rem (32px)
   */
  spacing?: ContainerSpacing;
  /**
   * Responsive padding around the container content.
   * Uses design tokens with mobile-first approach.
   * - `none`: No padding
   * - `sm`: px-4 py-4 (mobile) → px-6 py-6 (desktop)
   * - `md`: px-4 py-6 (mobile) → px-6 py-8 (desktop) - default
   * - `lg`: px-6 py-8 (mobile) → px-8 py-12 (desktop)
   */
  padding?: ContainerPadding;
};

export type ContainerProps = ContainerPropsBase &
  ComponentPropsWithoutRef<"div">;

const widthClasses: Record<ContainerWidth, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  narrow: "max-w-xl",
  "sm-medium": "max-w-2xl",
  medium: "max-w-4xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-full",
};

const alignClasses: Record<ContainerAlign, string> = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
};

const spacingClasses: Record<ContainerSpacing, string> = {
  none: "",
  tight: "space-y-2",
  normal: "space-y-4",
  medium: "space-y-6",
  loose: "space-y-8",
};

const paddingClasses: Record<ContainerPadding, string> = {
  none: "",
  sm: "px-4 py-4 md:px-6 md:py-6",
  md: "px-4 py-6 md:px-6 md:py-8",
  lg: "px-6 py-8 md:px-8 md:py-12",
};

const Container = ({
  as = "div",
  width = "default",
  align = "center",
  spacing,
  padding = "md",
  className = "",
  children,
  ...props
}: ContainerProps) => {
  const Element = as as ElementType;
  const classes = [
    "w-full",
    widthClasses[width],
    alignClasses[align],
    padding !== "none" ? paddingClasses[padding] : "",
    spacing ? spacingClasses[spacing] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Element
      className={classes}
      {...(props as ComponentPropsWithoutRef<typeof Element>)}
    >
      {children}
    </Element>
  );
};

export default Container;
