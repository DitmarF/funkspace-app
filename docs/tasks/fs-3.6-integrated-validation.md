# FS-3.6 — Integrated navigation, appearance and motion validation

## Status and candidate — 2026-09-27

**Status: COMPLETE — FS-3.6, EPIC 3 and FS-G1 accepted and closed by Dimi on 2026-09-27.**
The [final closure and re-review](#epic-3-closure-and-final-re-review--2026-09-27)
record Dimi's explicit “all tests are done” confirmation. Functional independent
review is PASS; both measured flag variants pass the approved 5,000 ms LCP budget.
The 0.82 flag-on score warning and unspecified device-test details remain recorded
limitations, not invented PASS results. Earlier blocked/pending entries below
describe their historical candidates and are superseded by this closure.
The [approved budget amendment](#approved-lcp-budget-amendment--2026-09-27)
supersedes the old LCP blocker through changed acceptance criteria, not faster
runtime. Earlier failures and the independent review retain their original scope.
**Owner:** Sites validation role, sole writer. **Counterpart:** Codex independent
review; this execution is not that review. The initial validation changed tests,
one story type annotation and documentation only. Dimi subsequently authorized
Sites to fix the two contrast findings; the bounded CSS correction and fresh
evidence are recorded in the [correction handoff](#sites-contrast-correction--2026-09-27).
Codex's subsequent tooling correction is recorded [separately below](#codex-playwright-type-correction--2026-09-27).
The latest [performance correction](#performance-capture-and-homepage-timing-correction--2026-09-27)
superseded missing-LCP status; the final closure records the subsequent gate decision.

- Repository: `DitmarF/funkspace-app`, branch `feature/funkspace-minimum-usable`.
- Starting revision: `53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef`, initially clean.
- Initial validation candidate: that revision plus the uncommitted validation
  diff, with runtime source unchanged. The original `candidate.json` and
  `candidate.patch` identify that historical candidate. The correction handoff
  below identifies the current candidate, including two changed stylesheets.
- Evidence directory, outside the repository:
  `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.6-validation/`.
  Each command has a `.log` and `.json` with command, working directory,
  timestamps, exit code and relevant flags. Browser reports/traces/screenshots,
  runner configurations, generated-source guards and build IDs are retained.
- Environment: macOS arm64, Node 22.22.0, pnpm 10.30.3, Playwright 1.55.1,
  Chromium 140.0.7339.186, axe 4.11.0. Firefox/WebKit runners are not installed;
  no framework/browser package installation or upgrade was performed.

The root AGENTS, AI workflow, task template, authoritative feature plan,
`/Users/dimi/Downloads/FunkSpace_EPIC_3_Detailed_Plan.md` sections 4/5/9,
current code/tests/scripts and prerequisite records were inspected. Historical
SHAs are references, not reset targets. No commit, push, deployment, email
sending, external configuration change or later-epic implementation is included.

## Prerequisite reconciliation

| Prerequisite             | Evidence and current consequence                                                                                                                                                                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FS-3.2                   | [Accepted navigation lifecycle](fs-3.2-navigation-lifecycle.md): independent correction approval and Dimi closure recorded. Actual Back decision is ordinary page history with overlay closure. Query-removal correction is present. Fresh tests below replace reliance on old logs.                                                        |
| FS-3.3                   | [Accepted appearance integration](fs-3.3-appearance-integration.md): one live theme authority and denied-write correction. No palette/bootstrap rewrite here.                                                                                                                                                                               |
| FS-3.4                   | [Policy implementation/reviews](fs-3.4-motion-policy-implementation.md): consuming review, critical review and subscriber correction PASS are historical evidence. Current service SHA-256 remains `cfa60e0dcdc3291571c008fbc72dffd9f213116a2272818d439b60d2be8e9782`, matching the independently reviewed authority.                       |
| FS-3.5                   | [Dimi closure](fs-3.5-motion-settings-and-logo.md#dimi-acceptance-and-completion--2026-09-27) records manual browser acceptance and the late-startup fix. No fresh independent review of the final amended candidate was recorded; that remains part of Codex's review obligation.                                                          |
| Later accepted decisions | Four motion choices include On. Explicit Reduced has a whole-logo fade; System with OS reduction and Off stay static. Only the top-left identity animates. The homepage sequences logo → menu 400 ms → content 800 ms, with bounded/interactive fallback. These supersede the detailed plan's original three-choice/static-Reduced wording. |
| Navigation amendments    | Icon-only Menu trigger is accepted; no visible caption is required. Full About is `/about`; legal notice retains `/impressum`. Disabled Coming soon entries are intentional. Older plan labels and discovery wording are not used to undo accepted decisions.                                                                               |

Dimi's FS-3.5 Safari/Firefox report is historical manual evidence with unspecified
versions/devices. It is neither fresh FS-3.6 automation nor FS-G1 approval.

## Initial validation execution and flags

This section and its original reports describe the pre-correction candidate;
the later author rerun is recorded separately below.

`pnpm check:theme-bootstrap` ran **before** generation. Then, in section 9.4 order:
`pnpm build:tokens`, `pnpm -F @funkspace/common typecheck`,
`pnpm -F @funkspace/wave-survivor build`, and
`pnpm -F frontend exec tsc --noEmit --incremental false` all passed.
Generated CSS/TypeScript/bootstrap diffs remain empty.

Production copies were freshly created from the exact starting revision under
`/tmp/fs36/on` and `/tmp/fs36/off`, with installed dependencies reused. Each ran
the full `pnpm build` with `NEXT_PUBLIC_ANIMATIONS_ENABLED=true` or `false` at
build time. Both passed. Build IDs are respectively `lcsB4EUcONANgaJItkg_d` and
`CCJ3q4s98roa3n4wLzJHA`. `source-guards.json` verifies runtime bytes match the
final working tree. Tests used `FS35_AVAILABLE=true/false` only to select expected
behavior; that environment variable did not substitute for building each flag.
The existing development preview used its already-authorized ignored local
`NEXT_PUBLIC_ANIMATIONS_ENABLED=true`; that configuration was not edited.

| Fresh check                                                                   | Result / retained log label                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focused dialog/handoff/theme/policy/provider/logo/game adapters               | PASS, 194 tests / 16 files; `focused`.                                                                                                                                                                                                                                                                                  |
| `pnpm lint`, `pnpm test`                                                      | PASS; 1,597 tests / 106 files; `lint`, `unit`. Final documentation/test-only checks are retained separately.                                                                                                                                                                                                            |
| `pnpm coverage`                                                               | PASS at unchanged thresholds: statements 85.58%, branches 82.87%, functions 82.13%, lines 87.81%; `coverage`. Existing exclusions include application/infrastructure/domain, so these percentages do not measure every critical policy line. Those layers have explicit executed suites.                                |
| `pnpm storybook:build`                                                        | PASS initially and after the story annotation correction; `storybook-final`. Existing bundle-size warnings retained.                                                                                                                                                                                                    |
| Expanded stories typecheck                                                    | PASS after correcting Minimal's partial args annotation; `story-types`.                                                                                                                                                                                                                                                 |
| Expanded stories + E2E typecheck                                              | FAIL: 21 incompatible `Page` type errors at axe call sites remain; `expanded-types-current` and final rerun. Normal frontend types exclude stories and do not include root E2E. No casts or suppressed diagnostics were added.                                                                                          |
| Full production route suite, initial On / Off                                 | 197 PASS / 17 FAIL and 198 PASS / 16 FAIL, each 214 cases, zero retries; `browser-on`, `browser-off`. Failures were retained, not overwritten.                                                                                                                                                                          |
| Corrected responsive/lifecycle fixtures + unchanged home axe checks, On / Off | Each 50 PASS / 4 FAIL; only the four home contrast cases remain red; `browser-on-rerun`, `browser-off-rerun`.                                                                                                                                                                                                           |
| All actual logo browser cases, final On / Off                                 | Each 16/16 PASS; `logo-on-final`, `logo-off-final`.                                                                                                                                                                                                                                                                     |
| Added integrated theme/motion/navigation journey                              | All eight viewport/storage combinations passed on each production build and on development; included in the full reports.                                                                                                                                                                                               |
| Added Motion hover/active/selected-hover contrast                             | Four failures on each build; `controls-on`, `controls-off`. These are newly exposed product defects, not waived assertions.                                                                                                                                                                                             |
| Protected theme-bootstrap production checks                                   | Final On / Off each 21/21 PASS; `bootstrap-browser-final`, `bootstrap-off`. Earlier 17 PASS / 2 FAIL from outdated visible-heading expectations are retained.                                                                                                                                                           |
| Existing isolated client-redirect fixture                                     | 4/4 PASS, widths 320/1280 with/without dismissal; `redirect-browser`. Only the temporary copy replaces `/about`; actual route validation uses the unmodified production copies.                                                                                                                                         |
| Built Storybook dialog/navigation/themes/foundations browser checks           | 35/35 PASS; `storybook-browser`. Storybook alone is not page integration proof.                                                                                                                                                                                                                                         |
| `pnpm e2e` focused development run                                            | 75 PASS / 1 FAIL: dismissed hard-redirect Contact had a scroll mismatch (1109 → 929). The unchanged case and its non-dismissed pair then passed six serial repetitions; `dev-e2e`, `dev-rerun`. Keep the initial failure as an intermittent observation, not a universally green run. Production lifecycle runs passed. |
| Standalone game typecheck/test/demo build                                     | PASS, 920 tests / 58 files; `game-types`, `game-tests`, `game-demo`.                                                                                                                                                                                                                                                    |
| Existing standalone actual-runtime browser checks                             | 2/2 PASS; `game-browser-final`, using `playwright.demo.config.ts`. No portfolio game integration was added.                                                                                                                                                                                                             |
| Three-run Lighthouse, original settings and thresholds                        | Off PASS: performance 100, LCP 725–788 ms, CLS about 0.0046. On FAIL: LCP has no value in all three reports; no performance score. `lighthouse-off`, `lighthouse-on`.                                                                                                                                                   |
| Separate extended-capture On diagnostic                                       | One sample PASS, performance 100, LCP 729 ms, CLS 0; `lighthouse-on-diagnostic`. This does not replace the failed standard three-run check.                                                                                                                                                                             |

The runner names actual configuration files. Setup mistakes (host Python lacked
the newer tar extraction argument, an initial game config filename was wrong,
and temporary expanded types needed workspace aliases) were corrected and
retained as setup failures, not product findings or passing application tests.

`latest-case-evidence.json` reconciles the latest result for each production
case across the initial run and affected-file reruns: **210 PASS / 8 FAIL per
flag**, with no skipped cases. The eight failures are four appearance and four
Motion interaction-contrast cases. This is a per-case evidence summary, not a
claim that one final full-suite invocation passed. Original failures remain in
their reports. The final lint rerun corrected one formatting-only issue in the
new contrast test; no assertion changed.

## Section 9 acceptance map

PASS below means the specified **automated layer** passed, not independent review
or real-device acceptance. Open contrast/type/performance findings keep Q1 red.

| ID  | Fresh evidence and scope                                                                                                                                                   | Result                                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| N1  | Native binding/Dialog/PortfolioNavigation tests; phone/desktop invokers, Close/Escape, fallback and final focus in lifecycle browser suite.                                | PASS Chromium/unit                                    |
| N2  | Primary/full About/legal hrefs; actual `/`, `/about`, `/impressum`, `/privacy` routes; release/main focus and footer links.                                                | PASS Chromium/component                               |
| N3  | Repeated/current hashes and query-removal variants assert Contact focus, next Tab, released lock and scroll after queued cleanup.                                          | PASS Chromium                                         |
| N4  | Secondary Contact, delayed/failed/redirected navigation, superseding interaction, native mailto inspected without activation. Isolated client redirect also rerun.         | PASS production; development intermittent noted       |
| N5  | Direct load/refresh, native hash/history, nonzero full-document Back/Forward, teardown, actual persisted BFCache return, external fragments.                               | PASS production Chromium                              |
| N6  | Keyboard, modified click/new-tab and downloads retain native same-tab behavior.                                                                                            | PASS Chromium                                         |
| N7  | Ten cycles at narrow/wide sizes, native close, immediate reopening; adapter queued-callback ownership.                                                                     | PASS Chromium/unit                                    |
| N8  | Failed native opening, no-JS/unavailable enhancement and ordinary links.                                                                                                   | PASS Chromium/unit                                    |
| N9  | All proposed viewport samples, 100/200% text, long panels, additional short rails, safe-area fixture, breakpoint changes, hidden invoker and footer reachability.          | PASS Chromium; human review pending                   |
| T1  | System/Default/Dark/Muted/High Contrast, selected service state, page and visible logo colors.                                                                             | PASS service/browser                                  |
| T2  | OS light/dark changes affect only System; selected/resolved semantics retained.                                                                                            | PASS service/browser                                  |
| T3  | Denied reads/writes, stale storage, fresh subscribers/current getter, settings reopen and new combined cross-route journey.                                                | PASS service/browser                                  |
| T4  | Invalid/missing storage, persistence/reload, repeated initialization, bootstrapped first paint before framework scripts, On/Off startup.                                   | PASS unit/production browser                          |
| M1  | SSR/initial static snapshot, delayed initialization, hidden/failed startup and bounded fail-open; pending homepage masking follows accepted FS-3.5 amendment.              | PASS provider/logo/browser                            |
| M2  | Current four-choice truth table across 15,360 combinations, including unavailable OS signal and reduced-alternative capability.                                            | PASS pure policy                                      |
| M3  | Validated key, denied storage, stale inputs, selection races and live choices despite failed writes.                                                                       | PASS policy/service/integration                       |
| M4  | Shared preference with two independent fake consumers, Pause/visibility and separate provider trees.                                                                       | PASS fixtures/provider; not particle scheduling proof |
| M5  | Pause survives environment/preference/flag/theme changes; actual logo imperative controls remain gated.                                                                    | PASS fixture/logo                                     |
| M6  | Setup/cleanup replay, subscription disposal, initialization teardown, late/reentrant/throwing callbacks and notification consistency.                                      | PASS service/adapter/provider                         |
| L1  | All parts/static fallbacks, OS/Off/availability/runtime failure, mid-draw changes, Reduced fade, late hydration after fallback.                                            | PASS real timeline/production browser                 |
| L2  | Unique SVG identifiers, nominated identity only, public seek/play/reverse/Pause and no override bypass.                                                                    | PASS logo/browser                                     |
| L3  | Completion survives theme/menu/visibility changes; unfinished permitted work resumes; no global scheduler.                                                                 | PASS logo/browser                                     |
| F1  | JavaScript disabled: all four routes, direct/refresh/native history, static navigation, skip link, Contact/mailto and complete artwork.                                    | PASS actual Chromium routes                           |
| Q1  | Main types/lint/tests/coverage/builds pass; interaction contrast, expanded E2E types and standard On performance evidence do not.                                          | FAIL; owners below                                    |
| G1  | Shared/game theme reader and host/loader regressions, game tests/build/demo and real runtime checks; source guard finds no decorative-policy dependency in game/host code. | PASS scoped tests + source inspection; not FS-G1      |

Viewport coverage is 320×568, 390×844, 844×390, 1280×720 plus 768×1024,
1440×900 and short 320×320/481/577 and 1280×320 rail fixtures. The responsive
suite exercises all four real routes in the four explicit themes at 100% and
200% text. The new combined journey uses all four proposed samples at 200% text.
These are CSS pixels and emulated text/inputs, not physical device results.

## Findings returned to original owners

### P2 — Appearance active-state text loses contrast (Sites controls/theme UI)

Reproduce in any explicit theme: open Accessibility, hover an unselected
appearance choice, hold pointer down. Existing unfiltered `home.a11y.spec.ts`
fails in all four themes on both builds. Default example: `#9c4b2b` text on
`#1a1a1a`, 2.86:1 for 16px text instead of 4.5:1.
[ThemeSwitcher.module.css:17](../../frontend/components/ThemeSwitcher.module.css#L17)
retains the hover foreground while the shared outlined active rule reverses
the background. Impact: unreadable active-state control text. Sites must
reconcile hover/active/selected tokens and rerun all interaction states; no
palette change or accessibility exclusion is proposed. **Corrected by Sites;
fresh author checks PASS. Independent review pending; see correction handoff.**

### P2 — Motion hover colors conflict with small labels/selection (Sites FS-3.1/3.5 UI)

The overlay sets 16px semibold labels in
[PortfolioNavigation.module.css:109](../../frontend/components/Layouts/PortfolioNavigation.module.css#L109),
while [controlAppearance.module.css:39](../../frontend/components/Controls/controlAppearance.module.css#L39)
uses the large-label hover token and can override the selected foreground at
`PortfolioNavigation.module.css:131`. New unsuppressed interaction tests fail
in all four explicit themes on both flags. Default unselected On hover is
3.02:1; selected On hover is 2.34:1 dark, 2.06:1 muted and 1.88:1 high contrast.
Active unselected states pass. Impact: small settings text falls below 4.5:1.
Sites must preserve readable selected/hover states with existing semantic
tokens and rerun `epic3-control-contrast.spec.ts` and home axe. **Corrected by Sites;
fresh author checks PASS. Independent review pending; see correction handoff.**

### P2 — E2E type coverage is broken by two Playwright types (Codex tooling owner)

Normal [frontend types](../../frontend/tsconfig.json) exclude stories and root
E2E. Expanded checking now validates all stories, but 21 axe call sites still
fail TS2739: runner Page lacks `consoleMessages`, `pageErrors`, `requests`.
Installed `@playwright/test` uses core 1.55.1; axe 4.11.0 resolves core 1.56.1
([lockfile](../../pnpm-lock.yaml), entries around 16/5788). Runtime axe executes,
so this is a verification/toolchain compatibility defect, not evidence of a
browser crash. Owner must reconcile compatible dependency types and add lasting
coverage without `any`, casts or suppressions. No package/lockfile change was
made during the initial validation. **Corrected by Codex; original and permanent
expanded checks now PASS without suppressions. See the tooling handoff below.**

### Q1 evidence blocker — standard flag-on Lighthouse has no LCP (Sites startup / Codex performance)

All three standard reports return an unavailable LCP/score; the unchanged
2,500 ms assertion fails. Extended capture gets a value, suggesting collection
and staged reveal timing need reconciliation. This is an inference, not proof
of a measured performance regression. Owner must establish a representative,
reviewed capture without weakening thresholds; the diagnostic is not a gate
PASS. **Historical finding: capture repaired by the performance correction below;
valid observed flag-on LCP now fails the unchanged budget.**

### Intermittent observation — development redirected Contact scroll (Sites FS-3.2)

One development run changed scroll from 1109 to 929 after Tab. Same assertions
passed six serial repetitions; production lifecycle/redirect checks passed.
Trace retained under `browser-dev-results`. Cause is not established; do not
silently discard it or infer a production defect. Follow up if reproduced.

## Validation fixture corrections and final-candidate reruns

During the initial validation, only fixtures changed: new combined journey and Motion contrast
coverage; responsive tab inventory excludes closed dialog/disclosure links;
invoker fixtures assert actual HTML buttons before using `.hidden`; Minimal
story args are correctly partial (inherited heading remains required by the
component); mid-draw logo checks await actual `waiting` before Escape; bootstrap
paint checks now cover On/Off and expect the approved pending mask only for On.
No focus/contrast assertion, coverage threshold or accessibility rule was removed.

Affected responsive/lifecycle checks, both logo variants, both bootstrap variants,
story types/build and expanded types were rerun against the final test candidate.
At that stage, production source remained byte-identical to both built variants; unit
and coverage results therefore still describe the same runtime. Product
findings above were reproduced and returned, not silently fixed by validation.
After owner corrections, rebuild affected variants and rerun those exact suites
before refreshing this record and requesting independent approval. The two Sites
contrast corrections now have that separate evidence below.

## Sites contrast correction — 2026-09-27

**Request/owner:** Dimi explicitly requested the appearance active-state and
Motion hover contrast fixes. Sites is the sole correction author. Both findings
are corrected with fresh automated evidence, pending independent review.
No FS-G1 approval or new device observations are implied.

**Bounded change:** `ThemeSwitcher.module.css` excludes `:active` from the
unselected hover override, preserving the shared outlined control's inverse
foreground/background pair while pressed. `PortfolioNavigation.module.css`
keeps the selected Motion pair intact on hover and uses the existing normal-text
hover token for unselected, non-active choices. The small labels no longer use
the large-text hover allowance. Shared control styling, palettes/generated
tokens, theme/policy authorities, routing, focus behavior and playback are unchanged.
There is no public contract change.

`epic3-control-contrast.spec.ts` now measures unselected focus/hover/active and
selected hover/active/focus in all four explicit themes. It checks actual rendered
colors at 4.5:1 and visible keyboard outlines. The existing unfiltered home axe
checks remain unchanged, including Appearance pointer-down and keyboard states.

**Exact candidate:** base `53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef` on
`feature/funkspace-minimum-usable`, preserving the ten pre-existing FS-3.6 changed
files. Only the two CSS files, contrast test and three existing FS-3.6 documentation
records change in this correction. Evidence is retained outside the repository at:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.6-contrast-fix/`.
`baseline/` preserves prior work; `candidate.json`/`candidate.patch` identify the
full current uncommitted candidate; `correction.patch` isolates this request.
The three-file runtime/test `correction-source.patch` has SHA-256
`c2a2b646ce1b59bab7fcd0a01175689840a786d0b86af6f521078fa7aeb20fa1`.
Configurations, exact commands, timestamps, reports and per-command logs accompany
the manifest. No commit, push or deployment was performed.

Both isolated production copies received the two changed stylesheets and ran
`pnpm build` with explicit build-time `NEXT_PUBLIC_ANIMATIONS_ENABLED=true/false`.
On build ID: `o2fdf0KSEmS9fkqwMSXTA`; Off: `01W-RnJ6Fs9Cbw7Z8ZKK8`.
Runtime source comparison and generated-diff guards accompany the handoff.
Test expectation flags do not stand in for these builds.

| Fresh correction check                                                                         | Result                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Development home axe + Motion contrast                                                         | 8/8 PASS (`contrast-dev`).                                                                                                                                                     |
| Production home axe, Motion contrast, Appearance, navigation composition and combined journeys | On 42/42 PASS; Off 42/42 PASS (`browser-on`, `browser-off`), zero retries. Includes denied storage, OS changes, reloads, narrow/wide/short and enlarged text.                  |
| Affected ThemeSwitcher and PortfolioNavigation component tests                                 | 6/6 PASS, three files (`focused-components`).                                                                                                                                  |
| Normal frontend types and expanded story types                                                 | PASS (`types`, `story-types`).                                                                                                                                                 |
| Production builds and Storybook build                                                          | PASS (`build-on`, `build-off`, `storybook-build`).                                                                                                                             |
| Rebuilt Storybook dialog/navigation/themes/foundations browser checks                          | 35/35 PASS (`storybook-browser`).                                                                                                                                              |
| Repository lint, formatting and bootstrap consistency                                          | PASS (`lint`); final documentation formatting checked separately.                                                                                                              |
| Expanded stories + E2E types                                                                   | FAIL: the same 21 TS2739 Playwright `Page` mismatches (`expanded-types`), no suppressed diagnostics.                                                                           |
| Standard three-run Lighthouse on rebuilt variants                                              | Off PASS: performance 100, LCP 724–727 ms, CLS about 0.0046. On FAIL: no LCP or performance score in all three runs (`lighthouse-off`, `lighthouse-on`); thresholds unchanged. |

Motion unselected-hover ratios are 4.87:1 Default, 5.95:1 Dark, 10.21:1 Muted,
and 11.18:1 High Contrast. All five other sampled states are 13.94:1 for
Default/Dark and 21:1 for Muted/High Contrast, on both builds. The eight original
contrast failures therefore pass in the affected rerun; the initial 210/8 report
is retained as historical evidence, not relabeled as a fresh full-suite run.

**Review and acceptance:** hand the exact correction to Codex for read-only
review; do not adopt these author results as independent approval. Dimi's updated
checklist requests actual settings contrast/focus observations. Expanded E2E
type incompatibility and standard flag-on Lighthouse LCP remain separate Q1
blockers. Firefox/WebKit automation, new physical-device acceptance and FS-G1
remain pending. The full unit/coverage/game and all-route matrix were not rerun
for this two-stylesheet correction; their prior results remain historical.

## Codex Playwright type correction — 2026-09-27

**Request/owner:** Dimi explicitly requested correction of the 21 incompatible
Playwright E2E type errors. Codex is the sole author of this tooling correction;
this is not an independent review of Sites or the integrated candidate.

**Reproduction and cause:** the original expanded compiler invocation reproduced
21 TS2739 diagnostics before editing (`reproduce-types`). Installed axe 4.11.0
declares `playwright-core >= 1.0.0` as a peer; pnpm had supplied 1.56.1, while the
pinned `@playwright/test` runner uses 1.55.1. The runner's `Page` therefore lacked
the newer peer's `consoleMessages`, `pageErrors` and `requests` members.

**Bounded correction:** root `package.json` explicitly provides `playwright-core`
1.55.1 as a devDependency. The regenerated lockfile resolves axe and the runner
to the same installed module and removes the unused 1.56.1 entry. Runner, browser,
axe and production dependencies retain their versions. An unrelated automatic
`third-party-web` update was removed from the proposed lockfile before the final
frozen install; no Lighthouse dependency update remains. This follows normal
[pnpm peer resolution](https://github.com/pnpm/pnpm.io/blob/main/versioned_docs/version-10.x/settings.md#autoinstallpeers),
without an override, cast, ignored diagnostic or test exclusion.

New `frontend/tsconfig.validation.json` extends existing strict compiler settings
and includes frontend stories, every E2E/fixture file and root Playwright configs.
Only generated build output and dependencies are excluded; existing compiler
strictness is preserved. Additional paths resolve root E2E references to Next.js
and the public common colors export. They have no runtime effect. Root
`pnpm typecheck:validation` runs it, and `.github/workflows/ci.yml` adds that
command after the existing frontend type check. README documents both the check
and keeping the explicit core peer aligned with the runner on future upgrades.
No product API, service, test assertion or application source changed here.

**Candidate and preservation:** branch `feature/funkspace-minimum-usable`, base
`53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef`, plus the prior FS-3.6 validation and
Sites contrast corrections. All 12 pre-existing changed files were snapshotted;
only the three shared documentation records are amended by this request. New
tooling changes are `package.json`, `pnpm-lock.yaml`,
`frontend/tsconfig.validation.json`, `.github/workflows/ci.yml` and `README.md`.
Evidence directory:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.6-tooling-fix/`.
`candidate.json`/`candidate.patch` record the full diff and hashes;
`correction.patch` isolates this request; `baseline/` preserves the prior work.
`commands.json`, individual logs, browser reports/configs,
`dependency-resolution.json` and `validation-file-coverage.json` supply exact evidence.

| Fresh tooling check                                         | Result                                                                                                                                                    |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Original expanded command before/after                      | 21 errors before; zero afterward (`reproduce-types`, `expanded-types-after`).                                                                             |
| `pnpm install --offline --frozen-lockfile --ignore-scripts` | PASS; dependency-only install from cache, not browser installation (`frozen-install`).                                                                    |
| `pnpm typecheck:validation`                                 | PASS with no diagnostics (`validation-types-final`).                                                                                                      |
| Compiler input audit                                        | All 78 current story/E2E/fixture/Playwright-config files included; none missing.                                                                          |
| `pnpm -F frontend exec tsc --noEmit --incremental false`    | PASS (`types`).                                                                                                                                           |
| `pnpm test`                                                 | 1,597/1,597 PASS, 106 files; includes bootstrap freshness (`unit`).                                                                                       |
| Production browser checks with corrected dependency graph   | On 42/42 PASS; Off 42/42 PASS (`browser-on`, `browser-off`). Suites: home axe, Motion contrast, Appearance, navigation composition and combined journeys. |
| Built Storybook browser checks                              | 35/35 PASS, dialog/navigation/themes/foundations (`storybook-browser`).                                                                                   |
| `pnpm lint`                                                 | PASS: bootstrap consistency, Next lint and repository formatting (`lint`).                                                                                |

Browser checks reuse the contrast-corrected production artifacts with build IDs
`o2fdf0KSEmS9fkqwMSXTA` (On) and `01W-RnJ6Fs9Cbw7Z8ZKK8` (Off), plus its built
Storybook. The change affects validation dependencies/configuration only; those
artifacts' product source is unchanged. This is a fresh test-runner/axe execution,
not a claim that these artifacts were rebuilt during this correction. No new
build, Lighthouse, coverage or physical-device run is claimed. The checked-in CI
step ran locally through its exact command; remote GitHub CI was not triggered.

**Next acceptance action:** independent reviewer checks this dependency/config
diff and reruns `pnpm typecheck:validation`. The Sites contrast correction remains
a separate author handoff. Standard flag-on Lighthouse evidence is still blocked;
Firefox/WebKit automation, Dimi's fresh device observations and FS-G1 decision
remain pending. No commit, push, deployment or external configuration change.

## Performance capture and homepage timing correction — 2026-09-27

**Request/owner:** Dimi requested the missing flag-on performance evidence fix.
Codex is the sole author of this bounded Sites-startup/performance correction.
Dimi explicitly approved shortening the homepage logo introduction from 1,500 ms
to 1,000 ms, preserving the menu-first order and 800 ms content fade. This timing
choice is not device acceptance or FS-G1 approval.

**Cause and correction:** default simulated Lighthouse capture finishes before
eligible content appears during the SVG-only introduction. Extending capture
alone produces a simulated LCP around 729 ms despite an observed paint around
2,821 ms, so that diagnostic must not be used to certify the visible sequence.
Both checked-in Lighthouse variants now use observed DevTools timings. Lighthouse
12.6.1 supplies a 5,250 ms quiet/capture window in this mode. Explicit network
settings translate the desktop preset's 40 ms RTT / 10,240 Kbps using Lighthouse's
3.75 / 0.9 calibration factors: 150 ms request latency, 9,216 Kbps download/upload,
CPU 1×. Otherwise the desktop preset leaves DevTools networking unthrottled.
This is an explicit lab profile, not a claim that simulation and applied
throttling are identical. Viewport remains desktop 1,350 × 940 at DPR 1.

All assertions are preserved: three runs, LCP p75 ≤ 2,500 ms, CLS p75 ≤ 0.1,
performance-score warning below 0.9. No error, audit, accessibility assertion or
feature gate was suppressed. Primary methodology references are
[Lighthouse throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)
and the installed Lighthouse/Lantern constants retained with the evidence.

`PortfolioShell` reuses `LogoMotion`'s existing `speed` prop (1.5× for the nominated
homepage instance). The default shared 1,500 ms manifest and other logo copies
are unchanged; the full draw and Reduced fade each take 1,000 ms on this instance.
Menu remains 400 ms; content remains 800 ms. The existing real-route regression
now requires the logo to remain active at 800 ms and yield to the menu by 1,100 ms
for On, Reduced and Follow system at 320/1,280 px. It retains the actual partial
opacity, menu/content duration, layout and completion assertions. No authority,
port, lifecycle, storage, bootstrap, generated token or game code changed.

**Candidate:** branch `feature/funkspace-minimum-usable`, base
`53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef`, plus the existing 17-file candidate and
this correction. Changed by this request: both `.lighthouse/lighthouserc.*.json`,
`frontend/components/Layouts/PortfolioShell.tsx`, `e2e/home-intro.spec.ts`, README,
this record, the feature-plan status and device checklist. Baseline snapshots,
exact `correction.patch`, full `candidate.patch`/`candidate.json`, command metadata
and reports are outside the repository at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.6-performance-fix/`.

Both isolated copies ran `pnpm build` with explicit build-time flags. On build ID
`dcRucbkOaXzPzqgIwB2AA`; Off `UXZSuf9rB7o47CjPfqMuT`. The runtime-source guard
compares 129 files per build with no mismatch. Ports 3220/3221 replace occupied
port 3000 only in retained audit configs; reports live outside the checkout.
Lighthouse 12.6.1 used installed Headless Chrome 154.0.0.0; browser regressions
use the project's Playwright Chromium. Earlier local diagnostic configs lacked
applied network throttling and are retained as diagnostics, not final evidence.

| Fresh check                                                                | Result / retained command label                                                                                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Original 1,500 ms introduction, observed timings without network emulation | FAIL: LCP 2,806–2,815 ms, score 0.85, three runs (`lighthouse-on`).                                                                        |
| Approved 1,000 ms introduction, without network emulation                  | LCP 2,286–2,337 ms; score 0.88 WARN. Diagnostic only (`lighthouse-final-on`); not the final profile.                                       |
| Final calibrated flag-on profile                                           | FAIL: all three LCPs 3,092.81 / 3,078.43 / 3,107.57 ms; score 0.82 WARN; CLS 0 (`lighthouse-throttled-on`). Valid metrics in every report. |
| Final calibrated flag-off profile                                          | PASS: LCP 453.92 / 457.20 / 459.29 ms; score 1.00; CLS 0.004603 (`lighthouse-throttled-off`). Valid metrics in every report.               |
| Focused logo, homepage binding and server-shell tests                      | 85/85 PASS across three files (`unit`). The command also named two nonexistent test paths; these supplied no additional coverage.          |
| Strict application/story/E2E types and lint/bootstrap freshness            | PASS (`validation-types`, `lint`).                                                                                                         |
| Production builds and reconciled Storybook build                           | PASS (`build-on`, `build-off`, `storybook-build-final`).                                                                                   |
| Real production startup/logo/settings/integration/axe suites               | On 59/59 PASS; Off 59/59 PASS, no retries (`browser-on`, `browser-off`).                                                                   |
| Theme/bootstrap first-paint and no-JavaScript checks                       | On 21/21 PASS; Off 21/21 PASS (`bootstrap-on`, `bootstrap-off`).                                                                           |
| Rebuilt Storybook checks                                                   | 35/35 PASS (`storybook-browser-final`).                                                                                                    |

**Outcome:** missing LCP/score evidence is repaired, but Q1 remains FAIL because
the observed flag-on page misses the unchanged performance budget. The approved
one-second logo alone is insufficient under applied network conditions. Owners
Sites startup / Codex performance must resolve startup/sequence latency before
closure; any further change to accepted pacing/order needs Dimi's decision.
Do not substitute an unthrottled or simulated diagnostic's green exit code.
Independent review, Dimi's new pacing/device observations and FS-G1 remain
separate and pending. No commit, push, deployment or environment change.
Full unit/coverage/game suites and the full 218-route matrix were not rerun for
this instance-speed/configuration correction; earlier results remain historical.
Firefox/WebKit automation remains unavailable. Legal/content/public-release
limitations are unchanged.

## EPIC 3 closure and final re-review — 2026-09-27

**Actual user decision:** after approving FS-G1, reporting Firefox/WebKit testing
complete and explicitly increasing the LCP limit to 5 seconds, Dimi said:
“ok lets close up the EPIC 3, all tests are done. re-review and update the
documentation”. This is explicit closure and an overall test-completion report.
**FS-3.1–FS-3.6, EPIC 3 and FS-G1 are COMPLETE/ACCEPTED.** The latest instruction
supersedes the earlier evidence-detail hold; no further closure approval is
requested. It supplies no device/OS/version or individual action results, so
those remain unspecified instead of being filled with fabricated PASS values.

**Exact closure candidate:** `feature/funkspace-minimum-usable`, HEAD
`53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef`, plus the existing uncommitted candidate.
The complete pre-documentation patch SHA-256 is
`c6c70d837806b27ab9f95853034154684c5ffe102bdddc37f550e7703af07d4c`.
All 21 modified/untracked file hashes matched the budget-amendment manifest.
`artifacts/fs-3.6-closure/` in the project workspace retains the exact patch,
baseline snapshots, `re-review.json`, documentation delta and final hashes.
There is no new commit SHA; this is an identified working-tree acceptance.

**Bounded final re-review: PASS, no additional findings.** Current application,
test and tooling bytes match the fresh independent review's candidate. Comparing
both current Lighthouse configs with that reviewed base confirms the only later
executable change is the explicitly approved LCP maximum of 2,500 → 5,000 ms.
Three-run sampling, calibrated observed timings, CLS and score-warning assertions
are unchanged. Command exit metadata and all six measured LCP/CLS samples from
the budget amendment were inspected and satisfy the current error-level limits.
This is a source/evidence re-review, not a new independent full-suite execution.

| Evidence level                 | Closure evidence                                                                                                                                                                                                                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Independent technical review   | Functional PASS; no additional actionable defect. 1,597 unit tests, 218 route checks per flag and 21 bootstrap checks per flag passed. The focused 195 tests are subset evidence. Exact review patch `1a7f6e9966c49ea3df007c6df7f6de9f7ee49587d2c4620a00398d2a510e08f8`; logs remain in `artifacts/fs-3.6-final-independent-review/`. |
| Critical-policy review         | Separate FS-3.4 subscriber-correction PASS; authority hash verified unchanged by final independent review. Later consumer/provider changes inspected independently.                                                                                                                                                                   |
| Current performance acceptance | Three runs per built flag PASS under Dimi's 5,000 ms budget: On 3,072–3,102 ms, Off 451–454 ms. On score 0.82 remains WARN; Off score 1.00. No runtime speed improvement claimed.                                                                                                                                                     |
| Dimi acceptance                | Explicit FS-G1 approval, Firefox/WebKit testing reported complete, then explicit “all tests are done” and EPIC 3 closure. Individual device/version/action/build details not supplied.                                                                                                                                                |
| This documentation-only task   | Candidate/config/report reconciliation plus local links, formatting, status and diff/preservation checks. No new application tests/builds/browser/device sessions claimed.                                                                                                                                                            |

Accepted production build identities remain On `dcRucbkOaXzPzqgIwB2AA` and Off
`UXZSuf9rB7o47CjPfqMuT`. These identify automated artifacts, not an invented device
test build. Historical failures/environment restrictions and their corrections
remain in their original records. All blocking implementation findings are
resolved or, for LCP, superseded by Dimi's explicit acceptance-budget amendment.

**Handoff:** the implemented theme/motion API, independent local Pause/visibility,
static/error paths, feature flags and shared dialog/navigation extension points
below remain the EPIC 4 base. FS-G1's prerequisite is satisfied. EPIC 4 has not
started and needs its own requested task/contract checkpoints. Draft content,
missing legal/operator/privacy facts, live contact delivery and public-release
authorization remain separate. Closure authorizes no commit, push, merge,
deployment, environment change or live email.

## Approved LCP budget amendment — 2026-09-27

Dimi explicitly requested: “performance issue, lets increase the limit to 5 sec”.
Both checked-in Lighthouse variants now assert LCP p75 ≤ **5,000 ms**, replacing
2,500 ms. This user-authorized acceptance change supersedes the earlier decision
to leave the old-budget finding open. It is not a startup optimization: the
1,000 → 400 → 800 ms animation sequence and all application code are unchanged.
The prior failed measurements remain valid historical results under their
original 2,500 ms budget; they are not relabeled as passing runs.

Three runs, observed/calibrated desktop measurement settings, CLS p75 ≤ 0.1 and
the performance-score **warning** below 0.9 remain unchanged. The score warning
must still be reported even when the command's error-level assertions pass.
No accessibility assertion, audit or test exclusion changed.

Base remains `53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef` on
`feature/funkspace-minimum-usable`. Existing production build IDs remain
`dcRucbkOaXzPzqgIwB2AA` (On) and `UXZSuf9rB7o47CjPfqMuT` (Off); no application
rebuild is needed for an assertion-only change. Runtime/tests/tooling retain the
independently reviewed bytes. This later budget/configuration amendment was
requested by Dimi; it is not falsely attributed to the prior independent review.

Evidence, exact command metadata/configs, fresh reports, baseline snapshots and
the amendment diff are in the project workspace's
`artifacts/fs-3.6-budget-amendment/`, outside the repository. Audits use the actual
built variants at ports 3220/3221 instead of occupied port 3000, with report paths
redirected outside the checkout. No commit, push, deployment or next-epic work.

Fresh `pnpm exec lhci autorun --config=/tmp/fs36-budget/lighthouse-on.json` and
the matching `lighthouse-off.json` command both exit 0 against the retained
flag-specific production copies. Exact commands/cwd/timestamps are in
`lighthouse-on.json` / `lighthouse-off.json` command metadata alongside the logs.

| Built variant | Three observed LCP samples           | CLS      | Performance score                 | Revised-budget result                            |
| ------------- | ------------------------------------ | -------- | --------------------------------- | ------------------------------------------------ |
| On            | 3,101.830 / 3,072.092 / 3,084.252 ms | 0        | 0.82 in each run — WARN below 0.9 | LCP/CLS PASS; command exit 0 with score warning. |
| Off           | 451.390 / 450.761 / 453.586 ms       | 0.004603 | 1.00 in each run                  | PASS; command exit 0.                            |

The LCP finding is closed **under the explicitly revised budget**. Missing
device/OS/browser-version/action/candidate details remain an acceptance-evidence
limitation; Dimi's explicit FS-G1 decision stays recorded separately. No new
application/unit/browser-functional test, build or independent review is claimed
for this two-value configuration change. JSON comparison verifies only the LCP
numbers changed in the audit configs; formatting, local links and diff/preservation
checks cover the documentation amendment.

## Final independent review and retained performance decision — 2026-09-27

Historical verdict before the approved budget amendment and final closure above.
Its exact runtime review and executed tests remain applicable; its old-budget
blocker status is superseded by those later decisions.

Dimi requested performance resolution and a final independent review. After the
trace showed that the sequential reveal is the bottleneck, Dimi explicitly chose:
“Keep the current order and timing; leave the performance blocker open.” Preserve
logo 1,000 ms → menu 400 ms → content 800 ms. The proposed overlapping fade was
not approved or implemented. No application, test, configuration, dependency,
threshold or environment changes were made during this task. This is a decision
to retain an open finding, not a performance PASS or budget waiver.

Fresh agent `/root/fs36_final_independent_review` independently inspected the
complete diff, including five untracked files, and reran checks read-only.
**Verdict: independent functional PASS; no additional actionable defect found.
Overall technical closure remains BLOCKED.** Contrast, type/peer/CI corrections,
homepage-only speed, actual rendered-state assertions, navigation cleanup,
theme/policy authorities and later provider/consumer amendments were inspected.
The earlier critical-policy service hash was verified; its approval was not
silently extended to later changes. No self-review substitutes for this review.

**Exact reviewed candidate:** HEAD `53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef`,
branch `feature/funkspace-minimum-usable`, plus 21 changed/untracked files.
Complete patch SHA-256:
`1a7f6e9966c49ea3df007c6df7f6de9f7ee49587d2c4620a00398d2a510e08f8`.
The reviewer verified all 21 hashes and HEAD remained unchanged. Its durable
`review.md`, `results.json`, `candidate.json`, complete patch, configs and logs are
in the project workspace's `artifacts/fs-3.6-final-independent-review/`, outside
the repository. Only this subsequent three-document handoff differs from that
reviewed candidate; all runtime/test/config bytes remain the reviewed bytes.

| Independent check                                                     | Actual result                                                                                                                       |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Full real production route matrix                                     | 218/218 PASS per flag, zero skipped/flaky/unexpected cases or retries.                                                              |
| Bootstrap / first paint / no-JavaScript                               | 21/21 PASS per flag.                                                                                                                |
| Full repository unit suite                                            | 1,597/1,597 PASS, 106 files.                                                                                                        |
| Focused lifecycle/theme/policy/logo/game-adapter units                | 195/195 PASS, 16 files; subset evidence, not an additional distinct full suite.                                                     |
| Application and expanded story/E2E types; bootstrap freshness         | PASS.                                                                                                                               |
| Next lint with external cache, full repository formatting, whitespace | PASS; no rules weakened.                                                                                                            |
| Retained production builds                                            | 143 runtime/config files match each copy; build IDs remain `dcRucbkOaXzPzqgIwB2AA` / `UXZSuf9rB7o47CjPfqMuT`. No new build claimed. |
| Performance reports/methodology                                       | Source/report inspection only; no new Lighthouse run. Enabled LCP 3,078–3,108 ms remains FAIL; disabled retained evidence PASS.     |

The initial server-start `EPERM` and protected lint-cache failures are retained
as environment attempts; tests ran successfully after local-server permission
and identical lint rules with a `/tmp` cache. Review servers stopped. Firefox/
WebKit executables remain absent; Dimi's separate reported testing is preserved.
No new Storybook, coverage, standalone-game browser, physical-device, Canvas,
email or deployment validation is claimed.

**Remaining P2, owners Sites startup / Codex performance:** the enabled page's
observed LCP exceeds 2,500 ms and its score is 0.82. Evidence anchors are
`PortfolioShell.tsx:76`, `PortfolioShell.module.css:40` and
`.lighthouse/lighthouserc.on.json:22`. Leave this finding open as Dimi requested;
future resolution needs an authorized performance approach and affected reruns.
Independent review is now supplied; it is not an outstanding missing review for
these bytes. Missing device/OS/version/action/candidate details still belong to
Dimi. Explicit FS-G1 approval remains recorded separately; EPIC 4 is not started.

## Acceptance evidence reconciliation — 2026-09-27

Historical initial acceptance-record stage. The explicit all-tests-complete and
EPIC 3 closure decision above supersedes this stage's evidence-detail hold.

This update changes documentation only. Dimi explicitly said “Firefox/WebKit test
are through, FS-G1 is accepted.” Record **Dimi decision: APPROVED**, received on
2026-09-27 (Europe/Berlin). This is an actual decision, not inferred approval.
The same request requires a blocked/pending gate when evidence, required reviews
or fixes remain missing; therefore **FS-3.6 technical closure / FS-G1 gate status:
BLOCKED**, with the approval preserved separately. No waiver of the performance
budget or missing review is inferred.

The [device record](fs-3.6-device-checklist.md#actual-report-and-evidence-limits--2026-09-27)
contains the actual report. Device/OS, Firefox and WebKit/Safari versions, test
date, per-action actual outcomes and tested candidate were not supplied. Dimi's
clarification reply “ok” adds no such details. Earlier FS-3.2/3.5 observations and
versions cannot populate this record. Previously unavailable automated runners
remain a historical automation limit, distinct from this new user report.

**Exact inspected candidate:** branch `feature/funkspace-minimum-usable`, HEAD
`53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef`, plus the full performance-correction
candidate patch SHA-256
`53e34407290e70ce65b048181a253c3e907b1583934a0d5ff1881b2c83640359`.
All 21 recorded changed-file hashes matched before this documentation update.
The On/Off build IDs and tests in the performance section apply to its unchanged
runtime. This is the available repository candidate, **not a confirmed device-test
reference**. The documentation-only delta, file hashes and preservation/link checks
are retained under the project workspace's `artifacts/fs-3.6-acceptance-record/`.

| Item                                            | Reconciled evidence / status                                                                                                                                                                                                                                                                                               | Necessary owner and next action                                                                                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dimi decision                                   | APPROVED explicitly; date above.                                                                                                                                                                                                                                                                                           | No repeat approval requested merely to record the decision.                                                                                                  |
| Firefox/WebKit and physical-device evidence     | Reported testing complete; versions/device/actions/candidate unspecified. No per-row PASS added.                                                                                                                                                                                                                           | Dimi: supply the missing test details or identify a retained report.                                                                                         |
| Appearance/Motion contrast and E2E type defects | Author checks and subsequent fresh independent review PASS; assertions/types were not weakened.                                                                                                                                                                                                                            | Independent review supplied; no additional defect for these bytes.                                                                                           |
| FS-3.6 technical review                         | Retained `artifacts/fs-3.6-technical-review/`: 218 route checks and 21 bootstrap checks per flag, 194 focused tests, game 920 + 2 browser checks; pre-performance candidate patch `69eb9447a4956767957d6c23e34662fe77fd1039ea8eb3c6207688a8c7ca2927`. Same-author contrast/tooling inspection is not independent approval. | Subsequent final independent review above inspected these changes: functional PASS; subsequent LCP budget amendment and explicit closure are recorded above. |
| Critical policy review                          | Separate subscriber-isolation re-review PASS is recorded in FS-3.4. Service hash still `cfa60e0dcdc3291571c008fbc72dffd9f213116a2272818d439b60d2be8e9782`; this is not blanket approval of later consumer amendments.                                                                                                      | Preserve this evidence; do not label self-review independent.                                                                                                |
| Missing Lighthouse values                       | RESOLVED: three valid samples for both built variants.                                                                                                                                                                                                                                                                     | Retain the corrected measurement profile.                                                                                                                    |
| Flag-on performance                             | PASS under Dimi's subsequent 5,000 ms budget: fresh LCP 3,072–3,102 ms. Score 0.82 remains WARN. Prior 2,500 ms failure is historical.                                                                                                                                                                                     | Budget amended explicitly; this is not a runtime optimization. See the budget-amendment evidence above.                                                      |

### EPIC 4 implementation handoff

This handoff describes implemented foundations after FS-G1 closure; it does not
authorize or start EPIC 4. Presentation → Application → Domain ← Infrastructure
remains binding.

- **Theme:** existing [ThemeService](../../frontend/application/theme/ThemeService.ts)
  provides `setTheme`, immediate `subscribe` (returns unsubscribe),
  `getCurrentTheme`, `getStoredTheme`, `resolveTheme` and `resolveSystemTheme`.
  Subscription state separates `selectedTheme` from `resolvedTheme` using
  [validated metadata/types](../../frontend/domain/theme/Theme.ts). Live choices
  survive failed storage writes; explicit storage queries still query storage.
  System alone follows OS changes. Preserve bootstrap source/generation; blocked
  reload has safe fallback, not promised persistence. Do not introduce scene storage.
- **Motion:** consume `useServices().motionPolicy` through the existing
  [provider](../../frontend/application/providers/ServiceProvider.tsx), with
  `getSnapshot`, immediate `subscribe`/unsubscribe and `setPreference` from
  [MotionPolicyConsumer](../../frontend/application/motion/MotionPolicyService.ts).
  Provider alone owns activation/release; consumers do not initialize/dispose the
  shared authority. One validated key `funkspace.motion.preference.v1` stores
  `system | on | reduced | off`; failed writes retain live preference. The stable
  initial snapshot is pending/System/unknown/hidden and cannot animate.
- **Permission and local state:** use the pure
  [resolveMotionPermission](../../frontend/domain/motion/MotionPolicy.ts).
  Selected preference stays separate from effective permission/blockers. Pass
  feature availability, opt-in, local visibility, local Pause and runtime readiness
  independently. On overrides only OS preference; Reduced permits only a declared,
  implemented reduced alternative. Default scene consumers remain complete-static
  under Reduced/Off. Unavailable OS capability resolves ready; System stays static.
  Environment/theme/flag/preference changes never clear explicit local Pause.
  Completion/cursor/direction remain consumer-owned; permission is not replay.
- **Static-first / flags:** preserve complete artwork for pending, unavailable,
  denied and failed states. Respect build-time `NEXT_PUBLIC_ANIMATIONS_ENABLED`
  and provider `decorativeMotionAvailable`; a controlled test override cannot
  bypass preference/Pause/readiness. The bounded homepage parser mask and
  cancellation fallback are an existing logo-intro exception, not permission to
  hide a future scene indefinitely. Only the top-left identity introduces; other
  logos stay static. The approved 1,000 → 400 → 800 ms page sequence is implemented
  and its measured LCP passes the approved 5-second budget; the score warning remains.
- **Runtime ownership:** the [real-API fixture](../../frontend/application/motion/MotionPolicy.fixture.ts)
  and [two-consumer tests](../../frontend/application/motion/MotionPolicy.fixture.test.ts)
  demonstrate shared preference with independent Pause/visibility/history.
  [Logo controller](../../frontend/application/animations/LogoMotionController.ts)
  and [native binding](../../frontend/infrastructure/motion/NativeLogoMotionBinding.ts)
  demonstrate bounded adapter ownership and guarded imperative calls. Fakes/logo
  do not prove Canvas scheduling: EPIC 4 must establish its own actual frame,
  pause/hidden/teardown assertions. No registry, scheduler, provider stack or
  decorative-policy coupling to game time is supplied or authorized.
- **Dialog/focus:** extend [Dialog](../../frontend/components/Controls/Dialog.tsx),
  [useDialog](../../frontend/hooks/useDialog.ts) and the existing
  [binding port](../../frontend/domain/ports/DialogBindingPort.ts).
  `dismiss` remains the default; `navigation` plus `onReleased` suppresses all
  departing return/opener/fallback restoration and releases the lock before the
  [navigation handoff](../../frontend/domain/ports/PortfolioNavigationHandoffPort.ts).
  Preserve the actual invoker per cycle, visible fallback, generation cancellation,
  ordinary href/history/modified links and static navigation. Do not add a second
  modal or router/focus manager.

**Validation scope of this record:** inspect retained reports and current APIs;
check local documentation links, formatting, status consistency and the exact
diff. No application tests, builds, browser/device sessions or performance reruns
are claimed here. Latest runtime author evidence remains 85 unit tests,
59 route and 21 bootstrap checks per flag, 35 Storybook checks, types/lint/builds,
and the failing/passing Lighthouse variants above. Historical full-suite/game
evidence retains its original candidate and date. No commit, push or deployment.

Documentation validation on 2026-09-27: `git diff --check` PASS;
`pnpm exec prettier --check docs/tasks/fs-3.6-device-checklist.md docs/tasks/fs-3.6-integrated-validation.md docs/features/funkspace-minimum-usable.md`
PASS; local file/heading link check PASS (128 references). Candidate preservation
check PASS: exactly these three documentation records changed; the other 18
pre-existing changed files retain their recorded hashes. Evidence and the exact
documentation delta are in `artifacts/fs-3.6-acceptance-record/` outside the repo.

**Unchanged release limits:** accepted draft About/portfolio copy and incomplete
legal pages are not publication-ready facts; Dimi owns final content/operator/
privacy details. Contact remains an email fallback, with no tested mail delivery.
Preview/public release, environment changes, contact processing and live email
require their separate decisions. FS-G1 approval is not public-release approval.
