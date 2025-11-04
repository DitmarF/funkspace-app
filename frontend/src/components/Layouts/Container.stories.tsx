import type { Meta, StoryObj } from "@storybook/react";

import Container, { type ContainerProps } from "./Container";
import Text from "../Base/Text";

const meta = {
  title: "Layouts/Container",
  component: Container,
  tags: ["autodocs"],
  args: {
    children: (
      <div className="space-y-3">
        <Text size="lg" className="font-semibold">
          Layouts give structure
        </Text>
        <Text>
          Containers manage responsive width and padding, letting modules
          compose predictable sections that honor the design system spacing
          scale.
        </Text>
      </div>
    ),
  },
  argTypes: {
    width: {
      control: { type: "select" },
      options: ["narrow", "default", "wide"],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  args: {
    width: "narrow",
  } satisfies ContainerProps,
};

export const Wide: Story = {
  args: {
    width: "wide",
  } satisfies ContainerProps,
};
