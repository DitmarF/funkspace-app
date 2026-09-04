import type { RandomSource } from "../RandomSource.js";
import {
  getUpgradeDefinition,
  INITIAL_UPGRADE_DEFINITIONS,
  type UpgradeDefinition,
  type UpgradeId,
} from "./UpgradeDefinition.js";
import { isUpgradeEligible, type RunUpgradeState } from "./RunUpgradeState.js";

function isCanonicalUpgradeDefinition(
  definition: unknown,
): definition is Readonly<UpgradeDefinition> {
  if (
    typeof definition !== "object" ||
    definition === null ||
    !("id" in definition) ||
    typeof definition.id !== "string"
  ) {
    return false;
  }

  return getUpgradeDefinition(definition.id) === definition;
}

/**
 * Select immutable, non-duplicate upgrade IDs from a stable eligibility order.
 *
 * Definitions are normalized through the canonical initial order before a
 * bounded partial Fisher-Yates shuffle, so caller collection order cannot
 * affect deterministic results.
 */
export function generateUpgradeOptionIds(
  definitions: readonly Readonly<UpgradeDefinition>[],
  state: Readonly<RunUpgradeState>,
  requestedOptionCount: number,
  randomSource: RandomSource,
): readonly UpgradeId[] {
  if (!Number.isSafeInteger(requestedOptionCount) || requestedOptionCount < 0) {
    throw new RangeError(
      "Requested upgrade option count must be a non-negative safe integer.",
    );
  }

  const supportedIds = new Set<UpgradeId>();
  for (const definition of definitions) {
    if (isCanonicalUpgradeDefinition(definition)) {
      supportedIds.add(definition.id);
    }
  }

  const eligibleIds = INITIAL_UPGRADE_DEFINITIONS.filter(
    (definition) =>
      supportedIds.has(definition.id) &&
      isUpgradeEligible(definition.id, state),
  ).map((definition) => definition.id);
  const selectedCount = Math.min(requestedOptionCount, eligibleIds.length);

  for (let index = 0; index < selectedCount; index += 1) {
    const remainingCount = eligibleIds.length - index;
    if (remainingCount <= 1) break;

    const selectedIndex = Math.floor(
      randomSource.nextFloat(index, eligibleIds.length),
    );
    const currentId = eligibleIds[index]!;
    eligibleIds[index] = eligibleIds[selectedIndex]!;
    eligibleIds[selectedIndex] = currentId;
  }

  return Object.freeze(eligibleIds.slice(0, selectedCount));
}
