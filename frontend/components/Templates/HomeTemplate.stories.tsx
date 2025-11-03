import type { Meta, StoryObj } from "@storybook/react";

import HomeTemplate, { type HomeTemplateProps } from "./HomeTemplate";
import Text from "../Base/Text";

const meta = {
  title: "Templates/HomeTemplate",
  component: HomeTemplate,
  tags: ["autodocs"],
  args: {
    heroHeading: "FunkSpace design system",
    heroSubheading:
      "Bring consistency to your product teams with tokens, accessible components, and ready-to-ship templates.",
    ctaLabel: "Explore components",
    features: [
      {
        title: "Tokens first",
        description:
          "All color, spacing, and typography decisions come from a shared token source of truth.",
      },
      {
        title: "Performance by default",
        description:
          "Split client-only interactions and lean on server components to keep experiences fast.",
      },
      {
        title: "Accessibility baked in",
        description:
          "Every module follows the A11y checklist so you ship inclusive experiences with confidence.",
      },
    ],
    footer: (
      <Text size="sm" className="text-[color:var(--fs-color-content-elevation-2)]">
        Need help onboarding? Reach out to the FunkSpace design ops team.
      </Text>
    ),
  },
  parameters: {
    actions: {
      handles: ["onCtaClick"],
    },
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomeTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    heroSubheading: undefined,
    ctaLabel: undefined,
    features: [],
    footer: undefined,
  } satisfies HomeTemplateProps,
};
