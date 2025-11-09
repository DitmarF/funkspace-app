import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import FullscreenScroll, {
  type FullscreenScrollProps,
} from "./FullscreenScroll";

const meta = {
  title: "Layouts/FullscreenScroll",
  component: FullscreenScroll,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A full-screen scroll container with CSS Scroll Snap. Uses `100dvh` for mobile viewport handling.",
      },
    },
  },
  args: {
    snapMode: "mandatory",
    children: (
      <>
        <section
          className="h-[100dvh] w-screen snap-start flex items-center justify-center"
          style={{ backgroundColor: "var(--fs-color-blue)" }}
        >
          <div className="text-white text-4xl font-bold">Section 1</div>
        </section>
        <section
          className="h-[100dvh] w-screen snap-start flex items-center justify-center"
          style={{ backgroundColor: "var(--fs-color-violet)" }}
        >
          <div className="text-white text-4xl font-bold">Section 2</div>
        </section>
      </>
    ),
  },
  argTypes: {
    snapMode: {
      control: { type: "select" },
      options: ["mandatory", "proximity", "none"],
      description:
        "Scroll snap behavior: mandatory always snaps, proximity snaps when close, none disables snapping.",
    },
  },
} satisfies Meta<typeof FullscreenScroll>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MandatorySnap: Story = {
  args: {
    snapMode: "mandatory",
  } satisfies FullscreenScrollProps,
};

export const ProximitySnap: Story = {
  args: {
    snapMode: "proximity",
  } satisfies FullscreenScrollProps,
};

export const NoSnap: Story = {
  args: {
    snapMode: "none",
  } satisfies FullscreenScrollProps,
};
