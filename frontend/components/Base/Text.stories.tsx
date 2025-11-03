import type { Meta, StoryObj } from "@storybook/react";

import Text, { type TextProps } from "./Text";

const meta = {
  title: "Base/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children: "Tokens and Tailwind make styling consistent across FunkSpace.",
    size: "md",
  },
  argTypes: {
    size: {
      control: { type: "inline-radio" },
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large text works well for hero copy or section leads.",
  } satisfies TextProps,
};

export const SmallMuted: Story = {
  args: {
    size: "sm",
    className: "text-[color:var(--fs-color-content-elevation-2)]",
    children: "Muted small text is handy for timestamps or meta detail.",
  } satisfies TextProps,
};
