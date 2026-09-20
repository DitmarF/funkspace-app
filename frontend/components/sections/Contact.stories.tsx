import type { Meta, StoryObj } from "@storybook/react";
import Contact from "./Contact";
import PortfolioShell from "../Layouts/PortfolioShell";

const meta = {
  title: "Sections/Contact",
  component: Contact,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <PortfolioShell>
        <Story />
      </PortfolioShell>
    ),
  ],
} satisfies Meta<typeof Contact>;

export default meta;
type Story = StoryObj<typeof meta>;
export const EmailFallback: Story = {};
