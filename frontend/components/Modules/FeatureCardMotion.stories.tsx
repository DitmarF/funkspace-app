import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import FeatureCardMotion from "./FeatureCardMotion";

const meta: Meta<typeof FeatureCardMotion> = {
  title: "Modules/FeatureCardMotion",
  component: FeatureCardMotion,
  parameters: {
    docs: {
      description: {
        component:
          "Feature card reveal with staggered children. Uses transform/opacity only. Run with NEXT_PUBLIC_ANIMATIONS_ENABLED=true to see motion.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureCardMotion>;

export const GridSix: Story = {
  args: {
    delayMs: 0,
    staggerMs: 60,
    className: "grid grid-cols-3 gap-4",
    children: Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="h-24 rounded-lg bg-fs-surface-elevation-1 border border-fs-border-subtle"
      />
    )),
  },
};
