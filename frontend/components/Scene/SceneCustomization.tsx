"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  count: "Particles",
  speed: "Speed",
  size: "Size",
  connectionsPerParticle: "Links",
  connectionDistance: "Reach",
} as const;
const values = (key: keyof ParticleConfig, value: number) =>
  key === "count"
    ? String(value)
    : key === "connectionsPerParticle"
      ? `${value} max`
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
      ? `${setting.min}–${setting.max} dots.`
      : name === "speed"
        ? "Move dots faster or slower."
        : name === "size"
          ? `Dot width: ${PARTICLE_SETTINGS.particles.radiusCssPx.map((radius) => Number((radius * value * 2).toFixed(2))).join("–")} px.`
          : name === "connectionsPerParticle"
            ? "Maximum lines per dot."
            : "Higher values connect dots farther apart.";
  const field = useField({ help });
  const valueText =
    name === "count"
      ? `${value} particles`
      : name === "connectionsPerParticle"
        ? `${value} links per particle maximum`
        : `${value.toFixed(1)} times ${name === "connectionDistance" ? "connection reach" : name}`;
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
        aria-valuetext={valueText}
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
  const fullFieldHintId = useId();
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
  const compactStatus =
    snapshot.status === "failed" || snapshot.paletteUnavailable
      ? "Unavailable"
      : snapshot.locallyPaused
        ? "Paused"
        : snapshot.presentation === "complete-static" ||
            snapshot.reducedMotion ||
            snapshot.blockers.includes("preference-off")
          ? "Still artwork"
          : "Scene paused";
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
        <div className={styles.toolbar}>
          <Button
            variant="outlined"
            aria-label="Reset animation"
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
            Reset
          </Button>
          <div className={styles.toggle}>
            <Button
              variant="outlined"
              role="switch"
              aria-checked={overlayTransparent}
              aria-label="Full field"
              aria-describedby={fullFieldHintId}
              onClick={() => onOverlayTransparentChange(!overlayTransparent)}
            >
              Full field: {overlayTransparent ? "On" : "Off"}
            </Button>
            <p id={fullFieldHintId} className={styles.hint}>
              Show beyond the WEB letters.
            </p>
          </div>
        </div>
        <p className={styles.status} role="status">
          <span aria-hidden="true">{compactStatus}</span>
          <span className="sr-only">
            {statusMessage}{" "}
            {snapshot.locallyPaused ? "Your local Pause is retained." : ""}
          </span>
        </p>
        <div className={styles.settings}>
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
        </div>
        <InlineStatus message={error} />
      </Dialog>
    </>
  );
}
