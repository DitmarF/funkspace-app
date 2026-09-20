import type { Meta, StoryObj } from "@storybook/react";
import AboutPreview from "./AboutPreview";
import PortfolioShell from "../Layouts/PortfolioShell";

const meta = {
  title: "Sections/About preview",
  component: AboutPreview,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <PortfolioShell>
        <Story />
      </PortfolioShell>
    ),
  ],
} satisfies Meta<typeof AboutPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Draft: Story = {};
