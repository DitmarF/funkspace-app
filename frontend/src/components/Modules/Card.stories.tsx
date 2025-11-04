import type { Meta, StoryObj } from "@storybook/react";

import Card, { type CardProps } from "./Card";
import Text from "../Base/Text";

const meta = {
  title: "Modules/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    title: "New Funk Demos",
    description:
      "Share a quick snapshot of what’s shipping. Cards bundle imagery, copy, and calls to action.",
    children: (
      <Text>
        Modules combine base and control components into reusable building
        blocks that stay consistent across product surfaces.
      </Text>
    ),
    actionLabel: "View release",
  },
  argTypes: {
    onAction: { action: "action" },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAction: Story = {
  args: {
    actionLabel: undefined,
    onAction: undefined,
  } satisfies CardProps,
};
