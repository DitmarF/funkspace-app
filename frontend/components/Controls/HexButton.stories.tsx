import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Button from "./Button";
import HexButton, { type HexButtonSize } from "./HexButton";

// Icon-only is the production default; explicit captions remain opt-in fixtures.
const iconOnly = {
  children: "",
  "aria-label": "Menu",
};

const meta = {
  title: "Controls/HexButton",
  component: HexButton,
  tags: ["autodocs"],
  args: { ...iconOnly, variant: "primary" },
  argTypes: {
    icon: {
      control: "select",
      options: [
        "settings-burger",
        "close",
        "navigation",
        "a11y",
        "chat-bot",
        "languages",
      ],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
    iconSize: { control: "select", options: [24, 36, 48] },
    variant: {
      control: "select",
      options: ["primary", "secondary", "outlined", "accent-outlined"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "48/72/96px Figma artwork with matching 24/36/48px icons. Controls are icon-only by default with an accessible name; no extra text field or caption is required. Explicit captions are optional. Hover and momentary press use the Standard treatments. Use keyboard Tab to inspect the unclipped focus ring.",
      },
    },
  },
} satisfies Meta<typeof HexButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {};

export const SelectedNavigation: Story = {
  args: {
    icon: "navigation",
    iconSize: 48,
    "aria-label": "Navigation",
    "aria-pressed": true,
  },
};

export const UnavailableChatBot: Story = {
  args: { icon: "chat-bot", "aria-label": "Chat-bot", disabled: true },
};

export const Close: Story = {
  args: {
    icon: "close",
    variant: "secondary",
    size: "small",
    "aria-label": "Close",
  },
};

export const FigmaMatrix: Story = {
  render: () => (
    <div className="grid gap-fs-lg">
      {(["large", "medium", "small"] as const).map((size) => (
        <section key={size} aria-label={size} className="grid gap-fs-md">
          <h2>
            {size}: {size === "large" ? 96 : size === "medium" ? 72 : 48}px
          </h2>
          {(
            ["accent-outlined", "primary", "outlined", "secondary"] as const
          ).map((variant) => (
            <section
              key={variant}
              aria-label={`${size}-${variant}`}
              className="grid gap-fs-xs"
            >
              <h3>{variant}</h3>
              <div className="flex flex-wrap items-start gap-fs-md">
                <HexButton {...iconOnly} size={size} variant={variant} />
                <HexButton
                  {...iconOnly}
                  size={size}
                  variant={variant}
                  disabled
                />
              </div>
            </section>
          ))}
        </section>
      ))}
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
export const LongLabel: Story = {
  args: {
    "aria-label": undefined,
    children: "Menu with more information about the available sections",
    className: "max-w-xs",
  },
};
export const EnlargedText: Story = {
  args: {
    "aria-label": undefined,
    children: "Menu and navigation",
    className: "max-w-xs",
    style: { fontSize: "2rem" },
  },
};

export const Treatments: Story = {
  render: () => (
    <div className="grid gap-fs-lg">
      <p>
        72px artwork, 36px icon. Hover, hold, or Tab to each available control.
      </p>
      {(["accent-outlined", "primary", "outlined", "secondary"] as const).map(
        (variant) => (
          <section
            key={variant}
            aria-label={variant}
            className="grid gap-fs-xs"
          >
            <h2>{variant}</h2>
            <div className="flex flex-wrap items-start gap-fs-md">
              <HexButton {...iconOnly} variant={variant} />
              <HexButton {...iconOnly} variant={variant} disabled />
            </div>
          </section>
        ),
      )}
    </div>
  ),
};

function InteractionExample({ size }: { size?: HexButtonSize }) {
  const [activations, setActivations] = useState(0);
  const [neighbors, setNeighbors] = useState(0);
  return (
    <div className="grid gap-fs-md">
      <div className="flex flex-wrap items-start gap-fs-md">
        <HexButton
          {...iconOnly}
          size={size}
          onClick={() => setActivations((n) => n + 1)}
        />
        <HexButton
          {...iconOnly}
          aria-label="Unavailable menu"
          size={size}
          disabled
          onClick={() => setActivations((n) => n + 1)}
        />
        <Button variant="outlined" onClick={() => setNeighbors((n) => n + 1)}>
          Next action
        </Button>
      </div>
      <p role="status">
        Menu activations: {activations}; next action: {neighbors}
      </p>
    </div>
  );
}
export const Interaction: Story = {
  render: (args) => <InteractionExample size={args.size} />,
};
