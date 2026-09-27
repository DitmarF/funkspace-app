"use client";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import {
  LogoMotion,
  type LogoMotionRef,
  type LogoMotionProps,
} from "./LogoMotion";
import { useServices } from "../../application/providers/ServiceProvider";
import Button from "../Controls/Button";
import MotionSettings from "../Layouts/MotionSettings";

const meta = {
  title: "Components/Logo/LogoMotion",
  component: LogoMotion,
  args: {
    enabled: true,
    autoPlay: true,
    speed: 1,
    className: "max-w-[420px] w-full",
  },
  parameters: { layout: "centered", decorativeMotionAvailable: true },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="space-y-fs-lg">
        <Story />
        <MotionSettings />
      </div>
    ),
  ],
  argTypes: {
    enabled: {
      description:
        "Opt-in only; cannot bypass availability, preference or Pause.",
    },
    pathCount: {
      control: false,
      description: "Compatibility prop; complete manifest remains unchanged.",
    },
    speed: { control: { type: "number", min: 0, max: 3, step: 0.1 } },
  },
} satisfies Meta<typeof LogoMotion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const StartAtTime: Story = { args: { startAtMs: 1000 } };
export const MultipleInstances: Story = {
  render: (args) => (
    <>
      <LogoMotion {...args} enabled={false} aria-label="Static logo" />
      <LogoMotion {...args} aria-label="Opted-in logo" />
    </>
  ),
};
function ControlsFixture(args: LogoMotionProps) {
  const ref = useRef<LogoMotionRef>(null);
  const [position, setPosition] = useState(0);
  return (
    <div className="space-y-fs-lg">
      <LogoMotion {...args} ref={ref} />
      <div className="flex flex-wrap gap-fs-sm">
        <Button onClick={() => ref.current?.play()}>Play / resume</Button>
        <Button onClick={() => ref.current?.pause()}>Pause</Button>
        <Button onClick={() => ref.current?.reverse()}>
          Reverse direction
        </Button>
        <Button
          onClick={() => {
            ref.current?.seek(0);
            ref.current?.play();
          }}
        >
          Replay
        </Button>
        <Button onClick={() => ref.current?.setSpeed(2)}>Double speed</Button>
      </div>
      <label>
        Seek position (ms)
        <input
          aria-label="Seek position in milliseconds"
          type="number"
          min={0}
          value={position}
          onChange={(event) => {
            const value = Number(event.target.value);
            setPosition(value);
            ref.current?.seek(value);
          }}
        />
      </label>
      <p>
        Controls obey the selected preference. Pause is local to this logo. Seek
        does not resume playback.
      </p>
    </div>
  );
}
export const Controls: Story = {
  args: { autoPlay: false },
  render: (args) => <ControlsFixture {...args} />,
};
function ReducedFixture(args: LogoMotionProps) {
  const { motionPolicy } = useServices();
  useEffect(() => motionPolicy.setPreference("reduced"), [motionPolicy]);
  return <LogoMotion {...args} />;
}
export const ReducedMotion: Story = {
  render: (args) => <ReducedFixture {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "The complete logo fades in uniformly over the normal introduction’s duration. Reload this story to compare; changing preference does not replay a consumed introduction.",
      },
    },
  },
};
function OnFixture(args: LogoMotionProps) {
  const { motionPolicy } = useServices();
  useEffect(() => motionPolicy.setPreference("on"), [motionPolicy]);
  return <LogoMotion {...args} />;
}
export const On: Story = {
  render: (args) => <OnFixture {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Explicit On overrides the device motion preference. Availability, local Pause and once-per-mount playback still apply.",
      },
    },
  },
};
function OptInFixture(args: LogoMotionProps) {
  const [enabled, setEnabled] = useState(false);
  return (
    <>
      <LogoMotion {...args} enabled={enabled} />
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        Opt this logo into available motion
      </label>
    </>
  );
}
export const FeatureFlagToggle: Story = {
  render: (args) => <OptInFixture {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "Toggle this copy's opt-in. The controlled composition supplies availability; preference and Pause remain authoritative.",
      },
    },
  },
};
export const FeatureFlagOff: Story = {
  args: { enabled: true },
  parameters: {
    decorativeMotionAvailable: false,
    docs: {
      description: {
        story:
          "Even enabled=true remains complete and static when composition availability is off.",
      },
    },
  },
};
