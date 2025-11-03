import type { Meta, StoryObj } from "@storybook/react";
import { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  tone?: "primary" | "neutral";
};

const toneClasses: Record<NonNullable<ButtonProps["tone"]>, string> = {
  primary:
    "bg-[color:var(--fs-color-blue)] text-[color:var(--fs-color-white)] focus-visible:outline-[color:var(--fs-color-blue)]",
  neutral:
    "bg-[color:var(--fs-color-grey-bright-2)] text-[color:var(--fs-color-grey-dark-4)] focus-visible:outline-[color:var(--fs-color-grey-dark-2)]",
};

const Button = ({
  tone = "primary",
  className = "",
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center rounded-lg p-4 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${toneClasses[tone]} ${className}`}
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
