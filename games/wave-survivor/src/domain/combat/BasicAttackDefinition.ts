/** Gameplay values required by the Gate 1 automatic projectile attack. */
export interface BasicAttackDefinition {
  readonly cooldownSeconds: number;
  readonly projectileSpeedUnitsPerSecond: number;
  readonly projectileDamage: number;
  readonly projectileCollisionRadius: number;
  readonly projectileLifetimeSeconds: number;
  readonly projectileDespawnMargin: number;
}

function assertFinitePositive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and positive.`);
  }
}

function assertFiniteNonNegative(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${name} must be finite and non-negative.`);
  }
}

/** Validate and freeze one basic attack definition. */
export function createBasicAttackDefinition(
  definition: BasicAttackDefinition,
): Readonly<BasicAttackDefinition> {
  assertFinitePositive(definition.cooldownSeconds, "Attack cooldown");
  assertFinitePositive(
    definition.projectileSpeedUnitsPerSecond,
    "Projectile speed",
  );
  assertFinitePositive(definition.projectileDamage, "Projectile damage");
  assertFinitePositive(
    definition.projectileCollisionRadius,
    "Projectile collision radius",
  );
  assertFinitePositive(
    definition.projectileLifetimeSeconds,
    "Projectile lifetime",
  );
  assertFiniteNonNegative(
    definition.projectileDespawnMargin,
    "Projectile despawn margin",
  );

  return Object.freeze({ ...definition });
}

/** Provisional Gate 1 tuning for the automatic projectile attack. */
export const BASIC_ATTACK_DEFINITION = createBasicAttackDefinition({
  cooldownSeconds: 0.9,
  projectileSpeedUnitsPerSecond: 320,
  projectileDamage: 1,
  projectileCollisionRadius: 4,
  projectileLifetimeSeconds: 2.5,
  projectileDespawnMargin: 32,
});
