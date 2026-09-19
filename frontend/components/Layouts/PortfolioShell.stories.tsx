import type { Meta, StoryObj } from "@storybook/react";
import PortfolioShell from "./PortfolioShell";

const meta = {
  title: "Layouts/PortfolioShell",
  component: PortfolioShell,
  parameters: { layout: "fullscreen" },
  args: {
    children: (
      <div className="max-w-3xl space-y-fs-md">
        <h1 className="text-3xl font-bold">Privacy</h1>
        <p className="text-base leading-7">
          No cookies. Self-hosted fonts. No third-party requests on first load.
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof PortfolioShell>;

export default meta;
type Story = StoryObj<typeof meta>;
export const SecondaryPage: Story = {};
