import type { Meta, StoryObj } from "@storybook/react";
import PortfolioNavigationTree from "./PortfolioNavigationTree";
import { portfolioNavigation } from "../../data/portfolioNavigation";

const meta = {
  title: "Layouts/PortfolioNavigationTree",
  component: PortfolioNavigationTree,
  parameters: { layout: "padded" },
} satisfies Meta<typeof PortfolioNavigationTree>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const GrowingContent: Story = {
  args: {
    items: [
      ...portfolioNavigation,
      {
        id: "story-collection",
        kind: "group",
        label: "A collection with a longer wrapping label",
        icon: "settings-burger",
        children: [
          {
            id: "story-experiment",
            kind: "pending",
            label: "A future experiment with a long descriptive title",
            icon: "settings-burger",
          },
        ],
      },
    ],
  },
};
