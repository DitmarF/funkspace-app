import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import ParticleLifecycleFixture from "./ParticleLifecycleFixture";

const meta = {
  title: "Scene/Aperture",
  component: ParticleLifecycleFixture,
  args: { aperture: true },
  parameters: { layout: "fullscreen", decorativeMotionAvailable: true },
} satisfies Meta<typeof ParticleLifecycleFixture>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Static: Story = {
  parameters: { decorativeMotionAvailable: false },
};
export const Replacement: Story = {
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    await userEvent.click(view.getByRole("button", { name: "On" }));
    await userEvent.click(view.getByRole("button", { name: "Start scene" }));
    await waitFor(() =>
      expect(
        canvasElement.querySelector("canvas[data-particle-canvas]"),
      ).toBeVisible(),
    );
    const canvas = canvasElement.querySelector("canvas[data-particle-canvas]");
    await userEvent.selectOptions(
      view.getByRole("combobox", { name: "Aperture" }),
      "technical-diamond",
    );
    await waitFor(() =>
      expect(
        canvasElement.querySelector(
          "[data-particle-fixture] [data-scene-aperture]",
        ),
      ).toHaveAttribute("data-aperture", "technical-diamond"),
    );
    await expect(
      canvasElement.querySelector("canvas[data-particle-canvas]"),
    ).toBe(canvas);
  },
};
