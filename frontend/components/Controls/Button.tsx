import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--fs-color-action-primary)] text-[color:var(--fs-color-white)] hover:bg-[color:var(--fs-color-blue)] focus-visible:outline-[color:var(--fs-color-action-primary)]",
  secondary:
    "bg-[color:var(--fs-color-grey-bright-1)] text-[color:var(--fs-color-content-primary)] hover:bg-[color:var(--fs-color-grey-bright-2)] focus-visible:outline-[color:var(--fs-color-grey-bright-3)]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;
