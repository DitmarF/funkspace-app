"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import {
  DEFAULT_PARTICLE_CONFIG,
  PARTICLE_SETTINGS,
  type ParticleConfig,
} from "@/domain/particles/ParticleSettings";
import type {
  ParticleSceneHandle,
  ParticleSceneSnapshot,
} from "@/domain/ports/ParticleScenePort";
import Button from "../Controls/Button";
import { Icon } from "../Icons/Icon";
import Dialog from "../Controls/Dialog";
import InlineStatus from "../Controls/InlineStatus";
import { FieldFrame, useField } from "../Controls/field";
import fields from "../Controls/fields.module.css";
import { usePortfolioOverlays } from "../Layouts/PortfolioOverlayScope";
import styles from "./SceneCustomization.module.css";

const labels = {
  count: "Density",
  speed: "Speed",
  size: "Size",
  connectionsPerParticle: "Connections per particle",
  connectionDistance: "Connection distance",
} as const;
const values = (key: keyof ParticleConfig, value: number) =>
  key === "count"
    ? `${value} particles`
    : key === "connectionsPerParticle"
      ? `${value} maximum`
      : `${value.toFixed(1)}×`;
function ParticleRange({
  name,
  value,
  change,
}: {
  name: keyof ParticleConfig;
  value: number;
  change(value: number): void;
}) {
  const setting = PARTICLE_SETTINGS.controls[name];
  const help =
    name === "count"
      ? `Number of particles: ${setting.min}–${setting.max}.`
      : name === "connectionsPerParticle"
        ? "Maximum connections at either end of a line. Closest pairs take priority; nearby particles may have fewer."
        : name === "connectionDistance"
          ? "Multiplier on the density-based connection distance. At high settings, rendering limits may shorten the range to keep the page responsive."
          : name === "speed"
            ? "Multiplier on particle velocity. Speed applies when animation can run; a still does not move."
            : `Multiplier on particle radius: ${Number((PARTICLE_SETTINGS.particles.radiusCssPx[0] * value).toFixed(2))}–${Number((PARTICLE_SETTINGS.particles.radiusCssPx[1] * value).toFixed(2))} CSS pixels at this size.`;
  const field = useField({ help });
  return (
    <FieldFrame label={labels[name]} help={help} field={field}>
      <output htmlFor={field.id}>{values(name, value)}</output>
      <input
        id={field.id}
        type="range"
        className={`${fields.control} ${styles.range}`}
        min={setting.min}
        max={setting.max}
        step={setting.step}
        value={value}
        aria-valuetext={values(name, value)}
        aria-describedby={field.describedBy}
        onChange={(event) => change(event.currentTarget.valueAsNumber)}
      />
    </FieldFrame>
  );
}

/** Details-only input surface. No scene store, renderer or preference authority. */
export default function SceneCustomization({
  scene,
  snapshot,
  statusMessage,
  overlayTransparent,
  onOverlayTransparentChange,
}: {
  scene: ParticleSceneHandle;
  snapshot: ParticleSceneSnapshot;
  statusMessage: string;
  overlayTransparent: boolean;
  onOverlayTransparentChange(value: boolean): void;
}) {
  const overlays = usePortfolioOverlays();
  const { navigationHandoff } = useServices();
  const trigger = useRef<HTMLButtonElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState("");
  const open = overlays?.owner === "customization" && overlays.open;
  const close = overlays?.close;
  const released = overlays?.released;
  const fallback = useMemo(
    () => ({
      get current() {
        return navigationHandoff.fallbackTarget();
      },
    }),
    [navigationHandoff],
  );
  useLayoutEffect(() => {
    if (!open) released?.("customization");
  }, [open, released, overlays?.owner]);
  const apply = (input: unknown) => {
    try {
      scene.configure(input);
      setError("");
    } catch {
      setError(
        "That value is unavailable. The previous settings are unchanged.",
      );
    }
  };
  const dismiss = () => close?.("customization");
  return (
    <>
      <Button
        ref={trigger}
        variant="outlined"
        icon={<Icon name="playground" size={24} />}
        aria-label="Customize animation"
        aria-haspopup="dialog"
        aria-expanded={Boolean(open)}
        disabled={!overlays?.navigationReady || unavailable}
        onClick={() => {
          setError("");
          if (!overlays?.request("customization")) setUnavailable(true);
        }}
      >
        Customize
      </Button>
      <InlineStatus
        className={styles.triggerStatus}
        message={
          unavailable
            ? "Customization is unavailable. The animation page and navigation remain usable."
            : !overlays?.navigationReady
              ? "Customization will be available when navigation is ready."
              : ""
        }
      />
      <Dialog
        open={Boolean(open)}
        className={styles.dialog}
        title="Customize animation"
        onCloseRequest={dismiss}
        closeDispositionRef={overlays?.closeDispositionRef}
        unmountDisposition="navigation"
        scrollLock="document-overflow"
        returnFocusRef={trigger}
        fallbackFocusRef={fallback}
        onReleased={() => released?.("customization")}
        onOpenError={() => {
          close?.("customization");
          setUnavailable(true);
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            try {
              scene.configure(DEFAULT_PARTICLE_CONFIG);
              scene.reset();
              onOverlayTransparentChange(false);
              setError("");
            } catch {
              setError(
                "Reset is unavailable. Your motion preference and local Pause are unchanged.",
              );
            }
          }}
        >
          Reset animation
        </Button>
        <Button
          variant="outlined"
          role="switch"
          aria-checked={overlayTransparent}
          aria-label="Transparent WEB overlay"
          onClick={() => onOverlayTransparentChange(!overlayTransparent)}
        >
          Transparent WEB overlay: {overlayTransparent ? "On" : "Off"}
        </Button>
        <p>
          Adjust Aperture - 1 for this visit. Closing keeps your settings;
          reloading restores defaults. Reset keeps Pause, theme and motion
          settings. Transparent overlay shows the full particle field when
          Canvas is ready. The scene stays still while this dialog is open.
        </p>
        <p>
          {statusMessage}{" "}
          {snapshot.locallyPaused ? "Your local Pause is retained." : ""}
        </p>
        {(
          [
            "count",
            "speed",
            "size",
            "connectionsPerParticle",
            "connectionDistance",
          ] as const
        ).map((name) => (
          <ParticleRange
            key={name}
            name={name}
            value={snapshot.config[name]}
            change={(value) => apply({ ...snapshot.config, [name]: value })}
          />
        ))}
        <InlineStatus message={error} />
      </Dialog>
    </>
  );
}
