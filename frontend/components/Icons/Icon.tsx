import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  iconArtwork,
  closeViewBoxSize,
  type IconName,
  type IconSize,
} from "./iconArtwork";
import { categoryIconViewBoxes } from "./categoryIconViewBoxes";

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
    const viewBoxSize = name === "close" ? closeViewBoxSize[size] : size;
    const viewBox =
      name in categoryIconViewBoxes
        ? categoryIconViewBoxes[name as keyof typeof categoryIconViewBoxes][
            size
          ]
        : `0 0 ${viewBoxSize} ${viewBoxSize}`;
    return (
      <svg
        {...props}
        ref={ref}
        width={size}
        height={size}
        viewBox={viewBox}
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
