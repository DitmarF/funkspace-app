import type { Meta, StoryObj } from "@storybook/react";
import Start from "./Start";
import PortfolioShell from "../Layouts/PortfolioShell";

const meta = {
  title: "Sections/Start",
  component: Start,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <PortfolioShell>
        <Story />
      </PortfolioShell>
    ),
  ],
} satisfies Meta<typeof Start>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Static: Story = {};
