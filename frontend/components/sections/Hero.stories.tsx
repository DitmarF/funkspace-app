import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import FullscreenScroll from "../Layouts/FullscreenScroll";
import Hero, { type HeroProps } from "./Hero";

const meta = {
  title: "Sections/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Hero section component with scroll-triggered animations. Uses tokenized colors and typography. Animations run only when section is in view. Supports keyboard navigation with proper focus management.",
      },
    },
  },
  args: {
    heading: "Welcome to FunkSpace",
    subheading:
      "A modern design system built for performance, accessibility, and developer experience.",
    ctaLabel: "Get Started",
    onCtaClick: () => {
      console.log("CTA clicked");
    },
    backgroundColor: "bg-fs-blue",
  },
  argTypes: {
    heading: {
      control: { type: "text" },
      description: "Main heading text",
    },
    subheading: {
      control: { type: "text" },
      description: "Subheading text (optional)",
    },
    ctaLabel: {
      control: { type: "text" },
      description: "Call-to-action button label (optional)",
    },
    onCtaClick: {
      action: "clicked",
      description: "Call-to-action button click handler",
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
} satisfies Meta<typeof Hero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSubheading: Story = {
  args: {
    subheading: undefined,
  } satisfies HeroProps,
};

export const WithoutCTA: Story = {
  args: {
    ctaLabel: undefined,
  } satisfies HeroProps,
};

export const Minimal: Story = {
  args: {
    subheading: undefined,
    ctaLabel: undefined,
  } satisfies HeroProps,
};

export const WithMultipleSections: Story = {
  render: (args) => (
    <FullscreenScroll snapMode="mandatory">
      <Hero {...args} />
      <Hero
        heading="Another Section"
        subheading="Scroll to see animations reset and replay"
        backgroundColor="bg-fs-violet"
      />
    </FullscreenScroll>
  ),
};
