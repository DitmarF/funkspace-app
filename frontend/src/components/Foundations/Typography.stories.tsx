import type { Meta, StoryObj } from "@storybook/react";
import { workSans, spaceGrotesk } from "../../app/fonts";

type Theme = "default" | "dark" | "muted" | "dark-high-contrast";

const meta = {
  title: "Foundations/Typography",
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["default", "dark", "muted", "dark-high-contrast"],
    },
  },
  args: {
    theme: "default" as Theme,
  },
  parameters: {
    layout: "centered",
  },
  render: ({ theme }: { theme: Theme }) => {
    const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
    return (
      <div
        className={`${workSans.variable} ${spaceGrotesk.variable} p-6 max-w-3xl`}
        data-theme={theme === "default" ? undefined : theme}
      >
        <h1 className="font-display text-5xl mb-2">Work Sans — Display</h1>
        <h2 className="font-display text-3xl mb-4">Heading Level 2</h2>
        <p className="font-sans text-base leading-7 mb-8">
          Space Grotesk — body text paragraph for verification across themes.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {weights.map((w) => (
            <div key={w} className="font-display" style={{ fontWeight: w }}>
              Work Sans weight {w}
            </div>
          ))}
        </div>
      </div>
    );
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
