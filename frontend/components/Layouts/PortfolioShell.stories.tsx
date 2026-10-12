import type { Meta, StoryObj } from "@storybook/react";
import PortfolioShell from "./PortfolioShell";

const meta = {
  title: "Layouts/PortfolioShell",
  component: PortfolioShell,
  parameters: { layout: "fullscreen" },
  args: {
    children: (
      <div className="max-w-3xl space-y-fs-md">
        <h1 className="text-3xl font-bold">Privacy</h1>
        <p className="text-base leading-7">
          No cookies. Self-hosted fonts. No third-party requests on first load.
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof PortfolioShell>;

export default meta;
type Story = StoryObj<typeof meta>;
export const SecondaryPage: Story = {};
export const SmartStickyHeader: Story = {
  parameters: {
    decorativeMotionAvailable: true,
    docs: {
      description: {
        story:
          "At tablet/desktop widths, scroll down to hide the header and up to reveal it. Focus or an open menu keeps it visible. Reduced/Off use a stationary sticky header. Mobile retains its existing layout.",
      },
    },
  },
  args: {
    children: (
      <article className="space-y-fs-3xl">
        <h1 className="text-3xl font-bold">Explore FunkSpace</h1>
        {Array.from({ length: 12 }, (_, index) => (
          <section key={index} className="space-y-fs-md">
            <h2 className="text-2xl font-bold">Section {index + 1}</h2>
            <p className="max-w-3xl text-lg leading-8">
              Scroll down to explore, then scroll up to bring the main
              navigation and settings back into view. The header keeps its space
              in the document so the content stays in place.
            </p>
            <a href="#main-content" className="text-fs-action-link underline">
              Back to content
            </a>
          </section>
        ))}
      </article>
    ),
  },
};
