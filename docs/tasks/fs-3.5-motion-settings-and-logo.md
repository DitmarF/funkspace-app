# FS-3.5 — Live Motion settings and policy-bound logo

> Current amendments: [Reduced now has a whole-logo fade](#reduced-logo-fade-amendment--2026-09-27)
> and [homepage content follows the logo](#homepage-sequence-amendment--2026-09-27).
> Earlier static-Reduced behavior and review verdicts below describe their
> historical candidates. The [current re-review](fs-3.5-motion-settings-and-logo-rereview.md)
> requested one P2 correction: late hydration restarts the logo after static fallback.
> The [author correction](#late-startup-handoff-correction--2026-09-27) is implemented;
> [Dimi's manual acceptance and explicit closure](#dimi-acceptance-and-completion--2026-09-27)
> supersede earlier pending status. No fresh post-correction independent PASS is inferred.

## Task metadata and approval

- **Status:** Complete by Dimi's explicit acceptance on 2026-09-27 after reported manual browser testing. No fresh independent post-correction review is recorded; FS-G1 remains separate.
- **Epic:** EPIC 3; dependencies FS-3.1 and accepted FS-3.4.
- **Owner / sole writer:** Sites implementation role in this session.
- **Counterpart:** Separate read-only Codex boundary reviewer.
- **Date:** 2026-09-27.
- **Branch/base:** `feature/funkspace-minimum-usable`,
  `5c02b93d48afbbea9d62262d58e12c7100e76280`. Working tree was clean before work.

The [approved policy contract](fs-3.4-motion-policy-contract.md), both policy
reviews and subsequent subscriber-isolation correction/acceptance in the
[FS-3.4 implementation record](fs-3.4-motion-policy-implementation.md) were
reconciled against the actual base. FS-3.4's preference authority and resolver
remained unchanged at the initial handoff; the explicit On amendment below
subsequently extends the vocabulary and device-permission rule. Root AGENTS,
AI workflow, task template, architecture,
authoritative feature plan, detailed plan sections 4/FS-3.5/L1–L3, prerequisite
records, current logo/manifest/timeline, providers, storage and tests were read.
Historical SHAs were evidence, never reset targets.

Dimi supplied the missing instance/playback decisions directly in this session:

> Top-left identity logo; keep the large Start logo static

Dimi also explicitly approved one non-looping introduction per mount, with
Reduced/Off restoring the full logo and consuming an introduction already
started so returning to Follow system cannot replay it. These are implementation
decisions, not observations of the delivered candidate or FS-G1 approval.

## Delivered scope and reuse

`MotionSettings` subscribes to the existing provider authority. Its pressed
selection is `snapshot.preference`; pending controls are disabled, and effective
restrictions are explained separately. It has no second default, persistence,
raw OS listener or flag switch. `MotionChoices` reuses domain metadata/types.
The existing controlled `PortfolioNavigation.motion` fixture remains available;
production uses the live controls.

`LogoMotion` is a thin React/ref owner. Application `LogoMotionController`
retains local Pause, playback intent, cursor, direction and completion history,
and consults the accepted pure resolver. New browser-free `LogoMotionPort`
describes only one renderer. `NativeLogoMotionBinding` owns per-SVG visibility,
styles and the existing `AnimationTimeline`. The provider's binding factory
injects the existing orchestrator/manifest. Timeline changes are limited to
optional completion/error callbacks; old consumers remain compatible.

The homepage passes `animateIdentity` to the existing shell. Secondary-page
identity, large Start and legacy sandbox copies stay static. Inline geometry,
instance IDs, manifest builder and animation core are unchanged. Each logo owns
only its observer/timeline/subscription; destroying one cannot dispose policy.
Setup is effect-time, with inert composition/construction. Late callbacks are
guarded and Strict Mode effect replay retains local history.

The default composition still reads `NEXT_PUBLIC_ANIMATIONS_ENABLED`.
Stable explicit Storybook/test factories can supply true or false availability;
the same policy still enforces preference, readiness and Pause. No deployment
configuration was changed. No scene, game clock, registry, extra provider stack,
manifest builder, dependency or global scheduler was added.

## Public contract and compatibility adjustments

- `enabled` is opt-in; true cannot override the production flag or policy.
- `autoPlay` expresses intent and cannot clear Pause or replay a completed intro.
  `autoPlay=false` may prepare a permitted runtime but keeps complete artwork.
- `play()` under known permitted hard gates clears local Pause and can wait for
  visibility/readiness. Pending, Reduced, Off and unavailable calls are no-ops.
- `pause()` latches even before preparation. Environment, preference, theme and
  prop changes preserve it. Temporary suspension presents complete artwork while
  retaining cursor/direction; allowed unfinished work resumes from that cursor.
- `seek()` can position a prepared, permitted visible runtime while paused;
  it never clears Pause. Denied/pending calls cannot hide any part. An explicit
  seek followed by play can replay; permission alone cannot.
- `reverse()` changes a permitted prepared runtime's direction, without starting
  paused work. `setSpeed()` changes speed without starting or clearing Pause.
  `isReady()` describes actual prepared runtime, not policy readiness.
- `startAtMs` is applied only on permitted playback (or permitted later seek).
  It never prepares hidden SSR/pending/denied artwork. `pathCount` remains an
  accepted compatibility prop; the pre-existing manifest was always complete.
- Reduced/Off or OS reduced motion mid-draw stop frames, restore all 19 parts
  and consume the started introduction. Completion, theme/menu rerenders and
  visibility changes do not automatically restart it.
- Missing visibility capability or manifest/frame failure leaves complete static
  artwork. A failed runtime does not retry indefinitely or leave active frames.

The real API is exercised in `LogoMotion.stories.tsx`: explicit composition,
live preference controls, Pause/resume, seek/reverse/speed, multiple copies,
Reduced and flag-off. Story controls do not invent an independent playing state.

## Evidence map

| Obligation            | Executed evidence                                                                                                                                                                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1, complete fallback | Actual controller/binding/timeline integration checks all 19 parts for SSR, delayed policy, OS unavailable/reduced, Reduced, Off, flag-off, missing/throwing manifest and a frame error. Browser checks first-load restrictions, delayed framework scripts, measurement failure and missing observer. |
| L2, API and instances | Real runtime integration checks pre-ready Pause/resume, permitted paused seek/reverse, denied methods, speed, start position, static opt-out copies, unique IDs and one active timeline.                                                                                                              |
| L3, lifecycle/history | Cursor resumption, repeat observer notifications, completion, five themes, prop/menu-like rerenders, document/element visibility, OS mid-draw changes, Strict Mode, teardown and late callbacks. Browser checks actual homepage/settings and returning System without replay.                         |
| Live settings         | Actual service with denied writes retains live selection across remount; browser pressed states, mid-draw Off and normal reload persistence. No persistence promise under blocked storage.                                                                                                            |
| Existing foundations  | Full unit suite, type/lint, production build, Storybook, appearance/bootstrap/navigation browser regressions, protected-source diff checks.                                                                                                                                                           |

Unit integration mocks browser observations/frame scheduling, not the logo
controller, binding, manifest or timeline. It is actual-logo lifecycle evidence.
Held-policy initialization is unit coverage; the browser delayed-start case
holds framework scripts. Neither is evidence of a future Canvas scheduler.

## Validation performed

Final command outcomes and logs are retained in the candidate artifact directory
below. Browser output uses one Chromium worker and zero retries; local flag-on
and flag-off builds use isolated source copies to avoid the shared Next cache.

```bash
pnpm exec vitest run frontend/components/Logo/LogoMotion.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/infrastructure/motion/timeline.test.ts
# PASS: 64 tests / 3 files.
pnpm test
# PASS: 1,531 tests / 105 files, including bootstrap freshness and game-facing tests.
pnpm -F frontend exec tsc --noEmit
# PASS.
pnpm lint
# PASS: bootstrap freshness, ESLint and repository formatting.
NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build
# PASS: tokens/common/game/frontend build; no generated source drift.
pnpm storybook:build
# PASS after correcting the story-only import; existing chunk/directive warnings.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-browser.config.cjs
# PASS: 13 production Chromium logo cases, 320/1280px and startup/error cases.
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-regressions.config.cjs
# PASS: 66 cases (13 logo, 8 appearance, 18 navigation composition,
# 8 query-removal handoff, 19 theme-bootstrap).
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-browser.config.cjs --grep 'short screen'
# PASS: 1 additional short-screen/200% text live-settings case.
git diff --check
# PASS.
```

The isolated frontend was built with the installed Next binary and local
`NEXT_PUBLIC_ANIMATIONS_ENABLED=true`, then false. These are test builds, not
deployment changes. The first browser launch against the shared `.next` failed
before tests with missing webpack chunks; isolated builds recovered validation.
The first type check rejected unsupported Testing Library `exact` options and
the first lint caught an unused destructured compatibility prop; both were
corrected. Storybook initially rejected an alias import in the new story;
the existing relative-import convention resolved it. Failed attempts are not
counted as passes.

The isolated app runtime matches the final candidate except for formatting of
`LogoMotion.tsx`. Storybook-only composition/import corrections were built in
the actual repository and are not part of the production bundle. No semantic
production change followed the successful browser checks. The 13 flag-on plus
66 flag-off/regression cases plus the short-panel check passed without retries. Narrow and wide settings
screenshots were inspected; the narrow panel scrolls to its helper text.

## Independent boundary review

Separate read-only reviewer `/root/fs35_boundary_review` inspected actual
controller/port/native binding/provider/timeline and public API against the
contract. It independently ran **70 tests / 5 files** (logo/timeline, policy
fixture/provider integration and navigation). Verdict: production boundary
technically acceptable; no production blockers. One **P2, owner Sites**:
Storybook's explicit false availability inherited default build availability.
The author added a stable false factory. Re-review closed the finding by source
verification and reran **62 logo/timeline tests** successfully. The reviewer did
not independently execute Storybook browser checks or Dimi's device pass.
Runtime hashes are preserved in the handoff manifest. The subsequent story-only
relative import change fixes build resolution without altering policy behavior.

## Exact candidate and next acceptance

The local project artifact folder
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.5-implementation/`
contains the base-relative `candidate.patch` (including untracked files),
`manifest.json` with file/patch hashes, validation logs/configuration, review
evidence and narrow/wide screenshots. Verify access and hashes before reuse.
The manifest is the exact file inventory; no commit, push, reset or deployment
is part of this implementation handoff.

Codex receives this candidate for any requested final read-only acceptance
review. Dimi owns the pending phone/desktop visual check of complete artwork,
Follow system/Reduced/Off, first-load reduced motion, menu/theme changes and
no automatic replay. Automation and the instance/playback decisions above do
not establish physical-device acceptance. No FS-3.5 Firefox/Safari, assistive
technology or Lighthouse run is claimed. FS-3.6, FS-G1 and particles remain
separate, unstarted work.

## Explicit On amendment — 2026-09-27

Dimi subsequently requested **On** and answered the behavior question:

> Yes—On overrides the device preference; Follow system respects it.

The question explicitly retained feature availability and local Pause. This is
approval of the bounded preference change, not permission to change deployment,
enable unavailable animation, replay completed introductions, or approve FS-G1.
The pre-amendment 22-file candidate was verified against its existing manifest
before edits; branch/base are unchanged and all existing work was preserved.

The settings now contain **Follow system / On / Reduced / Off**. The type,
metadata and validator add the raw value `on` under the existing
`funkspace.motion.preference.v1` key. Existing values/default and storage
failure semantics remain compatible; no migration or additional authority is
needed. The service and browser adapter implementations are unchanged.

| Selected preference | Known device no-preference | Device reduced  | Device signal unavailable |
| ------------------- | -------------------------- | --------------- | ------------------------- |
| Follow system       | May animate                | Complete static | Complete static           |
| On                  | May animate                | May animate     | May animate               |
| Reduced             | Complete static            | Complete static | Complete static           |
| Off                 | Complete static            | Complete static | Complete static           |

Every “may animate” cell still requires ready policy, available feature,
consumer opt-in, visible document/consumer, no local Pause and ready runtime.
Pending/disposed policy remains static even for a stored On selection.
On bypasses only the device preference; it does not infer document visibility
when that capability fails. Completion history and public playback semantics
remain as delivered above. On is not a replay command.

Settings render On from service notifications and explain its device override.
When feature availability is false, they instead explain that animation is
currently unavailable while retaining the On selection. The new On story uses
the existing controlled composition. Global CSS/legacy motion safeguards and
game time are untouched. AGENTS, motion guidance, architecture and the original
contract pointer record this explicit exception without rewriting historical
approval/review evidence.

Author checks for this amendment:

```bash
pnpm exec vitest run frontend/domain/motion/MotionPolicy.test.ts frontend/application/motion/MotionPolicyService.test.ts frontend/application/motion/MotionPolicy.fixture.test.ts frontend/components/Logo/LogoMotion.test.tsx
# PASS: 64 tests / 4 files, including 7,680 permission combinations.
pnpm test
# PASS: 1,539 tests / 105 files.
pnpm -F frontend exec tsc --noEmit
# PASS.
pnpm lint
# PASS: freshness, ESLint and formatting.
pnpm storybook:build
# PASS, existing bundle/directive warnings only.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-on-option.config.cjs
# PASS: 16 Chromium cases against the isolated flag-enabled production build.
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-on-option.config.cjs
# PASS: 16 Chromium cases against the isolated flag-disabled production build.
git diff --check
# PASS.
```

New tests cover valid stored On, reload, early/reentrant On against stale
initialization, denied writes/settings remount, independent Pause, actual logo
playback under reduced/unavailable device signals, feature-off imperative calls,
OS changes during On and no completed-introduction replay. The first focused
run exposed the unextended validator (9 failures); adding On to that validator
resolved the failures. The later full-suite result is the final runtime evidence.

Production browser tests additionally exercise selection, device reduction,
completion, persisted On after reload and availability-off behavior at
320/1280px. Exact commands/results, build flags and hashes are retained in
`artifacts/fs-3.5-on-option/` under the same local project workspace as the
initial handoff. Its patch includes the complete current candidate and a
separate amendment-only diff against the preserved initial FS-3.5 candidate.
The earlier independent review covers the prior candidate; no new independent
policy review or physical-device acceptance is claimed for this amendment.

Both isolated production builds passed using the installed Next binary with
the respective local flag value. The 32 Chromium cases used one worker and
zero retries; final On settings screenshots were inspected at 320/1280px.
No deployment configuration changed. The full unit suite includes policy,
provider, theme/bootstrap and game-facing regressions; the earlier 80 browser
results remain historical and were not relabeled as this amendment's run.

## Local manual-test enablement — 2026-09-27

Dimi explicitly requested turning animation on for manual testing. Added
`NEXT_PUBLIC_ANIMATIONS_ENABLED=true` to the ignored `frontend/.env.local`.
The existing development server on port 3000 picked it up without a restart;
no deployment setting, application default or user motion selection was changed.
`git check-ignore -v frontend/.env.local` confirms the existing frontend ignore
rule keeps this local setting out of commits.

Validation against the actual running development app:

```bash
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-manual-enable.config.cjs --grep 'explicit On overrides'
# PASS: 2 Chromium checks, 320px and 1280px, no retries.
```

These checks observed drawing with On under emulated device reduced motion,
retained selection after reload and no same-mount replay. For manual checking,
open `http://localhost:3000`, select On and reload the homepage to see a fresh
introduction. The large Start logo remains static. Dimi's physical-device
acceptance is still pending; no commit, push or deployment was performed.

## P2 reverse-completion correction — 2026-09-27

Dimi requested fixing the read-only review's **P2: reverse playback retains the
wrong completion state**, owned by Sites. The reviewed candidate was the
29-file working diff against `5c02b93d48afbbea9d62262d58e12c7100e76280`,
inventory SHA-256
`2ab8ec8cde3cb40e79163393d380935bb7254a9e7952937257abe7252e45223d`.
Branch and local manual-test availability remain unchanged; other working
changes are preserved.

The reproduction was a ready, permitted logo with autoplay disabled:
`seek(end) → reverse() → play()` scheduled no frames because completion still
described the old forward direction. Reversing before seeking worked.
`LogoMotionController` now samples cursor/completion consistently after either
an explicit seek or direction change. When reversing stopped, completed work,
it clears the old playback intent so only an explicit Play can start again;
visibility or preference notifications cannot accidentally replay it. Explicit
Pause remains separate. Running reversals continue with one active frame chain.
No policy, port, provider, timeline or SVG geometry change was needed.

Ten permanent actual-logo regressions cover both endpoints, seek versus natural
completion, paused/unpaused playback, environment changes before explicit Play,
and reversal at an endpoint while already running. The first eight failed on
the reviewed controller (22 existing tests passed), then passed after correction.
The two running-direction cases were added after that reproduction.

Author validation:

```bash
pnpm exec vitest run --coverage.enabled=false frontend/components/Logo/LogoMotion.test.tsx
# Before fix: 8 new failures; 22 existing tests passed.
pnpm exec vitest run --coverage.enabled=false frontend/components/Logo/LogoMotion.test.tsx frontend/infrastructure/motion/timeline.test.ts frontend/domain/motion/MotionPolicy.test.ts frontend/application/motion frontend/application/providers/MotionPolicy.integration.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/application/theme/ThemeService.test.ts frontend/features/games/theme/FunkSpaceGameThemeAdapter.test.ts
# After fix: 139 tests /9 files passed, before the two additional running cases.
pnpm test
# Final runtime/tests: 1,549 tests /105 files passed; includes all ten new cases.
pnpm -F frontend exec tsc --noEmit --incremental false
# PASS.
pnpm lint
# PASS: freshness, lint and formatting.
pnpm exec vitest run --config /private/var/folders/mc/hyg7fvq95rz1vdfk_tkx3nsc0000gn/T/fs35-review-probes-in6vd5zx/vitest.config.mts -t 'Review:'
# PASS: all 4 original review probes; the 22 existing tests were name-filtered out.
pnpm storybook:build
# PASS; existing bundle/directive warnings only.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-reverse-browser.config.cjs
# PASS: 16 production Chromium startup/settings/logo cases, zero retries.
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-reverse-browser-probe/config.cjs
# PASS: built Storybook controls perform reverse playback from both endpoints.
```

The corrected production snapshot was built successfully with the installed
Next binary and local `NEXT_PUBLIC_ANIMATIONS_ENABLED=true` in an isolated
copy; the active development preview and local availability setting were left
intact. A flag-disabled production build was not rerun for this correction;
hard-denial/flag-off regressions passed in the full unit suite. The Storybook
browser probe uses actual controls and observes SVG frame changes, rather than
mocked method calls. It supplements the deterministic Pause/frame-ownership
assertions in unit tests. No new device, Firefox/Safari or FS-G1 acceptance is
claimed.

The exact correction and final browser evidence are retained under
`artifacts/fs-3.5-reverse-fix/` in the same local project workspace as the earlier
handoffs. The fix touches only the controller, its actual-logo tests and this
record. Prior review evidence remains historical; the original failing probe
was rerun by the author, not a new independent reviewer. Next action: Codex
read-only re-review of this correction, followed by Dimi's still-pending
visual/device acceptance. FS-G1 remains unapproved; no commit/push/deployment
or unrelated task work is included.

## Reduced-logo fade amendment — 2026-09-27

**Authority:** Dimi explicitly requested an alternative for Reduced: the whole
logo fades in over the same duration as the default animation. This supersedes
the earlier unconditional static-logo result for explicit Reduced. It does not
authorize scene implementation, a new preference authority, automatic replay,
deployment changes, or task/gate acceptance. Owner/sole writer: Sites role in
this session. Next review owners: Codex for the bounded resolver/binding/API
changes; Dimi for actual visual/device acceptance. Neither is recorded as done.

**Reconciled base:** `feature/funkspace-minimum-usable` at
`5c02b93d48afbbea9d62262d58e12c7100e76280`, with the existing 29-file FS-3.5
working candidate preserved. The reverse-completion correction was re-reviewed
read-only in the preceding turn: 141 focused tests, four original probes,
16 production Chromium checks and the controls reproduction passed. That
same-session verdict is historical evidence, not independent acceptance of
this amendment. No reference SHA was used as a reset target.

### Contract and behavior

- `ConsumerMotionInputs.supportsReducedMotion?: boolean` is an additive,
  default-false capability. Only the logo declares an implemented alternative.
  Under explicit Reduced it permits that alternative with either known device
  signal. Off always denies; pending/disposed, unavailable/unknown capability,
  feature availability, opt-out, visibility, local Pause and runtime readiness
  retain their gates. Follow system plus device reduction still stays static.
  Existing fake/scene consumers keep their previous static Reduced behavior.
- `LogoMotionBinding.prepare(variant: "draw" | "fade")` selects the existing
  renderer's presentation. The application chooses the variant from the shared
  snapshot; it neither rewrites the preference nor reads the browser directly.
- The native binding uses the existing orchestrator manifest and pure
  `createTimeline(...).duration` to derive the fade length. A single linear
  opacity tween targets the owned SVG root using `:scope`; all 19 artwork parts
  keep their full opacity/fill/strokes. At normal speed this matches the normal
  introduction (currently 1.5 seconds). Existing speed controls affect both.
  There is one timeline at a time, no second scheduler or manifest builder.
- SSR, pending initialization, preparation, failures and denied states retain
  the complete logo. Only permitted playback/explicit seeking changes opacity.
  Off mid-fade restores root opacity and every part immediately. Pause or
  visibility suspension shows complete artwork while retaining the cursor;
  explicit resume/allowed unfinished visibility resume restores that cursor.
- Switching drawing/fade variants after work started restores the complete
  artwork and consumes the introduction. No environment/theme/menu/mode change
  replays completed work. Select Reduced and reload to compare introductions;
  Storybook also exposes explicit Replay. Seek/reverse/play keep their useful
  permitted behavior and preserve the reverse-completion correction. Explicit
  Pause survives mode changes; only explicit Play clears it.
- The homepage's top-left identity remains the only animated production copy.
  Large Start and secondary copies, SVG geometry, unique IDs, providers,
  persistence key/service, theme bootstrap, game clocks and deployment/local
  availability configuration remain unchanged.

### Files and validation

The amendment changes the controller, native binding, logo port, timeline root
target, pure policy/resolver tests, MotionSettings copy, LogoMotion tests/story,
production logo browser tests, and six guidance/record files (`AGENTS.md`,
architecture, motion, feature plan, historical contract note and this record).
All were already part of the pending FS-3.5 candidate. Exact amendment/full
patches, source hashes, logs, temporary browser configs and the fade midpoint
capture are packaged in `artifacts/fs-3.5-reduced-fade/` in the local project
workspace, separate from the repository. Earlier artifacts are preserved.

Executed author checks:

```bash
pnpm exec vitest run --coverage.enabled=false frontend/components/Logo/LogoMotion.test.tsx frontend/domain/motion/MotionPolicy.test.ts frontend/infrastructure/motion/timeline.test.ts
# PASS: 97 tests before the final reverse/Off/reprepare regression was added.
pnpm test
# PASS: 1,558 tests /105 files, including all final unit regressions.
# The policy test asserts 15,360 combinations; this is not 15,360 separate tests.
pnpm -F frontend exec tsc --noEmit --incremental false
# PASS after correcting a test-only HTMLElement-to-SVGElement assertion cast.
pnpm lint
# PASS: bootstrap freshness, ESLint and formatting.
pnpm storybook:build
# PASS; existing directive/chunk-size warnings only.
```

Two isolated copies were built with the installed Next binary, one using
`NEXT_PUBLIC_ANIMATIONS_ENABLED=true`, the other `false`. Both builds passed;
the local preview stayed running with its previously authorized setting.

```bash
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-reduced-on.config.cjs
# Final PASS: 16 production Chromium cases, 320px and 1280px; zero retries.
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-reduced-off.config.cjs
# PASS: 16 production Chromium cases, 320px and 1280px; zero retries.
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-reverse-browser-probe/config.cjs
# PASS: original reverse controls reproduction in rebuilt Storybook.
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-reduced-story-probe/config.cjs
# PASS: actual Reduced story at half-duration, full per-part artwork,
# final opacity, and no replay on Off/Reduced toggling.
```

The first enabled browser run had two obsolete reload assertions that expected
Reduced never to alter opacity. They were updated to require the new fade and
its complete endpoint; all 16 then passed. Unit coverage additionally checks
exact manifest-derived duration, both known device signals, Strict Mode,
separate static copies, reverse playback, Pause/visibility cursor preservation,
mode changes across deferred preparation, pending/flag-off/unavailable/error
fallbacks, teardown and stale callbacks. The midpoint browser capture was
visually inspected: the entire unchanged artwork fades uniformly.

**Limits and next action:** these are author checks and a self-review of the
bounded diff. No fresh independent review, Firefox/Safari/physical-device
acceptance, future Canvas scheduling evidence or FS-G1 approval is claimed.
Return the exact amendment to read-only review, then Dimi visual/device testing.
No commit, push, deployment or later task is included.

## Homepage sequence amendment — 2026-09-27

**Authority and scope:** Dimi requested that homepage content start invisible,
the nominated logo play first, and the content then fade in; explicit Reduced
uses the same sequence and Off is static. This is a bounded follow-up to FS-3.5,
not FS-3.6 implementation or FS-G1 approval. Sites is the sole writer. The base
remains `feature/funkspace-minimum-usable` at
`5c02b93d48afbbea9d62262d58e12c7100e76280`. The complete 29-file pending candidate,
including the Reduced amendment, was saved as the comparison baseline. Prior
review verdicts remain historical; no new independent review is inferred.

### Implementation and compatibility

- Only the existing homepage shell with `animateIdentity` opts in. The existing
  top-left logo remains visible; main content and footer (including the menu
  launcher) wait, then fade uniformly with `--fs-motion-duration-400` (400 ms)
  and the existing ease-out token. Layout space stays reserved. The logo keeps
  its existing duration, variants, geometry, identifiers and playback rules.
- `LogoMotionOptions`/`LogoMotionProps` add optional `onPlaybackState` with
  `pending | running | completed | static`. It reports lifecycle changes, not
  frames. Actual timeline completion starts the fade; denial, Pause, failure,
  or suspension reveals the page immediately. Default consumers are unchanged.
  The shell retains a single per-instance binding and server-rendered children.
- The small `HomeIntroPort` has `logoState` and `release`; construction remains
  in the existing composition/provider. Infrastructure owns attribute changes,
  parser startup and listeners. CSS owns the bounded opacity transition; there
  is no animation registry, new preference service, scheduler, routing patch,
  extra provider stack or game-clock dependency.
- `HomeIntroScript` is a startup composition boundary analogous to the existing
  isolated theme script. It serializes the existing pure preference validator
  and permission resolver into a self-contained parser script before the
  content. Trusted source and the existing key are the only inputs; no user
  text is embedded and storage is never written. Server/client bundlers can
  rename function locals differently, so the script and mutated root attribute
  explicitly suppress hydration text/attribute comparison. Production tests
  exercise the built serialized script and report no page errors.
- This one-time pre-paint eligibility check is a narrow amendment to the
  previously static homepage startup. The live authority and its stable initial
  snapshot remain unchanged. Off, unavailable flag/capability, denied startup
  storage, no-JS or blocked inline script leave content visible. A permitted
  parser enhancement can wait at most five seconds for startup/playback; that
  deadline is a fail-open guard, not the sequencing clock. No hidden-content
  default is put in server markup.
- Keyboard, pointer, focus, scrolling, document visibility changes, pagehide,
  fragments and history navigation terminate the reveal. Keyboard release runs
  before native focus advancement; hidden links cannot trap focus. Fragment
  entries and restored/back-forward entries skip initial hiding. No history or
  scroll APIs are patched. Once visible, content never hides again on theme,
  settings, visibility notifications, replay controls or late callbacks.
- The parser owns its bounded listener/timer handoff. Strict Mode effect
  reattachment preserves it; detached cleanup releases it and old binding
  callbacks are inert. A logo with missing visibility capability reports its
  static result instead of leaving the homepage waiting. Secondary pages,
  navigation destinations, dialog lifecycle, ThemeService/bootstrap generation,
  tokens, preference persistence, deployment and local flags are preserved.

### Exact files and evidence

The amendment touches the shell/CSS, logo controller/component/port, native logo
visibility fallback, existing provider/composition, new `HomeIntroPort`,
`HomeIntroBinding` and `HomeIntroScript`, their focused tests, a new
`e2e/home-intro.spec.ts`, the paused-clock logo fixture, and five guidance/record
files. Exact amendment/full-candidate patches and hashes are retained in
`artifacts/fs-3.5-home-intro/` in the local project workspace. No pre-existing
working changes were reset or discarded.

Executed author checks:

```bash
pnpm exec vitest run --coverage.enabled=false frontend/infrastructure/motion/HomeIntroBinding.test.ts frontend/components/Logo/LogoMotion.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx
# PASS: 68 tests. Fixtures flush jsdom storage events before counting owned
# timers; callback assertions allow the provider's synchronous teardown state.
pnpm test
# PASS: 1,580 tests /106 files, including the shared policy/theme/game readers.
pnpm -F frontend exec tsc --noEmit --incremental false
# PASS.
pnpm lint
# PASS: theme-bootstrap freshness, ESLint and formatting.
pnpm storybook:build
# PASS; existing directive/chunk warnings only.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-home-dev.config.cjs
# PASS: 16 new sequence/fallback cases in the existing development preview.
```

Both isolated Next production builds (`NEXT_PUBLIC_ANIMATIONS_ENABLED=true`
and `false`) passed. Browser evidence includes the actual built startup script,
logo-first and content-fade screenshots at 320/1280px, exact 400 ms CSS timing,
unchanged layout bounds, Off/device reduction, storage/observer/runtime failure,
failed hydration with bounded release, keyboard skip focus, ordinary no-JS links,
fragment/history restoration and unchanged secondary pages. The enabled suite's
first run passed 48 cases and stalled two old paused-clock reload fixtures: the
new intro correctly kept their menu hidden while their clock was stopped. Those
fixtures now use the supported keyboard exit before accessing settings. This
does not weaken their logo, persistence or no-replay assertions.

```bash
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-home-on.config.cjs
# Final PASS: 50 production Chromium cases, zero retries.
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-home-off.config.cjs
# PASS: 50 production Chromium cases, zero retries.
```

These 100 cases cover the new sequence, existing logo behavior and navigation
composition. The final test-fixture-only correction does not change either
built runtime. Type/lint checks and `git diff --check` passed; all changed
documents were formatted after the final evidence update.

A single diagnostic desktop Lighthouse collection ran against the enabled
production copy: performance 100, LCP 728 ms, CLS 0. This is one local sample,
not the repository's three-run p75 gate or proof of physical-device timing;
the clock-controlled browser cases establish the requested animation ordering.

**Handoff:** Sites supplies the exact candidate for Codex read-only review and
Dimi's visual/device checks. No independent review, Firefox/Safari or physical
device acceptance, FS-G1 approval, commit, push or deployment is claimed.

## Logo first-paint correction — 2026-09-27

**Request/owner:** Dimi reported the complete logo appearing before its animation,
causing a blink. Sites owns this bounded correction. Branch remains
`feature/funkspace-minimum-usable`, base
`5c02b93d48afbbea9d62262d58e12c7100e76280`; all existing FS-3.5 changes are preserved.

**Reproduction and decision:** A Chromium regression held framework scripts
before hydration. The eligible homepage identity had opacity `1` instead of `0`,
reproducing the reported first-paint flash. The existing parser handoff now starts
in `preparing`: both page content and the identity are masked. Only the existing
controller's `running` notification, emitted after its first draw/fade frame is
prepared, removes the identity mask. Completion still starts the content fade.
Opacity preserves SVG layout and observer measurements. No new timer, preference,
provider, animation target, public contract, geometry, generated output or feature
configuration is introduced. Static/error, interaction, timeout and no-JS exits
retain their existing fail-open behavior.

**Files:** `HomeIntroBinding.ts`, its adapter tests,
`PortfolioShell.module.css`, `e2e/home-intro.spec.ts`, `docs/motion.md` and this
record. The exact six-file correction relative to the preceding homepage-intro
candidate, full pending candidate, hashes and logs are retained in the local
project workspace at `artifacts/fs-3.5-logo-first-paint/`.

**Executed author evidence:**

```bash
pnpm exec vitest run --coverage.enabled=false frontend/infrastructure/motion/HomeIntroBinding.test.ts frontend/components/Logo/LogoMotion.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx
# PASS: 70 tests, including fallback during pending/running/completed stages.
pnpm -F frontend exec tsc --noEmit --incremental false
pnpm lint
pnpm storybook:build
# PASS; existing Storybook directive/chunk warnings only.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-home-dev.config.cjs
# Final PASS: 19 development Chromium cases.
NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm -F frontend build
NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm -F frontend build
# PASS in separate production copies; running development preview preserved.
```

The three new delayed-hydration cases cover On, Reduced and Follow system,
checking pre-hydration invisibility, an incomplete prepared frame immediately
after mask release, and complete final artwork. Existing tests additionally
assert visible identity fallback for Off, device reduction, denied storage,
runtime/observer failure, no-JS and the failed-hydration deadline. The first
post-fix run exposed a test assumption that strokes were still drawing at 800 ms;
the final assertion checks the actual prepared frame at time zero, and retains
the halfway whole-logo fade assertion. No production fix was needed for that
fixture correction.

```bash
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-blink-on.config.cjs
# PASS: 53 production Chromium cases, zero retries.
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-blink-off.config.cjs
# PASS: 53 production Chromium cases, zero retries.
pnpm exec lhci collect --config=/tmp/fs35-home-lighthouse.json
# One enabled production desktop diagnostic: performance 100, LCP 732 ms, CLS 0.
```

The production cases include homepage sequencing, logo settings/lifecycle and
navigation composition at narrow/wide sizes. Lighthouse is one diagnostic sample,
not the three-run performance gate. Focused tests were rerun for this correction;
the prior full-suite result above is historical evidence, not a fresh full run.
The final diff was checked for scope, lifecycle ownership, duplication and
generated drift. Formatting/type/lint and `git diff --check` passed.

**Next acceptance:** Codex may review this exact candidate read-only; Dimi should
reload the local homepage to confirm the initial blink is gone. No new independent
review, Firefox/Safari or physical-device acceptance is claimed. FS-G1 remains
pending; no commit, push or deployment was performed.

## Second-tab content sequence correction — 2026-09-27

**Request/owner:** Dimi reported logo playback without the following content fade
when reopening the homepage in another tab. Sites owns the correction. The branch
and base remain `feature/funkspace-minimum-usable` /
`5c02b93d48afbbea9d62262d58e12c7100e76280`. Earlier working changes are preserved.

**Reproduction:** The new two-page tests passed foreground startup but failed both
On and Reduced background startup: the parser skipped sequencing when the document
was hidden, while the logo resumed later on visibility. Its initial hidden state
also reported `static`, prematurely terminating any waiting page sequence.

**Decision/contract:** Reuse the existing parser handoff, visibility listener and
logo callback. An eligible background tab now retains `preparing`; its existing
five-second fail-open timer starts at first document visibility. The logo's
existing `pending` callback also means an unstarted, otherwise-permitted intro
waiting for first visibility. Hard denial, explicit Pause and runtime failure
still report `static`. Once an introduction has been presented, hiding it retains
the previous immediate content release/no-page-replay behavior. No new callback
value, preference authority, provider, scheduler, timer kind, persistence key or
browser effect in application code was added. Each tab owns its own handoff.

**Files:** `HomeIntroBinding.ts` and its tests, `LogoMotionController.ts`,
`LogoMotion.test.tsx`, `e2e/home-intro.spec.ts`, `docs/motion.md` and this record.
Exact seven-file amendment against the preceding first-paint candidate, full
pending diff, hashes and execution logs are in the local project workspace at
`artifacts/fs-3.5-second-tab-intro/`.

**Executed author checks:**

```bash
pnpm exec vitest run --coverage.enabled=false frontend/infrastructure/motion/HomeIntroBinding.test.ts frontend/components/Logo/LogoMotion.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx
# PASS: 74 tests.
pnpm test
# PASS: 1,586 tests /106 files.
pnpm -F frontend exec tsc --noEmit --incremental false
pnpm lint
pnpm storybook:build
# PASS; existing Storybook directive/chunk warnings only.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-home-dev.config.cjs
# PASS: 23 development Chromium cases.
NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm -F frontend build
NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm -F frontend build
# PASS: isolated enabled/disabled production copies; local preview preserved.
```

The new browser cases use two real pages sharing storage and verify On/Reduced,
foreground/initial-background startup, a six-second hidden wait, the actual
content fade's intermediate opacity and the first tab remaining visible. Headless
Chromium's background visibility input is explicitly controlled in those cases.
Two supplementary headed Chromium attempts also reported `visible` for the
requested background tab, so native tab-switch behavior is **not verified** by
those attempts; they do not count as acceptance. Adapter tests additionally cover
first-visibility timeout, failed hydration, later hiding and owned timer cleanup.

```bash
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-tab-on.config.cjs
# PASS: 57 production Chromium cases, zero retries.
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-tab-off.config.cjs
# PASS: 57 production Chromium cases, zero retries.
pnpm exec lhci collect --config=/tmp/fs35-home-lighthouse.json
# One enabled desktop diagnostic: performance 100, LCP 727 ms, CLS 0.
```

These checks retain the prior no-flash, actual logo settings/lifecycle, narrow/wide
navigation and static-fallback coverage. Lighthouse is a single diagnostic, not
the three-run performance gate. The production runtime matches the final source;
only an explanatory controller comment and documentation were added after builds.
Final diff review found no generated drift or extra lifecycle owner. Type/lint,
formatting and `git diff --check` passed.

**Next acceptance:** Codex can review the exact candidate read-only; Dimi should
repeat the reported new-tab steps in the target browser. Native OS tab activation,
Firefox/Safari and physical-device acceptance remain unverified for this fix.
No independent review, FS-G1 approval, commit, push or deployment is claimed.

## Menu-first content reveal amendment — 2026-09-27

**Request/owner:** Dimi requested two content steps after logo completion: first
the menu hex-button fades in, then the remaining page content. Sites owns this
bounded amendment. Branch/base remain `feature/funkspace-minimum-usable` /
`5c02b93d48afbbea9d62262d58e12c7100e76280`; earlier working changes are preserved.

**Implementation/contract:** Extend the existing per-shell intro states with
`menu`. Logo completion starts a 400 ms menu fade using the existing motion token;
the launcher's actual animation-end event starts the existing 400 ms content
fade. No guessed sequencing delays or additional timers are used. The enhanced
launcher and footer links have separate animation targets inside the same footer,
so fading the footer cannot hide or fade the menu a second time. Ordinary fallback
navigation joins the remaining content; if no enhanced menu exists, only its
step is skipped. No-JS, Off, flag-off, denied startup and fragment/history access
remain static. On, eligible Follow system and Reduced use the same ordering.

Clicking the menu while it fades completes the reveal immediately and opens the
existing dialog. Late menu/content events cannot restart a cancelled sequence;
the existing deadline and per-tab visibility behavior are preserved. There is
still one navigation owner, modal and motion authority. No public port or logo
API, persistence, geometry, deployment flag, tokens or generated source changed.

**Files/candidate:** Shell markup/CSS, PortfolioNavigation target markers,
HomeIntroBinding and its tests, homepage browser tests, AGENTS.md and the four
motion/architecture/feature/task documents. The exact eleven-file amendment and
full pending candidate, hashes, logs and narrow/wide screenshots are retained in
the local project workspace at `artifacts/fs-3.5-menu-first-reveal/`.

**Executed author checks:**

```bash
pnpm exec vitest run --coverage.enabled=false frontend/infrastructure/motion/HomeIntroBinding.test.ts frontend/components/Logo/LogoMotion.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx
# PASS: 79 tests.
pnpm test
# PASS: 1,589 tests /106 files.
pnpm -F frontend exec tsc --noEmit --incremental false
pnpm lint
pnpm storybook:build
# PASS; existing Storybook directive/chunk warnings only.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-home-dev.config.cjs
# PASS: 23 sequence/fallback cases before adding the two interaction cases.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-home-dev.config.cjs --grep 'menu is usable'
# PASS: both added mobile/desktop interaction cases.
NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm -F frontend build
NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm -F frontend build
# PASS in isolated production copies; existing development preview preserved.
```

The sequence cases assert hidden main/footer content while the menu independently
fades, its exact token duration and intermediate opacity, then complete menu and
intermediate content opacity. They retain the delayed-start no-flash and second-tab
regressions. New adapter assertions reject out-of-order/late events and verify the
missing-menu fallback. Narrow/wide menu-first screenshots were visually inspected
by the author; this is not Dimi's acceptance.

```bash
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-menu-on.config.cjs
# Initial: 58 passed /1 failed (new mobile interaction fixture synchronization).
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-menu-off.config.cjs
# PASS: 59 production Chromium cases, zero retries.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-menu-on.config.cjs --grep 'menu is usable'
# PASS: both interaction cases after synchronizing on actual logo startup.
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-menu-on.config.cjs home-intro.spec.ts
# PASS: all 25 enabled production homepage cases, zero retries.
```

The first mobile interaction fixture advanced its stopped clock before startup
had reached `waiting`, then expected `menu` while the logo was still running.
It now waits for that real startup state before advancing; production code was
unchanged. The other 34 enabled logo/navigation cases passed in the initial run
and were not unnecessarily repeated after this test-only synchronization change.

The default one-run desktop Lighthouse collection returned `NO_LCP` (inconclusive,
not PASS). A separate diagnostic using a 3,000 ms post-load/FCP capture window
returned performance 100, LCP 727 ms and CLS 0. Commands/configurations and both
observed results are retained (the first full report was replaced by collection,
so its inspected result is recorded separately); this does not establish the repository's three-run gate,
and no repository Lighthouse thresholds/configuration were changed.

Final diff inspection checked event ownership, stale callbacks, fallback links,
single-overlay reuse and generated drift. Type/lint, formatting and diff checks
passed. Next actions remain Codex's independent read-only review and Dimi's visual
pacing/device acceptance. Native OS tab activation and Firefox/Safari were not
reverified for this amendment. FS-G1 remains pending; no commit, push or deployment
was performed.

## Remaining-content duration adjustment — 2026-09-27

Dimi requested **800 ms** for the remaining content fade. Sites changed only
that stage to the existing `--fs-motion-duration-800` token; the menu keeps
400 ms. Ordering, easing, logo playback, Off/static fallback and lifecycle
behavior are unchanged. The browser duration assertion now requires 800 ms
for content and still requires 400 ms for the menu. Motion/architecture guidance
reflects the new timing; earlier evidence above describes its historical candidate.

The five-file delta is the shell CSS, homepage browser test, motion guidance,
architecture guidance and this record. Exact amendment and hashes are retained
in the local project workspace at `artifacts/fs-3.5-content-800ms/`. Branch/base
remain `feature/funkspace-minimum-usable` /
`5c02b93d48afbbea9d62262d58e12c7100e76280`; prior local changes are preserved.

Executed checks: `pnpm -F frontend exec tsc --noEmit --incremental false`,
`pnpm lint`, `pnpm storybook:build` and the isolated enabled
`NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm -F frontend build` all passed.
`FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-menu-on.config.cjs home-intro.spec.ts`
passed all 25 production homepage cases, including exact durations, narrow/wide
presentation, new-tab startup and static fallbacks. The extended-capture
`pnpm exec lhci collect --config=/tmp/fs35-menu-lighthouse-long.json` diagnostic
reported performance 100, LCP 731 ms and CLS 0; this is one sample, not the
three-run performance gate. Final formatting/diff review passed. The full unit
suite and disabled production build were not rerun for this CSS-only adjustment.

Dimi's visual pacing confirmation remains pending. No independent review,
physical-device acceptance, FS-G1 approval, commit, push or deployment is claimed.

## Late-startup handoff correction — 2026-09-27

**Owner:** Sites implementation role, sole writer. **Status:** author correction
implemented; awaiting fresh independent read-only review and separate Dimi
visual/device acceptance. The preceding [re-review](fs-3.5-motion-settings-and-logo-rereview.md)
remains an unchanged historical verdict on its recorded candidate. This entry
does not turn that review into an independent PASS or close FS-3.5/FS-G1.

The review reproduced a complete visible logo resetting into drawing/fading
when JavaScript arrived after the five-second static fallback. The startup
adapter now retains a cancellation latch when fallback reveals an introduction
that has **not started** (`preparing`). It delivers this result to the current
logo immediately on late subscription. The shell passes it through the existing
logo ref; no storage, policy authority, timer, provider or animation engine is
added. Once playback has reached `waiting`, revealing content preserves the
already-running logo and existing live-settings behavior. Normal completion
still sequences the 400 ms menu and 800 ms content stages.

Exact contract additions:

- `bindHomeIntro(root, cancelIntroduction?)`: optional callback, one active
  subscriber, immediate replay of an earlier cancellation, identity-guarded
  removal. Existing one-argument consumers remain valid. Detached-root cleanup
  removes the handoff; Strict Mode connected cleanup preserves it.
- `LogoMotionRef` / `LogoMotionHandle.cancelIntroduction()`: cancels automatic
  intent, restores complete artwork and consumes started work if called while
  playing. It does not alter shared preference or explicit local Pause.
- Optional `LogoPlaybackHistory.autoPlayCancelled`: per-mount history latch
  survives effect replay; constructor and autoPlay changes honor it. Explicit
  permitted playback remains available, with the existing prepare/seek/play
  requirements for replaying completed work. A new mount has fresh history.

The bounded delta changes twelve files: `HomeIntroBinding.ts` and its test,
`LogoMotionController.ts`, `ServiceProvider.tsx`, `LogoMotion.tsx` and its test,
`PortfolioShell.tsx`, `e2e/home-intro.spec.ts`, architecture/motion guidance,
the feature plan and this record. All earlier local changes are preserved.
Branch/base remain `feature/funkspace-minimum-usable` /
`5c02b93d48afbbea9d62262d58e12c7100e76280`; no reset target was used.

Exact full-candidate and amendment patches, file hashes, configurations and
logs are retained outside the repository in the local project workspace:
`artifacts/fs-3.5-late-start-fix/`. The amendment compares the saved pre-fix
working tree (`/tmp/fs35-late-start-baseline`); the full candidate compares HEAD
and includes untracked FS-3.5 files. The retained `candidate.json` identifies
the precise candidate without embedding a self-referential document hash here.

Regression coverage now includes deadline and early-interaction fallback with
held framework scripts under On, Reduced and eligible Follow system. It checks
all 19 logo parts, whole-logo opacity, visible content/menu and the terminal
page state before hydration and after 0/100/500/2,000/5,000 ms of queued work.
Adapter/component coverage checks subscription replacement, synchronous static
feedback, Strict Mode, per-mount isolation, automatic prop changes, unchanged
Pause/preference, explicit playback and cleanup. An already-running intro is
explicitly protected from startup cancellation.

During implementation, the first enabled production run passed 63/65 cases
and failed two existing mid-draw settings cases: cancellation also applied to
`waiting`. This exposed an overly broad change. Restricting it to `preparing`
preserved established playback and added a regression for that distinction.
An initial Reduced component fixture also needed to prepare its changed variant
before explicit seek/replay; the existing public playback contract was preserved.

Executed author checks and limitations are recorded below. Fresh independent
review must inspect this exact corrected candidate rather than adopt the author's
results as its verdict. Dimi must separately confirm real-device startup and
logo/menu/content pacing. No Firefox/Safari or physical-device rerun, native
OS background-tab acceptance, Canvas acceptance or FS-G1 approval is claimed.

Final executed validation:

| Command / environment                                                                                                  | Result                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                                                                                                            | PASS: 1,597 tests / 106 files, including policy/provider/theme, game-facing readers and 80 focused logo/startup tests. |
| `pnpm -F frontend exec tsc --noEmit --incremental false`                                                               | PASS.                                                                                                                  |
| `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm -F frontend build` and the same with `false`                                 | PASS in separate temporary checkouts; runtime source bytes verified against this working tree.                         |
| `pnpm storybook:build`                                                                                                 | PASS.                                                                                                                  |
| `FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-late-start-on.config.cjs` | PASS: 65/65 production Chromium startup/logo/navigation cases, zero retries.                                           |
| Same command with `FS35_AVAILABLE=false` and `/tmp/fs35-late-start-off.config.cjs`                                     | PASS: 65/65 production cases, zero retries.                                                                            |
| `pnpm exec lhci collect --config=/tmp/fs35-menu-lighthouse-long.json` in the enabled production frontend               | One extended-capture desktop diagnostic: performance 100, LCP 780 ms, CLS 0. Not the repository's three-run gate.      |

The enabled/disabled browser runs cover normal sequences, exact 400/800 ms
durations, narrow/wide layouts, static/failed-runtime paths, no-JS fallback,
background startup with a controlled visibility input, and settings changes.
The six new late-startup tests also passed on the existing development preview.
No deployment configuration or ignored manual-testing flag was changed.

The original review probes were also rerun unchanged with
`FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-late-start-original.config.cjs`:
**2/2 PASS** on the final enabled build; both report visible introduction,
opacity 1 and no partial logo parts after late hydration. `pnpm lint` passed
(including generated theme-bootstrap freshness and formatting), as did
`git diff --check`. Final author diff inspection found no generated/token drift,
preference/storage changes, new resource owner or game-clock coupling in this
correction. These are author checks, not the requested fresh independent verdict.

## Dimi acceptance and completion — 2026-09-27

Dimi reported manual testing in “salary and firefox,” stated **“FS-3.5 are done”**
and authorized updating documentation, committing and pushing all changes.
“salary” is interpreted as Safari in this browser-testing context; Firefox is
explicitly named. Browser versions, operating systems, devices and individual
test observations were not supplied for this acceptance. Earlier FS-3.2 browser
versions are not reused as evidence for FS-3.5.

This closes FS-3.5 by Dimi's explicit decision following the bounded late-startup
correction. His manual acceptance, the author's automated results and independent
review are separate evidence: **no fresh independent review of that final
correction is recorded or relabeled PASS**. Earlier review findings and results
remain attached to their historical candidates. Earlier pending/no-commit
language describes those stages and is superseded by this closure authorization.
FS-G1, production Canvas acceptance and any later task remain outside this closure.

Before documentation changes, all 36 pending files matched the last validated
candidate manifest, patch SHA-256
`b286e92e271fa353ebd8396c438d2323f15f30094c1289cc732495fe9f3bb9d3`.
Branch/base are `feature/funkspace-minimum-usable` /
`5c02b93d48afbbea9d62262d58e12c7100e76280`. This closure edits only this record
and the authoritative feature plan; runtime, tests and generated sources retain
the validated bytes. The recorded 1,597 unit tests, 130 production browser cases,
two original review probes, type/lint, both production builds and Storybook
results remain applicable and are not represented as new runs.

Closure checks cover candidate hashes/inventory, documentation formatting and
links, and the staged diff. Git delivery results are recorded after confirmation
outside the repository in the local project workspace at
`artifacts/fs-3.5-closure/`. The commit containing this record identifies the
complete documentation-inclusive delivery. Authorization covers commit/push;
no PR, merge, deployment or external configuration change is included.
