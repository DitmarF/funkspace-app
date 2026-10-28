# FunkSpace EPIC 6 — Detailed Plan

## 1. Status, outcome and deadline

- **Status:** Ready for planning review. No EPIC 6 implementation, release certification or rollout is claimed by this document.
- **Prepared:** 2026-10-28; all schedule times use Europe/Berlin (CET).
- **Owner:** Codex coordinates technical delivery; Sites owns UI/scene evidence and corrections; Dimi owns human acceptance and external-action decisions.
- **Deadline:** The site must be online, tested and usable by **Thursday evening, 29 October 2026**. The presentation starts **Friday, 30 October at 06:00**.
- **Repository:** [DitmarF/funkspace-app](https://github.com/DitmarF/funkspace-app), local checkout `/Users/dimi/Projects/funkspace-app`.
- **Inspected branch/base:** `feature/funkspace-minimum-usable` at `878b7da8beef805d65d5a33ea0150aef595aadab`; clean before this document was added.
- **Parent scope:** [Minimum Usable Experience](funkspace-minimum-usable.md#epic-6--integrated-quality-gates-controlled-rollout-and-game-handoff), tasks FS-6.1–FS-6.6 and gate FS-G3.
- **Source handoff:** [EPIC 6 planning handoff](../development/epic-6-planning-handoff.md). The downloaded attachment matches this repository file byte for byte.
- **Execution companion:** [EPIC 6 implementation prompts](FunkSpace_EPIC_6_Implementation_Prompts.md), added at Dimi's subsequent request; use one bounded prompt at a time.

### Request versus source context

Dimi's planning request was to produce this detailed plan, including dependency/security remediation, preparation to merge the portfolio feature branch into `main`, deployment, working contact and a subsequent game handoff. The original planning session excluded tool prompts; Dimi subsequently requested the separate execution companion linked above. Creating that prompt pack does not start implementation.

The handoff's embedded agent prompts and older task instructions are reference material, not new execution authorization. Its `07a75a7` checkpoint and statement that the packet is uncommitted are superseded by inspected commit `878b7da`, which contains the packet. Preserve newer work; none of these revisions is a reset target.

**Schedule/scope amendment:** The parent plan's undated release and optional-public-launch wording describe the earlier generic milestone. For this requested delivery, a public, usable portfolio is the primary required outcome. A protected preview is an intermediate checkpoint. If public release cannot proceed, record the deadline outcome as unmet unless Dimi explicitly accepts a named reduced presentation alternative. Do not quietly call a preview or a local build the public launch.

This changes the planning target, not the authorization status of a specific merge, deployment, environment change, DNS change or real email. Prepare those actions completely, then request approval of the concrete candidate and named actions together where practical. Existing EPIC 4/5 acceptance is preserved.

### Definition of success

1. The agreed public HTTPS URL serves the reviewed portfolio revision without requiring a developer account; primary routes, navigation, settings, artwork alternatives and legal/contact information work.
2. The contact form works on the intended public origin, with provider acceptance and actual recipient receipt separately evidenced. Existing EPIC 5 proof is reused; a bounded Production smoke verifies the new environment only when authorized.
3. Release-blocking dependency, architecture, functional and accessibility findings are resolved. Remaining nonblocking items have an owner, rationale and review date.
4. The feature-to-main integration is reviewed, reproducible and checked on the resulting revision; the public deployment is tied to that revision and configuration.
5. Recovery can restore a reviewed usable website or an explicitly accepted degraded mode without leaving uncontrolled older mail-enabled deployments reachable.
6. Dimi accepts the website and FS-G3. A fresh agent can then resume Wave Survivor EPIC 7 from repository evidence without reopening portfolio polish or inventing completed game integration.

## 2. Evidence baseline and known gaps

| Item                       | Verified planning evidence                                                                                                                                                             | Consequence                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Accepted portfolio runtime | `36407f6a790a8d9787bdc3123041e24e181bdfee`; `07a75a7` closes EPIC 5 in documentation; `878b7da` adds the planning packet/guidance                                                      | Reuse accepted unchanged behavior; validate the actual later release candidate                                         |
| EPIC 4/5 and gates         | Scene/contact closure and FS-G1/FS-G2 are recorded                                                                                                                                     | Do not reopen completed epics or request settled provider decisions again                                              |
| Branch relationship        | `main` has one unique commit and the feature branch 55; main's unique `31abe42` updates the pinned `pnpm/action-setup` SHA from `f40ffcd…` to `b906aff…`; local `main` itself is stale | Preserve that upstream CI update and feature work in the integrated candidate; refresh evidence at execution           |
| Current GitHub branches    | Read-only inspection confirms remote `main` `31abe42d97563775272d8a99e5021f3b39bc86ab` and feature `878b7da…`                                                                          | Do not substitute a local branch name or historical deployment label for current source identity                       |
| GitHub proposals           | Ten open Dependabot PRs; no open portfolio integration PR found in the inspected open-PR listing                                                                                       | Prepare a portfolio PR only under later authorization; inspect overlapping bot proposals rather than bulk merging      |
| Dependency alerts          | Fresh read-only GitHub inventory: **39 open default-branch alerts: 2 critical, 11 high, 19 medium, 7 low**                                                                             | The handoff's 38 is stale. This is not a count of exploitable defects in the feature candidate                         |
| Earlier remediation        | [28 September security remediation](../tasks/2026-09-28-dependency-security.md) is on the feature branch; its zero-audit result is historical                                          | Preserve its scoped fixes and refresh both candidate audits and alert-to-lockfile mapping                              |
| Contact state              | Last accepted live Preview was retired; replacement `BJwbeuR6NUejxG3GDpq3QQHj337q` / `h9uharydb` was verified delivery-off on 27 October                                               | No current live form or current deployment state is inferred from these dated records                                  |
| Production                 | Last recorded Vercel Production uses older `main`/`31abe42`                                                                                                                            | Recheck provider/deployment state; GitHub branch identity alone does not prove what the domain serves                  |
| Metadata                   | `frontend/app/layout.tsx` still labels metadata a proposal; `frontend/data/startContent.ts` describes a “PNPM workspace”                                                               | Supply concise audience-facing description and verify title/icon/URLs before release                                   |
| CI coverage                | Main pushes and PRs to main trigger CI; explicit contact Node coverage, Storybook build/browser checks, generic production-route E2E and dedicated game checks are missing             | Add the smallest repeatable release checks; green existing CI alone is insufficient                                    |
| Merge enforcement          | Main forbids force-push/deletion, but current protection has no required status checks/reviews; applicable branch rulesets returned empty                                              | Apply an explicit release review/check gate; do not assume GitHub prevents an unsafe merge or silently change settings |
| Device/performance history | Prior acceptance stands, but raw device/version/per-action and some phone timing data are incomplete                                                                                   | Record current targeted manual evidence; do not invent historical numbers                                              |

Live GitHub counts and PR states are snapshots from 28 October, not permanent facts. No fresh dependency audit, application suite, deployment-console audit, real-device test or live mail was performed during this planning session.

### Known dependency proposals to inspect

| Proposals                                                                                                                                                                                  | Planning disposition                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| [#285](https://github.com/DitmarF/funkspace-app/pull/285), [#286](https://github.com/DitmarF/funkspace-app/pull/286): Next 15.5.24 → 15.5.27                                               | Prioritize advisory/applicability review; keep Next-related packages compatible and the shared lockfile consistent  |
| [#288](https://github.com/DitmarF/funkspace-app/pull/288), [#289](https://github.com/DitmarF/funkspace-app/pull/289): Vite proposals from main's 7.3.5                                     | Feature already uses game Vite 7.3.6; compare against the actual feature graph and prior remediation                |
| [#290](https://github.com/DitmarF/funkspace-app/pull/290), [#291](https://github.com/DitmarF/funkspace-app/pull/291), [#281](https://github.com/DitmarF/funkspace-app/pull/281): Storybook | Check security relevance, family compatibility, manifest/lockfile completeness and duplication                      |
| [#282](https://github.com/DitmarF/funkspace-app/pull/282): Next/React group; [#287](https://github.com/DitmarF/funkspace-app/pull/287): 20 development updates                             | Extract necessary fixes or review a coherent minimal group; do not accept unrelated updates just to clear the queue |
| [#284](https://github.com/DitmarF/funkspace-app/pull/284): GitHub Actions group                                                                                                            | Review runner/action compatibility and security separately; retain SHA pinning                                      |

An update PR is neither an alert inventory nor proof of a safe fix. Do not close or merge it solely because a similarly named package was changed elsewhere.

### Fresh alert-to-feature version matches

The read-only advisory/lockfile comparison below gives FS-6.1 a concrete starting point. These are reported patched versions at inspection, **not an installed, audited or compatibility-tested remediation candidate**. Confirm current advisories, transitive paths and target compatibility when implementing.

| Finding                                                                                                                                                                                  | Feature version → reported patched version                       | Required handling                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Storybook critical [#148](https://github.com/DitmarF/funkspace-app/security/dependabot/148)/[#149](https://github.com/DitmarF/funkspace-app/security/dependabot/149), high #156/#157     | 10.5.10 → 10.6.2                                                 | Prioritize coordinated family remediation; verify preview-server exposure, build and interaction behavior                   |
| Vite high [#144](https://github.com/DitmarF/funkspace-app/security/dependabot/144)/[#145](https://github.com/DitmarF/funkspace-app/security/dependabot/145), related medium/low findings | 7.3.6 → 7.3.7                                                    | Repair shared graph and standalone tooling; preserve September esbuild fix and gameplay                                     |
| Next medium [#132](https://github.com/DitmarF/funkspace-app/security/dependabot/132)–#135                                                                                                | 15.5.24 → 15.5.27                                                | Review affected route/cache behavior; keep Next/lint family compatible and recheck version-scoped PostCSS override          |
| source-map-js high [#137](https://github.com/DitmarF/funkspace-app/security/dependabot/137)                                                                                              | 1.2.1 → 1.2.2                                                    | Trace owning tool paths and use the minimum compatible graph correction                                                     |
| compression high [#136](https://github.com/DitmarF/funkspace-app/security/dependabot/136)                                                                                                | 1.8.1 → 1.8.2                                                    | Trace owning server/tool path and verify compatibility/exposure                                                             |
| Vitest/mocker medium #150/#155                                                                                                                                                           | 4.1.11 → 4.1.12                                                  | Keep root/game/coverage versions compatible; preserve assertions and thresholds                                             |
| brace-expansion #139/#131; ip-address #127                                                                                                                                               | 1.1.18/2.1.4 → 1.1.21/2.1.7; 10.7.0 → 10.7.1                     | Target the affected transitive versions without an unrelated graph refresh                                                  |
| sprintf-js [#138](https://github.com/DitmarF/funkspace-app/security/dependabot/138)                                                                                                      | Advisory withdrawn on 22 October; alert still open at inspection | Record the upstream withdrawal and reconcile status; do not invent a patch, force replacement or silently dismiss the alert |

Older alerts for image-size, esbuild, extract-zip, tmp, qs, uuid and webpack overlap the feature's existing remediation. Verify the final graph and main rescan instead of reapplying old fixes. The current feature has no fresh whole-CI proof; the inspected historical feature run belongs to September PR #278.

## 3. Protected scope and architecture

Preserve `Presentation → Application → Domain ← Infrastructure`, the composition roots and the existing public ports. This epic certifies and repairs the website; it does not introduce a new architecture.

| Area               | Preserve                                                                                                                                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio journeys | Homepage Start/About, native scrolling, dedicated `/contact`, current header/tree destinations and navigation focus handoff; no reintroduced homepage Contact section or `/#contact`                                                                      |
| Scene              | Accepted WEB / Work Sans Black; 286 particles, speed 0.2×, size 0.1×, 100 links, reach 6×, Full field Off, seed `0x46533431`; static WEB alternative, local Pause and temporary customization                                                             |
| Themes             | Existing ThemeService, selected/resolved distinction, System behavior, failed-storage live selection; Default, Dark, Muted and Dark High Contrast                                                                                                         |
| Motion             | Existing provider-owned policy and pure resolver; System/On/Reduced/Off, accepted explicit-On override, independent readiness/visibility/local Pause and complete static fallback                                                                         |
| Dialogs/lifecycle  | Existing focus, scroll and dismissal/navigation ownership; cleanup of frames, listeners, observers, timers and subscriptions; React owns no per-frame state                                                                                               |
| Contact UI         | Optional Name, required Email/Message; ordinary Button, pending read-only fields/internal duplicate guard, focused plain feedback; preserved drafts and honest uncertainty; no new spinner, pending-button treatment, consent checkbox or automatic retry |
| Contact contract   | Existing [typed contract](../../frontend/domain/contact/ContactContract.ts), strict request limits/validation, server-only adapter/configuration, idempotency and retry rules; no new endpoint or public outcome                                          |
| Mail identity      | `FunkSpace <contact@mail.funkspace.de>` → `info@funkspace.de`; fixed subject, validated Reply-To, plain text; no tracking, automatic replies or new data store                                                                                            |
| Game               | Independently runnable TypeScript/Canvas package, lazy package-root loader, semantic theme adapter, public lifecycle, accepted gameplay and Gate 2                                                                                                        |
| Generated assets   | Source-owned tokens/icons/theme bootstrap; verify freshness before regeneration and inspect generated diffs                                                                                                                                               |

No new game integration, `/play/wave-survivor` implementation, public upgrade/result UI, gameplay tuning, audio/persistence, engine work, CMS, analytics, content catalogue, saved scene presets, multilingual rollout or opportunistic framework migration. Security patches are in scope; a necessary major migration requires a separate concrete decision and cannot be disguised as cleanup.

## 4. Delivery order and time budget

Keep the six task IDs and their original owners. The dependency chain remains **FS-6.1 → FS-6.2 → FS-6.3 → FS-6.4 → FS-6.5 → FS-6.6**. Read-only target/configuration discovery may occur early to expose blockers. Early automation blockers enter the same findings register and receive bounded corrections before dependent acceptance resumes; this does not falsely complete later tasks.

These are proposed working checkpoints, not a claim that execution has started or an instruction to deploy automatically at a clock time.

| Window                   | Work and exit checkpoint                                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wednesday 28 October     | Confirm target/access and device availability; Sites focused UI evidence; FS-6.1 dependency inventory, safe candidate setup and integrated checks; identify all release blockers early |
| Thursday morning         | Finish necessary security/CI corrections and FS-6.2 human journeys; FS-6.3 closes blockers and checks affected behavior on the revised candidate                                       |
| Thursday by 14:00        | FS-6.4 candidate/merge review, final copy and configuration, recovery candidate and concrete authorization packet ready                                                                |
| Thursday 14:00–17:00     | FS-6.5 authorized merge/release and deployed smoke; leave time for diagnosis, a bounded correction or rollback                                                                         |
| Thursday 18:00           | Proposed final go/no-go review with Dimi: intended public URL, contact result, device evidence, residual risks and recovery readiness                                                  |
| Thursday by 20:00        | Presentation freeze: verify the URL on the actual presentation device/network; save the exact release identity and fallback instructions; no discretionary upgrades/polish             |
| Friday before 06:00      | Brief manual opening of the frozen presentation URL and essential navigation; no planned deploy or repeat live email                                                                   |
| After website acceptance | FS-6.6 records closure and game handoff. Game implementation starts only after Dimi approves FS-G3 and authorizes EPIC 7                                                               |

If the schedule slips, drop cosmetic improvements and unrelated version upgrades first. Do not waive known exploitable release blockers, essential accessibility, honest contact behavior or rollback readiness. Escalate a concrete blocker and named alternative while time remains. A static-scene build and, if explicitly accepted, email-only mode are recovery options; they are not permission to mark missing form acceptance complete.

## 5. FS-6.1 — Automated, security and architecture review

**Lead:** Codex. **Counterpart:** Sites supplies focused UI acceptance evidence first. **Dimi:** reviews the blocker summary. **Depends on:** accepted FS-4.8 and FS-5.6.

**Deliverable:** Proposed `docs/tasks/fs-6.1-release-candidate-review.md`, with the candidate identity, alert register, command/result matrix, architecture findings, evidence locations and limitations. Do not prefill PASS results.

### 5.1 Freeze a reproducible candidate

1. Record branch, full SHA, clean/intentional diff, current remote main/base, lockfile hash and any proposed dependency patch. Record exact Node/browser/platform versions; repository pins Node **22.22.0** and pnpm **10.30.3**.
2. Use fresh isolated candidate directories; exclude `.env*`, installed/build output and unrelated untracked files. Copy reviewed intended source changes explicitly and record their hash. Existing local servers and local credentials are not test fixtures.
3. For application checks set `CONTACT_ENABLED=false`, blank `RESEND_API_KEY`, `CONTACT_FROM` and `CONTACT_TO`, and only the exact local test origin required by that suite. Disable telemetry and reject inherited mail settings.
4. Inspect and install the existing documented transport-denying preloader pattern; the contact config expects `deny-contact-egress.cjs`. Record its content/hash, actual launch environment and unexpected-egress results. File existence alone is not proof that transport is blocked. Use provider fakes and intercepted browser responses; no routine test sends mail.
5. Install with the frozen lockfile, then provision Chromium with `pnpm setup:browsers` (or verify an explicitly supported existing executable and record its path/version). Keep installation/browser downloads/advisory access separate from application execution under egress denial. Never fix a frozen-install error by disabling the frozen check.
6. Use fresh non-reused servers and candidate-specific result directories. Preserve outputs before the current fixed temporary contact-result filenames can be overwritten. Do not build into a directory that another running check serves.

### 5.2 Dependency/security review before expensive certification

Capture the current [Dependabot alerts](https://github.com/DitmarF/funkspace-app/security/dependabot), open proposals, lockfile and both `pnpm audit --json` and `pnpm audit --prod --json` results for the exact candidate. Read current upstream advisories for applicable findings. If access fails, record that limitation rather than declaring the inventory empty.

For every alert record: alert/GHSA/CVE ID, severity, package and manifest, installed version/path on main and candidate, runtime/build/dev exposure, patched compatible range, fix or non-applicability evidence, owner, validation and disposition. Count GitHub alerts and audit findings separately.

- Carry forward the September scoped overrides and package extensions until an inspected upstream fix makes them unnecessary. Avoid reverting a repaired feature lockfile to an older bot/main graph.
- Treat critical/high findings as unresolved release blockers until a fix or reviewed non-applicability/containment decision exists. Severity alone does not prove production exploitability; a development label alone does not make CI/tooling exposure safe.
- Fix applicable production vulnerabilities before launch. Tooling findings need credible restricted exposure and an explicit owner/date if deferred; unknown reachability is not a resolution.
- Select the smallest compatible security changes. Keep related Next/React/Storybook/Vitest families and the root shared pnpm lockfile coherent. No broad `update --latest`, audit suppression, blanket ignores or weakened checks.
- Record outdated/duplicate PR disposition proposals. Close superseded PRs only after the integrated fix and corresponding alert state are verified, under later GitHub-action authorization.
- Once changes reach main, recheck GitHub's rescan. A pending rescan remains pending even if a local audit passes; do not claim alerts closed from local evidence.

### 5.3 Ordered validation matrix

All application commands below run from the isolated candidate root under the safe setup above. They are an execution plan, not commands run during this session. Where a script regenerates assets, compare source/generated hashes before and after.

| Order | Check                                                 | Command / evidence                                                                                                                                                                                                                                                                                   |
| ----- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Install, browser provisioning and generated freshness | `pnpm install --frozen-lockfile`; `pnpm setup:browsers`; `pnpm check:icons`; `pnpm check:theme-bootstrap`; `pnpm check:scene-apertures`; compare token sources/generated output in the disposable candidate                                                                                          |
| 2     | Strict types and static analysis                      | `pnpm -F frontend exec tsc --noEmit --incremental false`; `pnpm typecheck:validation`; `pnpm -F @funkspace/common typecheck`; `pnpm lint`                                                                                                                                                            |
| 3     | Broad unit/component/integration coverage             | `pnpm coverage`; do not duplicate it with `pnpm test` just to produce another PASS                                                                                                                                                                                                                   |
| 4     | Explicit theme/server coverage                        | `pnpm test:theme-bootstrap`; `pnpm exec vitest run --config vitest.contact.config.ts --coverage`                                                                                                                                                                                                     |
| 5     | Release and component bundles                         | `pnpm build`; `pnpm storybook:build`; inspect routes, warnings, generated changes and unexpected client/server bundle contents                                                                                                                                                                       |
| 6     | Production route/theme tests                          | `pnpm e2e:production`; `pnpm e2e:theme-bootstrap`; compile and test both animation availability variants, using matching `NEXT_PUBLIC_ANIMATIONS_ENABLED` and `FS35_AVAILABLE` expectations                                                                                                          |
| 7     | Isolated contact routes                               | `CONTACT_E2E_WORKSPACE=/absolute/isolated-candidate PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config playwright.contact.config.ts`                                                                                                                                                      |
| 8     | Controlled form and Storybook                         | `CONTACT_STORYBOOK_DIR=/absolute/static-build PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config playwright.contact-manual.config.ts`; focused existing Storybook interaction/a11y cases using a fresh server                                                                             |
| 9     | Performance                                           | `pnpm lhci:ci`, sequential OFF/ON rebuilds/measurements; no competing browser tests during samples                                                                                                                                                                                                   |
| 10    | Independent game regression                           | `pnpm -F @funkspace/wave-survivor typecheck`; `pnpm -F @funkspace/wave-survivor test`; `pnpm -F @funkspace/wave-survivor build`; `pnpm -F @funkspace/wave-survivor demo:build`; `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config playwright.demo.config.ts` with server reuse disabled |
| 11    | Independent review                                    | Architecture checklist, server-only/secret boundary, import direction, client chunks, lifecycle teardown, unused/debug code, intentional complete diff                                                                                                                                               |

**Coverage/configuration qualifications:**

- Root coverage excludes Domain/Application/Infrastructure from its denominator; explicit contact coverage is required. Preserve its existing 95% statement/line, 90% branch and 80% function thresholds.
- `pnpm e2e` runs development mode and can reuse a server outside CI. It does not replace production-route tests. Production/theme configs prohibit reuse but do not independently sanitize secrets or install the egress guard.
- Existing configured projects and `pnpm setup:browsers` are Chromium-only. Storybook build success does not prove interaction/a11y execution; emulated WebKit is not physical Safari/iPhone evidence.
- Root production build already builds the game transitively through `frontend/package.json`. Explicit package/demo checks establish independence. Root frontend ESLint does not lint game TypeScript; run a scoped game lint check when affected changes require it.
- The demo and general Storybook configs also permit server reuse outside CI. Use an inspected temporary wrapper or a bounded configuration correction that changes launch isolation only, preserving assertions and retries.
- Performance limits remain three local desktop samples per variant, configured p75 LCP ≤5,000 ms and CLS ≤0.1. Performance score below 0.90 is a warning. These are lab results, not field p75 or phone certification. Preserve scene budgets of 15 KiB initial-JS growth and 35 KiB optional runtime and disclose baseline/method for any comparison.
- Previous On score warnings and missing raw phone timings stay visible; do not manufacture numerical acceptance or retune the approved scene to hide a warning.

### 5.4 Small, enforceable CI improvements

Prepare a bounded change to `.github/workflows/ci.yml` and only the scripts/configuration needed for reproducibility. Add explicit contact coverage and the missing release checks, or use a small release job with retained artifacts if the existing 30-minute job cannot accommodate them. Keep performance runs serial; independent isolated jobs may run concurrently. Reuse current tools rather than add a new CI platform.

Preserve frozen installation, SHA-pinned actions, least-privilege permissions, existing assertions and safe mail-disabled execution. Record which checks are enforced in CI and which remain a required manual release report. Repository branch-protection changes require a named separate approval; merely editing workflow YAML does not make a check required.

**Completion:** Every required automation/review item has PASS, FAIL, warning, reused-evidence or blocked status tied to source/configuration. Findings have owners. The report may complete as a report with blockers, but the release cannot advance past those blockers. Automated a11y is not human accessibility acceptance.

## 6. FS-6.2 — Human acceptance matrix

**Lead:** Dimi. **Counterpart:** Sites supplies a short checklist; Codex supplies the reproducible candidate and limitations. **Depends on:** FS-6.1 report and a candidate safe for human testing.

**Deliverable:** Proposed `docs/tasks/fs-6.2-human-acceptance.md`. For each row record full source/deployment/URL, date, tester, real device, OS/browser versions, viewport/orientation/text settings, action, expected result, actual result, severity and evidence link. Use PASS / FAIL / BLOCKED / REUSED with a reason. All current-candidate rows start unverified.

Use the already selected Sony Xperia XQ-CC54/Android 14 if still available, plus the MacBook Pro with Safari, Chrome and Firefox. Confirm actual versions at test time. Record any replacement device; do not infer an iPhone from Safari on Mac or Playwright WebKit.

| ID  | Journey and expected result                                                                                                                                                                                  | Minimum evidence                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| H01 | Open `/`, `/about`, `/animations/aperture`, `/contact`, `/privacy`, `/impressum` directly; refresh, follow native links, Back/Forward; correct page, current navigation and sensible arrival focus           | Phone + desktop, fresh and repeat visit                                                        |
| H02 | Phone portrait, short viewport and landscape; scroll all content, open virtual keyboard and fill Contact; fixed controls/artwork never hide essential text, fields, feedback or submit/fallback links        | Real phone, orientation/keyboard details                                                       |
| H03 | Increase text/zoom to 200%; read and operate page/menus/form without clipped actions or unusable horizontal overflow                                                                                         | Phone text setting and desktop zoom                                                            |
| H04 | Keyboard-only Tab/Shift+Tab/Enter/Space, menu/customize open-close, Escape, navigation from overlays; visible focus, no trap, correct restoration/handoff and scroll unlock                                  | Desktop keyboard, Safari included                                                              |
| H05 | Default/Dark/Muted/Dark High Contrast and System; change OS preference, navigate/reload; selected and resolved state correct, controls readable; storage-denied live choice remains usable                   | All palettes; controlled storage denial clearly labelled                                       |
| H06 | System/On/Reduced/Off, OS reduction, Pause/Resume, hidden/visible page; accepted policy respected and no unintended replay/restart                                                                           | Actual page; no-JS/failed-startup static checks separately labelled                            |
| H07 | Open/close navigation and Customize repeatedly; navigate away/back; essential content stays visible, scene remains bounded, no stuck overlay/scroll or duplicated behavior                                   | Phone + desktop; approved scene settings                                                       |
| H08 | Contact labels/help/errors and result focus; keyboard and assistive reading of feedback; invalid email/empty/long input, pending read-only fields and duplicate click/Enter guard                            | Controlled enabled fixture; screen-reader evidence where available, limitations recorded       |
| H09 | Controlled accepted, validation, unavailable, 429 including non-JSON response, timeout/uncertainty; draft retained, retry/edit/23-hour expiry/reset behavior correct, failure guidance not erased by editing | Existing safe fixtures/fakes; no real mail for negative tests                                  |
| H10 | Delivery-off page and no-JS/static page retain truthful availability, readable email fallback and legal/navigation links                                                                                     | Actual route, not only Storybook                                                               |
| H11 | Final public form smoke: allowed origin, one authorized submission, accepted feedback, separate mailbox receipt and Reply-To confirmation                                                                    | FS-6.5 Production evidence; may remain explicitly pending during pre-release manual acceptance |
| H12 | Frozen presentation URL on actual presentation device/network; new session without developer login; ordinary reload and essential journeys work                                                              | Thursday final checkpoint                                                                      |

Controlled fixtures demonstrate the UI contract, not production mail. A real route demonstrates integration, not physical-device behavior unless Dimi actually uses that device. Historical EPIC 4/5 evidence can be reused where inputs are unchanged and scope is stated; changed security/configuration inputs need appropriate current regression checks.

**Completion:** All required pre-release rows have evidence or named blockers. H11/H12 explicitly remain deployed-environment checks until FS-6.5. A blocker is not a PASS and cannot disappear into a vague overall “works” statement.

## 7. FS-6.3 — Bounded correction and candidate freeze

**Lead:** Codex coordinates. **Counterpart:** Sites corrects UI/scene findings; Codex corrects infrastructure, shared policy, server, CI and dependencies. **Dimi:** prioritizes experience issues and accepts specific nonblocking deferrals. **Depends on:** FS-6.2 findings, with early FS-6.1 blockers fed into the same register.

**Deliverable:** Proposed `docs/tasks/fs-6.3-acceptance-findings.md`, one prioritized register and links to bounded corrections. No concurrent edits to shared files by different owners.

| Priority    | Examples                                                                                                                                                                                           | Release treatment                                                                                                   |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Blocker     | Uncontained applicable security issue, secret exposure, essential route failure, lost/hidden essential controls, keyboard trap, dishonest contact success, uncontrolled mail, unreproducible build | Fix and recheck, or stop release                                                                                    |
| Significant | Browser-specific broken required journey, incorrect metadata/domain identity, unsafe rollback, required CI/manual evidence missing                                                                 | Resolve before release unless Dimi explicitly changes the required outcome; missing evidence is not silently waived |
| Follow-up   | Minor visual discrepancy, optional polish, nonessential version update with no applicable security reason                                                                                          | Record owner/date and Dimi's deferral; protect the deadline                                                         |

For each finding record ID, candidate, reproduction, impact, owner, proposed minimum fix, affected paths, regression evidence, reviewer and final disposition. Fix behavior with proportionate tests. Keep unrelated formatting, refactors and upgrades out. Investigate the historical Server Action identifier warning only if it recurs on the actual candidate; do not guess its cause.

After corrections, issue a new candidate identity. Rerun affected tests and any shared-system checks justified by the change. Dependency/framework/runtime/build changes invalidate relevant earlier build, route, contact and performance evidence; do not reuse it blindly. Documentation-only changes need content/link/format/diff review. No repeated full suite is needed when no relevant input has changed.

**Completion:** No unresolved release blocker, no new exemption hiding failure, intentional reviewed diff, current candidate evidence and explicitly owned follow-ups.

## 8. FS-6.4 — Merge-ready candidate, deployment configuration and recovery

**Lead:** Codex. **Counterpart:** Sites checks final content/links and actual metadata. **Dimi:** chooses/approves the target, enters secrets securely, decides missing operational facts and authorizes named external changes. **Depends on:** FS-6.3.

**Deliverables:** Proposed `docs/tasks/fs-6.4-release-preparation.md` and `docs/development/portfolio-release.md`; existing contact operating guide remains authoritative for mail. Avoid a second competing contact runbook.

### 8.1 Feature-to-main integration preparation

1. Inspect current remote main and feature SHAs, merge base, both unique histories, existing PRs, required checks/rules/reviews and automatic Vercel deployment behavior. Local `main` is stale and must not silently become the base.
2. Prepare a reviewable combined candidate that preserves the unique main change, accepted portfolio runtime and feature dependency remediation. Resolve conflicts by inspected intent; no force push, history rewrite or blanket conflict-side selection.
3. Review the entire feature diff against main, including manifests, lockfile, CI, documentation and generated outputs. Tie release report/manual evidence to the resulting tree. Do not merge Dependabot branches concurrently into the moving base during this review.
4. Prepare the PR title/body with concrete behavior, security disposition, validation, candidate/target and rollback. Commit/push/PR creation are later authorized actions, not performed by this plan.
5. After authorized PR creation, require fresh checks/review for its current head and current base. If either changes, review the delta and rerun invalidated checks before merging. Do not rely on a green old bot PR.
6. Confirm whether merging main immediately publishes Production. If yes, **merge and deployment form one approved release action**; do not merge early while treating publication as a later harmless step. Any change to automatic promotion/settings needs its own named authorization.
7. On the resulting main revision, verify expected tree and required CI/deployment checks. If merge/squash produces a different SHA, preserve the tree comparison and record the actual revision; rerun affected checks for any content difference. Verify default-branch alert rescan and retained follow-ups.

### 8.2 Deployment inventory to complete before enabling

The planning default is the existing Vercel project and `https://funkspace.de/`. Confirm actual ownership/project/domain attachment and the canonical/noncanonical URL policy; this is not a fresh provider verification.

| Item                      | Required record/check                                                                                                                                                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source/build              | Full commit/tree/lockfile hashes, Node/pnpm versions, project/team, production branch, monorepo root, install/build/output settings and generated-token/game package prerequisites                                                |
| Repeatable commands       | Frozen workspace install and the inspected root build chain; match Vercel's actual project root rather than assuming root scripts run from `frontend/`                                                                            |
| Build-time animation flag | Record `NEXT_PUBLIC_ANIMATIONS_ENABLED` for each artifact; static fallback needs an actual corresponding build, not a runtime environment edit                                                                                    |
| URLs                      | Canonical HTTPS host, redirects/`www` decision, public/default/branch/immutable aliases and older deployments; record which serve the candidate and which must remain protected/off                                               |
| Access                    | Public presentation URL usable without SSO; previews retain agreed protection; inspect bypass scope without exposing bypass credentials                                                                                           |
| Contact configuration     | Separate Production/Preview scopes for `CONTACT_ENABLED`, `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`, `CONTACT_ALLOWED_ORIGINS`; secret entered through provider interface, never copied to docs/chat/client code             |
| Exact origins             | Canonical HTTPS origin list in expected JSON form; no wildcard preview trust or Host-derived allowlist; immutable URL is not automatically trusted                                                                                |
| Provider                  | Sending-only/domain-restricted credential as supported, verified sender/domain, quota and operational access; no new provider/terms/DPA approval assumed necessary                                                                |
| Abuse controls            | Verify actual POST `/api/contact` rule and attribution: accepted five/IP/600-second fixed window/429; cover intended aliases/path variants and protection/bypass interactions; retain regional/shared-IP/distributed-abuse limits |
| Mail/DNS                  | Verify current sender authentication and DMARC state; last record says DMARC unpublished. Prepare a separate scoped DNS change only if needed and authorized; do not infer publication from this plan                             |
| Operations/privacy        | Confirm relevant logging access/retention/drains/exports/tracing and account facts against actual privacy copy; preserve accepted inquiry cleanup policy and note manual mailbox-workflow adoption status                         |

Review unresolved operator/address/TLM facts with Dimi without claiming legal certification or reopening accepted FS-5.5 wording/provider decisions. A material fact that prevents the intended public release needs an explicit resolution; urgency is not evidence that it is resolved.

### 8.3 Final content and identity

Sites verifies the existing Start/About/scene/contact/legal content and links on the candidate. Replace the technical scaffold metadata description with Dimi-approved audience-facing copy; confirm final title/icon and accurate URL-dependent metadata. Add only the minimum canonical/metadata-base/social metadata needed for the selected target. Check broken links, old contact addresses, placeholder language and preview-only URLs. Do not start a new content/SEO project or replace accepted copy gratuitously.

### 8.4 Recovery prepared before rollout

Record a **specific known-good deployment/source/configuration**, access requirements, exact restore/promote/alias steps, expected recovery time and owner. Older main may restore availability but does not automatically satisfy the finished-portfolio outcome. Prefer a reviewed candidate with complete static artwork and delivery off as the safe degradation artifact.

- Rehearse static fallback and mail-off behavior in isolated builds; verify access to the rollback artifact. Document which provider-level recovery steps were actually exercised and which are only prepared. Do not claim a live rollback rehearsal without authorization/evidence.
- Mail failure: disable delivery in every relevant environment, build/deploy the off candidate as needed, and verify the page/API state. A new false deployment or moved alias does **not** disable old immutable enabled deployments. Inventory and retire/restrict each affected old target through the authorized procedure.
- Scene failure: preserve complete static content and accessible navigation; use the tested static build when needed. Avoid hiding content until animation succeeds.
- Preserve contact retry identity/payload compatibility across a release: unchanged retries below 23 hours and the provider's 24-hour idempotency window. Changing sender/recipient/template/account can conflict with an existing key. No automatic resend; already accepted mail cannot be recalled.
- After recovery, rerun essential routes, settings, focus/static fallback and contact-off checks; record public URL, source, time and remaining impairment. Escalate if the fallback cannot meet the presentation needs.

### 8.5 Concrete authorization packet

Present one concise packet when ready, with each action separately identifiable: candidate SHA/tree; current base/PR and merge method; target domain/project; automatic deploy consequence; initial delivery-off Production deployment; exact configuration/protection/DNS changes if any; bounded off-only no-mail protection probes if needed (target, source IP, request budget/window and recovery check); subsequent Production mail activation/deployment; proposed **one-message** live smoke; retirement of any named old enabled deployment; and rollback actions/targets. Include evidence and unresolved items.

The rollout authorization and live-mail authorization remain distinct, even if Dimi approves both in one reply. Do not request secret values in chat or repeat previously granted approvals for unchanged actions. If no new DNS/settings action is needed, omit it from the packet.

**Completion:** Reproducible reviewed candidate, completed target inventory, approved final copy, merge-ready evidence and recovery plan with honest rehearsal limits. No scaffold metadata, leaked secret or unexamined automatic publication consequence remains.

## 9. FS-6.5 — Authorized public rollout and presentation freeze

**Lead:** Codex. **Counterpart:** Sites performs deployed UI smoke. **Dimi:** approves the concrete action packet, handles unavailable account-console steps and verifies actual receipt/presentation experience. **Depends on:** FS-6.4 and the required authorizations.

**Deliverable:** Proposed `docs/tasks/fs-6.5-public-rollout.md` with GitHub/CI links, resulting main SHA, immutable deployment ID, public/alias URLs, nonsecret configuration fingerprint, smoke results, mail evidence, recovery result if used and Thursday checkpoint decision.

### Execution sequence

1. Recheck candidate/base, approvals, current checks, target/environment and rollback availability immediately before the release. Stop if the approved input changed materially.
2. Perform the approved Git delivery/merge/deployment sequence with **Production delivery off first**, accounting for automatic Vercel promotion and configuring that off state before a merge can publish it. Record actual resulting source and deployment identity; wait for Ready/required checks and verify the public alias points to it. This intermediate off deployment does not complete the working-form criterion.
3. Use a fresh unauthenticated browser/session on the public URL. Verify TLS/redirects and all six routes; refresh/deep links/Back; fonts/assets; no scaffold identity or console/server errors blocking the experience.
4. Sites checks layout, menus/dialogs, focus, themes, motion/Pause, scene fallback and mobile viewport/keyboard risks on that deployed artifact. Dimi performs the real-device and presentation-device checks. Do not substitute a local screenshot.
5. Verify the off state, exact Production source/origins and protection. Reuse earlier protection evidence only where the exact scope remains unchanged. If target enforcement is unverified, perform only the separately approved bounded invalid-body/no-mail WAF probes while delivery remains off, with the named request budget/window and reset-recovery observation from the operating procedure. No unbounded or mail-enabled abuse testing. Keep routine failure, duplicate-submit and quota checks in controlled fixtures.
6. Only after that checkpoint passes, perform the separately approved Production activation/configuration and any required new deployment. Record its new deployment identity and configuration; repeat affected route/contact/protection checks on that actual artifact. Then, if authorized, perform the bounded one-message smoke with minimal test data and the agreed sender/recipient. Record accepted UI/provider outcome separately from actual mailbox receipt and Reply-To. Do not record raw message content, secrets or unnecessary provider identifiers. If receipt is delayed/uncertain, follow the existing manual/idempotent recovery policy; do not repeatedly resend.
7. Recheck any deployment aliases that could still deliver mail, default-branch security status and runtime logs within the approved access scope. Treat pending rescans as pending. Record the observation window and any warnings; no unrequested persistent monitoring/automation is created.
8. At the Thursday evening checkpoint, Dimi confirms the frozen URL, essential journeys, form outcome, residual risks and recovery option. Save a short presentation run sheet: opening URL, expected content/navigation, contact-demo choice, fallback URL only if approved, and person/action to use if unavailable. Avoid sending a fresh email merely to rehearse the presentation.

### Stop or rollback conditions

Stop/restore the approved safe state for essential route outages, inaccessible controls/focus traps, exposed credentials/private content, inaccurate accepted-mail feedback, uncontrolled delivery, wrong target/origin/protection, or new severe regressions. A minor cosmetic issue or the already accepted performance-score warning alone does not justify a risky deadline refactor.

If live form operation fails but the website and email fallback work, present that exact reduced outcome to Dimi. It may support the presentation if explicitly accepted; otherwise it remains incomplete against this plan. If public launch is blocked and only a protected preview is available, record that distinction and do not close the public-delivery criterion.

**Completion:** The authorized public target is verified with evidence and accepted for the presentation, including the agreed contact mode. Online status is demonstrated from the deployed experience, not inferred from a successful build or merge.

## 10. FS-6.6 — Website closure and Wave Survivor EPIC 7 handoff

**Lead:** Codex. **Counterpart:** Sites documents reusable shell/navigation/scene/overlay interfaces. **Dimi:** accepts FS-G3 and separately authorizes return to game implementation. **Depends on:** accepted FS-6.5 website outcome.

**Deliverable:** Proposed `docs/tasks/fs-6.6-portfolio-closure-game-handoff.md`; update the authoritative portfolio plan with actual final status/evidence and the game plan with the new continuation entry point. Record the user-requested release date/outcome amendment without rewriting historical acceptance.

### Handoff contents

| Required item          | Exact boundary/evidence to preserve                                                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Known base             | Final main commit, release tree/lockfile, public/immutable deployment, actual configuration mode, CI/release report and FS-G3 decision                                                          |
| Remaining website work | Owned follow-ups, security rescan/deferred tooling items, production operating limitations and recovery runbook; no hidden blocker or ongoing polish prerequisite                               |
| Lazy loader            | `frontend/features/games/GameLoader.ts`: explicit import of `@funkspace/wave-survivor`; no private engine imports or eager homepage game load                                                   |
| Theme adapter          | `frontend/features/games/theme/FunkSpaceGameThemeAdapter.ts`: immutable resolved semantic game theme; game never reads portfolio CSS variables or ThemeService                                  |
| Host/lifecycle         | `frontend/features/games/GameHost.tsx`: current mount/theme/visibility/destroy behavior and existing tests; future shell must preserve terminal idempotent destruction and subscription cleanup |
| Package public API     | `games/wave-survivor/src/index.ts`: createGame/controller/theme/mount/status/event/result types; Domain remains pure and Canvas/browser effects stay in adapters                                |
| Portfolio shell        | Existing navigation handoff, Dialog, provider/theme/motion and scene ports; document safe reuse without forcing homepage particles or global portfolio controls into the future play layout     |
| Standalone proof       | Current package types/tests/build, demo build and demo browser/run evidence; reuse unchanged FS-6.1 results with exact source/toolchain equivalence, rerun if inputs changed                    |

### Already present versus EPIC 7 work

- `onEvent` already exists in the package and frontend loader. WS-7.1/WS-7.2 begin with an audit of existing public types and the remaining `reducedEffects` requirement; do not add a parallel event contract.
- Current `GameHost` auto-starts after load, resumes on visibility return and ignores upgrade/result events. These are baseline facts, not completed deliberate-start/manual-pause/result-overlay acceptance.
- `/play/wave-survivor` remains absent and future work. Start instructions, semantic HUD, pause/upgrade/result overlays, loading/retry/exit, focus/announcements, safe-area/orientation handling, deliberate resume and route cleanup remain WS-7.3–WS-7.14 in the [game plan](wave-survivor-implementation-plan.md#epic-7--portfolio-play-shell-and-accessible-application-ui).
- Keep React at discrete status/event boundaries; retain independent standalone execution and accepted gameplay. No engine framework or speculative shared runtime is required.
- Correct the bounded stale wording in `games/README.md` that calls the package scaffolding and says the root build excludes it; actual frontend build already invokes the package build. Do not treat old pending prose as cancellation of accepted game Gate 2.

**Completion:** Dimi's FS-G3 acceptance and game-continuation decision are recorded; a fresh agent can start from the linked current base, passing evidence, available APIs and explicit pending work. EPIC 7 implementation is not silently marked complete or started by this handoff.

## 11. Expected file changes during implementation

Only this plan is created in the current session. The following is an implementation map, not authorization to edit every path or a claim that proposed records already exist.

| Paths                                                                                                                                          | Existing/proposed | Purpose/owner                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`, existing Playwright/Vitest configs, root `package.json`                                                            | Existing          | Codex: missing enforceable release checks and safe reproducibility, only as needed                               |
| `package.json`, `frontend/package.json`, `games/wave-survivor/package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.github/dependabot.yml` | Existing          | Codex: reviewed security fixes/compatible shared graph; Dependabot config changes only for a demonstrated defect |
| `frontend/app/layout.tsx`, `frontend/data/startContent.ts`, relevant existing pages/components                                                 | Existing          | Sites: final metadata/content or identified UI corrections; Codex reviews server/config implications             |
| `frontend/domain/`, `frontend/application/`, `frontend/infrastructure/`, `e2e/`, colocated tests                                               | Existing          | Original owner: only bounded acceptance fixes and meaningful regression evidence                                 |
| `docs/development/contact-operations.md`, `contact-processing-facts.md`                                                                        | Existing          | Update verified production operating facts; preserve contact contract and approved processing decisions          |
| `docs/tasks/fs-6.1-release-candidate-review.md` through the six named records above                                                            | Proposed          | Create as each task executes; avoid empty task records or fabricated results                                     |
| `docs/development/portfolio-release.md`                                                                                                        | Proposed          | Small durable install/deploy/recovery runbook linking existing contact operations                                |
| `docs/features/funkspace-minimum-usable.md`, `wave-survivor-implementation-plan.md`, `games/README.md`                                         | Existing          | Accurate final milestone/game handoff status and bounded stale-document corrections                              |

No planned change to gameplay, public contact schemas, theme/motion authorities, generated files by hand, repository settings or production secrets belongs in a routine cleanup diff.

## 12. Decisions and execution handoff

| Decision/input                                                                                     | Owner and latest point needed                                                       | Planning default                                                               |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Public canonical URL, Vercel project and alias/redirect policy                                     | Dimi + Codex discovery, early FS-6.1 / final FS-6.4                                 | Retain existing Vercel and `https://funkspace.de/`, verify rather than migrate |
| Actual device/browser versions and presentation machine/network                                    | Dimi, FS-6.2 and Thursday freeze                                                    | Existing Xperia/Mac selection; record actual available devices                 |
| Audience-facing metadata and any materially missing public-operating facts                         | Dimi with Sites/Codex evidence, FS-6.4                                              | Preserve accepted content and correct only actual gaps                         |
| Dependency deferrals                                                                               | Dimi after Codex supplies applicability/exposure/fix evidence, before FS-6.3 closes | Resolve release blockers; defer unrelated upgrades with owner/date             |
| Commit/push/PR, merge and automatic rollout                                                        | Dimi, concrete FS-6.4 packet                                                        | Reviewed feature-to-main path; no concurrent bot merges                        |
| Production secret entry/activation, settings/DNS changes, live email and old-deployment retirement | Dimi, each named action in packet                                                   | Exact required scope only; one proposed live message; no secret in chat        |
| Reduced presentation mode if blocked                                                               | Dimi, while recovery time remains                                                   | Full public site plus working form remains the objective                       |
| FS-G3 and return to game                                                                           | Dimi, FS-6.6 after online acceptance                                                | Freeze portfolio scope and then resume game EPIC 7                             |

**Recommended first implementation step:** Confirm the current repository/remote state, target access and Sites' focused evidence, then begin FS-6.1 with the security inventory and safe isolated candidate. Make no deployment or live-mail assumption from this planning document.

Every task completion report must distinguish files changed, main decisions, validation performed and remaining risks/follow-up. Include exact source and environment in evidence; link durable summaries rather than relying solely on temporary files or private chat history.

## 13. Planning-session validation and limitations

This document was grounded in the attached/repository handoff, current branch/history/manifests/scripts, authoritative feature plan, architecture/workflow/templates, accepted scene/contact records, contact configuration and metadata, game public boundary and current read-only GitHub evidence. Independent read-only reviews covered quality/game, contact/rollout and DevOps planning.

Original planning-session validation completed: Prettier check PASS; all five then-present local Markdown reference targets/anchors PASS; FS-6.1–FS-6.6 heading order and date/day checks PASS; new-file whitespace and final status review PASS. That session created only this document. Independent review findings about browser provisioning and off-first Production protection verification were incorporated. The later prompt-writing session added the execution-companion link and updated the request history; implementation remains pending.

Application tests/builds are unnecessary for this planning-only change and were not run. All FS-6 implementation results, provider state, actual device results, final metadata wording, exact release approvals and deployed evidence remain to be produced. No commit, push, PR, merge, deployment, configuration/DNS change or live email occurred.
