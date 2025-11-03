import type { Meta, StoryObj } from "@storybook/react";
import { ComponentPropsWithoutRef, CSSProperties } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  tone?: "primary" | "neutral";
};

const toneStyles: Record<NonNullable<ButtonProps["tone"]>, CSSProperties> = {
  primary: {
    backgroundColor: "var(--fs-color-blue)",
    color: "var(--fs-color-white)",
  },
  neutral: {
    backgroundColor: "var(--fs-color-grey-bright-2)",
    color: "var(--fs-color-grey-dark-4)",
  },
};

const Button = ({
  tone = "primary",
  style,
  className = "",
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fs-color-blue)] ${className}`}
    style={{ ...toneStyles[tone], ...style }}
    {...props}
  />
);

const meta = {
  title: "Examples/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Click me",
  },
  argTypes: {
    tone: {
      control: { type: "select" },
      options: ["primary", "neutral"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { tone: "primary" },
};

export const Neutral: Story = {
  args: { tone: "neutral" },
};
