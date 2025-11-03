import type { ComponentPropsWithoutRef } from "react";

type ContainerWidth = "narrow" | "default" | "wide";

export type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  width?: ContainerWidth;
};

const widthClasses: Record<ContainerWidth, string> = {
  narrow: "max-w-xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

const Container = ({
  width = "default",
  className = "",
  children,
  ...props
}: ContainerProps) => (
  <div
    className={`mx-auto w-full px-6 py-8 ${widthClasses[width]} ${className}`.trim()}
    {...props}
  >
    {children}
  </div>
);

export default Container;
