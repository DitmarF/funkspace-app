# FS-4.7 — Independent scene performance and failure review

Latest functional handoff: the [2026-10-05 pending-candidate review](#pending-candidate-review-and-authorized-delivery--2026-10-05) returns **PASS for the reviewed change scope**, with no actionable regression found. [Codex R3](#codex-r3--f7-correction-re-review--2026-09-30) previously closed F7; F1–F6 remain closed by R2. Overall FS-4.7 is **BLOCKED** on required Xperia/Safari evidence; FS-4.8 acceptance remains outstanding.

**Later tuning — 2026-10-01:** [R20 defaults](fs-4.1-scene-contract.md#r20--web-animation-defaults--2026-10-01) change count/speed/size to 286 / 0.2× / 0.1×. This review and its performance samples remain tied to the pinned earlier candidate (200 / 0.4× / 1×); no performance PASS for the new defaults is inferred. Required future default measurements must use R20.

**Later aperture correction — 2026-10-01:** [R21 implementation](fs-4.4-svg-aperture.md#built-in-web-correction--2026-10-01) removes the circle and bundles the trusted WEB opening to eliminate request-dependent wrong-mask rendering. Its focused tests and production/Storybook checks are functional evidence for a changed candidate, not new performance certification or closure of required device evidence. Future measurements must include this correction and R20 defaults.

## Pending-candidate review and authorized delivery — 2026-10-05

Dimi requested review of all uncommitted work, then explicitly authorized updating
documentation, committing and pushing it. The review left application sources
unchanged and returned **PASS for the bounded change scope**, not performance
certification, final visual acceptance or EPIC completion.

Candidate: `feature/funkspace-minimum-usable`, HEAD
`737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c`, plus all 76 pending files (including
16 untracked files). Complete pending patch SHA-256:
`9f695c976ee0640c45af8e4a70935117e7f4bfc818984960f838795277c8201e`.
The [review report and local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/uncommitted-review-2026-10-05/review.md)
retain the complete diff, per-file hashes, exact commands, results and captures.
All candidate hashes were verified unchanged before this documentation update;
the delivery diff adds only this handoff and the feature-plan entry.

Reviewed scope: approved R20 particle defaults; built-in WEB/circle removal and
mobile fitting; scene action layout, icons, hidden status and slower reveal;
shared button typography; responsive navigation/settings sizes, secondary
appearance, headings and 4rem tablet/desktop section spacing; associated tests,
stories, asset provenance and decision records. No actionable regression was
found. Existing controller, policy and Canvas ownership remain intact.

Fresh checks on isolated copies of the exact candidate:

- `pnpm coverage`: 120 files / **1,850 tests PASS**. Configured coverage:
  statements 87.47%, branches 84.60%, functions 86.34%, lines 89.58%. These
  percentages cover the configured denominator, not every tested layer.
- `pnpm typecheck:validation` and `pnpm lint`: **PASS**.
- Separately compiled flag-On and flag-Off `pnpm build`, plus
  `pnpm storybook:build`: **PASS**. On build `8HiZA4Arzzw888KKyTx8y`;
  Off build `UJpbuW4s-rFbzE78PTVnl`.
- Chrome **154.0.8037.95**: **108 On + 58 Off + 58 Storybook = 224 browser
  checks PASS**, zero skips, unexpected failures or flaky outcomes; retries 0.
  Existing flag-dependent test branches remain distinct. Coverage includes
  navigation/focus, policy/Pause/customization, aperture fallback/replacement,
  responsive controls, accessibility and no-JavaScript routes.
- Mobile scene controls and desktop accessibility captures were visually
  inspected. Diff whitespace and source integrity checks pass; owned ports were
  released. Tests ran concurrently and supply functional, not timing, evidence.

No new Lighthouse, sustained frame/CPU, transfer or physical-device measurements
were made. Earlier measurements retain their own candidate/conditions and score
warning; Safari/Firefox and Xperia were not rerun. Required FS-4.7 evidence and
FS-4.8 human acceptance remain open. Existing lint-deprecation/chunk warnings and
two pre-existing historical FS-1.4 links to the removed story stylesheet are
recorded in the report. Commit/push authorization does not authorize deployment,
PR creation, merging or repository settings changes.

## Candidate and scope

- Owner/current writer: Codex review; Sites owns scene/UI/test corrections. Shared navigation/foundation owners retain their boundaries.
- Review revision: **R1, 2026-09-30 — CHANGES REQUIRED**, with required device/browser evidence also **BLOCKED**. This is not FS-4.8 acceptance.
- Candidate: `4e46dd1f7ce10c58362fc7b693816d0c602233f9`, `feature/funkspace-minimum-usable`, initially clean. No implementation patch.
- Full EPIC 4 diff: historical pre-scene `1ab13095edb3cf0c9b38897ddcbb75a16d0ff498` to candidate, 110 files; SHA-256 `c5e0d37e78f43d7b9c7c818b4f38d407669e01bf8fa6e9c13e8eab507bcab4da`. The historical reference was not a reset target.
- Contract: [FS-4.1 R19](fs-4.1-scene-contract.md), including R18 controls and the later explicit Reduced/Off-still, WEB Black, no-thumbnail and lightweight-fallback amendments. [FS-4.6 C7 / R2](fs-4.6-customization-overlay.md#codex-r2-closure-and-authorized-delivery--2026-09-30) closed its three original findings; that does not certify this wider audit.
- Supplied plan actually inspected: `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`, especially sections 4, 7 and 9. Its proposal-era restrictions are superseded only by explicit recorded amendments.
- Evidence: [local review packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-review/README.md). Candidate/source hashes, full diff, commands, reports, traces and screenshots are retained locally; no publication is implied.

Goal: independently measure and review the complete candidate, preserve application bytes, map every integrated acceptance row and hand bounded corrections to the responsible owner. No implementation repair, threshold change, new renderer, dependency installation, commit, push or deployment belongs to this review.

## Inspection and execution plan

Read repository AGENTS, README/package scripts, architecture/ADRs, workflow/task template, milestone, FS-3.6 closure/API handoff, current contract and prior review resolutions. Inspect the full diff, actual rules/controller/binding/Canvas/compositor/startup/overlay and their tests. Capture source hashes before generation; use isolated `/tmp/fs47/on` and `/tmp/fs47/off` checkouts from the exact commit with existing dependencies and separate caches/ports.

Check generated-bootstrap freshness first, then tokens → common types → standalone game build → frontend and validation types. Run focused and full tests, coverage, lint, both actual flag builds, Storybook and production journeys. Finish functional jobs before CPU/Lighthouse sampling. Keep callback CPU, browser frame delivery, compositor activity, resource counts, transfer, Lighthouse and human comfort evidence distinct.

## Environment and interpretation

Actual host: Mac17,2 / Apple M5, macOS 26.7 (25G229), Node 22.22.0, pnpm 10.30.3. Chrome 154.0.8037.92 is used headlessly for primary browser/measurement work. Installed automated Firefox is 146.0.1; it is distinct from a manual Safari/Firefox desktop session. Installed WebKit build 2248 cannot create a page through the repository's Playwright 1.55.1 protocol (`Only page targets are expected in WebKit, received: frame`). Its attempted cases are **NOT RUN**, not application failures or Safari PASS.

The selected physical device remains Sony Xperia XQ-CC54, Android 14; no substitute device was invented. Fresh phone OS/browser, CSS viewport/DPR/refresh and comfort/trace evidence have not been supplied. Headless 390×844 / DPR 3 is explicitly desktop emulation. Host displays include 60 Hz and 50 Hz external displays; headless callback cadence does not establish which physical display would present frames.

Build-time flags are compiled separately, not changed on an already-built server:

| Variant | Build ID                | Source guard                                                  |
| ------- | ----------------------- | ------------------------------------------------------------- |
| On      | `rXwyvMvwGWp5O4Z9FlF_B` | All 688 captured files match the pinned candidate after build |
| Off     | `MbUptQdcjT_izDJeJtnqw` | All 688 captured files match the pinned candidate after build |

The existing preview was not reused or stopped. Evidence-only scripts/configurations live outside the application tree. The subscription probe compiles the actual composition/controller/adapters into a review-owned browser harness; it is separately identified from the production consumer. It does not become an application module or a second production authority.

## Source and prior-resolution assessment

The runtime import graph from homepage/layout contains 80 project files and 182 edges, including dynamic imports, with no game path or game-package import. Domain remains pure and seeded; theme, mask, DPR and clocks do not become physics inputs. Current rules normalize all five controls, preserve survivors and relative resize coordinates, drop excess delta and distinguish seeded low-level reset from user defaults. One adapter owns frame scheduling; controller cancellation generations and terminal cleanup remain at their reviewed boundaries.

The shared resolver remains the single policy. Explicit Reduced/Off may prepare an opted-in still; System+reduction, unavailable/unknown policy, disabled flag and failure retain independent solid WEB. A ready scene freezes behind customization; there is no modal thumbnail or second loop. Original header identity and the introduction remain. No production particle-SVG graph was reintroduced.

The inspected historical FS-4.4 `asset-selection.patch` changes only the trusted descriptor and diagnostic SVG. Its protected rule/Canvas hashes remain in that packet. Fresh mounted WEB↔diamond replacement checks operate on the same current Canvas; current Domain/Canvas bytes are unchanged throughout this audit. Repository-authored assets were explicitly authorized by R5; an Illustrator export is no longer a technical prerequisite. Neither those exports nor unseen YouTube/Figma visuals are claimed to be Dimi's original visual evidence.

## Measurement protocol

Current defaults are count 200, speed 0.4×, size 1×, maximum degree 100 and distance 6×. Current maximum controls are 1,000 / 2× / 4× / 100 / 10×. Seed `0x46533431`, Light theme, opaque WEB Work Sans Black, System with no OS reduction and visible foreground document are held constant. Historical 3,200-particle rows do not override R18; no CPU/frame/bundle threshold is relaxed.

For desktop 1280×720 / DPR 1 and emulated mobile 390×844 / DPR 3, capture three 30-second traces per configuration after 5 seconds of warm-up. Defaults use the actual homepage; maxima use the actual details-page controls. Per-run and pooled nearest-rank p95 are retained. Each run must meet the applicable target; pooled success cannot hide a failing run. Instrumentation overhead is included, not subtracted.

Scene callback timing begins before its RAF callback and ends after draw submission/rescheduling. It is identified by the owned Canvas marker, excluding logo callbacks. A draw subset begins at `fillRect` and therefore excludes the preceding transform. Callback intervals measure delivery; Chromium compositor trace events and paint lifecycle durations are separate. They are not physical display latency, GPU-memory certification or field p75/INP. Count/radius instrumentation runs outside timed samples.

The approved phone targets remain p95 ≤6 ms at defaults and ≤10 ms at current maxima, plus default frame delivery p95 ≤20 ms under a measured 60 Hz condition. Desktop measurements cannot pass the missing phone requirement. The 20-cycle resource checks and 10-minute Xperia comfort session remain distinct.

## Technical verdict and bounded handoff

**CHANGES REQUIRED against the exact candidate above.** No new scene-runtime or shared-policy defect was reproduced in the available production journeys. The wider validation gate is not green: branch coverage fails and several checked-in browser assertions do not describe the accepted candidate or stable measurement conditions. Phone performance/comfort and Safari evidence remain unavailable. Earlier checkpoint PASS decisions remain historical facts; this review does not reopen EPIC 3/FS-G1 or infer final scene acceptance.

Locations below refer to the pinned source, not an implementation patch. Sites is the next correction writer; Codex does not repair its source in parallel.

| ID / severity                   | Location                                                                                                                                                  | Consequence and evidence                                                                                                                                                                                                                                                                          | Smallest correction / owner                                                                                                                                                      |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1 — P2, validation gate        | `vitest.config.ts:62–69`; coverage report                                                                                                                 | All 1,833 tests pass, but branches are **78.48% (744/948)** against unchanged **80%**. The coverage command exits 1. Scene diagnostic fixtures contribute uncovered branches; existing exclusions mean this metric is not a certificate for Domain/adapters.                                      | Add meaningful behavior coverage for uncovered paths, then rerun coverage. Do not lower thresholds or hide files. **Sites / test owner**.                                        |
| F2 — P2, stale assertions       | `e2e/home.spec.ts:7`; `e2e/portfolio-navigation.spec.ts:75–77`; `e2e/static-route-contract.spec.ts:14`; `e2e/theme-bootstrap/startup.spec.ts:334,341,398` | Five general production cases per flag and five dedicated theme cases still seek the old FunkSpace homepage heading. R19 correctly renders **Aperture - 1**. This prevents the full gates from passing; it is not evidence that the accepted heading is wrong.                                    | Update the obsolete expected heading while preserving semantic/no-JS/theme assertions. **Sites**.                                                                                |
| F3 — P2, flag-off test contract | `e2e/scene-customization.spec.ts:447–449`                                                                                                                 | The transparent-overlay journey unconditionally expects an invisible cover and visible Canvas after selecting Off, even in the separately compiled unavailable build. Fresh flag-off startup has no Canvas and retains solid WEB, as required.                                                    | Branch the final assertions on compiled availability: disabled build must retain solid artwork and zero Canvas; enabled explicit Off must retain the permitted still. **Sites**. |
| F4 — P2, Storybook gate         | `e2e/storybook/essential-set.spec.ts:246–247`                                                                                                             | `dialog > div` now matches header and content. Three viewport cases fail strict-mode selection before proving the intended scroll/reflow contract. The shared Dialog structure predates this candidate; do not infer a new layout defect.                                                         | Select the actual dialog content/scroll element and retain the original reflow/a11y checks. **Shared-control test owner / Sites**.                                               |
| F5 — P3, test-clock reliability | `e2e/home-intro.spec.ts:100,136`                                                                                                                          | Reduced second-foreground-tab test misses the transient `menu` phase under the installed fake clock and sees `fading`/`visible`. Cold real-clock Reduced startup retains waiting → menu → fading → visible, with first scene draw after visible. No new sequence/readiness defect is established. | Reconcile the fake-clock/WAAPI observation with the actual sequence; retain ordering and no-early-start assertions. **Motion/navigation test owner**.                            |
| F6 — P3, measurement stability  | `e2e/navigation-visual-regressions.spec.ts:100–117`                                                                                                       | On `/about` at nominal 375×720, raw `Page.captureScreenshot` is followed by a traced viewport change to **500×633**. The launcher moves from `(289.828,628)` to `(414.828,541)` with the viewport. Comparing those boxes does not prove a hydration alignment regression.                         | Keep viewport invariant across the screenshot/box comparison and rerun the failing narrow case. Preserve alignment/artwork assertions. **Navigation test owner**.                |
| B1 — required evidence blocked  | FS-4.1 resource/device decision; P01/L04/A01/U01/H01 below                                                                                                | No fresh selected Xperia trace/comfort results, physical 60 Hz confirmation, or supported Safari run. Desktop emulation cannot supply these results. Installed WebKit cannot create a page.                                                                                                       | Capture the explicit device/browser packet below on this candidate or the next pinned correction. **Dimi provides access/observations; Codex/testing owner measures**.           |

The three previously recorded Firefox subpixel assertions remain a **P3 non-blocking portability follow-up**: `navigation-composition.spec.ts:142` (320/375 widths, 47.999992 vs 48) and `navigation-query-removal.spec.ts:172` (799.866638 vs 800). Keep that prior disposition distinct from new evidence blockers. A Firefox mobile-context test cannot run because `isMobile` is unsupported; that is not a product failure. A concurrent Storybook Axe invocation also failed once with “Axe is already running”; an unchanged isolated rerun passed. Retain the raw failure rather than silently declaring the whole suite green.

## Measured results

### Callback CPU, frame delivery and browser trace work

Each entry is the three independent run p95 values in milliseconds, not a field percentile. Every run contains 1,800 or 1,801 observed scene callbacks. Raw samples and twelve compressed Chromium traces are in the packet.

| Condition                                | Callback update + submission p95 | Draw-submission subset p95 | Callback interval p95 | Non-draw remainder p95 |
| ---------------------------------------- | -------------------------------- | -------------------------- | --------------------- | ---------------------- |
| Desktop defaults                         | 3.3 / 3.3 / 3.5                  | 3.3 / 3.3 / 3.5            | 16.7 / 16.7 / 16.8    | 0.1 / 0.1 / 0.1        |
| Desktop maximum numeric controls         | 2.7 / 2.6 / 2.8                  | 2.7 / 2.6 / 2.8            | 16.8 / 16.8 / 16.7    | 0.1 / 0.1 / 0.1        |
| Emulated mobile defaults                 | 3.1 / 3.3 / 3.5                  | 3.1 / 3.3 / 3.4            | 16.7 / 16.7 / 16.8    | 0.1 / 0.1 / 0.1        |
| Emulated mobile maximum numeric controls | 2.7 / 2.9 / 3.0                  | 2.6 / 2.8 / 3.0            | 16.7 / 16.8 / 16.7    | 0.1 / 0.1 / 0.1        |

The non-draw remainder is calculated per callback before percentile aggregation; it includes updates, transforms, rescheduling and instrumentation. Timer quantization limits its interpretation. It is not a pure-domain microbenchmark or a subtraction of two p95 values. Defaults and maxima use different route geometry, so their CPU difference cannot be attributed solely to count. Maximum transparent-overlay rendering was not a separate timed condition; all numeric maxima above retain opaque WEB.

All twelve runs have zero observed long tasks and zero callback intervals above 1.5× their median interval. This satisfies the default ≤20 ms interval target in this **headless desktop sample only**. Phone ≤6/≤10 ms targets and measured physical-refresh certification remain **BLOCKED**, even though local CPU numbers fall below those numeric limits. A brief review-side JSON inspection occurred during the sampling window; no concurrent test/build/browser workload was run. Instrumentation/trace overhead and ordinary host activity remain included.

Actual trace event names were inspected instead of interpreting absent legacy event names as zero cost. Across runs, p95 `Blink.Paint.UpdateTime` is 0.011–0.020 ms; `Blink.CompositingCommit.UpdateTime` 0.002–0.005 ms; `DirectRenderer::DrawFrame` 0.018–0.133 ms. `AnimationFrame::Presentation` event-interval p95 is 17.191–18.244 ms. These process/thread events may overlap and are not added to callback time. They do not establish physical presentation latency or isolated GPU raster memory. Minor GC is present (185–458 events/run); maximum conditions also show 2–4 MajorGC events/run. No allocation-free or heap-growth certification is inferred. See `trace-analysis.json`; the older generic `Paint`/`RasterTask` zero counts in `measurements.json` mean those event names were absent.

### Raster, population and resource bounds

| Condition                | CSS scene → backing pixels | Pixel count | Observed particles / connection strokes |
| ------------------------ | -------------------------- | ----------- | --------------------------------------- |
| Desktop defaults         | 1184×400 → 1184×400        | 473,600     | 200 / 3,028                             |
| Desktop maximum          | 1232×400 → 1232×400        | 492,800     | 1,000 / 4,519                           |
| Emulated mobile defaults | 319×200 → 638×400          | 255,200     | 200 / 2,847                             |
| Emulated mobile maximum  | 358×200 → 716×400          | 286,400     | 1,000 / 4,589                           |

Input DPR 3 is capped to effective 2. Actual sampled radii are 1.007–2.995 CSS px at default size and 4.008–11.992 at size 4×, within the current base 1–3 px multiplier contract. Counts/strokes remain below 1,000/4,800; the source bounds candidate checks to 38,400 total and 16 passes. Actual-adapter tests cover the 4,000,000-pixel, 4,096-side, DPR and zero/disconnected bounds, transform reset and failure paths. These current-viewport samples are not a measured claim of GPU memory at the absolute raster ceiling.

Fresh ownership probes distinguish scene resources from the logo:

- Twenty production details-page Pause/configuration/Reset/dialog/visibility/native-route cycles: maximum one pending scene RAF; pause/hidden states settle to zero. Native route departures create new documents, so that test alone is not same-document leak proof.
- Twenty same-document fixture mount/destroy cycles: 101 observations, constant document time origin, no growth. Active scene owns one ResizeObserver, one IntersectionObserver, one context-loss listener and one resolution listener; terminal counts/Canvas/RAF return to zero. WEB↔diamond replacement retains the same Canvas; Reset does not recreate it.
- Twenty actual-composition harness cycles: real `createServices`, controller, binding and Canvas; one scene ThemeService subscription and one MotionPolicy subscription while active, zero after destroy. The harness owns/initializes its own services; the production consumer does not initialize/dispose shared services. This is separate evidence from the production-page resource instrumentation.

`resource-samples.json`, `mount-resources.json` and `subscription-counts.json` preserve all rows. Fake-port tests separately exercise cancellation, setup/draw/cleanup throws and terminal callbacks; they are not relabeled browser resource measurements.

### Bundles, transfer and baseline comparison

Initial assets are unique modern script URLs, excluding the `nomodule` legacy fallback, recompressed with the same Python gzip level 9 / mtime 0 method as the retained pre-scene baseline. Both flags contain **189,381 bytes** initial gzip JS, an increase of **11,627 bytes (11.354 KiB)** over their same-flag baseline: **PASS ≤15 KiB**. The details route has 189,190 initial gzip bytes; it has no pre-scene route counterpart, so no invented route delta is given.

Cold network evidence confirms exactly one newly fetched Canvas chunk, `static/chunks/37.fdb5db788c83205a.js`: **6,206 raw / 2,721 gzip bytes (2.657 KiB)**, with its required shared modules already initial. **PASS ≤35 KiB aggregate optional runtime**. System+OS reduction and every flag-off preference fetch no Canvas chunk and create no Canvas. Explicit Reduced/Off in the on build load that same optional chunk for their approved still. No-JS fetches no scripts. No production particle SVG line/circle graph is present.

Actual cold production script transfer is recorded separately: on/System 196,638 bytes including response overhead, encoded body 193,038; denied on/System-reduce 193,610 / 190,310; off/System 193,609 / 190,309. Server compression/header totals differ from deterministic level-9 gzip accounting and are not substituted for it. `bundle-inventory.json` retains raw/gzip HTML and assets; `network-summary.json` retains all preference variants and URLs. The homepage/layout runtime graph has no game imports, and the build/chunk scan has no game-runtime inclusion.

HTML is accounted separately from JS: On raw/gzip bytes change from 68,658/16,458 to 67,271/17,516; Off from 68,659/16,461 to 67,273/17,522. Current cold CSS encoded bodies total 12,485 bytes across four files; the trusted WEB SVG is 743 bytes. These are payload observations, not a new CSS/HTML budget or a claim of zero-cost static UI.

The retained pre-scene candidate is `1ab13095…`, with no scene callback cost to compare. Baseline Chrome 154.0.8037.57 differs from this run's 154.0.8037.92; host and configured Lighthouse conditions match. Both use three fresh desktop DevTools runs, 1350×940 / DPR 1, 150 ms latency, 9216 Kbps download/upload, 1× CPU, local `p75` LCP/CLS assertions. Lighthouse's emulated network user-agent is not the installed browser version.

| Build | Pre-scene LCP ms (three runs)  | Current LCP ms (three runs)    | Current CLS | Score / criteria                                                                 |
| ----- | ------------------------------ | ------------------------------ | ----------- | -------------------------------------------------------------------------------- |
| On    | 3090.026 / 3081.097 / 3093.192 | 3105.076 / 3097.863 / 3108.189 | 0 / 0 / 0   | 0.82 each; **LCP ≤5000 and CLS ≤0.1 PASS**, existing score <0.9 warning retained |
| Off   | 462.171 / 458.438 / 455.000    | 457.084 / 454.004 / 448.689    | 0 / 0 / 0   | 1.00 each; assertions PASS                                                       |

This is local sample aggregation, **not field p75**. On LCP is roughly 3.10 s in both generations; the accepted intro remains a contributor. Cold traces and observed intro phases distinguish its cost from the scene: default first Canvas draw follows intro `visible` (about 2349 ms versus 2333 ms in the unthrottled phase probe); Reduced similarly draws after visible. Do not blame the historical intro warning on Canvas, or treat a warning as a new passing score. Exact configs, raw HTML/JSON reports, cold traces and baseline links are in the packet.

### Responsiveness and usable failure

Ten real pointer-driven menu opens per condition on the actual details page yield p95 capture-phase input delay **1.9 ms defaults / 0.5 ms maximum**, and click-to-dialog-open mutation **5.8 / 2.6 ms**. Two-RAF opportunity p95 is 36.1 / 30.7 ms; observed Event Timing maximum duration is 40 / 32 ms. This small local sample is not physical paint latency, field INP or a phone result. Opening the modal intentionally suspends the scene without changing local Pause.

Six extra homepage fault probes throw in scene `fillRect`, `arc`, `setTransform`, `stroke`, Canvas append, and removal after resource release. Each shows solid WEB, the unavailable explanation, zero retained Canvas and no further draws during the observation window; navigation still opens/closes. Fresh production tests additionally cover absent/null context, context loss, loading failure, invalid palette, delayed/stale asset/preparation completion, rejected/missing assets, blocked storage and denied motion. Static fallback screenshots were visually inspected; maximum-size particles can make WEB look nearly solid on a narrow view, which is product/comfort evidence for Dimi, not automatic visual approval.

## Validation ledger

Exact command arrays, cwd, timestamps, durations and exit codes are in packet `*.json` sidecars and `*.log` files. Bootstrap freshness preceded generation/build; generated application outputs remained byte-identical. No new dependency or persistent environment setting was installed.

| Check                                                                                   | Fresh result and limits                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prerequisites                                                                           | PASS: `check:theme-bootstrap`, token generation, common typecheck, standalone game build, frontend `tsc --noEmit --incremental false`, validation types, in that order.                                                         |
| Focused Domain/controller/actual adapter/aperture/policy/controls/navigation/theme/logo | PASS: 25 files, 439 tests. Fake clocks/ports and jsdom are distinguished from production rendering.                                                                                                                             |
| Full unit suite                                                                         | PASS: 119 files, 1,833 tests.                                                                                                                                                                                                   |
| Coverage                                                                                | **FAIL:** all tests pass, but branches 78.48% <80%; statements 83.29%, functions 79.52%, lines 85.41%. HTML report retained.                                                                                                    |
| Dedicated bootstrap unit gate                                                           | PASS; 100% statements/branches/functions/lines in its dedicated scope.                                                                                                                                                          |
| Lint/format                                                                             | PASS: existing `pnpm lint` (ESLint and Prettier).                                                                                                                                                                               |
| Production builds                                                                       | PASS: independent compiled On/Off builds and pinned IDs above.                                                                                                                                                                  |
| Storybook build                                                                         | PASS; existing large-chunk warning retained, not an application initial-JS budget failure.                                                                                                                                      |
| General production E2E On                                                               | Original **293/303** pass; targeted unchanged reruns resolve browser-path/localhost harness issues: **296 distinct cases verified, 7 unresolved** (five F2, F5, F6). No whole-suite PASS.                                       |
| General production E2E Off                                                              | Original **294/303** pass; targeted unchanged reruns: **297 distinct cases verified, 6 unresolved** (five F2, F3). On-only early-return cases do not establish enabled-renderer behavior.                                       |
| Dedicated production theme startup                                                      | **16/21** pass; five F2 stale-heading failures. Assertions were not weakened.                                                                                                                                                   |
| Storybook browser/a11y                                                                  | Original **113/117** pass; unchanged isolated Axe rerun passes, giving **114 distinct cases verified, 3 unresolved F4**. No filtered accessibility scan substituted.                                                            |
| Firefox targeted production                                                             | **95/99** pass; three retained subpixel failures and one unsupported mobile-context setup. Actual scene/aperture cases otherwise pass.                                                                                          |
| WebKit/Safari                                                                           | **NOT RUN:** all 16 selected attempts fail to create a page due to installed runner/protocol incompatibility; no app verdict from those attempts. Safari unavailable.                                                           |
| Standalone game                                                                         | PASS: types, 58 files / 920 tests, game build/demo build and **18/18 actual browser checks** through its required Vite development harness. Initial preview-mode mock import failure was corrected only in the external runner. |
| Extra review probes                                                                     | PASS: 12 timed samples, 20 production route cycles, 20 same-document mounts, 20 actual-composition subscription cycles, six homepage fault cases, cold preference/network probes, and actual menu input samples.                |

Full tests/coverage are justified by shared resolver, composition, intro, navigation and Dialog changes across the 110-file EPIC diff. They expose broader validation failures not exercised by the narrower FS-4.6 closure. Local runner corrections used existing installed dependencies, isolated cache directories, localhost origin and the game's intended development server; they did not alter application/test assertions. Initial failures and corrected-run configs are retained.

## Detailed-plan section 7 acceptance matrix

PASS means the stated source/automated evidence passes in its disclosed environment; it is not cross-browser/manual certification. BLOCKED identifies required evidence still absent. The literal proposed plan is interpreted through R19 and explicit amendments, especially Reduced/Off stills, repository-authored WEB and removed modal thumbnail.

| ID  | Result  | Evidence / remaining boundary                                                                                                                                                                                                                                   |
| --- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S01 | PASS    | Seed/trace repeatability, partition tolerance and intentionally clamped-time differences in fresh focused/full Domain tests.                                                                                                                                    |
| S02 | PASS    | Invalid/nonfinite rejection, finite clamp/step normalization, effective config and work/raster ceilings in rules/actual-adapter tests; live extrema measured above.                                                                                             |
| S03 | PASS    | Identity/relative resize, zero/disconnected bounds, transform reset and DPR-only resolution tests; live DPR 3→2 cap.                                                                                                                                            |
| L01 | PASS    | Actual-adapter/browser repeated resume/pause/destroy and review counters: maximum one pending scene RAF, terminal zero.                                                                                                                                         |
| L02 | PASS    | Controller/actual-adapter late preparation, stale completion, cancellation/rearming and throwing cleanup regressions. Controlled browser delayed/failed preparation passes.                                                                                     |
| L03 | PASS    | Twenty same-document mounts, twenty production routes and twenty actual-composition subscription cycles; no growth, separate ownership and terminal counts retained.                                                                                            |
| L04 | BLOCKED | Automated hidden/offscreen/occluded and Pause persistence pass; selected-phone suspension/resume/comfort evidence missing. Browser visibility overrides are simulated input, not physical tab/phone evidence.                                                   |
| A01 | BLOCKED | Circle/WEB/diagnostic asset, themes and narrow/wide/short browser checks pass in Chrome/Firefox. R5 authorizes repo-authored assets; original Illustrator export requirement is superseded, not fabricated. Safari and Dimi visual/device confirmation missing. |
| A02 | PASS    | Stable per-instance IDs, concurrent instances/logo coexistence, full rectangular cover and fitting regressions pass in available browsers.                                                                                                                      |
| A03 | PASS    | Trusted validator, delayed/missing/rejected asset and stale completion regressions; browser fallback and hidden unsafe Canvas. No claim of Safari support.                                                                                                      |
| A04 | PASS    | Retained asset-only selection diff/protected hashes inspected; mounted current WEB↔diamond preserves the same Canvas; no Domain/Canvas implementation change in this review.                                                                                   |
| M01 | PASS    | R19 interpretation: denied paths show solid WEB and load no runtime; opted-in Reduced/Off may prepare a still. Both actual flag cold probes confirm it. F3 is an obsolete test expectation, not permission to initialize flag-off Canvas.                       |
| M02 | PASS    | Shared resolver/actual-consumer full matrix; On overrides OS preference only, other blockers remain.                                                                                                                                                            |
| M03 | PASS    | Pause persists through config, Reset, themes, preferences and environmental transitions in production regressions; human comfort belongs to H01.                                                                                                                |
| T01 | PASS    | In-place palette/theme/invalid-palette and blocked-storage tests; no second preference authority; subscription lifecycle measured. Dedicated startup suite still has F2 heading failures.                                                                       |
| C01 | PASS    | Current five native ranges, units/effective values/limits and keyboard calls pass; maximum inputs exercised via real controls.                                                                                                                                  |
| C02 | PASS    | Configuration/default Reset retain runtime identity, local Pause and shared restrictions; domain reset remains distinct.                                                                                                                                        |
| C03 | PASS    | Close/reopen retains local values; reload/new mount restores defaults; no scene preference persistence in production checks.                                                                                                                                    |
| O01 | PASS    | Two-consumer release-before-open, one modal/lock, failed-open recovery and repeated dialog tests/counters. No thumbnail/second loop exists.                                                                                                                     |
| O02 | PASS    | Actual-invoker/destination focus, native links/history, route cleanup and stale-callback regressions. Known Firefox precision cases remain recorded, not silently passed.                                                                                       |
| O03 | BLOCKED | Most delayed-script/open/focused-native-disclosure cases pass; F6's `/about` 375px geometry comparison must be repeated under invariant viewport conditions before full-row closure.                                                                            |
| F01 | PASS    | Actual homepage absent/lost Canvas, palette/preparation/setup/draw/cleanup fault probes retain usable solid WEB and stop scene scheduling.                                                                                                                      |
| F02 | PASS    | Actual On/Off no-JS content/artwork/navigation verified; no dead scene controls. Correct accepted heading is present; obsolete F2 text assertions still need correction.                                                                                        |
| P01 | BLOCKED | Local raster/frame/bundle measurements retained and within local numerical targets. Required Xperia callback targets/60 Hz and comfort evidence unavailable; desktop emulation cannot pass them.                                                                |
| P02 | PASS    | Both separately compiled flag builds pass unchanged Lighthouse LCP/CLS criteria with 3 reports each; On score warning retained. Intro and scene work explicitly separated.                                                                                      |
| U01 | BLOCKED | Production keyboard, wheel/touch simulation, forced-colors and 200% text checks pass where executed. Storybook scroll/reflow gate has F4 selector failures; selected-browser/device manual accessibility evidence missing.                                      |
| G01 | PASS    | Runtime graph/chunk inspection excludes games; standalone types/unit/build/demo and 18 browser regressions pass.                                                                                                                                                |
| H01 | NOT RUN | Dimi has not accepted this exact measured homepage/detail candidate, phone comfort/readability and controls for FS-4.8. Prior product proposals are not final acceptance.                                                                                       |

No row is marked NOT APPLICABLE solely to hide missing evidence. Superseded proposal details are stated within their rows.

## Re-review and FS-4.8 entry requirements

1. Sites/test owners resolve F1–F4 and stabilize F5/F6 within their existing boundaries. Record exact changed bytes and results, then request Codex re-review. No worker/WebGL migration, engine, second policy, threshold relaxation or broad refactor is indicated by these measurements.
2. Provide a supported Safari run on the selected MacBook Pro and record Safari/macOS versions, build ID, native SVG mask and lifecycle/policy/overlay results. A compatible automation runner may supplement that evidence; this review did not install one.
3. On the selected Xperia XQ-CC54, record actual Android/browser version, CSS viewport, DPR, refresh condition, power/thermal state, build ID and settings. After five-second warm-up, retain three 30-second default and three maximum numeric-control samples, separating scene callback CPU, delivery and rendering work. Apply ≤6/≤10 ms CPU and default ≤20 ms at confirmed 60 Hz without substituting this Mac's samples. Repeat Pause/menu/customization/theme/visibility/route actions and a ten-minute heat/stutter/input-delay/comfort observation. Capture narrow/landscape/text and static-failure readability. Dimi supplies observations or access; no phone result was invented.
4. Recheck corrected candidate hashes, affected tests and any measurements invalidated by source changes. A docs/test-only correction does not automatically require rerunning unaffected CPU samples; changed runtime/configuration/Canvas/cover or production bundles do.
5. Only after the technical/evidence blockers close, FS-4.8 records Dimi's exact scene/aperture/control/comfort acceptance and any explicit deferrals. No current review result authorizes publication, remote actions or EPIC closure.

## R1 documentation handoff

Only this substantive record and the feature-plan status/link are changed in the repository. Application, tests, configuration and generated outputs remain unchanged. Evidence scripts/reports stay in the accessible local packet, with their own hash inventory and full command records. Documentation formatting, local links, the 28-row matrix and the final repository diff/source guard are checked separately from the measured candidate. No commit or push is performed.

## Sites correction C1 — 2026-09-30

Status: corrections implemented against `4e46dd1` plus the R1 documentation above; validation and handoff below identify the correction candidate. Dimi explicitly assigned this chat sole ownership of F1–F6. The existing temporary correction draft was inspected and adopted, then strengthened and freshly validated; prior draft logs are not represented as this pass's fresh results. The preceding independent review and measured candidate remain historical evidence; this section records implementation-owner work, not independent closure.

Scope: F1–F6 only. Add diagnostic-fixture behavior coverage; align the four stale-heading files and explicit flag-off expectations; select the actual Storybook dialog content; pause the actual menu/content CSS animations while the fake JS clock advances, then inspect/finish them through the existing animation API assertions; use Playwright-owned screenshots and assert invariant viewport around both captures. Application/runtime sources, thresholds, exclusions, dependencies, generated outputs and product choices stay protected. Existing isolated compiled flag builds are reusable because only tests/docs change. Re-run full coverage, affected production/Storybook/theme journeys, types and lint. Preserve raw failures and exact correction diff. Xperia/Safari evidence remains outstanding and no remote action is authorized.

### Correction details

| Finding | Bounded correction                                                                                                                                                                                                                                                                                                                | Preserved contract                                                                                                                                                                                                                   |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F1      | Add four colocated `ParticleLifecycleFixture.test.tsx` cases covering opt-in mount, controls and Pause/Reset delegation, repeated release, aperture/frame/shared choices without handle replacement, unavailable-state stills, rejection of a bounds-less preview with changed coordinates, and diagnostic static geometry/reuse. | Public handle doubles exercise presentation behavior; pure Domain data is reused. No fixture/renderer implementation, coverage exclusions or threshold changes. These are unit tests, not new browser or motion-acceptance evidence. |
| F2      | Replace only the obsolete homepage heading expectations in home, portfolio navigation, static route and theme-startup tests with exact `Aperture - 1`.                                                                                                                                                                            | Page title, header identity, About text, links, no-JS and theme assertions remain.                                                                                                                                                   |
| F3      | Branch the final explicit-Off transparency assertions on compiled availability. Enabled builds retain the connected original paused Canvas; unavailable builds require zero Canvas and a visible solid WEB path.                                                                                                                  | Check effective cover opacity, fallback count, stopped frames and reset-on-reload in both builds. Off is not permission to prepare a disabled runtime.                                                                               |
| F4      | Select the dialog's direct content container by its descendant `Run local preview` button and require exactly one match.                                                                                                                                                                                                          | Keep content height, horizontal fit, reachable action, enlarged-text, focus-return and unfiltered accessibility assertions.                                                                                                          |
| F5      | Pause only the menu/content CSS reveal animations in the second-tab fixture while advancing Playwright's JS clock. Existing assertions then sample actual opacity/duration and finish the real animation.                                                                                                                         | No fake `animationend`, dropped phase assertion, changed duration or production scheduling. The test no longer races an uncontrolled CSS wall clock; the separate R1 real-clock sequence remains recorded.                           |
| F6      | Replace the independent raw CDP screenshot session with `page.screenshot` and assert exact viewport dimensions before/after both captures.                                                                                                                                                                                        | Scripts stay held for the native fallback capture; exact pre/post-hydration launcher geometry and PNG bytes still match. No added visual tolerance or application layout change.                                                     |

The test-only patch is retained separately from documentation in the [owned correction evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-corrections/owned-pass/README.md). Candidate identity is base `4e46dd1` plus that exact patch; its hash and final file manifest identify this correction rather than the earlier temporary iterations.

### Fresh correction validation

| Check                         | Result                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New diagnostic behavior tests | 4/4 pass.                                                                                                                                                                                                                                                                                                                                            |
| Full coverage run             | 120 files, **1,837/1,837 tests pass**; branches **84.59% (802/948)** against unchanged 80%. Statements 87.65%, functions 86.17%, lines 89.80%. No coverage configuration change.                                                                                                                                                                     |
| Types                         | Frontend `tsc --noEmit --incremental false` and `typecheck:validation` pass.                                                                                                                                                                                                                                                                         |
| Lint                          | Existing `pnpm lint` passes bootstrap freshness, ESLint and Prettier.                                                                                                                                                                                                                                                                                |
| Affected production journeys  | **94/94 On and 94/94 Off** pass using the already separately compiled, hash-verified builds. Covers all six affected general E2E files, not a claimed fresh full 303-case suite.                                                                                                                                                                     |
| Dedicated theme startup       | **21/21 On and 21/21 Off** pass, including delayed scripts, storage failures and no-JS.                                                                                                                                                                                                                                                              |
| Storybook essential set       | **11/12** in the initial run, including all three corrected reflow cases. The remaining unchanged reduced-motion case hit the already-recorded concurrent Axe error; **1/1 passes on isolated unchanged rerun**. All 12 distinct cases are verified, but the initial suite is not relabeled clean. No accessibility rule was filtered or suppressed. |
| F5/F6 stability               | **30/30** pass: all ten second-tab/trigger capture cases repeated three times in the enabled production build, with zero retries.                                                                                                                                                                                                                    |

Application files and initial production chunks for both routes/flags match the measured candidate. On build `rXwyvMvwGWp5O4Z9FlF_B`, Off `MbUptQdcjT_izDJeJtnqw` and the existing Storybook output were reused; builds, Lighthouse, CPU traces and game regressions were not repeated because this correction changes tests/documentation only. R1 remains the source of those measurements and their limits. One initial runner attempt refused an occupied port; new isolated ports preserved the existing preview. All command/config/result files are retained in the owned-pass packet.

### Remaining handoff

F1–F6 have implementation responses and fresh affected checks; **independent re-review is still required** before changing the R1 verdict/acceptance matrix. The Storybook automatic/manual Axe collision remains a separate recorded test-runner follow-up, not a scene defect and not silently fixed by the isolated pass. The prior Firefox precision follow-up and B1 Xperia/Safari evidence remain open. No FS-4.8 acceptance, performance certification, commit, push or deployment is inferred.

## Codex R2 — correction re-review — 2026-09-30

**F1–F6: PASS / closed against C1. Overall: CHANGES REQUIRED; required device/browser evidence remains BLOCKED.** This fresh review pass inspected all corrected bytes and the actual tested components/assertions without repairing implementation. It occurred in the same chat as C1 and is not a second human review. The [R2 report and raw evidence](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-r2/REVIEW.md) records finding-by-finding conclusions, locations and remaining owners.

Reviewed base remains `4e46dd1f7ce10c58362fc7b693816d0c602233f9`; C1 test patch SHA-256 is `4fd95449d5672b6375445de0552abea2cced0b601ec16d01951c8ebdb279b2cb`, complete correction patch `49ab23d43682b67539d311cfd25e82e7f657d7b566cef999332971b08504bdab`. All ten C1 files matched the handoff manifest before review. Application/configuration/generated bytes remain unchanged in the repository and both isolated compiled builds; the evidence packet preserves the reviewed pre-R2 documentation and diff.

Fresh checks: 1,837/1,837 tests in 120 files; branch coverage 84.70% (803/948), above unchanged 80%; frontend/validation types and lint pass. Affected production On/Off pass 94/94 each; theme startup On/Off pass 21/21 each. The completed serial Storybook run passes 9/12, including all three corrected F4 reflow cases; three other cases reproduce the known `Axe is already running` collision. Initial concurrent Off-theme/Storybook runs logged passing cases but stalled at cleanup and were interrupted (exit 130); they are not clean suite passes. Raw logs, serial reruns and the unconfirmed cleanup limitation are retained.

**F7 — P2, Storybook validation reliability:** `e2e/storybook/essential-set.spec.ts:30–35` invokes explicit unfiltered Axe scans while the a11y addon is loaded at `frontend/.storybook/main.ts:12`; failures occur in default composition, forced colors and reduced-motion cases. Sites / the Storybook test-infrastructure owner must coordinate scan ownership/completion and repeat the essential set without filtering rules, swallowing errors or fixed sleeps. No shared-policy or scene-runtime change is requested. This is the already-recorded Axe follow-up, now explicit as a remaining gate; F4's selector correction stays closed.

Existing On/Off build IDs and R1 CPU/Lighthouse/bundle/game evidence were reused, not remeasured. C1's 30/30 repeated stability run remains prior evidence; R2 reran its affected full files. O03's F6 automated viewport blocker and U01's F4 selector blocker are resolved in Chrome; manual/device portions and B1 Xperia/Safari remain open. The original acceptance matrix remains historical. FS-4.8 is not started, and no final performance/visual acceptance, commit, push or deployment is inferred.

## Sites correction C2 — F7 scan ownership — 2026-09-30

**Implemented and validated; independent re-review pending.** F7 only: the essential-set browser fixture now passes Storybook's supported `a11y.manual:!true` global before rendering, giving its existing explicit AxeBuilder calls sole scan ownership for those visits. Normal Storybook visits remain automatic; no addon, global configuration, scan target, rule or assertion is removed. Actual installed Storybook 10.5.10 parser/addon code confirmed the option and URL syntax. No fixed sleep, retry or exception suppression was introduced.

The new negative-control regression adds an unnamed button, requires the unfiltered scan to report `button-name` for that exact element, removes it in `finally`, then requires the restored fixture to pass. All existing theme, motion, focus, layout and accessibility assertions remain intact. Only `e2e/storybook/essential-set.spec.ts` and this record change relative to R2; earlier F1–F6 edits and unrelated work are preserved.

Fresh unchanged-candidate reproduction: 32/36 cases pass with four Axe collisions over three predetermined repetitions. Fresh corrected candidate: **39/39 pass**, all 13 cases repeated three times, zero retries/skips/unexpected cases and successful runner exit. Frontend/validation types and existing lint pass. The same existing local Storybook build was used before/after; its sources/configuration and production sources remain unchanged. No new production build, CPU/Lighthouse sampling, full unit coverage or physical-device result is claimed.

Candidate: base `4e46dd1f7ce10c58362fc7b693816d0c602233f9` plus R2-reviewed C1 and the F7 test patch SHA-256 `bad417182610b2cde6fd4718a0badcbfcdba7d6c7091627e644917da3a6c6228`. The [C2 correction packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-f7/README.md) retains the exact incremental diff, manifests, before/after commands, raw results and failures. Codex must independently re-review these changed bytes before closing F7. Xperia/Safari and FS-4.8 remain outstanding. No commit, push or deployment was performed.

## Codex R3 — F7 correction re-review — 2026-09-30

**PASS for F7; F7 closed. F1–F6 remain closed. Overall FS-4.7: BLOCKED on required Xperia/Safari evidence.** The [R3 review and raw results](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.7-r3/REVIEW.md) record a fresh source review and browser execution without implementation or test repairs. This is a separate review pass in the same chat as C2, not a second human reviewer.

Candidate remains base `4e46dd1f7ce10c58362fc7b693816d0c602233f9` plus R2-reviewed C1 and C2. Verified F7 test patch SHA-256 `bad417182610b2cde6fd4718a0badcbfcdba7d6c7091627e644917da3a6c6228`, complete C2 patch `314c9dd07275372ceeb58feb66d6e8e039979daa6f0b79802764ba7645c595b5`, and exact repository/isolated-copy test bytes. Production sources, configuration and all other corrections remain unchanged.

Installed Storybook parser/addon inspection confirms the supported per-visit manual global prevents the competing automatic scan before render. All explicit scans in the affected file use that fixture; normal visits keep the unchanged automatic default. Existing unfiltered scan targets and assertions remain intact. The new negative control requires the exact unnamed-button violation, removes the test defect, and checks the clean fixture again. No scan-rule filter, fixed sleep, exception suppression, retry or weakened assertion was added.

Fresh actual Chrome validation: **39/39 pass**, all 13 essential-set cases repeated three times, zero retries/skips/unexpected/flaky results, no runner-level errors and exit 0. C2's earlier type/lint passes apply to identical test bytes; they were inspected, not relabeled fresh R3 checks. R3 documentation, links, hashes and diff checks pass. Existing compiled Storybook output was reused; no new production build, full coverage, performance sample or physical-device result is claimed.

No further F7 correction is requested. R1 measurements and historical acceptance rows remain preserved; missing Xperia/Safari, the recorded Firefox follow-up and FS-4.8 human acceptance remain explicit. No commit, push or deployment was performed.

## Authorized delivery — 2026-09-30

Dimi explicitly authorized updating documentation, committing and pushing the reviewed changes after R3. The containing Git commit packages the F1–F7 test corrections and this measured-review record on `feature/funkspace-minimum-usable`; application/runtime/configuration bytes remain unchanged. Final delivery checks compare every corrected test against its reviewed hash and validate documentation formatting, links and staged diff. Earlier execution results retain their original dates and scope; this documentation update is not a new performance run.

All F1–F7 correction findings are closed. FS-4.7 remains BLOCKED on the required Xperia/Safari evidence, and FS-4.8 has not started. This authorization does not approve deployment, scene acceptance, evidence substitutions or relaxed budgets. Raw traces, screenshots, logs and hash inventories linked above are local artifacts outside the repository and are not included in this push; a reviewer on another machine must obtain those packets or reproduce the checks before relying on the raw evidence. The substantive findings, measurements, commands/results and remaining capture requirements are retained in this versioned record.
