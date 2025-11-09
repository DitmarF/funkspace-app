import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Container from "./Container";
import Text from "../Base/Text";
import Button from "../Controls/Button";

const meta = {
  title: "Layouts/Container",
  component: Container,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <Text size="lg" className="font-semibold">
          Layouts give structure
        </Text>
        <Text>
          Containers manage responsive width and padding, letting modules
          compose predictable sections that honor the design system spacing
          scale.
        </Text>
      </>
    ),
  },
  argTypes: {
    width: {
      control: { type: "select" },
      options: [
        "xs",
        "sm",
        "narrow",
        "sm-medium",
        "medium",
        "default",
        "wide",
        "full",
      ],
    },
    align: {
      control: { type: "select" },
      options: ["left", "center", "right"],
    },
    spacing: {
      control: { type: "select" },
      options: ["none", "tight", "normal", "medium", "loose"],
    },
    padding: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    spacing: "normal",
  },
};

export const WidthVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Extra Small (xs)
        </Text>
        <Container width="xs" className="bg-fs-surface-elevation-1">
          <Text>Max width: 20rem (320px)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Small (sm)
        </Text>
        <Container width="sm" className="bg-fs-surface-elevation-1">
          <Text>Max width: 24rem (384px)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Narrow
        </Text>
        <Container width="narrow" className="bg-fs-surface-elevation-1">
          <Text>Max width: 36rem (576px)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Small-Medium
        </Text>
        <Container width="sm-medium" className="bg-fs-surface-elevation-1">
          <Text>Max width: 42rem (672px)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Medium
        </Text>
        <Container width="medium" className="bg-fs-surface-elevation-1">
          <Text>Max width: 56rem (896px)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Default
        </Text>
        <Container width="default" className="bg-fs-surface-elevation-1">
          <Text>Max width: 64rem (1024px)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Wide
        </Text>
        <Container width="wide" className="bg-fs-surface-elevation-1">
          <Text>Max width: 80rem (1280px)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Full
        </Text>
        <Container width="full" className="bg-fs-surface-elevation-1">
          <Text>No max-width constraint (100% width)</Text>
        </Container>
      </div>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Left Aligned
        </Text>
        <Container
          align="left"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>Content aligned to the left</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Center Aligned (Default)
        </Text>
        <Container
          align="center"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>Content centered</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Right Aligned
        </Text>
        <Container
          align="right"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>Content aligned to the right</Text>
        </Container>
      </div>
    </div>
  ),
};

export const PaddingVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          No Padding
        </Text>
        <Container
          padding="none"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>Container with no padding</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Small Padding
        </Text>
        <Container
          padding="sm"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>px-4 py-4 (mobile) → px-6 py-6 (desktop)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Medium Padding (Default)
        </Text>
        <Container
          padding="md"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>px-4 py-6 (mobile) → px-6 py-8 (desktop)</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Large Padding
        </Text>
        <Container
          padding="lg"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>px-6 py-8 (mobile) → px-8 py-12 (desktop)</Text>
        </Container>
      </div>
    </div>
  ),
};

export const SpacingVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          No Spacing
        </Text>
        <Container
          spacing="none"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>First child</Text>
          <Text>Second child</Text>
          <Text>Third child</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Tight Spacing
        </Text>
        <Container
          spacing="tight"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>First child</Text>
          <Text>Second child</Text>
          <Text>Third child</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Normal Spacing
        </Text>
        <Container
          spacing="normal"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>First child</Text>
          <Text>Second child</Text>
          <Text>Third child</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Medium Spacing
        </Text>
        <Container
          spacing="medium"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>First child</Text>
          <Text>Second child</Text>
          <Text>Third child</Text>
        </Container>
      </div>
      <div>
        <Text
          size="sm"
          className="mb-2 font-semibold text-fs-content-elevation-2"
        >
          Loose Spacing
        </Text>
        <Container
          spacing="loose"
          width="default"
          className="bg-fs-surface-elevation-1"
        >
          <Text>First child</Text>
          <Text>Second child</Text>
          <Text>Third child</Text>
        </Container>
      </div>
    </div>
  ),
};

export const InSectionContext: Story = {
  render: () => (
    <div className="min-h-screen bg-fs-surface-background">
      <section className="py-16">
        <Container width="default" spacing="normal">
          <Text size="xl" className="font-semibold">
            Section Heading
          </Text>
          <Text>
            This container demonstrates typical usage within a section. It uses
            default width, center alignment, medium padding, and normal spacing
            between children.
          </Text>
          <div className="flex gap-4">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
          </div>
        </Container>
      </section>
      <section className="bg-fs-surface-elevation-1 py-16">
        <Container width="narrow" spacing="loose">
          <Text size="xl" className="font-semibold">
            Narrow Container
          </Text>
          <Text>
            This section uses a narrow container with loose spacing, perfect for
            focused content like articles or blog posts.
          </Text>
        </Container>
      </section>
      <section className="py-16">
        <Container width="wide" align="left" spacing="tight">
          <Text size="xl" className="font-semibold">
            Wide Left-Aligned
          </Text>
          <Text>
            This container is wide and left-aligned with tight spacing, useful
            for dashboards or data-heavy layouts.
          </Text>
        </Container>
      </section>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
