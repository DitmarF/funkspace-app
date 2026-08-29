/** Stable enemy kinds supported by the current gameplay slice. */
export type EnemyKind = "basic";

/** Renderer-independent gameplay properties shared by enemies of one kind. */
export interface EnemyDefinition {
  readonly kind: EnemyKind;
  readonly collisionRadius: number;
  readonly movementSpeedUnitsPerSecond: number;
  readonly maximumHealth: number;
  readonly contactDamage: number;
}

/** Provisional Gate 1 tuning for the basic pursuing enemy. */
export const BASIC_ENEMY_DEFINITION: Readonly<EnemyDefinition> = Object.freeze({
  kind: "basic",
  collisionRadius: 12,
  movementSpeedUnitsPerSecond: 72,
  maximumHealth: 1,
  contactDamage: 1,
});
