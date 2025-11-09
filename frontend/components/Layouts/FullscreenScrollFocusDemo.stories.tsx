"use client";

import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import SnapSection from "../sections/SnapSection";
import {
  focusIntoSection,
  handleAnchorNavigation,
} from "../../utils/focusIntoSection";
import FullscreenScroll from "./FullscreenScroll";

const meta = {
  title: "Layouts/FullscreenScroll/Focus & A11y",
  component: FullscreenScroll,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Demonstrates scroll padding for sticky headers and programmatic focus navigation. " +
          "Verifies that focused elements are not hidden behind sticky UI and that scroll snap still functions.",
      },
    },
  },
} satisfies Meta<typeof FullscreenScroll>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Demo component showing scroll padding with sticky header and focus navigation.
 *
 * Features:
 * - Sticky header that stays at the top
 * - Scroll padding to prevent focused elements from being hidden
 * - Programmatic navigation buttons
 * - Anchor link navigation
 * - Keyboard tab navigation verification
 */
function FocusPaddingWithStickyHeaderDemo() {
  const [currentSection, setCurrentSection] = useState<string>("hero");

  // Handle hash changes for anchor navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        handleAnchorNavigation(window.location.hash);
        setCurrentSection(window.location.hash.replace(/^#/, ""));
      }
    };

    // Handle initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Track current section for visual feedback
  useEffect(() => {
    // Find the scroll container (the FullscreenScroll div)
    const scrollContainer = document.querySelector(
      '[class*="overflow-y-auto"]',
    ) as HTMLElement | null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              setCurrentSection(id);
              // Update hash without triggering scroll
              if (window.location.hash !== `#${id}`) {
                window.history.replaceState(null, "", `#${id}`);
              }
            }
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.5,
      },
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative h-screen h-[100dvh]">
      {/* Sticky header - this is what scroll-padding-top accounts for */}
      <header
        className="sticky top-0 z-50 w-full border-b border-white/20 bg-fs-blue/95 backdrop-blur-sm"
        style={{ height: "80px" }}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
          <h2 className="text-xl font-bold text-white">Sticky Header Demo</h2>
          <nav aria-label="Section navigation">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  focusIntoSection("hero");
                }}
                aria-label="Navigate to Hero section"
                className="rounded px-4 py-2 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Hero
              </button>
              <button
                type="button"
                onClick={() => {
                  focusIntoSection("about");
                }}
                aria-label="Navigate to About section"
                className="rounded px-4 py-2 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => {
                  focusIntoSection("contact");
                }}
                aria-label="Navigate to Contact section"
                className="rounded px-4 py-2 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Contact
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Scroll container with scroll-padding-top to account for sticky header */}
      <FullscreenScroll
        snapMode="mandatory"
        scrollPaddingTop="scroll-padding-top-20"
        className="h-[calc(100dvh-80px)]"
      >
        <SnapSection
          id="hero"
          aria-label="Hero section"
          snap="start"
          className="flex flex-col items-center justify-center bg-fs-blue"
        >
          <div className="max-w-4xl space-y-6 p-8 text-center">
            <h1 className="text-5xl font-bold text-white sm:text-6xl">
              Hero Section
            </h1>
            <p className="text-xl text-white/90">
              This section demonstrates scroll padding with a sticky header. Use
              the navigation buttons above or Tab to focus elements.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-fs-blue hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-fs-blue"
              >
                Focusable Button 1
              </button>
              <button
                type="button"
                className="rounded-lg bg-white/20 px-6 py-3 font-semibold text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Focusable Button 2
              </button>
            </div>
            {currentSection === "hero" && (
              <div className="mt-4 rounded-lg bg-white/20 p-4 text-sm text-white">
                ✓ Currently viewing Hero section
              </div>
            )}
          </div>
        </SnapSection>

        <SnapSection
          id="about"
          aria-label="About section"
          snap="start"
          className="flex flex-col items-center justify-center bg-fs-violet"
        >
          <div className="max-w-4xl space-y-6 p-8 text-center">
            <h2 className="text-5xl font-bold text-white sm:text-6xl">
              About Section
            </h2>
            <p className="text-xl text-white/90">
              When you navigate here programmatically or via anchor link, the
              focused element should appear below the sticky header, not behind
              it. Scroll snap should still function correctly.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="#contact"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-fs-violet hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-fs-violet"
              >
                Anchor Link to Contact
              </a>
              <input
                type="text"
                placeholder="Focusable input field"
                className="rounded-lg px-4 py-3 text-fs-violet focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            {currentSection === "about" && (
              <div className="mt-4 rounded-lg bg-white/20 p-4 text-sm text-white">
                ✓ Currently viewing About section
              </div>
            )}
          </div>
        </SnapSection>

        <SnapSection
          id="contact"
          aria-label="Contact section"
          snap="start"
          className="flex flex-col items-center justify-center bg-fs-green"
        >
          <div className="max-w-4xl space-y-6 p-8 text-center">
            <h2 className="text-5xl font-bold text-white sm:text-6xl">
              Contact Section
            </h2>
            <p className="text-xl text-white/90">
              This is the final section. Try using Tab to navigate through
              focusable elements. They should all be visible, not hidden behind
              the sticky header.
            </p>
            <form className="mx-auto max-w-md space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-lg px-4 py-3 text-fs-green focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg px-4 py-3 text-fs-green focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-white px-6 py-3 font-semibold text-fs-green hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-fs-green"
              >
                Submit
              </button>
            </form>
            {currentSection === "contact" && (
              <div className="mt-4 rounded-lg bg-white/20 p-4 text-sm text-white">
                ✓ Currently viewing Contact section
              </div>
            )}
          </div>
        </SnapSection>
      </FullscreenScroll>
    </div>
  );
}

export const FocusPaddingWithStickyHeader: Story = {
  render: () => <FocusPaddingWithStickyHeaderDemo />,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Demonstrates scroll padding with a sticky header. " +
          "The scroll container has `scroll-padding-top-20` (80px) to account for the sticky header height. " +
          "When navigating programmatically or via anchor links, focused elements appear below the header. " +
          "Scroll snap still functions correctly with the padding applied. " +
          "Try using Tab to navigate, or click the navigation buttons to test programmatic focus.",
      },
    },
  },
};

/**
 * Minimal demo showing scroll padding without sticky header.
 * This verifies that scroll padding doesn't break snap behavior.
 */
export const ScrollPaddingWithoutSticky: Story = {
  render: () => (
    <FullscreenScroll
      snapMode="mandatory"
      scrollPaddingTop="scroll-padding-top-16"
    >
      <SnapSection
        id="section-a"
        aria-label="Section A"
        snap="start"
        className="flex items-center justify-center bg-fs-blue"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Section A</h2>
          <p className="mt-4 text-white/90">
            Scroll padding is set but no sticky header. Snap should still work.
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-white px-6 py-3 font-semibold text-fs-blue focus:outline-none focus:ring-2 focus:ring-white"
          >
            Focusable Element
          </button>
        </div>
      </SnapSection>

      <SnapSection
        id="section-b"
        aria-label="Section B"
        snap="start"
        className="flex items-center justify-center bg-fs-violet"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Section B</h2>
          <p className="mt-4 text-white/90">
            Use Page Down or scroll to verify snap behavior.
          </p>
          <a
            href="#section-a"
            className="mt-4 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-fs-violet focus:outline-none focus:ring-2 focus:ring-white"
          >
            Anchor Link to Section A
          </a>
        </div>
      </SnapSection>
    </FullscreenScroll>
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Minimal demo with scroll padding but no sticky header. " +
          "Verifies that scroll padding doesn't interfere with scroll snap behavior.",
      },
    },
  },
};
