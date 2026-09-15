import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { iconArtwork, type IconName, type IconSize } from "./iconArtwork";

export { iconNames, type IconName, type IconSize } from "./iconArtwork";

export type IconProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  | "name"
  | "children"
  | "dangerouslySetInnerHTML"
  | "width"
  | "height"
  | "viewBox"
  | "role"
  | "aria-hidden"
  | "aria-label"
  | "aria-labelledby"
> & {
  name: IconName;
  size?: IconSize;
  /** Omit beside visible text; supply only when the icon itself carries meaning. */
  label?: string;
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, label, ...props }, ref) => {
    const prefix = useId();
    const artwork: (prefix: string) => ReactNode = iconArtwork[name][size];
    return (
      <svg
        {...props}
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        role={label ? "img" : undefined}
        aria-hidden={label ? undefined : true}
        aria-labelledby={label ? `${prefix}-title` : undefined}
      >
        {label ? <title id={`${prefix}-title`}>{label}</title> : null}
        {artwork(prefix)}
      </svg>
    );
  },
);
Icon.displayName = "Icon";
