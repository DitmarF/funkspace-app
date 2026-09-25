import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import PortfolioNavigation from "./PortfolioNavigation";
import type { MotionChoice } from "./MotionChoices";
import shell from "./PortfolioShell.module.css";

const meta = {
  title: "Layouts/PortfolioNavigation",
  component: PortfolioNavigation,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof PortfolioNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;

function Fixture({ motion = false }: { motion?: boolean }) {
  const [value, onChange] = useState<MotionChoice>("system");
  return (
    <div className={shell.shell}>
      <h1>Navigation preview</h1>
      {motion && (
        <p>
          Motion fixture only: choices are local to this story, are not saved,
          and do not animate the logo.
        </p>
      )}
      <PortfolioNavigation motion={motion ? { value, onChange } : undefined} />
    </div>
  );
}

export const Production: Story = { render: () => <Fixture /> };
export const ControlledMotionFixture: Story = {
  render: () => <Fixture motion />,
};
