"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Icon, type IconName, type IconSize } from "../Icons/Icon";
import {
  controlAppearanceClassName,
  type ControlVariant,
} from "./controlAppearance";
import styles from "./HexButton.module.css";

const artworkBySize = {
  small: {
    dimension: 48,
    icon: 24,
    stroke: 1.5,
    path: "M21.375 2.38184C22.8979 1.50259 24.7521 1.44739 26.3164 2.2168L26.625 2.38184L41.4092 10.917C43.0335 11.8548 44.0341 13.5883 44.0342 15.4639V32.5361C44.0341 34.4117 43.0335 36.1452 41.4092 37.083L26.625 45.6182C25.0006 46.556 22.9994 46.556 21.375 45.6182L6.59082 37.083C4.96653 36.1452 3.9659 34.4117 3.96582 32.5361V15.4639C3.9659 13.5883 4.96653 11.8548 6.59082 10.917L21.375 2.38184Z",
  },
  medium: {
    dimension: 72,
    icon: 36,
    stroke: 2,
    path: "M32 3.46387C34.3979 2.0795 37.3351 2.03607 39.7666 3.33398L40 3.46387L62.1768 16.2676C64.652 17.6966 66.1768 20.3382 66.1768 23.1963V48.8037C66.1768 51.6618 64.652 54.3034 62.1768 55.7324L40 68.5361C37.5248 69.9651 34.4752 69.9651 32 68.5361L9.82324 55.7324C7.34803 54.3034 5.82324 51.6618 5.82324 48.8037V23.1963C5.82324 20.3382 7.34803 17.6966 9.82324 16.2676L32 3.46387Z",
  },
  large: {
    dimension: 96,
    icon: 48,
    stroke: 3,
    path: "M42.75 4.7627C45.8972 2.94576 49.752 2.88931 52.9434 4.59277L53.25 4.7627L82.8193 21.835C86.0679 23.7105 88.0692 27.1767 88.0693 30.9277V65.0723C88.0692 68.8233 86.0679 72.2895 82.8193 74.165L53.25 91.2373C50.0014 93.1128 45.9986 93.1128 42.75 91.2373L13.1807 74.165C9.93215 72.2895 7.93083 68.8233 7.93066 65.0723V30.9277C7.93083 27.1767 9.93215 23.7105 13.1807 21.835L42.75 4.7627Z",
  },
} as const;

export type HexButtonSize = keyof typeof artworkBySize;

export type HexButtonProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "dangerouslySetInnerHTML"
> & {
  /** Optional caption. Icon-only controls retain an accessible name. */
  children?: string;
  icon?: Extract<
    IconName,
    | "settings-burger"
    | "close"
    | "navigation"
    | "a11y"
    | "chat-bot"
    | "languages"
  >;
  variant?: ControlVariant;
  size?: HexButtonSize;
  /** Optional artwork size at the nominal button size; scales with the hexagon. */
  iconSize?: IconSize;
};

const HexButton = forwardRef<HTMLButtonElement, HexButtonProps>(
  (
    {
      icon = "settings-burger",
      children = "",
      variant = "primary",
      size = "medium",
      iconSize,
      type = "button",
      className = "",
      ...props
    },
    ref,
  ) => {
    const artwork = artworkBySize[size];
    const iconDimension = iconSize
      ? `${(iconSize / artwork.dimension) * 100}%`
      : undefined;
    return (
      <button
        aria-label={
          children
            ? undefined
            : {
                "settings-burger": "Menu",
                close: "Close",
                navigation: "Navigation",
                a11y: "Accessibility",
                "chat-bot": "Chat-bot",
                languages: "Languages",
              }[icon]
        }
        {...props}
        ref={ref}
        type={type}
        className={`${styles.control} ${styles[size]} ${children ? "" : styles.iconOnly} ${controlAppearanceClassName(variant)} ${className}`.trim()}
      >
        <span className={styles.artwork} aria-hidden="true" inert>
          <svg
            className={styles.shape}
            width={artwork.dimension}
            height={artwork.dimension}
            viewBox={`0 0 ${artwork.dimension} ${artwork.dimension}`}
            fill="none"
            focusable="false"
            aria-hidden="true"
          >
            {/* Size-specific Figma exports; only paint is bound to shared roles. */}
            <path d={artwork.path} strokeWidth={artwork.stroke} />
          </svg>
          <Icon
            className={styles.icon}
            name={icon}
            size={iconSize ?? artwork.icon}
            style={
              iconDimension
                ? { width: iconDimension, height: iconDimension }
                : undefined
            }
          />
        </span>
        {children && <span className={styles.label}>{children}</span>}
      </button>
    );
  },
);
HexButton.displayName = "HexButton";
export default HexButton;
