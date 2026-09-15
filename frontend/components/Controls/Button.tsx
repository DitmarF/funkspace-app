"use client";

import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  StandardControlContent,
  standardControlClassName,
  type StandardIconProps,
  type ButtonSize,
  type ButtonVariant,
} from "./standardControl";
import styles from "./standardControl.module.css";

export type ButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "disabled"
> &
  StandardIconProps & {
    children: ReactNode;
    size?: ButtonSize;
  } & (
    | { variant?: ButtonVariant; pending?: undefined; disabled?: boolean }
    // Keep the S1 pending capability present from the first render. Native
    // disabled models ordinary unavailability, not an in-flight operation.
    | { variant?: "primary"; pending: boolean; disabled?: false }
  );

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "small",
      className = "",
      type = "button",
      children,
      icon,
      iconPosition,
      leadingIcon,
      trailingIcon,
      pending,
      disabled,
      onClickCapture,
      onKeyDownCapture,
      onKeyUpCapture,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) => {
    const statusId = useId();
    const button = (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled}
        aria-busy={pending || props["aria-busy"]}
        aria-disabled={pending || props["aria-disabled"]}
        aria-describedby={
          [describedBy, pending ? statusId : undefined]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={standardControlClassName(variant, className, size)}
        onClickCapture={(event) => {
          if (pending) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onClickCapture?.(event);
        }}
        onKeyDownCapture={(event) => {
          if (pending && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onKeyDownCapture?.(event);
        }}
        onKeyUpCapture={(event) => {
          if (pending && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onKeyUpCapture?.(event);
        }}
      >
        <StandardControlContent
          icon={icon}
          iconPosition={iconPosition}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
          reservePending={pending !== undefined}
          pending={pending}
        >
          {children}
        </StandardControlContent>
      </button>
    );

    if (pending === undefined) return button;

    return (
      <span className={styles.pendingGroup}>
        {button}
        <span id={statusId} role="status" className={styles.status}>
          {pending ? "Working…" : ""}
        </span>
      </span>
    );
  },
);

Button.displayName = "Button";

export default Button;
