import type { Meta, StoryObj } from "@storybook/react";
import ButtonLink from "./ButtonLink";

const meta = {
  title: "Controls/ButtonLink",
  component: ButtonLink,
  tags: ["autodocs"],
  args: {
    // Navigate to a real existing story; /about is still future page work.
    href: "/iframe.html?id=controls-button--primary&viewMode=story",
    children: "View primary button",
  },
  parameters: {
    docs: {
      description: {
        component:
          "The S3 outlined treatment uses a native anchor with a real destination. No disabled, pending, filled, compact or polymorphic variants. Use /about only when that page exists. Standard labels stay visible beside decorative icons.",
      },
    },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Navigation: Story = {};
export const NewTab: Story = { args: { target: "_blank", rel: "noopener" } };
