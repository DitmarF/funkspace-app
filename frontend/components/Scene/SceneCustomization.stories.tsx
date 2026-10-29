import type { Meta, StoryObj } from "@storybook/react";
import PortfolioShell from "../Layouts/PortfolioShell";
import ApertureDetails from "../sections/ApertureDetails";

function Details() {
  return (
    <PortfolioShell sceneCustomization>
      <ApertureDetails />
    </PortfolioShell>
  );
}
const meta = {
  title: "Scene/Customization",
  component: Details,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The actual Web Aperture details composition: the shared homepage opening with Customize, a plain-language guide, and a compact dialog with five ranges and a Full field switch.",
      },
    },
  },
} satisfies Meta<typeof Details>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Available: Story = {
  parameters: { decorativeMotionAvailable: true },
};
export const Unavailable: Story = {
  parameters: { decorativeMotionAvailable: false },
};
export const Narrow: Story = {
  parameters: {
    decorativeMotionAvailable: true,
    viewport: { defaultViewport: "mobile1" },
  },
};
