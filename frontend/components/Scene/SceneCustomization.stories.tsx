import type { Meta, StoryObj } from "@storybook/react";
import PortfolioShell from "../Layouts/PortfolioShell";
import StartScene from "./StartScene";

function Details() {
  return (
    <PortfolioShell sceneCustomization>
      <article className="space-y-fs-lg">
        <h1 className="text-3xl font-bold">Aperture - 1</h1>
        <StartScene customizable />
      </article>
    </PortfolioShell>
  );
}
const meta = {
  title: "Scene/Customization",
  component: Details,
  parameters: { layout: "fullscreen" },
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
