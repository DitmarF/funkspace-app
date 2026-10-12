import type { Meta, StoryObj } from "@storybook/react";
import PortfolioMainNavigation from "./PortfolioMainNavigation";
import PortfolioShell from "./PortfolioShell";

const meta = {
  title: "Layouts/PortfolioMainNavigation",
  component: PortfolioMainNavigation,
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PortfolioMainNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AboutActive: Story = {
  parameters: { nextjs: { navigation: { pathname: "/about" } } },
};
export const InHeader: Story = {
  parameters: { layout: "fullscreen", decorativeMotionAvailable: false },
  render: () => (
    <PortfolioShell>
      <h1>Header navigation</h1>
      <p>
        Home is the current page. About is available; Contact returns in EPIC 5.
      </p>
    </PortfolioShell>
  ),
};
