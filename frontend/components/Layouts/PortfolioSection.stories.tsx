import type { Meta, StoryObj } from "@storybook/react";
import PortfolioSection from "./PortfolioSection";
import ButtonLink from "../Controls/ButtonLink";
import Start from "../sections/Start";
import AboutPreview from "../sections/AboutPreview";

const meta = {
  title: "Layouts/PortfolioSection",
  component: PortfolioSection,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Content-driven sections with ordinary scrolling. Use plain (default) for static content and a few actions; cornered for interactive experiences with settings or navigation. Both use identical semantic token spacing. Corners are decorative and never receive focus or pointer input.",
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["plain", "cornered"] },
  },
  args: {
    variant: "plain",
    "aria-labelledby": "section-title",
    children: (
      <div className="space-y-fs-lg">
        <h2 id="section-title" className="text-2xl font-bold">
          Section content
        </h2>
        <p className="text-portfolio-body">
          The same content and spacing with or without SVG corner marks.
        </p>
        <ButtonLink href="/about">More about FunkSpace</ButtonLink>
      </div>
    ),
  },
} satisfies Meta<typeof PortfolioSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Cornered: Story = { args: { variant: "cornered" } };
export const HomepageSections: Story = {
  parameters: { decorativeMotionAvailable: false },
  render: () => (
    <div className="space-y-fs-xl">
      <Start />
      <AboutPreview />
    </div>
  ),
};
