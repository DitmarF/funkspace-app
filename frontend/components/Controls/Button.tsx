import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-fs-action-primary text-fs-content-inverse hover:bg-fs-action-hover",
  secondary:
    "bg-fs-surface-elevation-1 text-fs-content-primary hover:bg-fs-surface-elevation-2 hover:text-fs-content-inverse",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-fs-md py-fs-xs text-sm font-semibold shadow-sm transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fs-border-focus ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;
