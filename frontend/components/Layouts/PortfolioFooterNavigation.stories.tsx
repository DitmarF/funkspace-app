import type { Meta, StoryObj } from "@storybook/react";
import PortfolioFooterNavigation from "./PortfolioFooterNavigation";
import PortfolioShell from "./PortfolioShell";

const meta = {
  title: "Layouts/PortfolioFooterNavigation",
  component: PortfolioFooterNavigation,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof PortfolioFooterNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const InShell: Story = {
  parameters: { layout: "fullscreen", decorativeMotionAvailable: false },
  render: () => (
    <PortfolioShell>
      <h1>Footer navigation</h1>
      <p>
        Legal destinations and the FunkSpace project, centered in the footer.
      </p>
    </PortfolioShell>
  ),
};
