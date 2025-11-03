import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

type TextSize = "sm" | "md" | "lg";

type TextProps = ComponentPropsWithoutRef<"p"> & {
  size?: TextSize;
};

const sizeStyles: Record<TextSize, string> = {
  sm: "text-sm leading-5",
  md: "text-base leading-6",
  lg: "text-lg leading-7",
};

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ size = "md", className = "", ...props }, ref) => (
    <p
      ref={ref}
      className={`font-normal text-[color:var(--fs-color-content-primary)] ${sizeStyles[size]} ${className}`.trim()}
      {...props}
    />
  ),
);

Text.displayName = "Text";

export type { TextProps, TextSize };
export default Text;
