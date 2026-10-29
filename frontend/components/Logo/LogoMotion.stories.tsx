"use client";
import type { Meta, StoryObj } from "@storybook/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { resolveMotionPermission } from "../../domain/motion/MotionPolicy";
import type { LogoPlaybackState } from "../../domain/ports/LogoMotionPort";
import controls from "../Controls/AnimationFixture.module.css";
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
      <main className={controls.panel} aria-label="Logo animation fixture">
        <h1>Logo animation</h1>
        <Story />
        <MotionSettings />
      </main>
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
  const slider = useRef<HTMLInputElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const position = useRef({ time: 0, duration: 0 });
  const [duration, setDuration] = useState(0);
  const [playback, setPlayback] = useState<LogoPlaybackState>("pending");
  const { motionPolicy, decorativeMotionAvailable } = useServices();
  const subscribe = useCallback(
    (changed: () => void) => motionPolicy.subscribe(changed),
    [motionPolicy],
  );
  const read = useCallback(() => motionPolicy.getSnapshot(), [motionPolicy]);
  const snapshot = useSyncExternalStore(subscribe, read, read);
  const allowed = resolveMotionPermission(snapshot, {
    supportsReducedMotion: true,
    featureAvailable: decorativeMotionAvailable,
    optedIn: args.enabled !== false,
    visible: true,
    locallyPaused: false,
    runtime: "ready",
  }).mayRun;
  const hintId = useId();
  // Observe the existing renderer clock directly. No polling/RAF or React frame state.
  const observePosition = useCallback((time: number, total: number) => {
    if (position.current.duration !== total) setDuration(total);
    position.current = { time, duration: total };
    if (slider.current) {
      slider.current.max = String(total);
      slider.current.value = String(time);
      slider.current.setAttribute(
        "aria-valuetext",
        `${Math.round(time)} of ${Math.round(total)} milliseconds`,
      );
    }
    if (readout.current)
      readout.current.textContent = `${(time / 1000).toFixed(1)} / ${(total / 1000).toFixed(1)} s`;
  }, []);
  const pause = () => {
    const time = position.current.time;
    ref.current?.pause();
    // The product's Pause retains complete identity; this diagnostic explicitly
    // seeks back to the chosen frame so the timeline is a useful scrubber.
    ref.current?.seek(time);
  };
  return (
    <div className={controls.panel}>
      <LogoMotion
        {...args}
        ref={ref}
        onPosition={observePosition}
        onPlaybackState={setPlayback}
      />
      <fieldset className={controls.group} aria-describedby={hintId}>
        <legend>Playback</legend>
        <div className={controls.row}>
          <Button
            disabled={!allowed || !duration}
            onClick={() => {
              if (playback === "running") pause();
              else {
                if (
                  position.current.time >= position.current.duration ||
                  playback === "completed"
                )
                  ref.current?.seek(0);
                ref.current?.play();
              }
            }}
          >
            {playback === "running" ? "Pause" : "Play"}
          </Button>
          <Button
            variant="outlined"
            disabled={!allowed || !duration}
            onClick={() => {
              ref.current?.seek(0);
              ref.current?.play();
            }}
          >
            Restart
          </Button>
        </div>
        <label className={controls.timeline}>
          <span>
            Animation timeline <span ref={readout}>0.0 / 0.0 s</span>
          </span>
          <input
            ref={slider}
            aria-label="Animation timeline"
            type="range"
            min={0}
            max={duration || 1}
            step="any"
            defaultValue={0}
            disabled={!allowed || !duration}
            onChange={(event) => {
              const value = Number(event.target.value);
              ref.current?.pause();
              ref.current?.seek(value);
            }}
          />
        </label>
        <p id={hintId} className={controls.hint}>
          {allowed
            ? "Drag the timeline or use arrow keys to pause and inspect a frame. Play continues from there; Restart plays from the beginning."
            : "Playback and timeline are unavailable under the current motion setting or availability. The complete logo stays visible."}
        </p>
      </fieldset>
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
