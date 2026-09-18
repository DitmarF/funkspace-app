import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Button, { type ButtonProps } from "./Button";
import type { StandardIconProps } from "./standardControl";
import { Icon } from "../Icons/Icon";
import { ButtonArrow, ButtonSettings } from "./Button.story-icons";

const meta = {
  title: "Controls/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Click me",
    variant: "primary",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outlined", "accent-outlined"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
  parameters: {
    actions: {
      handles: ["click"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const AccentOutlined: Story = {
  args: { variant: "accent-outlined", children: "Accent outline" },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary action",
  } satisfies ButtonProps,
};

export const Outlined: Story = {
  args: { variant: "outlined", children: "Customize" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Unavailable" },
};

export const Pending: Story = {
  args: { pending: true, children: "Send message" },
};

// Exact exported Figma geometry with label/background paint bindings.
export const LeadingIcon: Story = {
  args: {
    icon: <ButtonArrow />,
    iconPosition: "leading",
    children: "Icon sample",
  },
};

export const TrailingIcon: Story = {
  args: {
    icon: <ButtonSettings />,
    iconPosition: "trailing",
    children: "Icon sample",
  },
};

export const LongLabel: Story = {
  args: {
    children: "Read the complete information about this available action",
    className: "max-w-xs",
  },
};

function PendingExample({
  icons = "trailing",
  size = "small",
}: {
  icons?: "leading" | "trailing" | "paired";
  size?: ButtonProps["size"];
}) {
  const [pending, setPending] = useState(false);
  const [activations, setActivations] = useState(0);
  const iconProps: StandardIconProps =
    icons === "paired"
      ? {
          leadingIcon: <Icon name="arrow-left" />,
          trailingIcon: <Icon name="arrow-right" />,
        }
      : { icon: <Icon name="arrow-right" />, iconPosition: icons };
  return (
    <div className="flex flex-wrap items-start gap-fs-md">
      <Button
        {...iconProps}
        size={size}
        pending={pending}
        onClick={() => {
          setActivations((count) => count + 1);
          setPending(true);
        }}
      >
        Send message
      </Button>
      <Button variant="secondary" onClick={() => setPending(false)}>
        Finish example
      </Button>
      <p>Activations: {activations}</p>
    </div>
  );
}

export const PendingInteraction: Story = {
  render: ({ size }) => <PendingExample size={size} />,
};
export const PendingLeadingIcon: Story = {
  render: ({ size }) => <PendingExample size={size} icons="leading" />,
};
export const PendingTrailingIcon: Story = {
  render: ({ size }) => <PendingExample size={size} icons="trailing" />,
};
export const PendingPairedIcons: Story = {
  args: { size: "large" },
  render: ({ size }) => <PendingExample size={size} icons="paired" />,
};

function NativeFormExample() {
  const [submissions, setSubmissions] = useState(0);
  const [actions, setActions] = useState(0);
  const [pending, setPending] = useState(false);
  return (
    <form
      className="grid gap-fs-md"
      onSubmit={(event) => {
        event.preventDefault();
        // The form owns submission orchestration, including implicit submits.
        if (pending) return;
        setSubmissions((count) => count + 1);
        setPending(true);
      }}
    >
      <label>
        Example value <input name="example" defaultValue="Initial value" />
      </label>
      <div className="flex flex-wrap items-start gap-fs-md">
        <Button onClick={() => setActions((count) => count + 1)}>Action</Button>
        <Button type="submit" pending={pending}>
          Submit example
        </Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
      <p>
        Actions: {actions}; submissions: {submissions}
      </p>
    </form>
  );
}

export const NativeForm: Story = { render: () => <NativeFormExample /> };

export const SurfaceMatrix: Story = {
  render: () => (
    <div className="grid gap-fs-lg">
      {(["background", "elevation-1"] as const).map((surface) => (
        <section
          key={surface}
          aria-label={surface}
          className="flex flex-wrap items-start gap-fs-md p-fs-md"
          style={{ background: `var(--fs-color-surface-${surface})` }}
        >
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outlined">Customize</Button>
          <Button disabled>Unavailable</Button>
          <Button pending>Send message</Button>
        </section>
      ))}
    </div>
  ),
};

// Native hover/press/focus states can be inspected on every cell. No synthetic
// selected or disabled-link state is added to the public component API.
export const FigmaMatrix: Story = {
  render: () => (
    <div className="grid min-w-0 grid-cols-1 gap-fs-lg">
      {(["large", "medium", "small"] as const).map((size) => (
        <section
          key={size}
          aria-label={size}
          className="grid min-w-0 grid-cols-1 gap-fs-md"
        >
          <h2>
            {size}: {size === "large" ? 96 : size === "medium" ? 72 : 48}px
          </h2>
          {(
            ["accent-outlined", "primary", "outlined", "secondary"] as const
          ).map((variant) => (
            <div key={variant} className="flex flex-wrap items-start gap-fs-md">
              <Button
                size={size}
                variant={variant}
                leadingIcon={<ButtonArrow />}
                trailingIcon={<ButtonSettings />}
              >
                {variant}
              </Button>
              <Button
                size={size}
                variant={variant}
                disabled
                leadingIcon={<ButtonArrow />}
                trailingIcon={<ButtonSettings />}
              >
                {variant}
              </Button>
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
};
