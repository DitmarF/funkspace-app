import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import HeroMotion from "./HeroMotion";

const meta: Meta<typeof HeroMotion> = {
  title: "Modules/HeroMotion",
  component: HeroMotion,
  parameters: {
    docs: {
      description: {
        component:
          "Hero entrance using transform/opacity only. To see motion, run Storybook with NEXT_PUBLIC_ANIMATIONS_ENABLED=true.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroMotion>;

export const Default: Story = {
  args: {
    delayMs: 0,
    className: "border border-fs-border-subtle rounded-lg p-6",
    children: (
      <div className="h-24 flex items-center justify-center bg-fs-surface-elevation-1 text-sm">
        Hero content placeholder
      </div>
    ),
  },
};
