# FS-3.4 — Proposed decorative-motion policy contract

## Status, authority and inspected base — 2026-09-27

**Status: PROPOSED — documentation only.** Codex is the contract author. Sites
is the consuming-API reviewer; Dimi approves product semantics. Neither review
nor approval has occurred for this proposal. The user explicitly requested
that Sites' read-only review not start yet. No policy implementation, production
Motion controls or playback enablement is authorized by this document.

Repository: `DitmarF/funkspace-app`; branch `feature/funkspace-minimum-usable`;
clean starting HEAD `3fca725459825644fe9286594c98e94644bc10e4`. This is the accepted
FS-3.3 service/provider base, following accepted FS-3.1/3.2 navigation. Preserve
ThemeService's live-state correction and the pre-hydration bootstrap unchanged.
Historical SHAs are evidence, never reset targets.

Dependencies are satisfied as recorded in [FS-0.5](fs-0.5-product-and-technical-decisions.md)
and [FS-2.6](fs-2.6-semantics-metadata-and-static-routes.md). FS-G0 and prior
task acceptance do not approve this new service. Root AGENTS, AI workflow,
task template, authoritative feature plan, architecture/ADR boundaries and
`/Users/dimi/Downloads/FunkSpace_EPIC_3_Detailed_Plan.md` section 4, FS-3.4/3.5
and M1–M6 / L1–L3 informed this proposal. No inaccessible document is assumed available.

### Actual reuse findings

| Inspected source                                                                         | Actual behavior and consequence                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application/animations/AnimationService.ts`                                             | Exposes `getOrchestrator()` only; no settings, storage or visibility authority. Keep it as the manifest/rendering orchestration entry point.                                                                                                            |
| `AnimationOrchestrator.ts`, `domain/ports/AnimationPort.ts`                              | Existing logo manifest builder and SVG/token measurements. Reuse; do not add another manifest builder. Existing DOM-typed legacy boundaries are not a model for the new pure policy.                                                                    |
| `application/providers/ServiceProvider.tsx`, `infrastructure/services/createServices.ts` | One service tree per provider, created without active listeners; effect currently initializes/cleans up theme and navigation. Extend this composition, not the provider stack.                                                                          |
| `domain/ports/StoragePort.ts`, `infrastructure/storage/LocalStorageAdapter.ts`           | Synchronous reads/writes; adapter handles denied access and returns null/no-op. Write success is not reported. Reuse unchanged, with no “saved” indicator.                                                                                              |
| `domain/ports/DOMPort.ts`, `infrastructure/dom/DOMAdapter.ts`                            | Browser-typed media query access, no plain environment subscription or document visibility contract. Use a narrow new value-only port instead of leaking MediaQueryList into policy.                                                                    |
| `hooks/useReducedMotion.ts`                                                              | Starts false, reads/subscribes in an effect, falls back to true on missing/blocked query invocation. Not a readiness-aware authority; cannot supply the new server/client initial snapshot. Other legacy consumers remain outside this task.            |
| `utils/motion.ts`, `app/globals.css`                                                     | CSS duration/easing helpers and a system-motion guard. Preserve defensive guards; they cannot override a denied shared policy or become a second stored preference. No blanket game animation reset.                                                    |
| `components/Layouts/MotionChoices.tsx`                                                   | Fixture-only controlled `value: "system" \| "reduced" \| "off"`, `onChange`; existing outlined pressed buttons. Reuse in FS-3.5; do not add fake production controls now.                                                                               |
| `LogoMotion.tsx`, tests/stories, `FunkSpaceLogoInline.tsx`                               | Existing complete geometry/unique IDs, imperative API and static reset. Logo directly constructs timeline/SVG effects and independently uses reduced-motion hook; its effect can rebuild on permission changes. FS-3.5 owns bounded consumer migration. |
| `infrastructure/motion/timeline.ts`, `common/motion/AnimationRuntime.ts`                 | Existing local timeline clock and pure lifecycle vocabulary. Constructor does not start frames; `seek` renders, `play` resumes, `reverse` toggles direction. Policy must not call their clocks or add a global scheduler.                               |
| `sections/Start.tsx`, `Layouts/PortfolioShell.tsx`                                       | Both explicitly use `enabled={false}`, `autoPlay={false}`. Keep static during FS-3.4. FS-3.5 separately nominates an animated instance.                                                                                                                 |
| `app/sandbox/logo-animation/page.tsx`                                                    | Shipped route passes `enabled={true}`; it is not Storybook just because its name is sandbox. FS-3.5 must remove/restrict this production flag bypass. No change now.                                                                                    |
| Game host/theme adapter, scene placeholder                                               | Game owns its own lifecycle; there is no integrated portfolio scene runtime to accept. Fake consumers below prove policy only, never Canvas/playback performance.                                                                                       |

## Product semantics proposed for Dimi

| Stored value | Label         | Meaning / proposed help text                                                                                                |
| ------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `system`     | Follow system | Permit decorative motion only with known OS no-preference and every other gate open. “Use your device's motion preference.” |
| `reduced`    | Reduced       | Complete static logo/scene; no invented slower particle mode. “Keep decorative scenes and the logo still.”                  |
| `off`        | Off           | No decorative animation; retain content/controls/artwork. “Turn off decorative animation.”                                  |

Reduced and Off intentionally have the same static result for current consumers,
while retaining distinct stored intent. Future limited Reduced transitions need
a separate reviewed use case. Neither setting stops gameplay or instantaneous
focus, selection, validation or error feedback.

Default: Follow system. Before readiness, always complete static output.
Missing/invalid/denied storage uses that default; unavailable system capability
settles **ready + static**, not endless pending and not permission to animate.
Document visibility failure is treated conservatively as not visible.

## Minimal typed surface (proposal, not executable implementation)

These are proposed exported signatures and values. Types belong in the pure
frontend domain; the authority belongs in Application. No DOM/React/clock
types enter them. There is no settings registry or collection of runtimes.

```ts
type MotionPreference = "system" | "reduced" | "off";
const MOTION_PREFERENCE_KEY = "funkspace.motion.preference.v1";
// Single validator and metadata list accompany this union/key.
declare function isMotionPreference(value: unknown): value is MotionPreference;

type SystemMotion = "reduce" | "no-preference" | "unavailable";
type MotionEnvironment = Readonly<{
  systemMotion: SystemMotion;
  documentVisible: boolean;
}>;

interface MotionEnvironmentPort {
  observe(onChange: (value: MotionEnvironment) => void): {
    current: MotionEnvironment;
    unsubscribe(): void;
  };
}

type MotionSnapshot = Readonly<{
  status: "pending" | "ready" | "disposed";
  preference: MotionPreference;
  systemMotion: SystemMotion | "unknown";
  documentVisible: boolean;
}>;

interface MotionPolicyService {
  getSnapshot(): MotionSnapshot;
  subscribe(listener: (snapshot: MotionSnapshot) => void): () => void;
  setPreference(value: MotionPreference): void;
  initialize(): () => void; // provider-owned, restartable activation
  dispose(): void; // terminal for explicit non-React owners/tests
}

type MotionPolicyConsumer = Pick<
  MotionPolicyService,
  "getSnapshot" | "subscribe" | "setPreference"
>;

type ConsumerMotionInputs = Readonly<{
  featureAvailable: boolean;
  optedIn: boolean;
  visible: boolean;
  locallyPaused: boolean;
  runtime: "unprepared" | "preparing" | "ready" | "failed" | "disposed";
}>;

type MotionBlocker =
  | "policy-pending"
  | "policy-disposed"
  | "feature-unavailable"
  | "opted-out"
  | "preference-reduced"
  | "preference-off"
  | "system-reduce"
  | "system-unknown"
  | "system-unavailable"
  | "document-hidden"
  | "consumer-hidden"
  | "local-pause"
  | "runtime-not-ready"
  | "runtime-failed"
  | "runtime-disposed";

type MotionPermission = Readonly<{
  mayPrepare: boolean;
  mayRun: boolean;
  presentation: "complete-static" | "hold-frame" | "motion-permitted";
  blockers: readonly MotionBlocker[];
}>;

declare function resolveMotionPermission(
  snapshot: MotionSnapshot,
  consumer: ConsumerMotionInputs,
): MotionPermission;
```

`blockers` contains **all** active reasons in the union's documented order, not
only the first failure. These reasons explain blocked advancement, so
`runtime-not-ready` can coexist with `mayPrepare: true`. Reason order is explanatory, not authority to mutate
inputs. No `effectivePreference` replaces the user's selection. No timestamps,
progress, play count, theme or consumer IDs live in the service snapshot.

The provider's internal service bundle owns the full lifecycle interface;
`useServices()` exposes only `MotionPolicyConsumer` for this property. This is
TypeScript narrowing of the same instance, not another wrapper/provider or
authority. Consumer cleanup can unsubscribe but cannot call initialize/dispose
through its public context type. Add a compile-time consumer-surface check.

The storage key had no match in inspected tracked repository source before this
proposal; `theme` remains separate. Store one raw validated string, not a JSON
schema or environment state. No cross-tab/account synchronization, cookies or
migration framework. Ignore invalid stored data in favor of System; do not write
normalization on startup. Explicit valid updates alone attempt persistence.
Invalid setter input from untyped callers is rejected without state/write
effects (proposed `RangeError`); storage failures are nonfatal. State and
notifications commit independently of persistence; no save-success claim.

### Availability, setup and public consumption

Resolve the existing `NEXT_PUBLIC_ANIMATIONS_ENABLED === "true"` once in
composition as readonly `decorativeMotionAvailable`, exposed alongside
`motionPolicy` in the existing service context. This is availability, not a
user preference or readiness bit. False blocks every production consumer.
True merely opens this one gate; it never selects Follow system, clears Pause
or requests a replay. No environment/deployment setting changes are proposed.

Controlled Storybook/test composition may inject availability true for an
isolated fixture; the same policy and consumer gates still apply. A production
`enabled={true}` prop cannot override a false build flag. `enabled={false}` can
always force a copy static. FS-3.5 may preserve the current prop for controlled
fixtures via their explicit composition, with no new provider stack. Do not use
`NODE_ENV !== "production"` as an uncontrolled application bypass.

## Truth table and preparation without a circular dependency

Let `baseAllows` mean: policy ready, feature available, opted in, Follow system,
and known no-preference. Then:

```text
mayPrepare = baseAllows AND documentVisible AND consumerVisible
             AND NOT locallyPaused AND runtime == unprepared
mayRun     = baseAllows AND documentVisible AND consumerVisible
             AND NOT locallyPaused AND runtime == ready
```

The preparation gate allows allocation of an inert runtime while the artwork
stays complete. A constructor/manifest measurement is not permission to hide
strokes or render time zero. Only a successfully ready runtime plus actual
consumer playback intent may apply drawing setup and play. Preparation failure
rolls back owned visual/resource changes and settles failed/static. No automatic
failure loop; retry requires an explicit later consumer retry/remount contract.

| Condition (other independent inputs preserved)                          | Prepare / run                                  | Required presentation and behavior                                                                                                                                                           |
| ----------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SSR/hydration/initial pending; service disposed                         | Neither                                        | Complete static; no draw setup or timeline start. Unknown OS never grants permission.                                                                                                        |
| Feature unavailable or opted out                                        | Neither                                        | Complete static; keep selected preference and local Pause.                                                                                                                                   |
| Reduced or Off, regardless of OS                                        | Neither                                        | Complete static artwork, including every logo dot/letter.                                                                                                                                    |
| System + reduce, unknown or unavailable                                 | Neither                                        | Complete static. Unavailable resolves ready; unknown belongs to pending only.                                                                                                                |
| Base allows but runtime unprepared                                      | Prepare only if visible and not locally paused | Complete static until successful preparation.                                                                                                                                                |
| Runtime preparing, failed or disposed                                   | Neither                                        | Complete static; no eager hide. Failed/disposed never prepare implicitly.                                                                                                                    |
| Base allows, ready runtime, but local Pause or hidden document/consumer | Neither                                        | Hold meaningful static frame; stop scheduling, retain playback position and independent Pause. If a partial logo is not meaningful, render complete artwork while retaining the held cursor. |
| All gates open, ready runtime                                           | Run permitted                                  | Consumer decides whether work remains and whether autoplay/play intent exists. No automatic restart of completed work.                                                                       |
| Hard denial arrives during drawing                                      | Neither                                        | Stop first, restore complete artwork synchronously, invalidate pending setup. No frozen half-drawn identity under Reduced/Off.                                                               |

For `presentation`, any hard denial or non-ready runtime returns
`complete-static`; otherwise any visibility/Pause blocker returns `hold-frame`;
otherwise return `motion-permitted`. The resolver never starts/stops a runtime.
An opted-out consumer need not even allocate one. Hidden, paused and disallowed
conditions may coexist; returning visibility removes only that reason.

## Authority lifecycle and initialization ordering

1. **Construction:** no browser access, storage read, listener, timer or write.
   Stable initial snapshot is `{status: "pending", preference: "system",
systemMotion: "unknown", documentVisible: false}` on server and first client
   render. `getSnapshot()` returns the same immutable object until a field
   changes. No theme-style pre-hydration motion script is added.
2. **Subscribe:** immediately deliver the current snapshot, including pending.
   Return idempotent unsubscribe; notifications use a listener snapshot so
   unsubscribe during delivery is safe. No subscription starts a browser
   lifecycle. Publish only on value changes; an initial callback is not a
   change event. Nested preference updates must never deliver an older snapshot
   after a newer one; test reentrant delivery explicitly.
3. **Initialize:** provider is the single lifecycle owner. Mark a new activation
   generation; seed from storage only if no initial/live preference has been
   captured. Observe the environment, acquire its cleanup, then publish ready
   with a complete initial reading. Synchronous reads are sufficient for the
   actual ports: do not add a Promise, timeout, polling or async storage layer.
4. **Environment adapter:** install listeners before sampling their current
   values, return `current` plus cleanup, and deliver later events as plain
   snapshots. `observe` must not synchronously invoke its callback before it
   returns. Reuse modern media-query listeners with legacy add/removeListener
   fallback and `visibilitychange`. A missing/throwing query or failed media
   subscription yields `unavailable`; a failed visibility read/subscription
   yields false. Roll back partially acquired resources. Capability failures
   produce a ready conservative snapshot, not an unhandled error or pending
   forever. No DOM or media objects leave Infrastructure.
5. **Race protection:** keep activation generation separate from preference
   revision. A selection made before initialization wins over storage. If an
   injected read reenters with a newer selection, do not publish its older
   result. Each environment callback checks active generation/disposed state;
   stale callbacks from earlier activation cannot publish. Pending readiness
   never becomes ready merely because `setPreference` was called. Tests may
   defer calling initialize to exercise pending without inventing async ports.
6. **Repeated setup:** an initialize call while active returns the same
   idempotent release and does not reread storage or attach extra listeners.
   Release invalidates that generation before detaching. It changes readiness
   to pending and environment to unknown/not-visible, retaining the live
   preference and current subscriptions. Reinitialization starts one new
   generation and samples current environment; an old release cannot stop it.
7. **React replay:** the existing provider effect calls initialize and returns
   its release, alongside existing theme/navigation cleanup. It must **not**
   terminally dispose its memoized service in effect cleanup, because Strict
   Mode immediately reuses it. Children own their unsubscribes. Actual unmount
   releases external resources and lets the unreferenced instance be collected.
8. **Terminal disposal:** explicit non-React owners/tests can call `dispose()`:
   invalidate, detach, publish a static `disposed` snapshot, clear subscribers.
   Repeated dispose/release is safe. Later initialize/setPreference are inert;
   later subscribe may synchronously receive disposed but retains no listener.
   getSnapshot remains readable. Consumers cannot dispose a shared authority.

Failure to report persistence success does not require a new StoragePort. Use
the accepted LocalStorageAdapter unchanged; defensive storage-call failure
handling in the new service also permits hostile port tests. Lifecycle setup
must not leave listeners attached if acquisition fails. Catch capability/storage
failures narrowly, not arbitrary consumer/programming exceptions.

## Consumer state and complete logo API compatibility proposal

Each consumer owns `locallyPaused`, visibility, opt-in, runtime generation and
playback history (`not-started`, unfinished cursor/direction, completed).
They are not persisted or registered with the authority. Pause survives theme,
preference, flag, visibility and readiness changes for that live consumer.
Only explicit resume/play intent clears it; unmount ends that consumer lifetime.
EPIC 4 separately defines scene Reset/remount behavior. A scene fake may test
Pause, but does not choose a real renderer or its clock semantics.

Visibility observation is a consumer-owned browser adapter concern (FS-3.5 and
scene integration), never policy React code reading viewport APIs. No known
visibility starts as false; unavailable observation stays conservatively static
unless a reviewed consumer boundary can supply reliable visibility. Each
observer/runtime cleanup has its own generation; it cannot stop a newly mounted
consumer or the shared authority. No policy subscription owns RAFs.

The following covers every current LogoMotion public prop/ref. These are
FS-3.5 consuming obligations, not implemented changes or permission to broaden
FS-3.4. Sites must review compatibility before the consumer migration.

| Existing surface                                       | Proposed behavior at integration                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`, `aria-label`, forwarded inline-logo props | Preserve geometry, unique IDs and static accessibility semantics.                                                                                                                                                                                                                                          |
| `enabled`                                              | False forces static. Undefined uses approved build availability. True is not a production flag bypass; controlled fixtures use injected availability.                                                                                                                                                      |
| `autoPlay` (currently true by default)                 | Initial/requested playback intent, not permission and not local Pause. False stops automatic advancement; switching true cannot clear explicit Pause or replay completed work.                                                                                                                             |
| `speed`, `setSpeed(f)`                                 | Preserve permitted speed control without scheduling or clearing Pause. Validate/clamp using existing runtime semantics; no policy-owned speed.                                                                                                                                                             |
| `startAtMs`, `seek(ms)`                                | Preserve bounded seeking only with ready, permitted presentation; never draw partial artwork while hard-denied/pending. Seek while locally paused can scrub an already permitted prepared runtime without clearing Pause. Denied calls are no-ops, not deferred replay commands.                           |
| `pathCount`                                            | Existing value is clamped but does not filter the actual orchestrator steps. Do not silently invent a partial-logo API; preserve complete artwork. Resolve any deprecation separately in FS-3.5, without rebuilding the manifest.                                                                          |
| `play()`                                               | With hard gates open, explicit resume intent may clear local Pause; advancement still waits for runtime/visibility. While hard-denied/pending, it is a no-op including Pause/intent, and does not queue future play/replay. Environment handlers must never call this public intent method to clear Pause. |
| `pause()`                                              | Latch local Pause even if no runtime is ready yet; stop only that consumer.                                                                                                                                                                                                                                |
| `reverse()`                                            | Preserve direction-toggle behavior for permitted prepared runtime; does not clear Pause or auto-start a paused runtime. Hard-denied calls cannot reveal incomplete artwork.                                                                                                                                |
| `isReady()`                                            | Reports actual runtime readiness, not user/system permission. Callers must not use it as permission to bypass policy.                                                                                                                                                                                      |

Preparation/playback must be distinct from an environment notification. A
not-started opted-in logo may autoplay once when eligible. Hide/show can resume
only permitted unfinished work with playback intent; a completed introduction
stays completed. Recommended FS-3.5 behavior for hard denial mid-introduction:
restore complete artwork and mark that introduction consumed, so switching
Reduced/Off back to Follow system does not unexpectedly replay it. Intentional
replay requires an explicit allowed seek/start action. Theme changes do not
recreate the timeline or reset its history. Nominated instance and concrete
visual/replay acceptance remain Dimi's FS-3.5 checkpoint.

## Bounded usage examples (illustrative contracts only)

### Settings (FS-3.5)

```ts
// Inside an existing-provider consumer; not a second authority.
let state = motionPolicy.getSnapshot();
const unsubscribe = motionPolicy.subscribe((next) => {
  state = next;
  render();
});
// Adapt existing MotionChoices value/onChange, using shared domain metadata.
// While state.status !== "ready", render status/static choices as disabled.
const choose = (value: MotionPreference) => motionPolicy.setPreference(value);
// Selection is state.preference even when unavailable or OS-reduced.
// No direct storage read, separate default, flag control or "saved" claim.
// Unmount: unsubscribe(), never motionPolicy.dispose().
```

### Logo boundary (FS-3.5)

```ts
const permission = resolveMotionPermission(snapshot, {
  featureAvailable: decorativeMotionAvailable,
  optedIn: nominatedInstance && enabled !== false,
  visible: consumerVisible,
  locallyPaused,
  runtime: runtimeState,
});
// mayPrepare: acquire inert binding; leave the full SVG visible until ready.
// complete-static: stop, cancel stale setup, restore all artwork.
// hold-frame: suspend without changing local Pause/cursor/history.
// mayRun: resume only if playbackIntent && unfinished; never reset on a signal.
```

The narrow SVG binding/factory correction belongs to FS-3.5: move concrete
timeline/static-reset/visibility effects behind the existing application
composition boundary as needed, reusing the orchestrator and original SVG.
This proposal does not introduce a second SVG engine or pre-approve that port's
exact shape. Its implementation review must cover owned style restoration,
constructor/setup failure, imperative methods and stale runtime callbacks.

### Two fake consumers (FS-3.4 tests only)

```ts
const logo = { locallyPaused: true, visible: true, runtime: "ready" as const };
const scene = {
  locallyPaused: false,
  visible: true,
  runtime: "ready" as const,
};
const common = { featureAvailable: true, optedIn: true };
const logoPermission = resolveMotionPermission(readySystemAllows, {
  ...common,
  ...logo,
});
const scenePermission = resolveMotionPermission(readySystemAllows, {
  ...common,
  ...scene,
});
// logoPermission.mayRun === false; scenePermission.mayRun === true.
// Hide/show document, change theme/flags/preferences, return to allowed:
// logo stays explicitly paused; scene may resume only its own unfinished work.
```

No fake is a production scene, Canvas implementation, runtime registry or game
adapter. A fake's counters verify local start/stop/dispose only; no FPS claim.

## Proposed file map and implementation boundaries

| Path                                                                                              | Proposed change / owner                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `frontend/domain/motion/MotionPolicy.ts` (new)                                                    | Codex FS-3.4: union, key, metadata/validator, snapshots/consumer inputs and pure resolver. No React/DOM/storage effects.                                                                                     |
| `frontend/domain/ports/MotionEnvironmentPort.ts` (new)                                            | Codex FS-3.4: plain value observation contract above.                                                                                                                                                        |
| `frontend/application/motion/MotionPolicyService.ts` (new)                                        | Codex FS-3.4: sole preference authority, immutable snapshots, generations/revisions and lifecycle. Sibling of AnimationService; not a generalized preferences manager.                                       |
| `frontend/infrastructure/motion/BrowserMotionEnvironment.ts` (new)                                | Codex FS-3.4: media/document capability reads and listener ownership. No renderer.                                                                                                                           |
| `frontend/infrastructure/services/createServices.ts`, `application/providers/ServiceProvider.tsx` | Codex FS-3.4 after approvals: construct one authority, inject existing storage and narrow environment, expose readonly availability, initialize/release through current provider. Preserve theme/navigation. |
| Corresponding `.test.ts` and provider integration test                                            | Codex FS-3.4: pure matrix, failures, ownership, replays and two fake consumers. No production playback.                                                                                                      |
| `MotionChoices.tsx`, `LogoMotion.tsx` and stories/tests                                           | Sites FS-3.5: import/alias domain preference type instead of copying it, integrate approved policy, preserve useful UI/API and migrate only touched browser effects. Remain unchanged in FS-3.4.             |
| `AnimationService`, orchestrator, common timelines, storage/theme/bootstrap, tokens, game files   | Reuse unchanged. Policy does not know game time or mutate generated assets.                                                                                                                                  |

The small sibling service is justified by two concrete consumers (settings and
logo) plus a bounded scene contract; extending the manifest builder with
storage/visibility would mix responsibilities. No extra package, dependency,
provider, registry, scheduler, broadcast synchronization or app-wide CSS rewrite.

## Required tests after approval (not executed implementation evidence)

| Group                                      | Required assertions                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pure matrix / M2                           | Enumerate all readiness, preference, OS and boolean gates plus every runtime state. Verify mayRun iff all permit, mayPrepare only unprepared/otherwise allowed, presentation precedence and **all** simultaneous blockers. Reduced/Off static regardless of fixture flag.                                                             |
| Startup / M1, M3                           | Stable SSR/first-client pending; no reads/listeners at construction. Missing/invalid/denied storage, unknown/unavailable media and visibility failures settle safely; no permanent loading or accidental mayRun. Explicit selection before/reentrant initialization wins; no stale storage reread.                                    |
| Authority / M3, M4                         | Immediate coherent snapshot and new subscribers after failed writes; invalid setter side-effect free; same-value updates; unsubscribe during delivery; reentrant updates cannot deliver stale state. Selection persists across stop/reinitialize. Storage query success is never claimed.                                             |
| Ownership / M6                             | One media/document observer per active authority; modern/legacy branches, partial acquisition rollback, idempotent release, release-before-reinit and late old release, callback-after-release/dispose, Strict Mode replay, double dispose, post-disposal methods and two independent provider instances.                             |
| Consumers / M4, M5                         | Two fakes share preference but retain independent Pause, visibility, opt-in and failed/disposed runtime. Hide/show/theme/flag/preference changes never clear Pause. Completed fake never restarts merely because permission returns. No scheduling during unresolved/preparing/denied state.                                          |
| Preservation / T1–T4                       | Rerun accepted ThemeService/bootstrap, provider/navigation and game-facing reader regressions after composition changes; protect generated-file hashes. No decorative imports into games or policy clock access.                                                                                                                      |
| FS-3.5 real integration / M1, M4–M6, L1–L3 | SSR and held initialization, actual five-theme changes, Reduced/Off mid-draw, all props/ref operations, flag-off/fixture overrides, full SVG after failures, multiple unique instances, no theme/menu replay, viewport/document suspension, teardown and static production copies. Real browser assertions, not only mock play calls. |

For FS-3.4 implementation, run focused unit/integration and type/lint checks,
then required repository/build/bootstrap checks appropriate to provider changes.
Record exact commands/counts/results. Real logo/Canvas acceptance cannot be
claimed from the FS-3.4 fake consumers; FS-3.5/EPIC 4 supply those tests.

## Approval packet and stop point

**Sites — review packet, not dispatched:** review these exact proposed types,
settings/logo/fake-scene examples, preparation versus playback, provider replay,
all logo methods and later migration boundaries. Return compatibility findings
to Codex without editing the proposal. The user has not authorized starting
that review in this task.

**Dimi — precise pending choices:**

1. Approve `Follow system / Reduced / Off`, default Follow system, and complete
   static logo/scene for both Reduced and Off (no separate slow mode).
2. Approve static pending initialization and ready-static fallback when the
   system capability is unavailable; denied persistence keeps live intent but
   does not promise persistence after reload.
3. Approve the feature flag as a hard production gate; controlled story/test
   availability overrides still obey preference, readiness, visibility and
   Pause. No deployment flag is changed.
4. Approve consumer-local Pause surviving all environmental/preference/theme/
   flag changes, and permission never commanding replay. FS-3.5 separately
   confirms the nominated logo and concrete replay behavior.
5. Approve the single key `funkspace.motion.preference.v1` and bounded values
   above, with no cross-tab synchronization or additional stored state.

No answer is inferred from this preparation request, FS-G0, FS-3.3 acceptance or
the detailed plan. Implementation remains gated on Sites' consuming-contract
review and Dimi's explicit semantic approval, followed by implementation
authorization. If a choice changes, revise and re-review the affected contract.

## Documentation validation and handoff evidence

Only this proposed contract and the feature-plan pointer change. Inspect/read
commands, collision search, content/link review, formatting, diff and final
source-hash checks support this documentation task. The extracted proposed API
declarations also passed standalone strict TypeScript checking; this validates
the signature example only, not runtime behavior. Policy tests/builds are
**not run**: no implementation exists. Acceptance/validation above is a plan,
not PASS evidence. The exact proposal patch, inspected-source hashes and final
documentation checks are stored in local project-mirror artifacts under
`artifacts/fs-3.4-contract/revision-1/`; another session must verify access.

Stop here. No Sites review, policy source, playback, production setting, next
task, commit, push or deployment has started. FS-G1 remains unapproved.
