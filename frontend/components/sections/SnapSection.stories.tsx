import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Container from "../Layouts/Container";
import FullscreenScroll from "../Layouts/FullscreenScroll";
import SnapSection from "./SnapSection";

const meta = {
  title: "Sections/SnapSection",
  component: SnapSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A semantic full-screen section component with CSS Scroll Snap support. Includes proper accessibility attributes and keyboard navigation support.",
      },
    },
  },
  decorators: [
    (Story) => (
      <FullscreenScroll snapMode="mandatory">
        <Story />
      </FullscreenScroll>
    ),
  ],
  args: {
    id: "section-1",
    "aria-label": "Example section",
    snap: "start",
    relaxSnap: false,
    children: (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">Section 1</h2>
          <p className="text-lg text-white/90">
            This section demonstrates keyboard navigation. Use Tab, Page
            Down/Up, or Space to navigate.
          </p>
        </div>
      </div>
    ),
  },
  argTypes: {
    id: {
      control: { type: "text" },
      description:
        "Unique identifier for the section (required for accessibility)",
    },
    "aria-label": {
      control: { type: "text" },
      description: "Accessible label for screen readers (required)",
    },
    snap: {
      control: { type: "select" },
      options: ["start", "center", "end", "none"],
      description:
        "Scroll snap alignment: start (default), center, end, or none to disable.",
    },
    relaxSnap: {
      control: { type: "boolean" },
      description:
        "If true, relaxes snap behavior for sections with dense content.",
    },
  },
} satisfies Meta<typeof SnapSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultipleSections: Story = {
  render: () => (
    <FullscreenScroll snapMode="mandatory">
      <SnapSection
        id="hero"
        aria-label="Hero section"
        snap="start"
        className="flex items-center justify-center"
        style={{ backgroundColor: "var(--fs-color-blue)" }}
      >
        <div className="text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Hero Section</h2>
          <p className="text-lg">
            Use keyboard navigation: Tab, Page Down, Page Up, or Space
          </p>
        </div>
      </SnapSection>
      <SnapSection
        id="about"
        aria-label="About section"
        snap="start"
        className="flex items-center justify-center"
        style={{ backgroundColor: "var(--fs-color-violet)" }}
      >
        <div className="text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">About Section</h2>
          <p className="text-lg">
            Focus should land in the snapped viewport when navigating
          </p>
        </div>
      </SnapSection>
      <SnapSection
        id="contact"
        aria-label="Contact section"
        snap="start"
        className="flex items-center justify-center"
        style={{ backgroundColor: "var(--fs-color-cyan)" }}
      >
        <div className="text-center text-white">
          <h2 className="mb-4 text-4xl font-bold">Contact Section</h2>
          <p className="text-lg">
            Content should not be skipped during navigation
          </p>
        </div>
      </SnapSection>
    </FullscreenScroll>
  ),
};

export const WithRelaxedSnap: Story = {
  render: () => (
    <FullscreenScroll snapMode="proximity">
      <SnapSection
        id="dense-content"
        aria-label="Section with dense content"
        snap="start"
        relaxSnap={true}
        className="flex items-center justify-center"
        style={{ backgroundColor: "var(--fs-color-orange)" }}
      >
        <Container
          width="sm-medium"
          spacing="normal"
          padding="lg"
          className="text-center text-white"
        >
          <h2 className="mb-4 text-4xl font-bold">Dense Content Section</h2>
          <p className="text-lg">
            This section has relaxed snap behavior for better scrolling with
            dense content.
          </p>
          <div className="mt-8 space-y-2 text-left">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </Container>
      </SnapSection>
    </FullscreenScroll>
  ),
};

export const WithFocusableContent: Story = {
  render: () => (
    <FullscreenScroll snapMode="mandatory">
      <SnapSection
        id="focusable-1"
        aria-label="Section with focusable elements"
        snap="start"
        className="flex items-center justify-center"
        style={{ backgroundColor: "var(--fs-color-indigo)" }}
      >
        <div className="space-y-4 text-center text-white">
          <h2 className="text-4xl font-bold">Focusable Content</h2>
          <button
            type="button"
            className="rounded bg-white px-4 py-2 text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
          >
            Focusable Button 1
          </button>
        </div>
      </SnapSection>
      <SnapSection
        id="focusable-2"
        aria-label="Second section with focusable elements"
        snap="start"
        className="flex items-center justify-center"
        style={{ backgroundColor: "var(--fs-color-magenta)" }}
      >
        <div className="space-y-4 text-center text-white">
          <h2 className="text-4xl font-bold">Another Section</h2>
          <button
            type="button"
            className="rounded bg-white px-4 py-2 text-magenta-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-magenta-600"
          >
            Focusable Button 2
          </button>
        </div>
      </SnapSection>
    </FullscreenScroll>
  ),
};
