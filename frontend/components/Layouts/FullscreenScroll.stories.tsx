import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import About from "../sections/About";
import Hero from "../sections/Hero";
import SnapSection from "../sections/SnapSection";
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
        <SnapSection
          id="section-1"
          aria-label="First section"
          snap="start"
          className="flex items-center justify-center"
          style={{ backgroundColor: "var(--fs-color-blue)" }}
        >
          <div className="text-white text-4xl font-bold">Section 1</div>
        </SnapSection>
        <SnapSection
          id="section-2"
          aria-label="Second section"
          snap="start"
          className="flex items-center justify-center"
          style={{ backgroundColor: "var(--fs-color-violet)" }}
        >
          <div className="text-white text-4xl font-bold">Section 2</div>
        </SnapSection>
      </>
    ),
  },
  argTypes: {
    snapMode: {
      control: { type: "select" },
      options: ["mandatory", "proximity", "none"],
      description:
        "Scroll snap behavior: mandatory always snaps, proximity snaps when close, none disables snapping.",
      // Add toolbar control for easy toggling
      toolbar: {
        items: [
          { value: "mandatory", title: "Mandatory Snap" },
          { value: "proximity", title: "Proximity Snap" },
          { value: "none", title: "No Snap" },
        ],
        showName: true,
      },
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

/**
 * Composite layout story with Hero and About sections
 */
export const CompositeLayout: Story = {
  render: (args) => (
    <FullscreenScroll {...args}>
      <Hero
        heading="Welcome to FunkSpace"
        subheading="A modern design system built for performance, accessibility, and developer experience."
        ctaLabel="Get Started"
        onCtaClick={() => {
          console.log("CTA clicked");
        }}
        backgroundColor="bg-fs-blue"
      />
      <About
        heading="About FunkSpace"
        innerScrollable={false}
        backgroundColor="bg-fs-violet"
      >
        <div className="space-y-4">
          <p className="text-white">
            FunkSpace is a modern design system built for performance,
            accessibility, and developer experience.
          </p>
          <p className="text-white">
            Our components are designed with accessibility first, ensuring that
            everyone can use our products regardless of their abilities.
          </p>
          <p className="text-white">
            We use tokenized design tokens for colors, typography, and spacing
            to maintain consistency across all products.
          </p>
        </div>
      </About>
    </FullscreenScroll>
  ),
  args: {
    snapMode: "mandatory",
  } satisfies FullscreenScrollProps,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Composite layout with Hero and About sections. Use the toolbar control to toggle snap mode (mandatory/proximity) for testing. The canvas is truly fullscreen and snap functions correctly.",
      },
    },
  },
};

/**
 * Composite layout with inner scrolling in About section
 */
export const CompositeLayoutWithInnerScroll: Story = {
  render: (args) => (
    <FullscreenScroll {...args}>
      <Hero
        heading="Welcome to FunkSpace"
        subheading="A modern design system built for performance, accessibility, and developer experience."
        backgroundColor="bg-fs-blue"
      />
      <About
        heading="About FunkSpace"
        innerScrollable={true}
        backgroundColor="bg-fs-violet"
      >
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className="space-y-2">
            <p className="text-white font-semibold">Section {i + 1}</p>
            <p className="text-white/90">
              This is paragraph content for section {i + 1}. It demonstrates how
              long content can scroll inside the About section without fighting
              the outer snap behavior. When inner scrolling is enabled, the
              outer snap is relaxed to proximity mode to avoid trapping users.
            </p>
            <p className="text-white/90">
              Keyboard users can navigate through all content using Tab, arrow
              keys, and Page Up/Down. The inner scrollable area maintains proper
              focus management.
            </p>
          </div>
        ))}
      </About>
    </FullscreenScroll>
  ),
  args: {
    snapMode: "proximity",
  } satisfies FullscreenScrollProps,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Composite layout with Hero and About sections. The About section has inner scrolling enabled, so the snap mode is set to proximity to avoid trapping users. Use the toolbar control to test different snap modes.",
      },
    },
  },
};
