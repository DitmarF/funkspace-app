import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import ParticleLifecycleFixture from "./ParticleLifecycleFixture";

const meta = {
  title: "Scene/ParticleLifecycleFixture",
  component: ParticleLifecycleFixture,
  parameters: { layout: "fullscreen", decorativeMotionAvailable: true },
} satisfies Meta<typeof ParticleLifecycleFixture>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  parameters: { decorativeMotionAvailable: false },
};

export const Motion: Story = {
  play: async ({ canvasElement }) => {
    const view = within(canvasElement);
    await userEvent.click(view.getByRole("button", { name: "On" }));
    await userEvent.click(view.getByRole("button", { name: "Start scene" }));
    await waitFor(() =>
      expect(
        canvasElement.querySelector("canvas[data-particle-canvas]"),
      ).toBeVisible(),
    );
  },
};

export const ContextLoss: Story = {
  play: async (context) => {
    await Motion.play?.(context);
    context.canvasElement
      .querySelector("canvas[data-particle-canvas]")
      ?.dispatchEvent(new Event("contextlost"));
    await waitFor(() =>
      expect(
        within(context.canvasElement).getByRole("status"),
      ).toHaveTextContent("failed"),
    );
    await expect(
      context.canvasElement.querySelector("[data-particle-static]"),
    ).toBeVisible();
  },
};
