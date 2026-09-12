import type { MovementInputPort } from "../../domain/MovementInputPort.js";
import type { JoystickRenderSnapshot } from "../../domain/GamePresentationPort.js";
import { ARENA } from "../../domain/arena/Arena.js";
import {
  createMovementIntent,
  ZERO_MOVEMENT_INTENT,
  type MovementIntent,
} from "../../domain/movement/MovementIntent.js";
import { VIRTUAL_JOYSTICK_GEOMETRY } from "./VirtualJoystickConfig.js";

interface ClientJoystickGeometry {
  readonly centerClientX: number;
  readonly centerClientY: number;
  readonly logicalUnitsPerCssPixelX: number;
  readonly logicalUnitsPerCssPixelY: number;
  readonly rectLeft: number;
  readonly rectTop: number;
}

export type VirtualJoystickPresentationSnapshot = JoystickRenderSnapshot;

/** Canvas-owned Pointer Events adapter for one fixed virtual joystick. */
export class BrowserVirtualJoystickInput implements MovementInputPort {
  private activePointerId: number | null = null;
  private destroyed = false;
  private readonly didModifyTouchAction: boolean;
  private movementIntent: MovementIntent = ZERO_MOVEMENT_INTENT;
  private knobOffsetLogicalX = 0;
  private knobOffsetLogicalY = 0;
  private presentationSnapshot: JoystickRenderSnapshot | null = null;
  private readonly previousTouchAction: string;
  private resizeObserver: ResizeObserver | null = null;
  private surface: HTMLCanvasElement | null;

  constructor(surface: HTMLCanvasElement) {
    this.surface = surface;
    this.previousTouchAction = surface.style.touchAction;
    this.didModifyTouchAction = this.previousTouchAction !== "none";

    if (this.didModifyTouchAction) {
      surface.style.touchAction = "none";
    }

    surface.addEventListener("pointerdown", this.handlePointerDown);
    surface.addEventListener("pointermove", this.handlePointerMove);
    surface.addEventListener("pointerup", this.handlePointerUp);
    surface.addEventListener("pointercancel", this.handlePointerCancel);
    surface.addEventListener(
      "lostpointercapture",
      this.handleLostPointerCapture,
    );
    this.refreshPresentationSnapshot();
    this.observeResize(surface);
  }

  readMovementIntent(): MovementIntent {
    return this.destroyed ? ZERO_MOVEMENT_INTENT : this.movementIntent;
  }

  readPresentationSnapshot(): VirtualJoystickPresentationSnapshot | null {
    return this.destroyed ? null : this.presentationSnapshot;
  }

  reset(): void {
    this.endGesture(true);
  }

  destroy(): void {
    if (this.destroyed) return;

    this.destroyed = true;
    this.reset();
    this.surface?.removeEventListener("pointerdown", this.handlePointerDown);
    this.surface?.removeEventListener("pointermove", this.handlePointerMove);
    this.surface?.removeEventListener("pointerup", this.handlePointerUp);
    this.surface?.removeEventListener(
      "pointercancel",
      this.handlePointerCancel,
    );
    this.surface?.removeEventListener(
      "lostpointercapture",
      this.handleLostPointerCapture,
    );
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.surface && this.didModifyTouchAction) {
      this.surface.style.touchAction = this.previousTouchAction;
    }

    this.presentationSnapshot = null;
    this.surface = null;
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (
      this.destroyed ||
      this.activePointerId !== null ||
      !event.isPrimary ||
      event.button !== 0 ||
      !Number.isFinite(event.clientX) ||
      !Number.isFinite(event.clientY)
    ) {
      return;
    }

    const geometry = this.readClientGeometry();
    const surface = this.surface;
    if (!geometry || !surface) return;

    const displacementX = event.clientX - geometry.centerClientX;
    const displacementY = event.clientY - geometry.centerClientY;
    if (
      Math.hypot(displacementX, displacementY) >
      VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels
    ) {
      return;
    }

    try {
      surface.setPointerCapture(event.pointerId);
    } catch {
      return;
    }

    event.preventDefault();
    this.activePointerId = event.pointerId;
    this.updateGesture(event.clientX, event.clientY, geometry);
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (this.destroyed || event.pointerId !== this.activePointerId) return;

    event.preventDefault();
    this.updateGesture(event.clientX, event.clientY);
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    if (this.destroyed || event.pointerId !== this.activePointerId) return;

    event.preventDefault();
    this.endGesture(true);
  };

  private readonly handlePointerCancel = (event: PointerEvent): void => {
    if (this.destroyed || event.pointerId !== this.activePointerId) return;

    event.preventDefault();
    this.endGesture(true);
  };

  private readonly handleLostPointerCapture = (event: PointerEvent): void => {
    if (this.destroyed || event.pointerId !== this.activePointerId) return;

    this.endGesture(false);
  };

  private updateGesture(
    clientX: number,
    clientY: number,
    geometry = this.readClientGeometry(),
  ): void {
    if (!geometry || !Number.isFinite(clientX) || !Number.isFinite(clientY)) {
      this.setNeutralGesture();
      this.presentationSnapshot = null;
      return;
    }

    const displacementX =
      (clientX - geometry.centerClientX) * geometry.logicalUnitsPerCssPixelX;
    const displacementY =
      (clientY - geometry.centerClientY) * geometry.logicalUnitsPerCssPixelY;
    const distance = Math.hypot(displacementX, displacementY);
    if (!Number.isFinite(distance) || distance === 0) {
      this.setNeutralGesture();
      this.updatePresentationSnapshot(geometry);
      return;
    }

    const logicalRadiusScale = Math.min(
      geometry.logicalUnitsPerCssPixelX,
      geometry.logicalUnitsPerCssPixelY,
    );
    const baseRadius =
      VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels * logicalRadiusScale;
    const clampedDistance = Math.min(distance, baseRadius);
    const directionX = displacementX / distance;
    const directionY = displacementY / distance;
    this.knobOffsetLogicalX = directionX * clampedDistance;
    this.knobOffsetLogicalY = directionY * clampedDistance;

    const deadZoneRadius = baseRadius * VIRTUAL_JOYSTICK_GEOMETRY.deadZoneRatio;
    if (distance <= deadZoneRadius) {
      this.movementIntent = ZERO_MOVEMENT_INTENT;
      this.updatePresentationSnapshot(geometry);
      return;
    }

    const analogMagnitude = Math.min(
      1,
      (distance - deadZoneRadius) / (baseRadius - deadZoneRadius),
    );
    this.movementIntent = createMovementIntent(
      directionX * analogMagnitude,
      directionY * analogMagnitude,
    );
    this.updatePresentationSnapshot(geometry);
  }

  private endGesture(releaseCapture: boolean): void {
    const pointerId = this.activePointerId;
    this.activePointerId = null;
    this.setNeutralGesture();
    this.refreshPresentationSnapshot();

    if (
      releaseCapture &&
      pointerId !== null &&
      this.surface?.hasPointerCapture(pointerId)
    ) {
      try {
        this.surface.releasePointerCapture(pointerId);
      } catch {
        // The browser may already have released capture during interruption.
      }
    }
  }

  private setNeutralGesture(): void {
    this.movementIntent = ZERO_MOVEMENT_INTENT;
    this.knobOffsetLogicalX = 0;
    this.knobOffsetLogicalY = 0;
  }

  private updatePresentationSnapshot(geometry: ClientJoystickGeometry): void {
    const logicalRadiusScale = Math.min(
      geometry.logicalUnitsPerCssPixelX,
      geometry.logicalUnitsPerCssPixelY,
    );
    const centerX =
      (geometry.centerClientX - geometry.rectLeft) *
      geometry.logicalUnitsPerCssPixelX;
    const centerY =
      (geometry.centerClientY - geometry.rectTop) *
      geometry.logicalUnitsPerCssPixelY;

    this.presentationSnapshot = {
      active: this.activePointerId !== null,
      centerX,
      centerY,
      baseRadius:
        VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels * logicalRadiusScale,
      knobX: centerX + this.knobOffsetLogicalX,
      knobY: centerY + this.knobOffsetLogicalY,
      knobRadius:
        VIRTUAL_JOYSTICK_GEOMETRY.knobRadiusCssPixels * logicalRadiusScale,
    };
  }

  private refreshPresentationSnapshot(): void {
    if (this.destroyed) return;

    const geometry = this.readClientGeometry();
    if (geometry) {
      this.updatePresentationSnapshot(geometry);
    } else {
      this.presentationSnapshot = null;
    }
  }

  private observeResize(surface: HTMLCanvasElement): void {
    if (typeof ResizeObserver === "undefined") return;

    this.resizeObserver = new ResizeObserver(() => {
      this.refreshPresentationSnapshot();
    });
    this.resizeObserver.observe(surface);
  }

  private readClientGeometry(): ClientJoystickGeometry | null {
    if (!this.surface) return null;

    const rect = this.surface.getBoundingClientRect();
    if (
      !Number.isFinite(rect.left) ||
      !Number.isFinite(rect.top) ||
      !Number.isFinite(rect.width) ||
      !Number.isFinite(rect.height) ||
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return null;
    }

    const centerOffset =
      VIRTUAL_JOYSTICK_GEOMETRY.safeInsetCssPixels +
      VIRTUAL_JOYSTICK_GEOMETRY.baseRadiusCssPixels;
    const centerClientX = rect.left + centerOffset;
    const centerClientY = rect.top + rect.height - centerOffset;
    const logicalUnitsPerCssPixelX = ARENA.width / rect.width;
    const logicalUnitsPerCssPixelY = ARENA.height / rect.height;
    if (
      !Number.isFinite(centerClientX) ||
      !Number.isFinite(centerClientY) ||
      !Number.isFinite(logicalUnitsPerCssPixelX) ||
      !Number.isFinite(logicalUnitsPerCssPixelY)
    ) {
      return null;
    }

    return {
      centerClientX,
      centerClientY,
      logicalUnitsPerCssPixelX,
      logicalUnitsPerCssPixelY,
      rectLeft: rect.left,
      rectTop: rect.top,
    };
  }
}
