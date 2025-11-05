/**
 * Manifest loader for animation timelines
 * Resolves selectors, validates manifest structure, and provides warnings
 */

import type { AnimationManifest, AnimationStep } from "./types";

export interface ManifestValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * Resolve a selector within an SVG root element
 * @param root SVG root element
 * @param selector CSS selector (e.g., '#logo-path-1')
 * @returns Found element or null
 */
export function resolveSelector(
  root: SVGSVGElement,
  selector: string,
): SVGElement | null {
  try {
    return root.querySelector(selector);
  } catch (error) {
    // Only warn in development to avoid console noise in production
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Manifest] Invalid selector "${selector}":`, error);
    }
    return null;
  }
}

/**
 * Validate a single animation step
 * @param step Animation step to validate
 * @param index Step index in manifest
 * @param root SVG root element for selector resolution
 * @returns Validation result
 */
function validateStep(
  step: AnimationStep,
  index: number,
  root: SVGSVGElement,
): ManifestValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Validate target selector
  if (!step.target || typeof step.target !== "string") {
    errors.push(`Step ${index}: target is required and must be a string`);
  } else if (!step.target.startsWith("#")) {
    warnings.push(
      `Step ${index}: target "${step.target}" should start with # for ID selector`,
    );
  } else {
    const element = resolveSelector(root, step.target);
    if (!element) {
      errors.push(
        `Step ${index}: target "${step.target}" not found in SVG root`,
      );
    }
  }

  // Validate property
  if (
    !step.property ||
    !["strokeDashoffset", "opacity"].includes(step.property)
  ) {
    errors.push(
      `Step ${index}: property must be "strokeDashoffset" or "opacity"`,
    );
  }

  // Validate from/to
  if (typeof step.from !== "number" || isNaN(step.from)) {
    errors.push(`Step ${index}: from must be a valid number`);
  }
  if (typeof step.to !== "number" || isNaN(step.to)) {
    errors.push(`Step ${index}: to must be a valid number`);
  }

  // Validate duration
  if (typeof step.duration !== "number" || step.duration < 0) {
    errors.push(`Step ${index}: duration must be a non-negative number`);
  }

  // Validate delay (optional)
  if (step.delay !== undefined) {
    if (typeof step.delay !== "number" || step.delay < 0) {
      errors.push(`Step ${index}: delay must be a non-negative number`);
    }
  }

  // Validate easing (optional)
  if (step.easing !== undefined) {
    const validEasings = ["standard", "emph", "linear"];
    const isCubicBezier =
      typeof step.easing === "string" &&
      step.easing.startsWith("cubic-bezier(");
    if (!validEasings.includes(step.easing) && !isCubicBezier) {
      warnings.push(
        `Step ${index}: easing "${step.easing}" may not be recognized`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Validate an animation manifest
 * @param manifest Animation manifest to validate
 * @param root SVG root element for selector resolution
 * @returns Validation result with warnings and errors
 */
export function validateManifest(
  manifest: AnimationManifest,
  root: SVGSVGElement,
): ManifestValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Validate manifest structure
  if (!manifest) {
    errors.push("Manifest is required");
    return { valid: false, warnings, errors };
  }

  if (!Array.isArray(manifest.steps)) {
    errors.push("Manifest.steps must be an array");
    return { valid: false, warnings, errors };
  }

  if (manifest.steps.length === 0) {
    warnings.push("Manifest has no steps");
  }

  // Validate each step
  manifest.steps.forEach((step, index) => {
    const stepResult = validateStep(step, index, root);
    warnings.push(...stepResult.warnings);
    errors.push(...stepResult.errors);
  });

  // Log warnings and errors (only in development)
  if (process.env.NODE_ENV === "development") {
    if (warnings.length > 0) {
      console.warn("[Manifest] Validation warnings:", warnings);
    }
    if (errors.length > 0) {
      console.error("[Manifest] Validation errors:", errors);
    }
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Load and validate a manifest, resolving all selectors
 * @param manifest Animation manifest
 * @param root SVG root element
 * @returns Validated manifest with resolved elements
 */
export function loadManifest(
  manifest: AnimationManifest,
  root: SVGSVGElement,
): {
  manifest: AnimationManifest;
  validation: ManifestValidationResult;
  resolvedElements: Map<string, SVGElement | null>;
} {
  const validation = validateManifest(manifest, root);
  const resolvedElements = new Map<string, SVGElement | null>();

  // Resolve all selectors
  manifest.steps.forEach((step) => {
    if (!resolvedElements.has(step.target)) {
      const element = resolveSelector(root, step.target);
      resolvedElements.set(step.target, element);
    }
  });

  return {
    manifest,
    validation,
    resolvedElements,
  };
}
