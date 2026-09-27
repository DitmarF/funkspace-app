# FS-3.5 — Read-only re-review, 2026-09-27

## Verdict and candidate

**CHANGES REQUESTED: one P2 startup defect, owned by Sites.** Normal motion,
settings and sequencing checks pass, but the late-hydration fallback reintroduces
the logo flash. FS-3.5 is not ready for closure on this candidate.

Reviewed the actual tracked/untracked diff on `feature/funkspace-minimum-usable`
against `5c02b93d48afbbea9d62262d58e12c7100e76280`: 35 pending files before these
review-document updates. The immutable candidate patch SHA-256 is
`36b839304bc3300f281f4893abcdc1e5706a3119e5e9049a4676019a9c420e8d`.
The patch, per-file hashes, logs and temporary reproduction probes are in the
local project workspace at `artifacts/fs-3.5-rereview/`.

Scope includes the accepted On option, explicit Reduced logo fade, nominated
top-left instance, no-flash/new-tab amendments, and logo → 400 ms menu → 800 ms
remaining-content sequence. Those later user decisions supersede the detailed
plan's earlier three-choice/static-Reduced descriptions. The detailed plan's
FS-3.5/L1–L3, FS-3.4 contract/reviews and actual implementation were compared.

Implementation and repository tests were read-only. Only this review record,
the task's current review status and the feature-plan handoff are updated under
Dimi's explicit documentation request. This is a same-session re-review by the
agent that authored the amendments; it is **not** a fresh independent-agent
review or Dimi's visual/device acceptance.

## Required revision

### P2 — Late hydration restarts the logo after the static fallback is visible

**Owner:** Sites (homepage/LogoMotion handoff, not the policy authority).

**Evidence:**

- `frontend/infrastructure/motion/HomeIntroBinding.ts:24`: fallback `reveal()`
  only changes the shell attribute and removes startup resources.
- `frontend/infrastructure/motion/HomeIntroBinding.ts:71`: the five-second
  deadline invokes that fallback without retiring the logo's automatic intro.
- `frontend/infrastructure/motion/HomeIntroBinding.ts:132`: a subsequently
  attached binding ignores logo notifications once the shell is `visible`.
- `frontend/application/animations/LogoMotionController.ts:187`: an eligible,
  unstarted controller still seeks to the beginning and plays after hydration.

**Executed reproduction:** In the actual enabled production build, hold framework
scripts, advance the clock 5,100 ms, verify that the identity and page are visible,
then release scripts and advance playback 100 ms. Both external probes failed the
required complete-static result:

| Preference | Shell after late startup | Observed logo result                           |
| ---------- | ------------------------ | ---------------------------------------------- |
| On         | `visible`                | Partially drawn artwork (`partial: true`)      |
| Reduced    | `visible`                | Whole-logo opacity `0.0653333`, instead of `1` |

The visitor sees a complete logo during fallback, then sees it reset or almost
disappear when slow JavaScript arrives. Content stays visible, so the intended
intro ordering is also abandoned. This recreates the reported startup blink on
slow/recovering loads; it is not merely a missing assertion.

**Required correction:** Coordinate a terminal per-homepage startup fallback with
the nominated logo's automatic introduction. Once complete artwork is revealed
as fallback, late readiness must not automatically reset it. Keep this local to
the existing handoff/controller; do not create a second policy authority or use
an arbitrary delay. Preserve ordinary explicit public playback behavior.

**Regression obligations:** Delayed framework startup beyond the deadline in On,
Reduced and eligible Follow system; final complete artwork after queued work;
menu/content remain visible; first-frame flash does not return. Also cover early
interaction before hydration, Strict Mode reattachment, teardown and subsequent
mounts, so cancelling one intro cannot consume a new page's intro or clear Pause.
Rerun the existing normal/new-tab sequence, Off/flag-off, failure and L1–L3 cases.

## Executed evidence

| Status          | Check                                                                                    | Result                                                                         |
| --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| PASS            | Logo, intro binding, timeline, navigation UI, pure policy and service                    | 159 tests /6 files                                                             |
| PASS            | Consumer fixture, ThemeService, ThemeSwitcher integration, bootstrap, game theme adapter | 59 tests /5 files                                                              |
| PASS            | Actual provider integration and browser motion environment                               | 13 tests /2 files                                                              |
| PASS            | Type check and theme-bootstrap freshness                                                 | No errors/drift                                                                |
| PASS            | Enabled production homepage/logo/navigation suite                                        | 59 Chromium cases, zero retries                                                |
| PASS            | Disabled production homepage/logo/navigation suite                                       | 59 Chromium cases, zero retries                                                |
| FAIL            | Additional late-hydration probes                                                         | Both On and Reduced reproduce the P2                                           |
| PASS            | Disabled production build                                                                | Rebuilt isolated copy with current CSS                                         |
| SOURCE VERIFIED | Enabled build source identity                                                            | Current runtime matches the previously built enabled copy; no rebuild claimed  |
| NOT RUN         | New full unit suite, Storybook build or performance audit                                | Prior author results remain historical; focused review evidence above is fresh |
| NOT VERIFIED    | Native OS background-tab activation, Firefox/Safari and physical devices                 | Controlled visibility coverage is not physical-device acceptance               |

Commands were run from the repository except the isolated disabled build:

```bash
pnpm exec vitest run --coverage.enabled=false frontend/components/Logo/LogoMotion.test.tsx frontend/infrastructure/motion/HomeIntroBinding.test.ts frontend/infrastructure/motion/timeline.test.ts frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/domain/motion/MotionPolicy.test.ts frontend/application/motion/MotionPolicyService.test.ts frontend/application/providers/ServiceProvider.test.tsx
# Six existing files ran; ServiceProvider.test.tsx does not exist. The actual
# provider suite was located and executed separately below.
pnpm exec vitest run --coverage.enabled=false frontend/application/motion/MotionPolicy.fixture.test.ts frontend/application/theme/ThemeService.test.ts frontend/components/ThemeSwitcher.integration.test.tsx frontend/infrastructure/theme/themeBootstrap.test.ts frontend/features/games/theme/FunkSpaceGameThemeAdapter.test.ts
pnpm exec vitest run --coverage.enabled=false frontend/application/providers/MotionPolicy.integration.test.tsx frontend/infrastructure/motion/BrowserMotionEnvironment.test.ts
pnpm -F frontend exec tsc --noEmit --incremental false
pnpm check:theme-bootstrap
NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm -F frontend build
FS35_AVAILABLE=true PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-menu-on.config.cjs
FS35_AVAILABLE=false PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-menu-off.config.cjs
PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs35-review-probes/config.cjs
```

## Trace and coverage conclusions

Settings still derive selected preference from one provider-owned authority.
The pure resolver keeps availability, readiness, environment and local Pause
separate. On bypasses only OS preference; explicit Reduced runs only an opted-in
alternative. Live storage-failure choices, consumer isolation and disposal pass.
The existing geometry, unique identifiers and manifest are reused; only the
homepage identity opts in. The sandbox/large Start/secondary copies stay static.

The real native timeline integration tests cover public seek/play/reverse,
direction-specific completion, Pause, mid-draw restoration, runtime errors and
cleanup. No additional defect was found there. The homepage tests assert actual
intermediate opacity and the 400/800 ms stages, not merely callback invocation.
They previously checked failed hydration and successful short-delayed hydration
separately, leaving the failed-open-then-late-success transition uncovered.

The source diff shows no new game-clock coupling, token/generated drift,
deployment configuration, duplicate modal or broad animation engine. Browser
effects remain in adapters/startup composition; application decisions remain
browser-free. These source conclusions do not establish Canvas correctness.

Next action: Sites implements the bounded P2 correction and regressions, then
returns the exact candidate for read-only review. Dimi's pacing/device acceptance
and any required fresh independent review remain separate. No FS-G1 approval,
commit, push or deployment is authorized or claimed.
