import type { Meta, StoryObj } from "@storybook/react";
import { DesignTokenDocBlock } from "storybook-design-token/doc-blocks";

const TokensDocPage = () => (
  <div className="space-y-6">
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Design Tokens</h1>
      <p className="text-base text-[color:var(--fs-color-content-elevation-2)]">
        Color, spacing, and typography primitives sourced from Style Dictionary. Updates propagate
        here after running <code>pnpm build:tokens</code>.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Colors</h2>
      <DesignTokenDocBlock categoryName="Colors/Primitives" />
      <DesignTokenDocBlock categoryName="Colors/Extended" />
      <DesignTokenDocBlock categoryName="Colors/Surface" />
      <DesignTokenDocBlock categoryName="Colors/Content" />
      <DesignTokenDocBlock categoryName="Colors/Actions" />
      <DesignTokenDocBlock categoryName="Colors/Feedback" />
      <DesignTokenDocBlock categoryName="Borders" />
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Spacing</h2>
      <DesignTokenDocBlock categoryName="Spacing Scale" viewType="card" />
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Typography</h2>
      <DesignTokenDocBlock categoryName="Typography/Families" />
      <DesignTokenDocBlock categoryName="Typography/Sizes" />
      <DesignTokenDocBlock categoryName="Typography/Weights" />
      <DesignTokenDocBlock categoryName="Typography/Line Heights" />
    </section>
  </div>
);

const meta = {
  title: "Foundations/Tokens",
  parameters: {
    docs: {
      page: TokensDocPage,
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  name: "Token catalogue",
  render: () => null,
  parameters: {
    docs: {
      disable: true,
    },
  },
};
