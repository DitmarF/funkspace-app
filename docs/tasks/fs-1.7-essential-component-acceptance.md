# Task FS-1.7 — Essential component acceptance

## Task metadata

- **Stage:** C — acceptance documentation and authorized commit/push. Earlier preparation records below are historical.
- **Status:** Accepted by Dimi, who declares FS-1.7 done on 2026-09-18. Technical finding R3 remains open; the latest Codex verdict is changes required. This records the human decision without claiming a clean technical close or FS-G1 completion.
- **Latest candidate:** source matches the reviewed pending-button patch `cb87e907c612a1bdb06bde5ac156399350795a83c8df3e64ac404eb2b8a1bbb5` on the base below. This finalization changes only this document and the feature plan; the containing Git commit identifies the committed candidate. Local manifests retain the earlier exact review snapshots.
- **Owner:** Sites owns R3; Codex owns its recheck. **Visual/device approver:** Dimi.
- **Last updated:** 2026-09-18.
- **Base:** `feature/funkspace-minimum-usable`, `05b25a461fa9308ae5a787fa94e6030cd5c56495`, clean at Stage A start. Stage C preserved the six-file uncommitted Stage A candidate and adds only the assigned corrections below.
- **Scope:** Essential-set stories, bounded integration/browser evidence, responsive CSS corrections and existing task documentation. Dimi explicitly authorizes committing and pushing these changes on 2026-09-18. No deployment or new product flow is authorized.
- **Related:** [feature plan](../features/funkspace-minimum-usable.md), [workflow](../development/ai-workflow.md), [template](../templates/task.md), [architecture](../architecture.md), [asset contract](fs-1.1-asset-and-component-contract.md), [foundation evidence](fs-1.2-token-and-contrast-foundations.md).

## Prerequisites and approval boundary

The dated final decision at the end of this record supersedes earlier statements
that Dimi's complete-set acceptance or commit/push authorization was missing.
Historical test results keep their original scope. R3 is not recorded as fixed.

| Prerequisite                                                | Recorded implementation / acceptance                                                                                              | Remaining boundary                                               |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [FS-1.3 Standard Button](fs-1.3-standard-button-family.md)  | Dimi manual/visual PASS; full 48/72/96 matrix and large-label Figma hover pairing accepted                                        | Independent compatibility review belongs to FS-1.7               |
| [FS-1.4 HexButton](fs-1.4-hexagonal-button-family.md)       | Manual/visual PASS; full matrix and icon-only gallery accepted                                                                    | Fixed-page positioning is later work                             |
| [FS-1.5 fields/status](fs-1.5-essential-form-primitives.md) | Readability approved and manual/visual PASS                                                                                       | Contact validation/delivery decisions belong to EPIC 5           |
| [FS-1.6 dialog](fs-1.6-shared-dialog-primitive.md)          | Stage B architecture reviewed; implementation and final manual/visual PASS including Close icon and blue focus; committed in base | Complete-set Codex review and Dimi acceptance are still required |

Prior component approvals are real evidence, not approval of the new combined
candidate. Device/browser versions were not supplied for those manual checks.
This stage neither infers those versions nor closes EPIC 1 or FS-G1. FS-G1 also
needs the real static website and navigation/settings work of EPICs 2–3.

## Inspection and decisions

Read root AGENTS (no nested instruction files), README/build order, workflow,
feature plan, task template, accepted FS-1.1–FS-1.6 records, and the supplied
`/Users/dimi/Downloads/FunkSpace_EPIC_1_Detailed_Plan.md`, especially FS-1.7 and
its validation section. The attachment's historical revisions are provenance,
not reset targets. No material scope conflict was found.

Inspected actual Button/ButtonLink/standardControl, HexButton/controlAppearance,
Icon and raw-source register, field helpers/TextField/TextAreaField/InlineStatus,
Dialog/useDialog/native adapter, ServiceProvider/createServices, ThemeService,
Storybook main/preview, production globals/fonts/tokens, existing stories/tests,
and package/Playwright configurations.

- Reuse the existing matrix stories rather than duplicate a decorative wall.
- Add a small local composition and full-document version, both using only
  existing controls. All draft/error/pending/completion/example state stays in
  a story; it is not a contact form, service or production controller.
- Existing Standard content/style and shared control appearance recipes already
  remove the real Button/anchor/Hex duplication. FieldFrame already shares
  label/help/error associations. No further production duplication or unused
  production demonstration logic was demonstrated; no speculative cleanup.
- Production token CSS enters Storybook through `app/globals.css`; local
  Work Sans (100–900) and Space Grotesk (300–700) variable fonts use the same
  production font definitions. No alternate token or font source is introduced.
- ServiceProvider owns ThemeService initialization/disposal; StorybookTheme
  aligns the root selection, while the existing addon sets the body's explicit
  theme. Explicit `light` differs from system-following `default`. Tests await
  both rendered states, verify actual colors/fonts, and exercise the real toolbar.
- The first new story import used an alias that Storybook does not resolve for
  excluded story files. Changed only that story to the preview's existing
  relative-import convention. An early immediate body-theme assertion raced
  the addon effect; polling both observable states fixed readiness without
  weakening the final theme assertions. No preview/provider inconsistency
  remained after resolution, so neither was rewritten.
- Screenshot review found a real 320px/200%-text issue despite the original
  visibility check passing: native dialog's em-based max-width and scaled
  gutters left the action taller than the content viewport. `Dialog.module.css`
  now caps existing token gutters by viewport dimensions and removes the native
  max-width cap; its explicit width still bounds the surface. Text sizes and
  button variants are unchanged. The strengthened check requires the whole
  action to fit the scrollable area; all three stress viewports pass. The first
  gutters-only attempt still failed; overriding the native cap completed the
  repair. This is the only production change and needs Dimi's visual decision.

## Actual changed files and boundaries

| File                                                           | Change                                                                                                                                                                                                                |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/components/Controls/EssentialSet.stories.tsx`        | Composition and Full Document fixtures; existing native links, Standard/Hex triggers, controlled fields, caller error, pending/status and shared dialog; a read-only ThemeService subscription reports resolved state |
| `frontend/components/Controls/EssentialSet.stories.module.css` | Story-only wrapping layout and full-document scrolling geometry using existing spacing/font tokens                                                                                                                    |
| `frontend/components/Controls/Dialog.module.css`               | Viewport-capped gutters and explicit native max-width override for demonstrated narrow/enlarged-text reflow; lifecycle and typography unchanged                                                                       |
| `e2e/storybook/essential-set.spec.ts`                          | Real browser composition, theme/font evidence, native links, pending, retained values, reflow, separate media modes, toolbar changes and same-document story disposal/reset                                           |
| `docs/tasks/fs-1.7-essential-component-acceptance.md`          | This candidate/evidence/checklist record                                                                                                                                                                              |
| `docs/features/funkspace-minimum-usable.md`                    | Stage A status and bounded next-owner handoff                                                                                                                                                                         |

No production API, source token, SVG, generated output, dependency, bootstrap,
logo, game or application route change. Presentation still consumes application
services through the existing provider. Pure Domain contracts and Infrastructure
ownership of native dialog effects remain unchanged.

## Review map and API/asset summary

| Area             | Existing contract and meaningful stories                                                                                                                                                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard actions | Native default `type="button"`; submit/reset, refs/native props, four treatments and 48/72/96 sizes. Leading/trailing or paired decorative icons. `Controls/Button/Figma Matrix`, Native Form, Pending Interaction, Long Label                                                         |
| Navigation       | `ButtonLink href` renders a real outlined anchor with native browser navigation; no disabled/pending link fiction. `Controls/ButtonLink` and the combined fixture's fragment/new-tab destinations                                                                                      |
| Hex controls     | Native rectangle, decorative-only hex clipping, full hit area/focus ring; four treatments, 48/72/96 artwork with 24/36/48 icons. `Controls/HexButton/Figma Matrix`, Interaction, Close; Menu remains visibly named for the real trigger                                                |
| Fields           | `TextField` text/email and `TextAreaField`, persistent caller labels, stable IDs, merged descriptions, native values/events/refs/attributes. Supplied `error` controls invalid semantics. `Controls/FormFields` normal/invalid/disabled/pending/surface pairings                       |
| Pending/status   | Primary Button `pending` reserves indicator/status layout and blocks repeats while retaining focus; native disabled means ordinary unavailability. InlineStatus is polite and mounted. Fixture completion is explicitly local; no delivery claim or validation business rule           |
| Dialog           | Controlled `open/onCloseRequest`, visible title, optional short description, initial/return/fallback refs; native modal path, Close/Escape, no backdrop dismissal, owned focus/scroll cleanup. `Controls/Dialog` short/long/full-document/lifecycle fixtures plus combined composition |
| Assets           | Eight approved Figma icon families, 24 raw exports, currentColor and per-instance clip IDs; Close's 26/40 source-frame exceptions display at 24/36px. [Source register](../../frontend/components/Icons/README.md), `Icons/Library/Gallery`; original logo unchanged                   |

Approved substitutions remain explicit: Customize/Send treatments are text-only;
More artwork exists in the gallery but no extra More control is invented.
The previously accepted text-only Close substitute was superseded by Dimi's
new Close icon. No missing essential asset blocks this candidate. Genuine
selected/toggle combinations have no accepted consumer and are not invented.
Pending is not added to unsupported treatments; future form orchestration and
route/destination behavior remain outside this stage.

New entry points:

- [Composition](http://localhost:6006/?path=/story/controls-essentialset--composition)
- [Full Document, standalone](http://localhost:6006/iframe.html?id=controls-essentialset--full-document&viewMode=story&globals=theme:light)
- [Standard matrix](http://localhost:6006/?path=/story/controls-button--figma-matrix)
- [Hex matrix](http://localhost:6006/?path=/story/controls-hexbutton--figma-matrix)
- [Icon gallery](http://localhost:6006/?path=/story/icons-library--gallery)

The standalone iframe URL opens as a top-level document for native modality and
document-scroll checks. In embedded Storybook, only the preview document is
modal; the surrounding manager remains interactive. Existing dialog tests
separately exercise background inactivity, scroll containment/restoration,
trigger removal, unmount, native/controlled closure and ten cycles per trigger.

## Validation evidence

Exact commands/logs, JSON reports, pairing/font attachments, screenshots and
generated hashes are retained under the session workspace's
`artifacts/fs-1.7-stage-a/`.

| Command / check                                                                                                                                                                                  | Result and scope                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:theme-bootstrap`                                                                                                                                                                     | PASS before generation/build; no stale output hidden or startup changes                                                                                                                                                                                   |
| `pnpm build:tokens` twice, SHA-256 comparison                                                                                                                                                    | PASS, identical outputs; zero generated diff against base                                                                                                                                                                                                 |
| `pnpm -F @funkspace/common typecheck`, `pnpm -F @funkspace/wave-survivor build`, `pnpm -F frontend exec tsc --noEmit --incremental false`                                                        | PASS in inspected prerequisite order                                                                                                                                                                                                                      |
| `pnpm -F frontend exec tsc -p /tmp/fs17-stories-tsconfig.json --noEmit`                                                                                                                          | PASS; explicitly includes the new story normally excluded by frontend config                                                                                                                                                                              |
| `pnpm lint`                                                                                                                                                                                      | PASS, no lint warnings/errors; rerun after responsive repair, final documentation formatting checked separately                                                                                                                                           |
| `pnpm test`                                                                                                                                                                                      | PASS, 1,351 tests / 90 files; production behavior unchanged by subsequent CSS-only repair                                                                                                                                                                 |
| `pnpm storybook:build`, then `pnpm build`                                                                                                                                                        | PASS; both repeated after the reflow repair. Root build generates tokens, checks common, builds game and frontend                                                                                                                                         |
| `pnpm -F @funkspace/wave-survivor typecheck`, `pnpm -F @funkspace/wave-survivor test`, `pnpm -F @funkspace/wave-survivor demo:build`                                                             | PASS; 920 tests / 58 files. No game or shared output changed                                                                                                                                                                                              |
| `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.storybook.config.ts --reporter=json`                                                                         | Final PASS: 107 tests, zero skipped/flaky/unexpected, no retries. Existing 95 plus 12 new integration checks                                                                                                                                              |
| `pnpm e2e --reporter=json`                                                                                                                                                                       | Final PASS: all 14 configured application tests, zero skips/retries: foundation pairings 4, unfiltered home accessibility 4, home 1, logo 2, no-cookies/third-party 1, theme 2                                                                            |
| Built Storybook on temporary port 6007: `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config /tmp/fs17-built.config.ts essential-set.spec.ts dialog.spec.ts --reporter=json` | Historical 28-test pass; Stage B R2 corrected its provenance: 27 tests used the static server and the dialog touch test used development port 6006. This is not 28 static-build checks.                                                                   |
| Ad hoc strict TypeScript of new and unchanged browser-test files                                                                                                                                 | BLOCKED by existing Axe/Playwright `Page` mismatch (`consoleMessages`, `pageErrors`, `requests`), reproduced in unchanged `form-fields.spec.ts`. New test's own native-button narrowing error was fixed. No unsafe cast, suppression or dependency change |
| Screenshot inspection, local doc destinations, whitespace and final source/generated diff                                                                                                        | PASS; final screenshots include whole-action visibility at narrow/enlarged text. Initial permissive reflow evidence is explicitly superseded by strengthened checks                                                                                       |

**Browser/project identity:** Playwright 1.55.1, installed Chromium
140.0.7339.186 on this macOS host. Storybook config's single unnamed project
uses Desktop Chrome settings on port 6006; its top-level iframe URLs are real
full documents. The static-build override copies that configuration to port
6007, and also exercises the embedded manager for toolbar/story transitions.
Application config runs the named `chromium` project on port 3000. Firefox and
WebKit binaries are unavailable and were not installed or claimed tested.

**Fixtures/media:** four resolved themes, 1440×900 wide, 320×640 reflow stress,
844×390 short landscape, each enlarged-text case at 200%. Forced colors and
reduced motion have separate new tests. Existing dialog checks include touch
emulation and an embedded-host modality boundary. Physical phone, Safari,
screen reader and device/browser versions from Dimi remain unavailable here.

The new integration evidence verifies loaded font faces and computed Work Sans
600 headings / 700 regular controls, Space Grotesk 400 field text, root/body/
service theme agreement, real hover/pointer-down/focus, caller description and
error merging, disabled blocking, pending repeat prevention and stable target
dimensions, close/reopen value retention, both triggers, native fragment/back/
new-tab navigation and open-dialog story-unmount cleanup. All Axe results are
unfiltered within the fixture scope. Existing matrix tests retain size-specific
500/600/700 weights and approved large-label 3:1 hover criteria; ordinary text
remains at 4.5:1 and meaningful focus at 3:1. This does not certify hypothetical
future states or translucency/contrast combinations.

**Not run / not needed for this patch:** Lighthouse flag-on/off runs, production
theme-bootstrap browser suite, standalone game browser suite and coverage
instrumentation. The only production diff is bounded dialog CSS, currently
consumed by Storybook; routes, startup, game integration and bundle entry points
are unchanged. Full application checks, game types/tests/demo build and source/
built dialog browser checks ran as above. Full-site performance and real page
placement remain later acceptance work. Existing Storybook addon-version,
sourcemap and bundle-size warnings remain visible in the build log.

Cleanup stopped the owned static server on 6007; Playwright stopped its owned
application server. The existing Storybook on 6006 remains available for review.
No repository build output, temporary test config or evidence archive is tracked.

## Dimi phone/desktop checklist — pending for this candidate

Historical checklist: Dimi subsequently reports manual/visual PASS and declares
the task done; see the final decision. Device/browser versions and a separate
assistive-technology result remain unspecified.

Record device, OS, browser/version and candidate identifier. Use the selected
Sony phone and MacBook browsers; do not infer one browser from another.

1. In Composition and both matrices, choose **light**, dark, muted and
   highContrast. Check blue focus, icon colors, font identity, labels and
   disabled readability. `default` follows the OS; `light` forces standard.
2. Use the Standard and visible Menu triggers. Close with the X and Escape
   where a keyboard is available. Check return focus, comfortable targets and
   reachable Close in portrait/landscape and the short viewport.
3. Edit Name/Message, show the example error, then edit Preview message.
   Run local preview twice: only one run should count, the pending name should
   stay stable, and the value should remain visible. Close/reopen, finish the
   fixture work and verify retained values. No information is sent.
4. In Full Document, scroll before opening; scroll the long dialog; verify
   the background is inactive and position returns on closing. Follow the
   notes link and the new-tab link using native browser controls.
5. At 200% text/browser enlargement and a narrow viewport, inspect wrapping,
   fields, status/error text and focus visibility. Test OS reduced motion;
   use forced colors separately where supported.

### Assistive-technology spot check — not run here

Using VoiceOver with Safari on the MacBook (or the actual available screen
reader/browser, recorded explicitly), navigate by controls and headings:

- Each field announces its persistent label, help plus caller description,
  and supplied error; absent errors do not announce invalid.
- Dialog opening announces its visible title without treating long content
  as one description. Background controls are outside its navigation scope.
- Close has one name, decorative glyphs stay silent, and focus returns to the
  initiating control. Pending remains understandable without motion.
- Run/finish once; working/completion feedback should be understandable
  without duplicate global error announcements or focus theft.

Automated accessibility checks do not substitute for this listening check.

## Historical Stage A candidate identity and handoff

The immutable base above plus `candidate.patch` in `artifacts/fs-1.7-stage-a/`
reproduces the candidate in a separate clean checkout. `candidate-manifest.json`
records the full patch SHA-256 and every changed file hash. Apply only to that
base (`git apply --check` first); never reset the user's current checkout.
`command-evidence.md` and the raw reports accompany the same candidate.

Codex's next step is independent technical review of this exact candidate and
the existing production component set at the base, including accepted earlier
API/asset amendments. The Stage A diff is a harness/evidence diff, not a
replacement for inspecting those production components. Sites will own returned
UI/fixture fixes; shared-token/build issues go to Codex through an explicit
handoff. No review was delegated or started during Stage A.

Open gates: Codex review and Dimi's complete-set visual/device decision,
including the assistive-technology spot check or its explicitly recorded
availability/outcome. Prior manual/visual PASS records are retained. No final
approval, EPIC 1 acceptance or FS-G1 completion is claimed.

Open findings/owners: the pre-existing ad hoc browser-test type mismatch is a
Codex tooling follow-up; it does not conceal a runtime/Axe failure. Dimi must
review the responsive dialog gutters and the combined matrix/device checklist.
Sites owns returned UI fixes. No unresolved functional failure was observed in
the tested candidate. This is Sites' implementation handoff, not an independent
technical verdict or final visual approval.

## Stage B review and Stage C reconciliation — 2026-09-16

The [Codex Stage B review](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-1.7-stage-b/review.md)
returned **changes required**, with two P2 findings. Review SHA-256:
`bfd7f0e0691e1ceef1d013e6df2ad56384aabc0c3b97793abab2fe7bc5d0736c`.
It reviewed base `05b25a461fa9308ae5a787fa94e6030cd5c56495` plus Stage A patch
`722701f3542e69eb6875280729ca427e0c15e5d7464ef5195ff5ba2934a1c363`, as well as
the earlier production component commits. Its passing checks are historical
evidence for that candidate; they do not approve the revised Stage C patch.
The review distinguishes earlier Codex foundation self-checks from independent
authorship evidence and states that no separate agent was launched.

Stage C rechecked HEAD, branch, actual diff, original contracts and task records,
the review and its reproductions, package/build order, and affected code/tests.
There are no unrelated source changes. Sites remains the only writer. The
Sites execution-profile check reported `portable`, `configured:false`; existing
repository scripts and architecture were preserved. This is local repository
work, with no Site registration, publication, commit or push.

### Assigned findings and bounded corrections

| Finding | Demonstrated problem                                                                                                                                                       | Stage C correction and owner                                                                                                                                                                                                                                                                                                                   | Acceptance state                                                                                    |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| R1 / P2 | At 320×640 and 200% root text, Standard Figma Matrix widened to 513px; the large paired-icon button was 481.14px wide. Merely constraining its parent collapsed the label. | Sites: shared `standardControl.module.css` allows content rows to wrap, retains a nonshrinking label bounded by the content width, and caps horizontal padding at 5% of the containing width when smaller than the existing token. Matrix grids use a zero minimum track. Font sizes, icon geometry, colors, targets and variants stay intact. | Implemented with regression evidence; Codex re-review and Dimi's revised wrapping decision pending. |
| R2 / P2 | Dialog and Hex touch tests hardcoded development origin 6006, bypassing static-build configuration.                                                                        | Sites: custom touch contexts receive the configured `baseURL`, navigate relatively, assert the actual origin and attach it to the report. The inaccurate Stage A aggregate above is corrected.                                                                                                                                                 | Implemented; static-origin rechecks recorded below; Codex re-review pending.                        |

The new matrix regression checks all 24 cells at 320px/200%, document width,
contained/nonoverlapping children, label width of at least two font-size units,
and an unchanged enlarged 96px large-label font. It separately moves an actual
large control into a 240px parent, preserving unique SVG IDs, and runs
unfiltered Axe. It does not hide overflow or reduce text to make the check pass.
Normal desktop matrices and pending/link behaviors retain their existing tests.

Stage C changes five additional implementation/test files:

- `frontend/components/Controls/standardControl.module.css`
- `frontend/components/Controls/Button.stories.tsx`
- `e2e/storybook/button-matrix.spec.ts`
- `e2e/storybook/dialog.spec.ts`
- `e2e/storybook/hex-button.spec.ts`

This task record and the feature plan are updated within the existing six-file
Stage A patch, making **11 total candidate files**. The inherited dialog reflow
correction and EssentialSet fixture remain. No API, token, asset, dependency,
bootstrap, game, or page change is added. No shared-foundation correction was
demonstrated, so no ownership takeover or speculative token edit is needed.

### Initial Stage C validation and exact candidate

Fresh command results and immutable patch/file hashes are retained in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-1.7-stage-c/`.
`candidate.patch` plus the base above reproduces this candidate;
`candidate-manifest.json` identifies its patch SHA-256 and every changed file.
Use `git apply --check` in a separate checkout at that base, not a reset of the
user's current checkout. Stage A/B artifacts remain earlier provenance.

Fresh Stage C results (macOS; Playwright 1.55.1 / Chromium 140.0.7339.186):

| Command/check                                                                                                                 | Result                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:theme-bootstrap` before builds and at cleanup                                                                     | PASS; startup source/generated output unchanged                                                                                                                   |
| Frontend `tsc --noEmit --incremental false`; explicit Controls/Icons/Foundations story types using the retained configuration | PASS                                                                                                                                                              |
| `pnpm lint`; `pnpm test`                                                                                                      | PASS; 1,351 tests / 90 files                                                                                                                                      |
| `pnpm storybook:build`, then `pnpm build`                                                                                     | PASS, inspected tokens → common → game → frontend order; generated files remain unchanged                                                                         |
| Focused `button-matrix.spec.ts --grep '320px'`                                                                                | PASS; formerly 513px-wide matrix now stays at 320px, labels and artwork remain contained and nonoverlapping                                                       |
| Full `playwright.storybook.config.ts` suite on development port 6006                                                          | PASS: 108 tests, zero skipped/flaky/unexpected, no retries                                                                                                        |
| Full suite using retained `built.config.ts` on static IPv4 port 6017                                                          | PASS: 108 tests, zero skipped/flaky/unexpected, no retries. All four dialog/Hex touch attachments explicitly identify port 6017                                   |
| Same dialog touch test with configured port 61999 and no server                                                               | Expected FAIL: `ERR_CONNECTION_REFUSED` at 61999. This negative control confirms there is no silent fallback to 6006; it is not counted as a passing browser test |
| `pnpm e2e --reporter=json`                                                                                                    | PASS: 14 named Chromium application tests on Next development port 3000, including four unfiltered home accessibility and four foundation-pairing tests           |
| Final formatting, local links, diff/patch and protected-file comparison                                                       | PASS; only the 11 scoped candidate files differ from HEAD                                                                                                         |

Source/static reports, actual touch origins, enlarged-text screenshots, command
logs and final file hashes accompany the Stage C patch. The candidate is not
technically re-approved by its own implementation checks. The first diagnostic
probe reused a Stage B helper; its new diagnostic outputs were moved into Stage C.
The original Stage B primary failure screenshot and detailed reflow measurements
remain the before-evidence; no new run is represented as historical evidence.

Dedicated game tests/demo/browser, token double-generation, and common checks
from Stage B remain explicitly historical for unchanged inputs; the current
root build also reran common types/game build, and root unit tests include game
regressions. There is no new shared-token or game change requiring another full
standalone run. No new ad hoc browser-test typecheck, Lighthouse, coverage,
production-bootstrap browser, Firefox/WebKit, physical-device or assistive-
technology result is claimed. Existing Axe/Playwright typing and Storybook
addon/sourcemap/chunk warnings are not fixed or suppressed.

Cleanup stops only the owned static server on 6017; the existing Storybook
preview remains available. No generated output, dependency or unrelated work
is included in the patch.

### Historical Stage C decision and remaining gates

**No FS-1.7 complete-set visual/device decision has been supplied.** Dimi's
FS-1.3–FS-1.6 manual/visual PASS statements apply to their recorded earlier
candidates. They do not accept Stage A's dialog gutter correction or Stage C's
new narrow Standard wrapping. No phone/browser version or screen-reader result
is inferred from “it's all fine so far.”

1. **Codex:** re-review the exact Stage C patch, especially R1 bounds/readability,
   normal/pending compatibility and R2 origin evidence. Sites owns any returned UI fixes.
2. **Dimi:** review that same candidate using the phone/desktop checklist above;
   record device, OS, browser/version, outcomes and acceptance/revisions. Inspect
   large paired-icon wrapping at 320px/200% and dialog Close/content reachability.
3. **Dimi:** record the assistive-technology spot check, or its actual unavailability;
   automated Axe is not a listening test. Firefox/WebKit and physical-device
   results are not supplied by Chromium emulation.
4. **Codex/Dimi tooling follow-up:** existing Axe/Playwright Page type-version
   mismatch remains separately scoped; no suppression or dependency change here.

Until the required review and human evidence are present, FS-1.7 is
**implemented / awaiting acceptance**, not complete. Only then may Sites record
EPIC 1 component acceptance. **FS-G1 remains the later static-site/navigation/settings gate.**

## EPIC 2 handoff — available foundation and limitations

This inventory enables the next owner to plan integration. Dimi's later
acceptance and the remaining R3 limitation are recorded below. Page
implementation requires its own task; it is not part of this finalization.

| Available import                                              | Supported contract and example                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@/components/Controls/Button` (default)                      | Native action; default `type="button"`, `variant="primary"`, `size="small"`. Four treatments: primary, secondary, outlined, accent-outlined. Sizes small/medium/large retain 48/72/96 minimums. Explicit submit/reset, refs, native props and class/style extension remain. Single leading/trailing icon or named paired slots; decorative artwork is silent. See Button/Figma Matrix, Native Form and Pending Interaction.                                                                                 |
| `@/components/Controls/ButtonLink` (default)                  | Native anchor with required genuine `href`, outlined appearance, three sizes and shared icon slots. Browser fragment/back/new-tab behavior stays native; no disabled/pending link API. Use actual routes only once they exist.                                                                                                                                                                                                                                                                              |
| `@/components/Controls/HexButton` (default)                   | Native rectangular target around 48/72/96 artwork and 24/36/48 icons; four shared treatments. Defaults primary/medium with visible Menu. Icon-only consumers supply `aria-label`; Close uses secondary/small and the Close artwork. No selected-state or overlay-open semantics are invented.                                                                                                                                                                                                               |
| `@/components/Icons/Icon` (`Icon`)                            | Eight source-backed families in 24/36/48 display sizes; currentColor and documented arrow background binding. Meaningful standalone artwork supplies `label`; decorative control icons do not. Keep per-instance IDs and actual Close viewBox exceptions.                                                                                                                                                                                                                                                   |
| `@/components/Controls/TextField`, `TextAreaField` (defaults) | Persistent required caller label, optional help/error; text/email only for TextField. Native IDs/names/refs/events/values/defaultValues, autoComplete, required, disabled/readOnly and textarea sizing retained. Supplied errors, including later server-derived strings, set invalidity; descriptions merge. Caller owns validation and submission policy; disabled fields follow native omission from FormData.                                                                                           |
| `@/components/Controls/InlineStatus` (default)                | Keep mounted and update caller-supplied `message`; polite inline status without focus theft. Fixture completion text is not delivery evidence.                                                                                                                                                                                                                                                                                                                                                              |
| `@/components/Controls/Dialog` (default)                      | Under the existing ServiceProvider: controlled `open`, `onCloseRequest`, visible `title`, optional short description and content. Required stable outside `fallbackFocusRef`; optional initial and return refs. Set return ref from the trigger event for reliable pointer restoration. One native modal per document, explicit Close/Escape, outside-click dismissal off. Infrastructure owns modal/scroll/listener cleanup. Consumers own future navigation/destination choice and keep fallback mounted. |

Reference the [accepted asset/variant contract](fs-1.1-asset-and-component-contract.md),
[Standard API/matrix amendments](fs-1.3-standard-button-family.md),
[Hex contract](fs-1.4-hexagonal-button-family.md),
[field and later-error examples](fs-1.5-essential-form-primitives.md),
[reviewed dialog API and lifecycle boundary](fs-1.6-shared-dialog-primitive.md),
and [actual source/export register](../../frontend/components/Icons/README.md).
Controls/EssentialSet/Composition and Full Document demonstrate their joint use.

Approved text-only More/Customize/Send substitutes remain valid; optional future
artwork replacement is Dimi-owned at its named consumer task. The Menu SVG and
later Close SVG are supplied assets, not unresolved substitutes. No placeholder
brand artwork, spinner, fake destination or delivery provider is introduced.
Original logo geometry/IDs remain protected; repeated inline-logo consumers
need the previously recorded ID/animation review before integration.

Themes/fonts come from existing production globals and ThemeService; do not
create another palette/provider. Large-label Figma hover uses its accepted 3:1
pairing, ordinary text retains the repaired 4.5:1 roles. Real page placement,
navigation/settings, contact delivery/validation rules, physical device behavior
and final site performance remain their later tasks and acceptance evidence.

## Pending presentation correction requested by Dimi — 2026-09-16

Dimi reported that Pending Interaction gained unwanted bottom space and put
the ellipsis below its label. The explicit request is a normal-height button
with an arrow-right on the right, replaced by the ellipsis during pending.
This is a correction request, not acceptance of the current FS-1.7 candidate.

The cause was the Stage C combination of wrapping content and parent-percentage
padding inside the pending wrapper's intrinsically sized grid. The empty
reserved icon slot wrapped to a second row even before activation. Shared
padding now uses `min(existing token, 5vw)`, avoiding that percentage-sizing
cycle. Pending controls keep a single icon/label row and let the label wrap
when enlarged; ordinary controls retain the reviewed constrained-row reflow.
No fixed-height clipping or font-size reduction is introduced.

`Button.stories.tsx` supplies the existing `Icon name="arrow-right"` in the
trailing slot for Pending Interaction. The component's existing pending
replacement renders `…` in that slot and restores the arrow when complete.
The leading/trailing demonstration stories use the same trusted arrow asset.
The separate polite “Working…” status and its reserved external space remain;
the extra row inside the button is removed. Native props, focus retention,
repeat guards, accessible name and public API are unchanged.

The strengthened existing browser tests use a 320px viewport and require a
48px button before activation, the same dimensions afterward, the same icon
slot coordinates, vertical alignment beside the label, idle/restored SVG,
pending ellipsis and no SVG, plus the original focus/repeat/layout assertions.
The first run's selector matched both the decorative span and nested SVG;
restricting it to the direct span corrected the test setup without weakening
assertions. The 320px/200% matrix regression remains in the test selection.

Actual narrow-preview measurement: **235.65625 × 48 CSS pixels before and
after activation**, at the same coordinates. Idle/pending screenshots are
retained with the current patch under
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-1.7-pending-fix/`.
The earlier Stage C patch `4b02a4670e00fd75358f9f02fab76725ed8951e0f5e23edf6720e9624ff817a6`
is superseded; its evidence is historical. The latest `candidate.patch` and
`candidate-manifest.json` identify the current continuation on unchanged base
`05b25a461fa9308ae5a787fa94e6030cd5c56495`.

This follow-up changes the shared Standard CSS, Button stories, existing Button
browser tests, this record and the feature-plan note. No token, SVG, font,
dependency, theme/bootstrap, game or dialog-lifecycle change is included.
Codex's renewed review and Dimi's visual/device decision must refer to this
latest candidate. EPIC 1 and FS-G1 remain open; no commit or push is performed.

Fresh validation: bootstrap freshness, frontend types, explicit story types,
lint and 1,351 unit tests PASS; Storybook and application builds PASS.
All 108 source Storybook browser checks PASS, plus 48 focused static-build
checks (`button.spec.ts`, `button-matrix.spec.ts`, `essential-set.spec.ts`) on
port 6017. All 14 application browser tests PASS, including unfiltered home
smoke. Final browser runs have no failures, skips or retries. Screenshots
confirm the requested idle/active presentation. This remains Chromium evidence,
not renewed Codex review or physical-device/assistive-technology acceptance.

## Dimi final decision and authorized commit — 2026-09-18

Dimi first reported **“The manual and visual Tests are PASS”** and requested
renewed Codex review. After receiving that review, Dimi stated:

> ok 1.7 are done, all tests are PASS. Update the documentation if needed, then commit and push the changes.

This is Dimi's task-completion/acceptance decision and explicit commit/push
authorization for the current candidate. It does not establish that an
observed technical failure was repaired. All 12 candidate file hashes still
matched the reviewed patch before this documentation update; no other writer's
fix or later test result was present in the checkout.

### Renewed review and remaining technical finding

The [renewed Codex review](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-1.7-renewed-review/review.md)
reviewed base `05b25a461fa9308ae5a787fa94e6030cd5c56495` plus patch
`cb87e907c612a1bdb06bde5ac156399350795a83c8df3e64ac404eb2b8a1bbb5`.
It confirms R1 ordinary-control reflow and R2 configured-origin touch checks
are corrected. The normal 48px Pending Interaction arrow/ellipsis swap passes.
The technical verdict remains **changes required**, with this repository-local
summary retained so it does not depend on access to the local review artifacts:

- **R3 / P2, owner Sites:** `standardControl.module.css` pending-group no-wrap
  and shrinking-label rules collapse a large paired-icon Button label at a
  320px viewport and 200% root text. The actual component with `size="large"`,
  both icon slots and `pending={false}` or `pending={true}` has a **0px label
  width** and **1337.0625px height**. Without the pending prop, its label is
  218px wide. Text overlaps icons; document width alone still passes at 320px.
- **Required follow-up:** preserve the ordinary one-row 48px appearance while
  allowing a readable layout for enlarged/constrained pending controls. Keep
  indicator reservation, focus and repeat guards. Add this supported combination
  to regression coverage; Codex rechecks and Dimi reviews changed presentation.
- **Acceptance distinction:** Dimi's completion decision is recorded as given.
  R3 is open, not fixed, tested green, or explicitly waived. No new product
  restriction or silent removal of supported sizes/icon combinations is made.

### Validation and evidence reconciliation

Fresh renewed-review checks on this same source candidate passed bootstrap
freshness, frontend and explicit story types, lint, 1,351 unit tests, Storybook
and application builds, 108 source plus 108 static Storybook browser checks,
14 application browser checks including unfiltered home/foundation assertions,
and standalone game types/build/920 unit tests/18 browser tests. Game unit
counts overlap the root suite. Positive browser suites had no skips or retries.
R2's unused-origin negative control failed as expected at the configured port.
The additional R3 browser probe **failed**; “all tests PASS” above is Dimi's
reported result, not a replacement for that technical evidence.

The reviewer checked all 466 tracked/untracked source-file hashes unchanged,
the empty index, HEAD, protected generated/assets/game paths and reverse patch
applicability. These were separate review-stage checks in the same agent session,
not evidence of a newly independent author/reviewer. Existing ad hoc
Axe/Playwright typing alignment remains a separate Codex tooling follow-up.
Physical browser/version details, screen-reader outcome, Firefox/WebKit,
Lighthouse and coverage instrumentation remain unrecorded or not run as
specified in the review; no evidence is invented from the human PASS statement.

This finalization changes documentation only. Formatting, local-link targets,
bootstrap freshness, diff scope and unchanged implementation hashes are checked
before committing; prior executable results remain tied to the unchanged source.
The authorized commit contains these 12 task files:

- `docs/features/funkspace-minimum-usable.md`
- `docs/tasks/fs-1.7-essential-component-acceptance.md`
- `e2e/storybook/button-matrix.spec.ts`
- `e2e/storybook/button.spec.ts`
- `e2e/storybook/dialog.spec.ts`
- `e2e/storybook/hex-button.spec.ts`
- `e2e/storybook/essential-set.spec.ts`
- `frontend/components/Controls/Button.stories.tsx`
- `frontend/components/Controls/Dialog.module.css`
- `frontend/components/Controls/standardControl.module.css`
- `frontend/components/Controls/EssentialSet.stories.module.css`
- `frontend/components/Controls/EssentialSet.stories.tsx`

No public API, token, asset, dependency, bootstrap or game contract changes in
this finalization. The API/import/substitution handoff above remains available.
Sites owns R3's next source change; Codex owns re-review; Dimi owns acceptance of
that changed presentation and any missing device/assistive-technology detail.
EPIC 1 has Dimi's component acceptance but retains the open technical finding;
it is not represented as an unqualified technical pass. **FS-G1 remains open**
for the later static-site/navigation/settings gate. No later task or deployment
is started by this commit/push authorization.
