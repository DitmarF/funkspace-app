import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  StandardControlContent,
  standardControlClassName,
  type StandardIconProps,
  type ButtonSize,
} from "./standardControl";

// S3 is a real outlined anchor. No polymorphic element, pending/disabled state,
// click router, or alternate treatment is part of this navigation contract.
export type ButtonLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "children" | "aria-disabled" | "aria-busy"
> &
  StandardIconProps & {
    href: string;
    children: ReactNode;
    size?: ButtonSize;
  };

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      href,
      children,
      icon,
      iconPosition,
      leadingIcon,
      trailingIcon,
      size = "small",
      className = "",
      ...props
    },
    ref,
  ) => (
    <a
      {...props}
      ref={ref}
      href={href}
      className={standardControlClassName("outlined", className, size)}
    >
      <StandardControlContent
        icon={icon}
        iconPosition={iconPosition}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
      >
        {children}
      </StandardControlContent>
    </a>
  ),
);

ButtonLink.displayName = "ButtonLink";

export default ButtonLink;
