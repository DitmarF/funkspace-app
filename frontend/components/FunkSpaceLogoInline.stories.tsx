import type { Meta, StoryObj } from "@storybook/react";

import { FunkSpaceLogoInline } from "./FunkSpaceLogoInline";

const meta = {
  title: "Components/FunkSpaceLogoInline",
  component: FunkSpaceLogoInline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Inline SVG version of the FunkSpace logo with stable IDs for animation. Each path has a deterministic `id='logo-path-N'` for timeline targeting.",
      },
    },
  },
  argTypes: {
    "aria-label": {
      control: { type: "text" },
      description: "Accessible label for the logo",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof FunkSpaceLogoInline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "FunkSpace logo",
  },
};

export const CustomSize: Story = {
  args: {
    "aria-label": "FunkSpace logo",
    className: "w-64 h-auto",
  },
};

export const Verification: Story = {
  render: (args) => {
    return (
      <div className="space-y-4">
        <FunkSpaceLogoInline {...args} />
        <div className="text-sm text-gray-600">
          <p>
            <strong>Path count verification:</strong> Open browser console and
            run:
          </p>
          <code className="block mt-2 p-2 bg-gray-100 rounded">
            document.querySelectorAll(&apos;[id^=&quot;logo-path-&quot;]&apos;).length
          </code>
          <p className="mt-2">
            Expected: <strong>10</strong> paths with stable IDs
          </p>
        </div>
      </div>
    );
  },
  args: {
    "aria-label": "FunkSpace logo",
  },
};
