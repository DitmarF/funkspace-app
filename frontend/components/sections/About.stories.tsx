import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import FullscreenScroll from "../Layouts/FullscreenScroll";
import About, { type AboutProps } from "./About";
import Text from "../Base/Text";

// Generate long content for testing inner scroll
const longContent = Array.from({ length: 20 }, (_, i) => (
  <div key={i} className="space-y-2">
    <Text className="text-white">
      <strong>Section {i + 1}</strong>
    </Text>
    <Text className="text-white/90">
      This is paragraph content for section {i + 1}. It demonstrates how long
      content can scroll inside the About section without fighting the outer
      snap behavior. When inner scrolling is enabled, the outer snap is relaxed
      to proximity mode to avoid trapping users.
    </Text>
    <Text className="text-white/90">
      Keyboard users can navigate through all content using Tab, arrow keys, and
      Page Up/Down. The inner scrollable area maintains proper focus management.
    </Text>
  </div>
));

const meta = {
  title: "Sections/About",
  component: About,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "About section component with optional inner scrolling. When inner scrolling is enabled, the outer snap is relaxed to proximity to avoid trapping users. Supports long content and keyboard navigation.",
      },
    },
  },
  args: {
    heading: "About FunkSpace",
    innerScrollable: false,
    backgroundColor: "bg-fs-violet",
    children: (
      <div className="space-y-4">
        <Text className="text-white">
          FunkSpace is a modern design system built for performance,
          accessibility, and developer experience.
        </Text>
        <Text className="text-white">
          Our components are designed with accessibility first, ensuring that
          everyone can use our products regardless of their abilities.
        </Text>
        <Text className="text-white">
          We use tokenized design tokens for colors, typography, and spacing to
          maintain consistency across all products.
        </Text>
      </div>
    ),
  },
  argTypes: {
    heading: {
      control: { type: "text" },
      description: "Main heading text",
    },
    innerScrollable: {
      control: { type: "boolean" },
      description:
        "If true, enables inner scrolling for long content and relaxes outer snap to proximity",
    },
    backgroundColor: {
      control: { type: "select" },
      options: [
        "bg-fs-blue",
        "bg-fs-violet",
        "bg-fs-cyan",
        "bg-fs-indigo",
        "bg-fs-magenta",
      ],
      description: "Background color token",
    },
  },
} satisfies Meta<typeof About>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInnerScroll: Story = {
  args: {
    innerScrollable: true,
    children: longContent,
  } satisfies AboutProps,
  parameters: {
    docs: {
      description: {
        story:
          "About section with inner scrolling enabled. Long content scrolls inside the section without fighting outer snap. The outer snap is relaxed to proximity mode.",
      },
    },
  },
};

export const WithProximitySnap: Story = {
  render: (args) => (
    <FullscreenScroll snapMode="proximity">
      <About {...args} innerScrollable={true}>
        {longContent}
      </About>
    </FullscreenScroll>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "About section with inner scrolling in a proximity snap container. This demonstrates how inner scrolling works with relaxed snap behavior.",
      },
    },
  },
};

export const WithMultipleSections: Story = {
  render: () => (
    <FullscreenScroll snapMode="proximity">
      <About
        heading="About Us"
        innerScrollable={true}
        backgroundColor="bg-fs-blue"
      >
        {longContent}
      </About>
      <About
        heading="Our Mission"
        innerScrollable={false}
        backgroundColor="bg-fs-violet"
      >
        <div className="space-y-4">
          <Text className="text-white">
            Our mission is to create accessible, performant, and beautiful user
            experiences.
          </Text>
          <Text className="text-white">
            We believe that great design should be available to everyone,
            regardless of their abilities or the devices they use.
          </Text>
        </div>
      </About>
    </FullscreenScroll>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multiple About sections demonstrating both inner scrolling and regular sections. The first section has inner scrolling enabled, the second does not.",
      },
    },
  },
};
