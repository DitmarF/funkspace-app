# Feature plan: FunkSpace — Minimum Usable Experience

## Plan metadata

- **Status:** Authoritative feature plan — both supplied sources reconciled; FS-0.4 documentation complete. FS-G0 APPROVED by Dimi on 2026-09-12 for the reviewed candidate/patch; [actual decision](../tasks/fs-0.4-authoritative-feature-plan.md#dimi-fs-g0-decision--2026-09-12). FS-1.1 contract complete: Codex technical review recorded and Dimi accepted the recommended matrix on 2026-09-15; [actual decision and limits](../tasks/fs-1.1-asset-and-component-contract.md#dimi-contract-decision--2026-09-15). FS-1.2 is complete: Sites consumer review passed and Dimi accepted all corrections on 2026-09-15; [acceptance](../tasks/fs-1.2-token-and-contrast-foundations.md#dimi-acceptance--2026-09-15).
- **Owner/current writer:** Codex; product owner/final acceptance: Dimi. Sites supplies read-only counterpart review and later owns its assigned implementation tasks.
- **Related epic/task:** Portfolio EPICs 0–6; publication task [FS-0.4](../tasks/fs-0.4-authoritative-feature-plan.md).
- **Decision entry point:** [Authoritative decision register](#pending-decisions-and-latest-needed-points); [FS-0.5 technical rationale and answer provenance](../tasks/fs-0.5-product-and-technical-decisions.md). Dimi leads/approves FS-0.5; Codex is its designated documentation writer.
- **Target release:** Minimum Usable Experience, before separate Wave Survivor EPIC 7; no portfolio release date assigned.
- **Last updated:** 2026-09-15.
- **Related ADRs:** [001](../decisions/ADR-001-monorepo-strategy.md), [002](../decisions/ADR-002-design-token-source-of-truth.md), [003](../decisions/ADR-003-interactive-experience-boundary.md), [004](../decisions/ADR-004-game-development-architecture.md).

### Authority and source provenance

This feature plan owns milestone scope and current milestone status. The [consolidated baseline](../tasks/fs-0.1-inventory-real-starting-point.md) owns inspection evidence and links its dated [tooling/command follow-up](../tasks/fs-0.2-tooling-baseline.md). Substantial [task records](../templates/task.md) own execution, reviews and handoffs; the [branch decision](../tasks/fs-0.3-branch-integration-decision.md) owns integration/approval provenance. Link those records rather than copying their logs or treating their dated pre-execution statuses as current milestone state. The [AI workflow](../development/ai-workflow.md) and [feature template](../templates/feature-plan.md) remain unchanged; the task breakdown below extends the template for this multi-epic milestone.

- **Complete source read:** [Archived supplied minimum-usable plan](../global/FunkSpace_Minimum_Usable_Development_Plan.md), prepared 2026-09-11, local `/Users/dimi/Downloads/FunkSpace_Minimum_Usable_Development_Plan.md`; SHA-256 `6475a13f4538c5d3a3dbfb88be3be971e0291ddca4db27a131185934bf4c8ae1`. Its scope, 44 task IDs, leads, counterpart/Dimi responsibilities, dependencies, work and completion criteria are retained below. The repository source copy has a provenance notice and normalized Markdown formatting; the original Downloads bytes remain unchanged. The archive is reference material, not a competing status authority.
- **Detailed source read and reconciled:** [FunkSpace_EPIC_0_Detailed_Plan.md](../global/FunkSpace_EPIC_0_Detailed_Plan.md), prepared 2026-09-11 and supplied 2026-09-12; original-byte SHA-256 `57bde4a6ba34308e6e59193159d5298372ff9115f0175570ceb040f8efa4ca1f`. The [complete reconciliation](../tasks/fs-0.4-authoritative-feature-plan.md#detailed-source-reconciliation-and-current-readiness--2026-09-12) maps all sections to actual evidence; no scope/owner/dependency conflict found. Both source archives are references, not parallel status authorities.
- **Historical inspection reference:** `b8128d5220a09a6f79117ace388d7ae1b54b7d68` is the supplied source plan's reference, not the current tip or an instruction to reset.
- **Verified local input:** clean `/Users/dimi/Projects/funkspace-app`, branch `feature/funkspace-minimum-usable`, HEAD and cached upstream `8a054ae755315b334f18ac4b53ac4cce541e3519`; local main/validated portfolio base `9f3f01d8e2745408a8523c07198aec0e73eed52b`. This task does not recheck live provider state. FS-0.3 records the actual squash integration, production deployment and exact-revision validation; the following documentation commit records its handoff.
- **Design evidence limit:** the source refers to six screenshots and an approved brief. Those original screenshots, editable vectors and the video were not supplied to this local FS-0.4 inspection. Preserve the written scope; do not infer production SVGs or claim visual approval from it.
- **Approval limit:** Dimi explicitly approved option A, the portfolio branch name and FS-G0, then the particular Vercel corrections/production game-baseline merge. Those approvals do not complete FS-0.4/0.5, approve new services or contact delivery, or authorize later portfolio publication. Documentation drafting alone proves no implementation or human acceptance.
- **Current gate decision (2026-09-12):** after preservation/source reconciliation and independent review, Dimi explicitly approved FS-G0 and the six-file patch based on `156c28c8486352328a184d587a6540eee42b8bc1`, SHA-256 `677b435d304376692d2e32c47aac19072e06e86c7dc9d8ebab68816b94f874d8`. The [decision record](../tasks/fs-0.4-authoritative-feature-plan.md#dimi-fs-g0-decision--2026-09-12) preserves the actual answer and separate commit/push authorization. Earlier approval/review stages remain historical evidence.

## Goal

Deliver an animation-led, mobile-first website with Start, About, and Contact/footer sections, normal scrolling, the existing FunkSpace logo and semantic design foundations, one customizable Canvas scene behind a replaceable SVG aperture, usable navigation/settings, real contact delivery, and completed secondary pages. End when the portfolio is ready to host game integration. Do not implement game integration in this milestone.

Approved routes: `/`, `/about`, `/impressum`, `/privacy`. Dimi selected English first; German and other languages are possible later, without adding multilingual implementation to this milestone. Preserve `/play/wave-survivor` as the following game milestone's route, not a link to an unfinished page.

In scope: the essential Standard/Hexagonal button matrix; your available icons and named temporary substitutes; shared form/dialog primitives; theme and motion controls; a deliberate static scene alternative; testing, documentation, and a deployable candidate.

Deferred: slide navigation, forced scroll snapping, up/down section controls, animation carousel/counter/dots, multiple particle scenes, animated/morphing masks, general visual editor, arbitrary SVG uploads, saved scene presets, CMS, account system, analytics, monetization, leaderboard, sitemap UI, large content catalogue, and unrelated architecture migration. An ordinary technical sitemap may be handled with metadata if justified; it is not a new content-navigation feature.

Dimi selected a separately authorized public release as the completed portfolio target. A verified preview can still satisfy integration readiness; it is not permission to deploy publicly or evidence that a public launch occurred. Real provider-backed contact delivery remains part of the minimum usable experience, even when tested in an approved preview.

## User value

### Primary user

Visitors learning about FunkSpace and contacting its operator, including phone, keyboard and reduced-motion users. Dimi and future maintainers need a recoverable path to game integration.

### User story

As a visitor, I can read Start/About/Contact, follow real links, control decorative motion and send a message with honest feedback, so I can understand FunkSpace and make contact without fighting the presentation.

### Success evidence

Reachable real content, usable static fallbacks, approved scene/controls, verified provider acceptance and recipient receipt, proportionate automated checks and Dimi's recorded acceptance at FS-G1–FS-G3.

## Current problem

The current home route is a heading plus theme switcher, with demonstrations and reusable foundations elsewhere. Working standalone gameplay is retained, but the proposed three-section portfolio, shared decorative preference, integrated Canvas scene and real contact journey are not delivered. See the baseline's [reuse map](../tasks/fs-0.1-inventory-real-starting-point.md#reuse-map) for paths/contracts and limitations; a story or particle placeholder is not integrated behavior.

The earlier layout plan mandates snapping and fullscreen panels, conflicting with this milestone's ordinary scrolling. Without one scope entry point, a fresh agent could implement those historical proposals or repeat already completed tooling work. The narrow documentation reconciliation is recorded in FS-0.4; unrelated architecture migration remains deferred.

## Proposed solution

### User flow or behavior

1. Load the static Start section with existing logo geometry and reserved scene space.
2. Scroll naturally through About and Contact; follow ordinary route/anchor links.
3. Open shared navigation/settings, choose appearance and decorative-motion settings, and dismiss or navigate with correct focus behavior.
4. Enhance the reserved space with one bounded Canvas scene and trusted replaceable SVG aperture; customize or pause it without changing gameplay time.
5. Use email fallback, then the validated provider-backed form when its separate contract and server work are complete.

### Key implementation decisions

Reuse ThemeService, Standard Button, Logo/LogoMotion, AnimationOrchestrator, existing CSS motion helpers and suitable pure common motion. Legacy logo manifest exports throw; `pathCount` does not currently constrain the manifest. Logo static reset and failed-storage theme consistency remain assigned consumer corrections. No duplicate manifest builder, theme authority, overlay system or general engine is authorized.

The shared decorative preference is **planned FS-3.4 work**, consumed by logo in FS-3.5 and scene in FS-4.5. The current reduced-motion hook/animation service does not establish that policy. Renderer and service decisions still need their assigned reviews. FS-0.4 creates no API, UI, token or configuration implementation.

### Delivery sequence

Use the epic order and gates below. Each task also inherits its epic prerequisites. Do not skip unresolved content, asset, architecture or acceptance inputs merely because FS-G0 is recorded as approved.

### Rollout and rollback

- **Feature flag:** retain `NEXT_PUBLIC_ANIMATIONS_ENABLED`, default off for consumers that use its default; explicit logo overrides exist. FS-3.4 defines the future policy interaction. Flag-off, Reduced and Off require a complete static alternative.
- **Rollout:** existing Vercel hosting and the production game-baseline merge are evidenced in FS-0.3. The future completed portfolio candidate/target is a separate FS-6.4/6.5 decision, with separately authorized deployment and live email tests.
- **Rollback:** prepare the exact known-good revision and deployment recovery in FS-6.4; retain static scene and honest email fallback. Do not invent a tested rollback from this plan or invoke one under documentation authorization.

## Architecture impact

Preserve `Presentation → Application → Domain ← Infrastructure`. Pure rules/configuration validation belong in Domain; orchestration and preference policy in Application; Canvas, clocks, DOM, storage, and mail-provider effects in Infrastructure; page rendering/controls in Presentation. Construct cross-layer dependencies at the appropriate composition root. Static content does not need invented services or domain models.

Reuse ThemeService, existing Button/logo foundations, common pure motion where useful, and the public game boundary. One shared dialog has two planned consumers (navigation and customization, FS-1.6); one motion preference has two planned consumers (logo and scene, FS-3.4). The [baseline reuse map](../tasks/fs-0.1-inventory-real-starting-point.md#reuse-map) records the dialog as missing and the policy as planned, not working integrated systems. Those are concrete planned reuse cases, not permission to build generic managers.

The particle scene owns a bounded runtime; it does not import Wave Survivor or place per-frame positions in React state. The new motion preference controls decorative presentation, not gameplay time. SVG aperture geometry remains independent of particle rules. Only trusted repository SVG assets are supported.

Use source tokens, regenerate CSS and TypeScript artifacts, and inspect effects across existing themes and the game. No unrelated palette/engine/framework migration is required. Existing debt touched by the requested integration can receive a narrow tested correction; unrelated debt stays recorded.

| Layer or concern          | Planned change                                                           | Boundary or contract                                                    | Why it belongs here              |
| ------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------- |
| Domain                    | Bounded particle/configuration rules and contact validation              | Pure typed input/output; no DOM or mail client                          | Deterministic rules              |
| Application               | One decorative preference/suspension policy; contact use case            | Domain ports; separate preference/local Pause/environment reasons       | Coordination of actual consumers |
| Infrastructure            | Scene Canvas/clock/visibility/storage adapters; server-only mail adapter | Reviewed lifecycle/network ports                                        | Browser and external effects     |
| Presentation              | Static sections/routes, controls, dialogs, logo/scene and contact UI     | Existing provider boundary; discrete state, no frame positions in React | Rendering/input/focus            |
| Tokens/design system      | Required semantic pairing/font/spacing reconciliation in FS-1.2          | Source JSON → generated CSS/TypeScript                                  | Shared visual foundation         |
| Data, privacy or security | Bounded contact payload, abuse protection, minimal diagnostics           | No secret/client exposure; no body logging; approved provider           | Honest, limited data flow        |

### Dependency direction check

These are design constraints to verify in each implementation, not checked-off implementation results: Domain stays pure; Application depends on Domain abstractions; Presentation introduces no direct Infrastructure imports; composition stays in the composition root; experiences remain isolated under ADR-003; any new boundary/exception is reviewed before implementation. The game engine stays private and independently runnable. No new ADR is created speculatively by this plan.

## Files affected

| Path                                                                                                                                                     | Inspected status                                                              | Later change/consumer                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `frontend/app/`                                                                                                                                          | Existing root, privacy and sandbox routes; target portfolio route set partial | FS-2; `/about`, `/impressum`, `/api/contact` are proposed routes until implemented |
| `frontend/components/Controls/Button.tsx`, `frontend/components/Logo/`                                                                                   | Existing partial reusable foundations                                         | FS-1.3, FS-2.2, FS-3.5                                                             |
| `frontend/application/theme/ThemeService.ts`, `frontend/application/providers/ServiceProvider.tsx`, `frontend/infrastructure/services/createServices.ts` | Existing theme/composition boundary                                           | FS-3.3/3.4; no assumed motion-service path                                         |
| `frontend/app/sandbox/particles/page.tsx`                                                                                                                | Placeholder, not a working Canvas runtime                                     | FS-4 uses inspected layer conventions; exact new files proposed in its own task    |
| `tokens/`, `styles/tokens.css`, `common/generated/`                                                                                                      | Existing source/generated separation                                          | FS-1.2; generate outputs, never hand-edit                                          |
| `frontend/.storybook/`, `e2e/`                                                                                                                           | Existing config/tests with documented coverage limits                         | Assigned component and integrated checks                                           |
| `frontend/features/games/`, `games/wave-survivor/`                                                                                                       | Existing host/public API and accepted standalone game                         | Preserve during portfolio; later game EPIC 7 owns integration                      |

### Files or areas intentionally unchanged

All application/game code, configuration, packages, lockfile, generated outputs and original assets remain unchanged in FS-0.4. Preserve the separate project-mirror clone and its three untracked combat files; undisclosed work/assets remain unconfirmed, not disposable. The backend stub is not a new service authorization.

## Dependencies

### Internal dependencies

Use the baseline reuse map and assigned task graph. FS-0.2 establishes Node 22.22.0, pnpm 10.30.3, frozen installation and root build order. Tailwind features scanning, canonical Storybook preview and build-time Lighthouse flag setup were corrected there; they are not outstanding implementation tasks. Global Storybook font/theme acceptance remains FS-1.7. Security proposals and source contrast/typography work remain open at their recorded owners.

### External dependencies

No new package/service is selected here. Existing Vercel hosting is recorded in FS-0.3; mail provider/transport, abuse-protection deployment model, cost and data-processing choices remain FS-5.1/5.3 decisions. Choose the smallest approved server path in the existing Next.js deployment; no parallel backend, editor or game framework is introduced.

### Environment and coordination

Do not record secret values. Future environment variable names, sender/recipient setup, legal facts and operational fallback belong to the contact/rollout tasks. The responsibility and pending-input tables below govern ownership; missing service access blocks its dependent work, not unrelated static inspection.

### Responsibilities

**FS-3.3 coordination:** Sites retains the source task lead. The baseline assigns the bounded FS01-S03 ThemeService persistence correction to Codex; arrange an explicit current-writer handoff for that correction, then return ownership for Sites' integration. See [owner consistency](../tasks/fs-0.4-authoritative-feature-plan.md#assumptions-and-open-decisions). This does not authorize simultaneous edits or change the preserved task contract.

| Participant   | Primary responsibility                                                                                                                                                                                                                 | Not their default responsibility                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dimi          | Product/design decisions; original SVG assets; accurate copy and operator information; provider/account choices; secret entry; real-device acceptance; approval of external changes and gates                                          | Repeating every test command, repairing routine TypeScript errors, or coordinating two concurrent writers to the same file                             |
| ChatGPT Sites | User-facing implementation: design-system controls, Storybook, pages, responsive UI, navigation/settings presentation, the particle scene, mask, customization, and contact UI; tests/docs for that work                               | Unrequested dependency migrations, unilateral repository cleanup, changes to mail-provider/DNS settings, or redefining shared contracts without review |
| ChatGPT Codex | Repository/toolchain maintenance; durable plan integration; shared motion-policy implementation; contact server/security/adapter work; independent technical review; CI/build/performance verification; authorized integration/rollout | Product approval, inventing Dimi's legal/biographical details, redesigning accepted visuals, or taking over Sites' files mid-task                      |

These are project assignments, not claims that either product is technically limited to frontend or backend work. The designated executor must confirm that its environment can perform the assigned operation; unavailable access is a blocker or an explicit handoff, never an invented successful result.

**One task, one lead, one current writer.** The lead inspects, implements, adds tests, self-reviews, updates evidence, and prepares the handoff. The counterpart reviews or supplies the stated contract; it does not silently rewrite the same files. If a different agent takes over, record the new owner before editing.

**Every handoff** identifies task ID, base revision, accessible diff/branch/artifact, actual changed files, contract changes, checks actually run and outcomes, blockers, and Dimi's requested acceptance action. No assumed automatic synchronization between agent sessions. Use the existing repository workflow and task template rather than hidden conversation state.

**Review ownership:** Codex reviews Sites-authored work at the relevant gates. For Codex-authored motion/contact logic, Sites checks the consuming contract, and a separate read-only review pass (Sites or a fresh Codex review session) checks the critical policy/security diff before acceptance. The author then resolves findings. Self-review alone is not recorded as independent review, and AI review is not external security certification.

**Authorization:** code/document review is separate from commit, push, pull-request creation, merge, branch deletion, deployment, external account/DNS changes, or live email sending. Obtain the required explicit authorization before those actions. Do not weaken tests or change repository settings to obtain a green result.

### Pending decisions and latest-needed points

This is the single authoritative FS-0.5 decision/input register, expanded from the existing table. The [task record](../tasks/fs-0.5-product-and-technical-decisions.md) owns evidence and technical tradeoffs, not a second status register. Originally prepared at `65eefa1db2656e78b169882414dfedb4715aa408`; now reconciled against `156c28c8486352328a184d587a6540eee42b8bc1` plus the six-file source/readiness documentation diff. Approved means an actual Dimi answer or a linked recorded approval; provisional means a reversible proposal, not implementation authorization. Pending rows name the owner and the latest task that needs the answer. The original task contracts below remain unchanged.

| Decision/input                                            | Status                                                   | Actual answer/default                                                                                                                            | Owner                                                                                     | Evidence/rationale                                                                                                                                         | Latest-needed task                                                                      | Impact                                                                                         | Safe work while pending                                           |
| --------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Integration, branch and FS-G0                             | Approved; integration executed/validated                 | Option A; `feature/funkspace-minimum-usable`; validated base `9f3f01d8e2745408a8523c07198aec0e73eed52b`                                          | Dimi approval; Codex evidence                                                             | [FS-0.3](../tasks/fs-0.3-branch-integration-decision.md); no new gate vote inferred                                                                        | FS-0.3 / FS-G0, recorded                                                                | Portfolio inherits accepted game baseline                                                      | Current task remains documentation-only                           |
| Initial language                                          | Approved                                                 | English first; German/others possible later                                                                                                      | Dimi                                                                                      | Actual FS-0.5 answer 1 in [provenance](../tasks/fs-0.5-product-and-technical-decisions.md#recorded-product-answers)                                        | FS-0.5; FS-2 content                                                                    | English content; no new localization scope                                                     | English content planning                                          |
| Structure, routes and navigation scope                    | Approved scope; routes expressly confirmed               | Start, About, Contact/footer; `/`, `/about`, `/impressum`, `/privacy`; ordinary scrolling; no unfinished game destination                        | Dimi; Sites consumes                                                                      | Existing requested milestone scope and answer 2; scope is not implementation evidence                                                                      | FS-0.5; FS-2.1                                                                          | Stable page/navigation contract                                                                | Route/content planning within existing gates                      |
| Completed portfolio target                                | Approved scope; deployment pending                       | Separately authorized public release; verified preview may establish readiness                                                                   | Dimi                                                                                      | Answer 3; previous game-baseline deployment approval is separate                                                                                           | FS-0.5; exact candidate/action FS-6.4/6.5                                               | Preview still requires real contact delivery; no public rollout permission here                | Local work and preview planning                                   |
| Representative devices                                    | Approved selection; testing pending                      | Sony Xperia XQ-CC54, Android 14; MacBook Pro with Safari, Chrome, Firefox                                                                        | Dimi supplies access; Codex/Sites record tests                                            | Answer 4; no physical-device results supplied                                                                                                              | FS-4.7 and FS-6.2                                                                       | Named real-device/browser coverage                                                             | Honest emulated/local checks                                      |
| Mobile browser and exact test versions                    | Pending                                                  | Mobile browser, macOS and browser versions not supplied; record versions at testing time                                                         | Dimi selects phone browser; testing owner records versions                                | Device answer did not name phone browser or versions                                                                                                       | Before FS-4.7 evidence; refresh FS-6.2                                                  | Prevents unsupported claims of device coverage                                                 | Desktop/automated checks with actual versions                     |
| Original icon SVGs, editable sources and substitutes      | Pending                                                  | Existing original logo verified; custom icon set/editable files unconfirmed; approve named substitutes only for missing icons                    | Dimi supplies/approves; Sites inventories                                                 | Baseline reuse map; screenshots do not establish SVG assets                                                                                                | FS-1.1 inventory; FS-1.3/1.4 finalization                                               | Blocks affected visual finalization, not unrelated foundations                                 | Existing logo and component API review                            |
| Minimal Standard/Hexagonal control matrix                 | Provisional; final choices pending                       | Minimum milestone states; 48-pixel target is a proposal until FS-1.1 agreement                                                                   | Sites proposes; Dimi approves; Codex reviews contracts                                    | Existing Button reuse; [technical rationale](../tasks/fs-0.5-product-and-technical-decisions.md#trusted-svg-and-control-inputs)                            | FS-1.1; FS-1.3/1.4 finalization                                                         | Avoids speculative variants and duplicate controls                                             | Review actual Button API/stories                                  |
| About copy and public contact address                     | Pending                                                  | No approved final copy/address supplied; public address need not equal delivery recipient                                                        | Dimi                                                                                      | Sites checklist; no biography/address inferred                                                                                                             | FS-2.3/2.4 completion                                                                   | Required for truthful public content and email fallback                                        | Clearly temporary development copy/layout                         |
| Operator and legal/privacy facts                          | Pending                                                  | Actual operator details and real processing facts required; no invented legal content                                                            | Dimi facts/acceptance; Codex technical flow; Sites pages                                  | Sites checklist; FS-5.5 contract                                                                                                                           | FS-2.4 content requirements; FS-5.5 finalization and public release                     | Blocks claims of complete legal pages/release                                                  | Page structure and inventory of actual data flow                  |
| Hosting continuity and preview access                     | Provisional recommendation; target configuration pending | Retain existing Vercel/Next deployment; verify preview access/protection and environment before use                                              | Dimi host/config decisions; Codex verifies                                                | [Hosting rationale](../tasks/fs-0.5-product-and-technical-decisions.md#hosting-and-preview); dated FS-0.3 evidence                                         | FS-5.1 runtime choice; before live adapter checks; FS-6.4/6.5 rollout                   | No migration or paid entitlement assumed                                                       | Existing local build workflow and mocked tests                    |
| Semantic themes and motion foundations                    | Approved existing boundary; consumer details pending     | ThemeService remains sole theme authority; source tokens/generated output; reuse orchestrator, CSS helpers and pure runtime vocabulary           | Codex boundary review; Sites consumer work                                                | AGENTS/ADRs and baseline; bounded corrections remain assigned                                                                                              | FS-1.2, FS-3.3, FS-4.5                                                                  | No parallel theme/token/manifest system; gameplay isolated                                     | Inspect consumers and plan source-token changes in assigned tasks |
| Shared decorative-motion policy                           | Provisional Codex proposal; reviews/approval pending     | One preference for logo/scene; Follow System, Reduced, Off; static unresolved/reduced/off; explicit scene Pause survives environmental resume    | Codex proposes; Sites reviews consumer contract; Dimi approves                            | [Policy proposal](../tasks/fs-0.5-product-and-technical-decisions.md#semantic-theme-and-motion-reuse); no policy service exists yet                        | Before FS-3.4 implementation                                                            | Gates shared policy implementation; never controls gameplay time                               | Contract examples and static UI after its gates                   |
| One scene and static alternative                          | Approved milestone scope; appearance pending             | One bounded Canvas scene, one trusted replaceable aperture, static alternative; no carousel/editor/multiple scenes                               | Dimi scope/visual acceptance; Sites implementation lead later                             | Existing source/request; no new visual approval                                                                                                            | FS-4.1 specification                                                                    | Keeps scope bounded; placeholder is not working Canvas behavior                                | Static shell and reference preparation                            |
| Reference behavior and tuning                             | Pending; numeric defaults provisional                    | Dimi reference/description required; density/speed/size/Pause/Reset scope retained; DPR cap 2 and numeric budgets proposed                       | Dimi reference/acceptance; Sites proposal; Codex measurement review                       | Original visual/video sources not inspected                                                                                                                | FS-4.1 budgets; behavior before FS-4.2; controls FS-4.6                                 | No invented appearance, workload or frame-rate approval                                        | Architecture planning; bounded controls proposal                  |
| Scene renderer boundary                                   | Provisional direction; final proposal/reviews pending    | One Canvas 2D infrastructure adapter with pure rules, shared lifecycle vocabulary and no per-frame React state                                   | Sites proposes; Codex reviews; Dimi approves                                              | [Renderer rationale](../tasks/fs-0.5-product-and-technical-decisions.md#scene-renderer-boundary); existing runtime/ADR-003                                 | Approval at FS-4.1, before FS-4.2 implementation                                        | Gates renderer design; no new engine or game internals                                         | Read-only reuse/performance planning                              |
| Trusted SVG aperture handling and second vector           | Existing trusted-only scope; second asset pending        | Retain original sources; reviewed repository SVG only; circle proof first; second trusted SVG needed for replacement acceptance                  | Dimi supplies editable/second SVG; Sites export/consumer contract; Codex reviews boundary | [Asset rationale](../tasks/fs-0.5-product-and-technical-decisions.md#trusted-svg-and-control-inputs)                                                       | FS-4.4 acceptance                                                                       | No arbitrary upload or inferred production vectors                                             | Circle proof and export guidance after task gates                 |
| Contact/server path and consumer contract                 | Provisional Codex proposal; reviews/approval pending     | One proposed `POST /api/contact`, pure validation/use case and narrow server-only provider adapter                                               | Codex proposes; Sites supplies consumer contract; Dimi approves                           | [Contact rationale](../tasks/fs-0.5-product-and-technical-decisions.md#one-contact-path-and-provider-boundary); no handler implemented                     | Approval FS-5.1, before FS-5.2 implementation                                           | Gates server flow; one honest typed request/result contract                                    | Contact layout, contract/error examples and routine mocks         |
| Contact fields and abuse controls                         | Pending; minimal fields provisional                      | Agree required fields/limits/errors at FS-5.1; deployment-aware abuse controls at FS-5.3; no automatic consent checkbox                          | Codex proposes; Sites consumer contract; Dimi product/privacy choices                     | Source task contract; provider/runtime constraints still pending                                                                                           | FS-5.1 contract; FS-5.3 controls before exposure/live acceptance                        | No excess data collection or false success; no unreviewed service                              | Pure contract/security review; unrelated UI                       |
| Mail provider, sender, recipient and secure configuration | Pending                                                  | No provider/account/transport selected; recipient/sender/config not supplied; secrets only through approved secure mechanism                     | Dimi decides/configures; Codex verifies compatibility/adapter                             | Provider capabilities, pricing, quotas and data-processing terms unverified until specific option evaluation                                               | Provider choice FS-5.1; actual configuration before FS-5.2 live verification and FS-5.6 | Live adapter verification and FS-5.6 cannot pass without configuration and authorized delivery | Mocked adapter/UI tests; static content                           |
| Live delivery, external actions and release approval      | Pending per action                                       | Dimi must authorize exact live test and deployment/settings/other external action; provider acceptance and recipient receipt recorded separately | Dimi approves and confirms receipt; Codex executes only authorized action                 | Scope answers are not action permission; [FS-5.1/5.6 rationale](../tasks/fs-0.5-product-and-technical-decisions.md#one-contact-path-and-provider-boundary) | Before each action; FS-5.6 and FS-6.5 acceptance                                        | No automatic mail, accounts, DNS, deployment, commit or push                                   | Reviewable candidates, local checks and operating guide           |
| Detailed EPIC 0 source/reconciliation                     | Supplied by Dimi; reconciliation complete                | Both original sources archived with provenance; no new scope conflict                                                                            | Dimi supplied; Codex reconciled                                                           | [Complete source mapping](../tasks/fs-0.4-authoritative-feature-plan.md#detailed-source-reconciliation-and-current-readiness--2026-09-12)                  | FS-0.4 source requirement satisfied before refreshed review                             | Resolves missing-source blocker; does not grant gate approval                                  | Readiness review and assigned later preparation                   |
| Preservation requirements                                 | Confirmed by Dimi, 2026-09-12                            | Preserve known clone/combat files, original assets and unrelated work; no cleanup/disposal authorized                                            | Dimi confirmation; Codex preservation                                                     | [Actual answer and limits](../tasks/fs-0.1-inventory-real-starting-point.md#preservation-confirmation--2026-09-12)                                         | Confirmation received; protect new discoveries before affected edits                    | Resolves missing-confirmation blocker; asset availability remains a separate input             | Continue safe inspection and documentation                        |

**FS-G0 decision distinction:** Dimi has now expressly approved the refreshed candidate and review patch, in addition to the earlier historical approval. Preservation and source blockers are resolved. The same answer explicitly authorizes this documentation commit/push; it does not grant later policy, renderer, contact, provider or visual approvals, or authorize merge/deployment/settings/live sending.

## Risks

| Risk                                                            | Likelihood / impact  | Mitigation                                                                                       | Verification                                              |
| --------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Mistaking reconciled documentation for current gate approval    | Material / high      | Keep historical approval, refreshed technical review and current Dimi decision separate          | FS-0.4 current review and exact candidate/patch           |
| Unavailable vectors/copy/legal facts                            | Present / high       | Named owners/latest-needed tasks; no fabricated assets/content                                   | FS-0.5, FS-1.1, FS-5.5                                    |
| Hidden contrast defects or shared token regressions             | Known / high         | Repair colors and both existing filters together, preserve generated boundaries                  | FS-1.2 unfiltered checks and game regressions             |
| Inconsistent preferences, static logo or leaked scene resources | Known/planned / high | Reuse authorities; transition, storage-failure and lifecycle tests                               | FS-2.2, FS-3.3–3.5, FS-4.7                                |
| Contact abuse, false success or secret exposure                 | Planned / high       | Reviewed server boundary, limits, fake routine adapter and separately approved live receipt test | FS-5.1–5.6                                                |
| Tooling/production advisories                                   | Known / high         | Keep FS-0.2 proposals owned; no blanket upgrades or clean-security claim                         | Separately reviewed graph/checks before relevant exposure |
| Future game coupling or accidental deployment                   | Material / high      | Preserve public game boundary; exact-revision review and action-specific authorization           | FS-6.4–6.6 and separate game EPIC 7                       |

## Testing strategy

For every implementation task, the lead must meet the task outcome, preserve protected behavior, add proportionate tests, review the diff and cleanup, and record exact evidence. Code checks normally include focused type/lint/tests; docs-only tasks need content, link, formatting, and diff review instead. Storybook is not a substitute for page-level tests. Automated checks are not a substitute for Dimi's phone review.

### Validation commands and evidence boundary

Use the [FS-0.2 ordered command baseline](../tasks/fs-0.2-tooling-baseline.md#validation-results) and [FS-0.3 actual-result validation](../tasks/fs-0.3-branch-integration-decision.md#fresh-validation-of-the-actual-result) for exact commands, prerequisites, versions, exits and limitations. Reinspect current scripts before each candidate run. The root build order is tokens → common typecheck → game build → Next; installation preserves the lockfile. Browser provisioning is deliberate and its security finding remains recorded.

Default E2E covers Chromium; standalone demo E2E is separate. Neither establishes WebKit or a physical phone. Lighthouse OFF/ON is compiled at build time, but the current measured home route has no animated-logo consumer. Local results are not animation-cost or field p75 evidence. Home and logo E2E retain differently scoped 2.4 filters; their exact behavior is [recorded in the baseline](../tasks/fs-0.2-tooling-baseline.md#exact-contrast-suppression-and-coverage-limits), and both removals stay with source repair in FS-1.2. No threshold, exclusion or suppression changes here.

FS-0.4 application checks are NOT RUN: this is documentation-only. Its content/link/graph/format/diff checks and counterpart findings belong to the FS-0.4 record, not new application acceptance claims. Implementation test levels remain domain/unit, application/adapter integration, component/hooks, Storybook, route E2E, accessibility and measured performance according to each task's risks.

### Manual verification and required evidence

| Concern                  | Required evidence                                                                                                               | Primary owner                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Core routes/content      | Direct load, refresh, Back, anchors, no-JavaScript content/links, identity and approved copy                                    | Sites                                   |
| Controls/overlays        | Names, focus visibility, Escape, focus restoration/destination, no scroll lock after teardown                                   | Sites; Codex review                     |
| Themes/motion            | Existing modes, blocked storage, preference initialization, reduced/off/static, explicit Pause preserved                        | Sites and Codex in their assigned tasks |
| Scene                    | Bounded draw workload/count/DPR, no frames while suspended, no growing resource count, mask replacement                         | Sites; Codex independent measurement    |
| Contact                  | Controlled error tests, server validation/abuse controls, secrets review, authorized live provider acceptance and inbox receipt | Codex; Dimi confirms receipt            |
| Responsive/accessibility | Agreed narrow/wide/short/landscape sizes, enlarged text, keyboard, unfiltered automated contrast, real phone                    | Dimi; agents supply automated checks    |
| Game protection          | Standalone build/test and unchanged public integration boundary; no game bundle loaded by the homepage                          | Codex                                   |
| Rollout                  | Actual approved target, complete environment config, fallback/rollback, deployed smoke check                                    | Codex with Dimi authorization           |

Performance measurements must record the device or emulation settings, browser, viewport, build, enabled flags, sample method, and results. Use the existing project Lighthouse limits and the scene budget agreed in FS-4.1; do not equate one local Lighthouse run with field p75 measurements or promise frame rates before testing.

Manual defect records should name build, device/browser, action, expected/actual outcome, and severity. Tasks remain blocked when required evidence is unavailable. Scoped revisions retain the original owner, followed by rerunning affected checks. No parallel agent fix of the same code without an explicit handoff.

## Acceptance criteria and gates

```text
EPIC 0: baseline, scope, branch approach → FS-G0
  ↓
EPIC 1: assets and essential controls
  ↓
EPIC 2: static three-section site
  ↓
EPIC 3: navigation and settings → FS-G1
  ├── EPIC 4: signature scene + human acceptance ──┐
  └── EPIC 5: real contact delivery + legal facts ─┤ → FS-G2
                                                 ↓
EPIC 6: whole-site acceptance / approved target → FS-G3
                                                 ↓
Wave Survivor EPIC 7 (separate plan)
```

Dimi can prepare assets/content/accounts alongside EPIC 0. Contact-provider selection can start early, and the contact UI may use a controlled test double after its contract is approved. EPICs 4 and 5 may overlap only on isolated files with agreed interfaces. Work is sequential by default; parallelism is not a goal.

**FS-G0:** starting point and decisions recoverable; defects identified honestly.

**FS-G1:** static website, real navigation, themes/motion policy, and fallback contact are usable.

**FS-G2:** the distinctive scene and genuine contact journey both work.

**FS-G3:** integration-ready website with recorded quality evidence and Dimi's acceptance.

These are portfolio gates, independent of the earlier Wave Survivor Gate 1/Gate 2. The attached EPIC 6 task plan is historical game planning and is not imported as new portfolio scope.

### Current acceptance status

| Gate  | Current state                | Evidence / remaining boundary                                                                                                                                                                                                                                           |
| ----- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FS-G0 | APPROVED by Dimi, 2026-09-12 | Explicit approval of `156c28c…` plus reviewed patch `677b435d…`, following independent readiness review and closure of preservation/source blockers. [Actual answer and full candidate](../tasks/fs-0.4-authoritative-feature-plan.md#dimi-fs-g0-decision--2026-09-12). |
| FS-G1 | Pending                      | Static-site/navigation/theme/motion acceptance in FS-3.6 not performed.                                                                                                                                                                                                 |
| FS-G2 | Pending                      | Integrated scene and genuine contact acceptance not performed.                                                                                                                                                                                                          |
| FS-G3 | Pending                      | Whole portfolio candidate and Dimi acceptance not performed. The game-baseline production release is not this portfolio gate.                                                                                                                                           |

The source sequence anticipated all EPIC 0 planning before FS-G0. The first Dimi approval preceded FS-0.4/0.5 completion; those records are now reconciled, independently reviewed and covered by Dimi’s explicit refreshed-candidate approval. Retain both dated decisions and the original prerequisites. Later choices keep their named owners and deadlines.

## Task breakdown and current milestone status

The following is the complete supplied portfolio graph: 44 tasks (5 / 7 / 6 / 6 / 8 / 6 / 6 across EPICs 0–6). Each task retains its source lead, counterpart, Dimi responsibilities, dependencies, work and completion criterion. Status annotations are the current milestone view; linked task records contain evidence. No empty task records are precreated. Historical Wave Survivor EPIC 6 tasks are not included.

All task IDs below are new portfolio IDs. Dependencies indicate required inputs; they do not imply that prior game code should be modified. Each task also requires the relevant epic prerequisites. No task is complete merely because code was generated.

### EPIC 0 — Repository baseline, maintenance, and durable planning

**Goal:** Create a reproducible starting point and a recoverable plan without turning maintenance into a repository rewrite.

**Dependencies:** None. This epic starts from the inspected game-feature branch and current local working tree.

**Affected areas:** AGENTS.md; README.md; package manifests and lockfile; CI; docs/development/; docs/features/; docs/templates/.

**Protected scope:** Accepted game behavior, unrelated local changes, repository settings, and unreviewed dependency upgrades.

#### FS-0.1 — Inventory the real starting point

**Current status:** Complete inventory/reuse and detailed-source reconciliation; Dimi preservation confirmation received 2026-09-12. [Evidence](../tasks/fs-0.1-inventory-real-starting-point.md). Access limits remain documented, not erased.

**Lead:** Codex

**Counterpart:** Sites identifies reusable visual components and consumes the inventory before implementing.

**Dimi:** Identify any unpushed work or local assets and confirm what must be preserved.

**Depends on:** None beyond epic prerequisites.

**Work:** Inspect AGENTS.md, relevant ADRs, code, tests, scripts, branches, and the working tree. Record the exact base revision, component reuse map, generated files, open defects, and protected areas. Compare branch ancestry rather than treating old branches as disposable.

**Complete when:** A baseline record names the inspected revision, existing implementations, missing features, protected work, and prioritized findings. No assumptions about local changes are presented as verified facts.

#### FS-0.2 — Reconcile tooling and run the baseline

**Current status:** Bounded maintenance and baseline delivered; security proposals remain owned/deferred. [Evidence](../tasks/fs-0.2-tooling-baseline.md); later exact-main validation is in FS-0.3.

**Lead:** Codex

**Counterpart:** Sites consumes the confirmed commands and does not change package versions independently.

**Dimi:** Approve any necessary package/service choice that changes scope or cost.

**Depends on:** `FS-0.1`

**Work:** Resolve the Node/pnpm/CI convention and required build order. Include frontend/features in Tailwind scanning. Run installed-package security/dependency review and make only justified, bounded fixes. Record the existing contrast-test suppression for atomic repair with the relevant colors in FS-1.2. Keep unrelated upgrades in a backlog.

**Complete when:** An exact command log distinguishes passes, failures, environmental blockers, and known baseline defects. Necessary tooling is reproducible; neither a blanket dependency upgrade nor a lowered test threshold is used as a shortcut.

#### FS-0.3 — Choose and prepare the branch integration path

**Current status:** Complete; A approved and executed, actual main validated, portfolio branch created and subsequently pushed. [Evidence](../tasks/fs-0.3-branch-integration-decision.md).

**Lead:** Codex

**Counterpart:** Sites starts only from the recorded portfolio base and does not independently merge or delete branches.

**Dimi:** Approve specific pull-request, commit/push, merge, deletion, or repository-setting actions before execution.

**Depends on:** `FS-0.2`

**Work:** Prefer a reviewed merge of the accepted game baseline into main before starting the portfolio branch. If that merge is deferred, record a portfolio branch based on the validated game tip and the integration dependency. Review CI evidence and deployment consequences. Delete branches only after retained work and merge status are confirmed.

**Complete when:** The chosen base and integration strategy are recorded. Any authorized merge is validated. A documented unmerged-base strategy is a valid outcome; destructive cleanup is not required to pass the planning gate.

#### FS-0.4 — Publish one authoritative feature plan and update stale guidance

**Current status:** Complete documentation reconciliation in the working tree; both supplied sources read, selective guidance corrections and counterpart findings incorporated. [Execution, source mapping and refreshed review](../tasks/fs-0.4-authoritative-feature-plan.md). No deployment or current gate approval implied.

**Lead:** Codex

**Counterpart:** Sites supplies component and interaction decisions; it updates its own task completion records during implementation.

**Dimi:** Approve the release scope and any architecture decision; reject additions that do not serve this milestone.

**Depends on:** `FS-0.1`

**Work:** Place the approved plan at proposed docs/features/funkspace-minimum-usable.md using the existing feature template. Update the current full-screen-layout/home-motion guidance to reflect normal scrolling and the bounded Canvas scene. Reuse the existing AI workflow. Use task records for substantial work, not 44 empty documents created in advance.

**Complete when:** A fresh agent can identify scope, owners, dependencies, protected areas, and acceptance gates from the repository. Historical slide-navigation and game plans remain clearly distinguished from the current work.

#### FS-0.5 — Approve product, content, and operating assumptions

**Current status:** Product answers and technical decision preparation complete in the [canonical register](#pending-decisions-and-latest-needed-points) and [FS-0.5 record](../tasks/fs-0.5-product-and-technical-decisions.md); FS-0.4 source dependency reconciled. Later inputs/approvals retain owners/deadlines; Dimi remains lead/approver. No future implementation approval inferred.

**Lead:** Dimi

**Counterpart:** Sites prepares the small design/content checklist. Codex prepares technical options for hosting, motion policy, SVG assets, and contact delivery.

**Dimi:** Choose the initial site language, approve the three-section structure and routes, identify a target test phone, and choose preview-versus-public-release scope. Start gathering copy, vectors, and real operator/contact details.

**Depends on:** `FS-0.4`

**Work:** Record confirmed decisions and owners for outstanding inputs. Keep English as a reversible implementation default unless another language is selected. Approve architecture proposals before a new global motion service, renderer boundary, or server contact flow is implemented. Approve one scene, not a carousel or visual editor.

**Complete when:** Every material decision has an answer or a named owner and a latest-needed task. Missing email-provider details block delivery work, not unrelated UI implementation. This plan itself authorizes no remote changes or live sending.

**Epic exit:** FS-G0: Dimi approves the baseline, scope, and branch approach. Known defects have owners; no test suppression is mistaken for evidence of correctness.

---

### EPIC 1 — Design assets and essential Storybook components

**Goal:** Turn the supplied visual language into a small, reusable, accessible set of production controls.

**Dependencies:** FS-G0 for code changes. Dimi may prepare assets while EPIC 0 runs.

**Affected areas:** tokens/; frontend/tailwind.config.ts; frontend/components/Base, Controls, Logo; Storybook; relevant component and accessibility tests.

**Protected scope:** Generated token outputs are not hand-edited. No palette redesign, full token-hierarchy migration, or replacement component library.

#### FS-1.1 — Prepare the asset and component contract

**Current status:** Complete — Sites recorded Codex's technical review and the inspected 36-unit Menu SVG export in the [asset and component contract](../tasks/fs-1.1-asset-and-component-contract.md). Dimi accepted the recommended treatments, dimensions, control typography and necessary text-only substitutions on 2026-09-15; [actual decision](../tasks/fs-1.1-asset-and-component-contract.md#dimi-contract-decision--2026-09-15). Production export/integration and later visual checks retain their owners. FS-1.2 foundation corrections are also complete and accepted; later component work remains separate.

**Lead:** Dimi

**Counterpart:** Sites maps the screenshots into required component variants and records temporary substitutes. Codex checks export/build implications.

**Dimi:** Export available custom icons as clean SVG; identify editable design sources, essential variants, and approved substitutes for missing icons.

**Depends on:** `FS-0.5`

**Work:** Agree icon sizing/viewBox conventions, standard and hexagonal control sizes, filled/outlined and accent/neutral treatments, and interaction states. Keep default, hover, keyboard focus, pressed, selected, disabled, and loading conceptually distinct. Reuse the existing logo assets rather than redrawing them from screenshots.

**Complete when:** The minimal variant matrix, asset locations, missing-icon list, and replacement ownership are documented. Screenshots are design references, not claimed production vectors.

#### FS-1.2 — Reconcile required tokens and repair contrast evidence

**Current status:** Complete — Codex implemented the [token and contrast foundations](../tasks/fs-1.2-token-and-contrast-foundations.md), with before/after rendering evidence and unfiltered checks. Sites' separate consumer review passed after the transition-contrast correction, and Dimi accepted all corrections on 2026-09-15; [actual decision and commit/push authorization](../tasks/fs-1.2-token-and-contrast-foundations.md#dimi-acceptance--2026-09-15). The pre-existing E2E type mismatch and future component coverage limits remain recorded. No later component-family implementation is started.

**Lead:** Codex

**Counterpart:** Sites supplies needed visual pairings and verifies their component usage.

**Dimi:** Approve visible changes needed for readable colors while retaining the design identity.

**Depends on:** `FS-1.1`, `FS-0.2`

**Work:** Verify typography-source drift and align required sources with Work Sans and Space Grotesk. Expose needed spacing consistently. Fix concrete foreground/background/focus pairings across existing themes; add narrowly justified semantic roles only where required. Regenerate CSS/TypeScript artifacts and remove the 2.4:1 contrast suppression with its cause addressed.

**Complete when:** Token generation is reproducible, changed game-facing output is reviewed, and unfiltered accessibility checks cover the repaired state. No generated artifact is edited by hand and no unrelated token migration is required.

#### FS-1.3 — Extend the Standard Button family

**Current status:** Complete — Dimi confirmed that the Buttons and icon implementations passed manual and visual Storybook tests on 2026-09-15; [implementation, API, validation and acceptance record](../tasks/fs-1.3-standard-button-family.md#final-dimi-acceptance-and-completion--2026-09-15). The accepted scope includes the four-treatment Standard matrix, native outlined navigation, explicit light preview and seven-family icon library. Codex reviews compatibility at FS-1.7. No page/contact or later component-family work is included.

**Lead:** Sites

**Counterpart:** Codex reviews shared API changes at the component gate rather than rewriting the component in parallel.

**Dimi:** Approve the selected size, icon spacing, and visual states in Storybook.

**Depends on:** `FS-1.2`

**Work:** Extend the existing Button with the approved treatments, size choices, leading/trailing icons, and required submitting/disabled states. Share styling with genuine navigation links without pretending that links are buttons. Preserve useful existing props and defaults.

**Complete when:** The agreed matrix renders, links navigate natively, buttons activate by keyboard, submitting does not shift layout unexpectedly, and focused component tests protect behavior.

#### FS-1.4 — Implement the Hexagonal Button family

**Current status:** Complete — Dimi reports manual and visual tests PASS on 2026-09-16 and authorizes documentation finalization, commit and push. The [FS-1.4 acceptance record](../tasks/fs-1.4-hexagonal-button-family.md#final-dimi-acceptance-and-completion--2026-09-16) covers the full size matrix and icon-only Storybook correction. Codex review remains at FS-1.7.

**Lead:** Sites

**Counterpart:** Codex reviews semantics, focus treatment, and actual reuse of shared styling.

**Dimi:** Check thumb reach and confirm that the custom icon plus visible Menu label is understandable.

**Depends on:** `FS-1.2`, `FS-1.3`

**Work:** Native rectangular target containing the decorative hexagon, custom icon and visible Menu label. Dimi's subsequent full-matrix request adds 48/72/96px artwork with 24/36/48px icons; the accepted default Menu remains 72/36px. Storybook Figma Matrix shows all four Standard treatments at every size with unclipped focus. No genuine selected state is currently accepted; a future named consumer must supply semantics and a non-color cue.

**Complete when:** Mouse, touch, keyboard, and focus states work without relying only on color. Decorative clipping does not hide focus or unnecessarily shrink the intended touch area.

#### FS-1.5 — Add essential form primitives

**Current status:** Complete — implementation and automated checks passed; Dimi approved presentation/readability on 2026-09-16 in the [FS-1.5 acceptance record](../tasks/fs-1.5-essential-form-primitives.md#dimi-presentation-acceptance--2026-09-16). Native fields, help/errors and polite inline status are presentation primitives, not a delivery form or FS-5.1 server contract. Codex compatibility review remains at FS-1.7.

**Lead:** Sites

**Counterpart:** Codex reviews the later server-contract compatibility; no server validation is replaced by these components.

**Dimi:** Approve label wording and readability of errors and status text.

**Depends on:** `FS-1.2`

**Work:** Create or extend only the needed labeled input, textarea, field help/error, and status treatments. Support required indicators, autocomplete, email input, disabled/submitting state, and error associations. Use native semantics instead of placeholder-only labels.

**Complete when:** Storybook covers normal, invalid, disabled, and pending form presentation. Tests confirm accessible labels and error associations; no delivery backend is implied.

#### FS-1.6 — Build one shared dialog primitive

**Current status:** Complete. Dimi reports FS-1.6 manual and visual tests PASS on 2026-09-16 and authorizes documentation finalization, commit and push. The accepted implementation includes the Figma Close icon in a secondary HexButton and blue focus styling in every theme. The [final acceptance record](../tasks/fs-1.6-shared-dialog-primitive.md#final-manualvisual-acceptance-and-commit-authorization--2026-09-16) identifies the exact candidate/evidence on base `16cc8b1bcd2e3f338123696e31ce453ca8857675`. Separate FS-1.7 compatibility/component-set review remains pending; no navigation/settings integration is included.

**Lead:** Sites

**Counterpart:** Codex reviews lifecycle/focus boundaries and existing utilities before any replacement abstraction is introduced.

**Dimi:** Test opening, closing, Escape, and the reachability of controls on the phone.

**Depends on:** `FS-1.3`, `FS-1.4`

**Work:** Use the existing suitable implementation if found; otherwise prefer a small native-dialog-based primitive. Define labeling, initial focus, close control, background inactivity, scroll handling, and focus restoration. Keep platform effects at the appropriate adapter boundary. Navigation and scene customization will reuse this primitive.

**Complete when:** Keyboard interaction and teardown are tested. Long dialog content scrolls, the background does not receive unintended input, and repeated open/close cycles leave no locked body or stale listener.

#### FS-1.7 — Review the complete essential component set

**Latest correction:** Pending Interaction keeps normal height and swaps a right-hand arrow for an ellipsis. The [follow-up record](../tasks/fs-1.7-essential-component-acceptance.md#pending-presentation-correction-requested-by-dimi--2026-09-16) identifies that change and its candidate. The later decision below records Dimi's acceptance.

**Current status:** Sites has implemented the bounded **R3 / P2** pending-control reflow correction on `fbfea569a999134a28c5432313ded96f58ba5f57`; [repair, validation and exact-candidate handoff](../tasks/fs-1.7-essential-component-acceptance.md#sites-r3-correction-and-review-handoff--2026-09-18). The large paired-icon label remains readable at 320px/200% text, while the normal 48px arrow/ellipsis presentation stays stable. Codex re-review and Dimi's decision on changed wrapping are pending. Dimi's [previous acceptance and commit/push decision](../tasks/fs-1.7-essential-component-acceptance.md#dimi-final-decision-and-authorized-commit--2026-09-18) remains recorded for `fbfea569`; it does not automatically accept this patch. R3 is implemented/awaiting review, not waived or independently signed off. FS-G1 remains open.

**Lead:** Sites

**Counterpart:** Codex checks changed APIs, unfiltered accessibility evidence, build compatibility, and test quality.

**Dimi:** Accept the visual matrix across the existing color modes and at mobile/desktop sizes.

**Depends on:** `FS-1.3`, `FS-1.4`, `FS-1.5`, `FS-1.6`

**Work:** Assemble Storybook stories for meaningful states and verify actual component integration. Check forced-colors behavior where relevant. Consolidate real duplication and remove temporary demonstration content from production-bound controls, without building unused variants.

**Complete when:** Dimi records visual acceptance, Codex records the technical review, and the owner resolves blocking findings. Reusable controls are ready to build the real page.

**Epic exit:** Component acceptance: the agreed control matrix works across supported themes; Dimi approves visual fidelity and Codex verifies relevant foundation changes.

---

### EPIC 2 — Three-section website, content, and real routes

**Goal:** Create a useful static website before the signature animation and live form are complete.

**Dependencies:** EPIC 1 essential components; approved content and route decisions from FS-0.5.

**Affected areas:** frontend/app/; existing sections and layout components; frontend/data/; logo components; route-level tests.

**Protected scope:** No section snapping, up/down controls, carousel arrows, fake destinations, CMS, or running game on the homepage.

#### FS-2.1 — Define page structure and shared navigation data

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews route boundaries and keeps future game imports out of the shell.

**Dimi:** Approve section order and labels: Start, About, Contact; plus About, Impressum, and Privacy pages.

**Depends on:** `FS-1.7`

**Work:** Use stable section IDs and one small typed destination definition. Implement or plan /, /about, /impressum, and the existing /privacy route. Use /#contact from secondary pages. Preserve ordinary links as the fallback; do not expose unimplemented Games/Experiments destinations.

**Complete when:** Every visible destination resolves to real content, URLs are coherent, and mobile/desktop navigation will consume the same data.

#### FS-2.2 — Build the static Start section and reuse the logo

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews existing logo integration, static fallback, and multiple-instance SVG identifiers.

**Dimi:** Approve the scene framing, short introduction, typography, and logo placement.

**Depends on:** `FS-2.1`

**Work:** Reuse the animated-logo component with a deliberate static state while motion policy is unavailable. Reserve one responsive scene area and a purposeful static preview that later scene work will enhance. Keep essential words as semantic HTML. Remove 01/03, dots, and previous/next animation controls.

**Complete when:** The opening section looks intentional without animation, has one clear page heading, and reserves stable space. Logo reuse does not cause duplicate-ID or hydration failures.

#### FS-2.3 — Build About preview and About page

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex checks server/client boundaries and route behavior at the site gate.

**Dimi:** Provide and approve the short introduction and longer About copy; do not delegate factual biography invention.

**Depends on:** `FS-2.1`

**Work:** Adapt the wireframe to a naturally growing section with a descriptive More about FunkSpace link. Create a small complete /about page using the same shell and typography. Avoid forcing long content into a single viewport or an unnecessary nested scroller.

**Complete when:** Both pages use real approved copy, contain no lorem ipsum, and the preview link works with keyboard, direct loading, and browser navigation.

#### FS-2.4 — Build Contact/footer and legal-page structure

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex flags configuration/privacy dependencies that must be finalized with the real mail provider in EPIC 5.

**Dimi:** Supply the public contact address and accurate operator/legal information, using appropriate review where needed.

**Depends on:** `FS-2.1`

**Work:** Create the Contact/footer section with a working email fallback and links to Impressum and Privacy. Establish readable legal-page layouts using supplied content. Reserve the future form location, but do not present a fake Send or fake success state. Provider-specific privacy wording remains explicitly pending until FS-5.5.

**Complete when:** Visitors can make contact and reach legal information. Missing legal input is recorded as a release blocker rather than replaced with fabricated text.

#### FS-2.5 — Complete responsive shell and ordinary scrolling

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews overflow, viewport, layering, and future play-route containment.

**Dimi:** Check the phone layout, larger screens, landscape/short screens, and enlarged text.

**Depends on:** `FS-2.2`, `FS-2.3`, `FS-2.4`

**Work:** Use one page shell rather than duplicating the wireframe header in every section. Make narrow and wide layouts deliberate; keep decorative corner marks hidden from assistive technology. Allow content-driven heights, safe-area spacing, and room for the later mobile menu trigger.

**Complete when:** There is no horizontal overflow, scroll hijacking, unreachable footer, or content covered by fixed controls at the agreed test sizes.

#### FS-2.6 — Finish semantic, metadata, and static-route behavior

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex validates the production build and checks no unnecessary game or particle runtime enters the shell.

**Dimi:** Approve page titles, description, icon/identity treatment, and the initial language.

**Depends on:** `FS-2.5`

**Work:** Replace scaffold metadata, establish landmarks, heading order and a skip link, and add meaningful not-found behavior. Verify core content and ordinary links without JavaScript. Preserve self-hosted fonts. Final deployment-dependent canonical URLs are assigned only after the real host is known.

**Complete when:** Direct route loads, refresh, Back, anchor navigation, and a static experience are usable. Production rendering has no known hydration errors or placeholder identity.

**Epic exit:** Static-site checkpoint: Start, About, Contact, and secondary routes are reachable with ordinary scrolling and without waiting for decorative JavaScript.

---

### EPIC 3 — Navigation overlay, themes, and one motion policy

**Goal:** Deliver a coherent mobile-first control system without duplicating settings authority or modal behavior.

**Dependencies:** EPIC 2 shell/navigation data; FS-1.6 shared dialog. Motion-policy design is approved before its implementation.

**Affected areas:** Frontend presentation and navigation data; application/providers and services; browser/storage adapters; existing ThemeService and logo consumers.

**Protected scope:** No second theme manager, global route-animation framework, deeply nested menu, or changes to game simulation.

#### FS-3.1 — Compose the combined navigation and settings overlay

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews the shared data/overlay contract.

**Dimi:** Approve hierarchy and wording, including a visible Menu clue beside the custom icon.

**Depends on:** `FS-2.6`, `FS-1.6`

**Work:** Use separate Navigation, Appearance, and Motion groups, with secondary legal links. Render website navigation as ordinary links, not an application command menu. Reuse the dialog primitive and shared destination data. Show no empty future destinations.

**Complete when:** Users can distinguish navigation from settings. All visible actions have meaningful labels and the layout remains readable with larger text.

#### FS-3.2 — Implement navigation lifecycle across mobile and desktop

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex checks cleanup, focus destinations, and the bounded overlay state.

**Dimi:** Test the trigger with a thumb and check that it never obscures Contact or legal links.

**Depends on:** `FS-3.1`

**Work:** Add the mobile trigger and compact desktop navigation. On ordinary closure, return focus to the trigger; on navigation, close and focus the destination appropriately. Support Escape, Back/route changes, safe areas, and long panel content. Keep only one overlay open; customization joins the same small state later.

**Complete when:** No focus/scroll lock survives closure or route changes. Destination focus differs correctly from dismissal focus, and all navigation remains available outside the overlay fallback.

#### FS-3.3 — Connect appearance controls to ThemeService

**Related bounded maintenance:** [Typed inline theme bootstrap](../tasks/maintenance-theme-bootstrap.md) records the extraction, initialization failure correction and validation separately; it does not complete this task or change its ownership/dependencies.

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews subscriptions, existing initialization, and storage-error behavior.

**Dimi:** Approve the existing theme choices in the new controls and check an actual reload.

**Depends on:** `FS-3.1`

**Work:** Consume ThemeService through the established provider/hook boundary. Keep its selected/resolved theme contract and pre-hydration initialization. Add no component-local theme authority or direct scattered localStorage writes. Handle blocked storage and immediate theme changes.

**Complete when:** Controls, page, logo, and later scene receive consistent theme updates. Reload and system changes do not produce a second authority or a fatal storage error.

#### FS-3.4 — Implement the shared motion-preference and suspension policy

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites consumes the approved API and supplies logo/scene needs; it does not maintain another persisted motion preference.

**Dimi:** Approve Follow system, Reduced, and Off semantics and the feature-flag interaction.

**Depends on:** `FS-0.5`, `FS-2.6`

**Work:** Build the smallest policy in the existing application/composition structure. Distinguish user preference, local Pause, feature-flag availability, document/scene visibility, and unresolved initialization. Do not start decorative motion before preferences are known. Reduced/Off keep a static particle scene; environmental resume cannot override explicit Pause.

**Complete when:** Unit/integration tests cover precedence, storage failure, preference changes, visibility changes, and cleanup. Exactly one preference authority serves the logo and scene; no game clock is coupled to it.

#### FS-3.5 — Wire motion settings and the existing logo

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex checks that any necessary migration of touched logo infrastructure access stays narrow and tested.

**Dimi:** Test preferences and confirm a complete static logo when animation is unavailable.

**Depends on:** `FS-3.1`, `FS-3.4`

**Work:** Connect the settings UI to the motion policy and adapt the current logo consumer to it. Preserve the existing feature-flag gate and useful logo API. Animate one prominent instance rather than replaying every copy. Avoid an initial unwanted-motion flash.

**Complete when:** Changing a setting updates visible behavior without reload. Off/Reduced/flag-disabled paths remain complete and no missing or invisible logo is accepted as a fallback.

#### FS-3.6 — Validate the static site and control flows

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex independently reviews and reruns focused integration checks. Blocking fixes return to the original task owner.

**Dimi:** Approve FS-G1 after phone/desktop navigation, theme, motion, and keyboard checks.

**Depends on:** `FS-3.2`, `FS-3.3`, `FS-3.5`

**Work:** Add and run real-route tests for menu open/close, focus, navigation from secondary pages, settings changes, blocked storage, reduced motion, and layout. Check the static no-JavaScript fallback and repeated open/close sequences.

**Complete when:** A useful site exists before live contact or continuous particles. Tests and Dimi’s observations are recorded separately, with no claim that Storybook alone proves page integration.

**Epic exit:** FS-G1: Dimi can browse and adjust settings on the real site; Codex verifies focus, persistence, static fallbacks, and lifecycle boundaries.

---

### EPIC 4 — Signature Canvas scene, replaceable SVG aperture, and customization

**Goal:** Deliver one distinctive animation whose visual mask can change independently of particle simulation.

**Dependencies:** FS-G1; the static Start framing, theme service, motion policy, and dialog are available.

**Affected areas:** Frontend domain/application animation modules; infrastructure Canvas/browser adapters; the Start presentation; approved static assets; shared pure motion API only where needed.

**Protected scope:** No new game engine, game-runtime imports, general particle editor, mask upload feature, animation carousel, or speculative shared engine extraction.

#### FS-4.1 — Confirm the scene appearance and measurable limits

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews the renderer plan, resource budget, and architecture decision before implementation.

**Dimi:** Provide an accessible reference clip/stills or describe the required motion. Approve trails/connections/pointer behavior explicitly rather than assuming the inaccessible video was inspected.

**Depends on:** `FS-3.6`, `FS-1.1`

**Work:** Specify one particle behavior, a centered circular aperture, density/speed/size controls, Pause, and Reset. Begin with a proposed DPR cap of 2 and a bounded count. Record device/viewport, frame-work and bundle targets before optimization; all numeric tuning remains a measured project decision.

**Complete when:** A visual acceptance description and testable resource limits exist. Unknown reference behavior is resolved or explicitly replaced by a Dimi-approved candidate; no matching-video claim is invented.

#### FS-4.2 — Implement pure particle state and update rules

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews deterministic boundaries and unnecessary reuse/extraction.

**Dimi:** Review a simple preview for the agreed behavior rather than choosing internal data structures.

**Depends on:** `FS-4.1`

**Work:** Keep movement/configuration rules in pure TypeScript with controlled randomness and bounded delta handling. Validate configuration and define deterministic resizing/bounds behavior where applicable. Use tests for equivalent scripted updates, limits, invalid values, and reset; keep positions out of React state.

**Complete when:** Rules run without DOM, Canvas, or uncontrolled clocks. Configuration remains bounded and tests protect the agreed behavior.

#### FS-4.3 — Implement Canvas rendering and lifecycle adapter

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews scheduling, initialization cancellation, browser resources, and exception cleanup.

**Dimi:** Check that scrolling and touch behavior remain normal around the scene.

**Depends on:** `FS-4.2`

**Work:** Own one active animation-frame chain for this scene, separate from game runtimes. Handle responsive size/DPR, drawing, pause/resume/reset/destroy, visibility suspension, unavailable Canvas, and mount/unmount races. Reuse the existing runtime vocabulary, not the game engine. Reserve initial geometry and provide a static render.

**Complete when:** Paused/hidden/destroyed scenes schedule no continuous frames; repeated mount/unmount does not multiply loops, observers, or listeners. Browser APIs remain at the infrastructure boundary.

#### FS-4.4 — Implement SVG overlay and prove asset replacement

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews mask semantics, SVG safety, identifiers, and sizing.

**Dimi:** Export a second trusted test aperture from Illustrator following the agreed asset guide and confirm that the workflow is practical.

**Depends on:** `FS-4.1`, `FS-4.3`

**Work:** Place a theme-colored SVG covering layer above Canvas and expose particles through a circle. Define one explicit luminance-mask convention, valid viewBox, scaling/centering, unique mask IDs, and non-intercepting decorative layers. Replace the circle with a trusted second shape without modifying particle rules. Document SVG export constraints.

**Complete when:** Two shapes work at narrow/wide aspect ratios and in all themes. Simulation code does not change when the aperture is replaced; IDs do not collide and malformed/missing assets have a deliberate fallback.

#### FS-4.5 — Integrate scene themes, motion policy, and local Pause

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex verifies that preferences and local/environmental pause reasons remain separate.

**Dimi:** Test theme changes, OS reduced motion, settings, Pause, scrolling away/back, and background/foreground transitions.

**Depends on:** `FS-4.3`, `FS-4.4`, `FS-3.3`, `FS-3.4`

**Work:** Supply resolved semantic colors from the frontend boundary and subscribe through existing services. Keep simulation independent of visual theme. Add an obvious scene Pause control. Reuse the static preview when motion is disallowed; do not make Off or Reduced a blank hole.

**Complete when:** Theme changes redraw safely, explicit Pause survives environmental resume, reduced motion is respected before playback, and the feature-flag-disabled experience remains complete.

#### FS-4.6 — Add the contextual customization overlay

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex reviews configuration validation and ensures no second overlay/settings system is added.

**Dimi:** Approve slider ranges, reset behavior, labels, and the live/static preview experience.

**Depends on:** `FS-4.5`, `FS-1.6`, `FS-3.2`

**Work:** Reuse the shared dialog for density, speed, size, and Reset. Keep values local to the scene and temporary. Apply configuration without destroying/recreating the runtime on each input. Under Reduced/Off/Pause, changes may redraw a static preview but never silently start continuous motion.

**Complete when:** Controls are keyboard-operable, constrained to safe ranges, visibly update the permitted preview, and do not conflict with the main menu. No arbitrary SVG/color upload or persisted preset editor is added.

#### FS-4.7 — Review performance, failure paths, and lifecycle

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites owns targeted visual/runtime corrections identified by the review; it does not edit the same files concurrently.

**Dimi:** Provide observations from the nominated real phone and report heat, stutter, input delay, or discomfort.

**Depends on:** `FS-4.6`

**Work:** Measure against FS-4.1 budgets on representative conditions. Inspect flame/frame evidence and repeated route/visibility/pause sequences. Test missing assets, failed initialization, denied/blocked storage interactions, feature flag off, reduced motion, and absent Canvas. Fix bounded causes before proposing workers/WebGL or broad scheduling infrastructure.

**Complete when:** Measurements and limitations are recorded, resource counts remain bounded, controls stay responsive, and failure produces a usable static scene. Simulated browser evidence is not labeled real-device evidence.

#### FS-4.8 — Approve the signature experience

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Dimi

**Counterpart:** Sites incorporates bounded visual feedback. Codex revalidates affected behavior after revisions.

**Dimi:** Approve appearance, visual comfort, mask replacement workflow, customization, and phone readability.

**Depends on:** `FS-4.7`

**Work:** Review the actual integrated homepage, not only a sandbox. Record which candidate is accepted and which enhancements are deferred. Adjust a small number of parameters per feedback cycle instead of redesigning the scene repeatedly.

**Complete when:** The chosen scene is accepted with a commit/build reference. Remaining polish does not conceal a lifecycle, accessibility, or performance defect.

**Epic exit:** Scene acceptance: Dimi approves the look on the test phone; Codex confirms lifecycle/performance evidence and independent mask replacement. The static alternative remains first-class.

---

### EPIC 5 — Real contact delivery, privacy, and failure handling

**Goal:** Provide an honest, secure contact journey that sends real messages without building an unnecessary backend platform.

**Dependencies:** FS-0.5 operating decisions; EPIC 1 fields; EPIC 2 Contact shell. Can run alongside EPIC 4 when files/contracts are isolated.

**Affected areas:** Frontend contact UI; pure validation; application contact use case; server-only mail adapter/composition; one route handler (proposed /api/contact); legal copy and operational documentation.

**Protected scope:** No accounts, message dashboard, attachments, database-backed inbox, unnecessary analytics/CAPTCHA, or fake success. No secrets in source, fixtures, or chat.

#### FS-5.1 — Choose delivery infrastructure and freeze the UI/server contract

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites provides form-state requirements and consumes the typed request/result contract.

**Dimi:** Select the host/mail provider, create required accounts, approve cost/data processing, and configure secrets securely. Approve any DNS or provider-side changes before execution.

**Depends on:** `FS-0.5`, `FS-1.5`, `FS-2.4`

**Work:** Propose one server-handled path within the existing Next.js deployment. Define name/email/message inputs, required fields (proposed: email/message), limits, accepted/error/rate-limited outcomes, timeout behavior, and user-facing wording. Choose one transport, not both route handlers and server actions. Document the server-only composition and provider boundary.

**Complete when:** The approved contract supports UI work with a fake adapter while real-provider configuration proceeds. Missing credentials are a visible delivery blocker, not a reason to simulate successful sending.

#### FS-5.2 — Implement validation, contact use case, and mail adapter

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites implements only the presentation side against the public contract.

**Dimi:** Confirm the intended recipient, sender identity, and actual field requirements.

**Depends on:** `FS-5.1`

**Work:** Implement server-side validation, bounded payload/field lengths, fixed recipient/sender configuration, safe reply-address handling, timeouts, and explicit provider failures. Keep pure rules separate from the network adapter and HTTP mapping. Keep the provider credential server-only and use a test double in ordinary automated tests.

**Complete when:** Valid requests reach the fake/approved adapter, invalid requests do not, headers cannot be injected, and a success response means provider acceptance rather than guaranteed inbox delivery. Tests cover all declared outcomes.

#### FS-5.3 — Add abuse controls and privacy-conscious operations

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites maps rate limits and errors into understandable UI without exposing infrastructure details.

**Dimi:** Approve provider/platform choices and the retention/data-processing implications of abuse protection.

**Depends on:** `FS-5.2`

**Work:** Apply server/platform request limits, suitable rate limiting, origin protections, and a lightweight spam strategy. Do not rely on per-process memory as the sole production limit across multiple instances. Minimize logging and avoid message bodies or secrets. Keep CAPTCHA and extra infrastructure out unless measured abuse or host constraints justify them.

**Complete when:** Abusive/oversized requests are rejected predictably, limits work in the selected deployment model, and diagnostics do not unnecessarily retain contact content. Security review records assumptions and residual limits.

#### FS-5.4 — Implement the live contact-form interface

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Sites

**Counterpart:** Codex verifies contract usage, validation parity, and that tests do not send mail unintentionally.

**Dimi:** Approve field/help/status wording and test it with the phone keyboard.

**Depends on:** `FS-5.1`, `FS-1.5`, `FS-2.4`

**Work:** Build idle, invalid, pending, accepted, rate-limited, timeout, and failure states against the contract. Preserve user input on failure, prevent repeated pending submissions, associate errors with fields, announce status, and retain the email fallback. Wire the real endpoint only after the server tasks are validated.

**Complete when:** Component tests cover all states with controlled responses. Production never reports success from a timer or mock, and the form remains usable with narrow/short viewports and accessible error feedback.

#### FS-5.5 — Finalize legal content and the contact operating guide

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Dimi

**Counterpart:** Sites publishes approved copy in the existing page structure. Codex supplies the actual data flow, provider configuration, logging, failure, and rollback facts.

**Dimi:** Supply and verify actual operator/privacy information and obtain appropriate advice where needed; approve the stated purpose, retention, recipients, and legal basis.

**Depends on:** `FS-5.1`, `FS-5.3`, `FS-2.4`

**Work:** Finalize Impressum and Privacy for the real deployment and contact flow; do not invent operator details or insert a compulsory consent checkbox without a justified decision. Document environment-variable names without values, sender/recipient setup, no-body logging, failure diagnosis, and safe form-disable/email-fallback operation.

**Complete when:** Published information matches the actual technical flow and contains no placeholders. An operator can diagnose delivery failure without exposing secrets or changing the UI to claim false success.

#### FS-5.6 — Verify end-to-end delivery and failure recovery

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites fixes UI-specific findings and retains accessible fallback behavior.

**Dimi:** Authorize the controlled live test, send/receive a real test message, verify the recipient mailbox, and confirm the user-facing outcome.

**Depends on:** `FS-5.2`, `FS-5.3`, `FS-5.4`, `FS-5.5`

**Work:** Run mocked integration tests for all error states, then a separately authorized test through the intended deployed environment. Verify reply handling, duplicate-click behavior, rate limits, and provider-failure fallback without spamming the service. Record actual provider acceptance and receipt rather than conflating them.

**Complete when:** A real message reaches the intended recipient, failure paths retain the message text and offer recovery, and no unexpected live calls occur in the routine automated suite. Unavailable service access leaves the task blocked.

**Epic exit:** FS-G2 after EPICs 4 and 5: one approved scene and a complete tested contact journey, with actual provider acceptance and recipient verification recorded separately.

---

### EPIC 6 — Integrated quality gates, controlled rollout, and game handoff

**Goal:** Certify the complete minimum website and preserve a clear, low-risk route back to Wave Survivor EPIC 7.

**Dependencies:** EPIC 4 scene acceptance and EPIC 5 live contact acceptance; all required content supplied.

**Affected areas:** Tests/e2e; production/Storybook/build configuration; deployment documentation; feature/task completion evidence; existing game boundary reviewed but not expanded.

**Protected scope:** No game integration, public result/upgrade UI, gameplay tuning, new content catalogue, speculative engine work, or unauthorized publication.

#### FS-6.1 — Run the complete automated and architecture review

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites runs its focused checks first and supplies acceptance evidence for the UI work.

**Dimi:** Review the summarized blockers rather than becoming the routine command runner.

**Depends on:** `FS-4.8`, `FS-5.6`

**Work:** Run types, lint/format, unit/integration tests, production build, Storybook, accessibility and key-route E2E, and performance checks in the documented order. Verify flag-on/off paths and game regression coverage after shared changes. Independently review server-only secrets, import boundaries, unused code, and lifecycle cleanup.

**Complete when:** A release-candidate report identifies the exact build, commands, outcomes, and unverified areas. Automated checks are not called manual accessibility or real-device certification.

#### FS-6.2 — Complete the human acceptance matrix

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Dimi

**Counterpart:** Sites provides a short interaction checklist. Codex provides a reproducible candidate and records environment limitations.

**Dimi:** Test real phone and desktop, keyboard navigation, short/landscape screens, enlarged text, all themes, reduced motion, overlays, the actual form, and repeat visits.

**Depends on:** `FS-6.1`

**Work:** Record device/browser, build reference, action, expected result, actual result, and severity. Include Safari/WebKit coverage where available; simulated WebKit is not physical iPhone testing. Check that fixed controls, virtual keyboards, and the artwork never hide essential information.

**Complete when:** Every required manual criterion has evidence or a clearly recorded blocker. A vague "works on my phone" does not replace targeted checks for the risky paths.

#### FS-6.3 — Resolve bounded acceptance findings

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites owns UI/scene corrections; Codex owns infrastructure/shared-policy/server corrections. Fixes are separate, nonconcurrent tasks assigned back to the original owner.

**Dimi:** Prioritize experience issues and explicitly defer cosmetic enhancements that do not block the milestone.

**Depends on:** `FS-6.2`

**Work:** Triage blockers versus follow-up enhancements. Keep each correction scoped, update its test, and rerun affected checks. Do not use this cleanup phase for a framework upgrade or unrelated refactor. Codex coordinates the candidate after the correction handoffs.

**Complete when:** No unresolved acceptance blocker is hidden by a new test exemption. The candidate still satisfies the original scope and has a clean, reviewed intentional diff.

#### FS-6.4 — Prepare the deployable candidate and rollback plan

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites verifies final content/link presentation and actual metadata against the approved destination.

**Dimi:** Approve the preview/public target and enter environment secrets via the provider interface; authorize external configuration changes individually.

**Depends on:** `FS-6.3`

**Work:** Prepare repeatable installation/build steps, deployment-dependent URLs and identity, environment-variable documentation, and the required preview protections. Verify that the animation can fall back statically and a mail outage can fall back honestly to contact-by-email. Document rollback to the previous known-good build.

**Complete when:** The approved target has a reproducible candidate, no scaffold metadata or leaked secrets, and a tested/documented recovery path. Repository scripts match the intended deployment configuration.

#### FS-6.5 — Perform authorized preview or public rollout

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites performs the post-rollout UI smoke check. Dimi executes account-console steps that cannot be delegated safely or lack tool access.

**Dimi:** Authorize the specific rollout. Public launch remains optional; confirm domain/provider settings and check the deployed experience.

**Depends on:** `FS-6.4`

**Work:** Deploy only to the expressly approved target, or record public launch as deferred. Run deployed-route, static fallback, contact, and settings smoke checks appropriate to that target; obtain separate approval for any live email tests. Roll back if a release blocker appears.

**Complete when:** The authorized target is verified with evidence. No live deployment is claimed from a local build, and a deferred public launch is distinguished from an approved usable preview.

#### FS-6.6 — Close the portfolio milestone and prepare game EPIC 7

**Current status:** Not started in this portfolio milestone; no implementation or human acceptance inferred from existing foundations.

**Lead:** Codex

**Counterpart:** Sites documents shell, navigation, scene, and overlay interfaces relevant to future integration.

**Dimi:** Approve FS-G3 and authorize returning to game integration rather than adding more portfolio polish.

**Depends on:** `FS-6.5`

**Work:** Record the final revision and status in the authoritative feature plan. Check that Wave Survivor still builds/runs independently and that loader/theme/public lifecycle boundaries remain intact. Note /play/wave-survivor as future work and prevent homepage particles/global controls from being forced into the play layout. Preserve pending game-specific UI as EPIC 7 scope.

**Complete when:** A fresh agent can continue EPIC 7 from repository evidence: known base, available shell APIs, protected game behavior, passing checks, and explicit remaining work. No integration task is silently marked complete.

**Epic exit:** FS-G3: Dimi approves integration readiness based on actual evidence. Public launch is a separate explicit authorization and may be deferred without pretending it happened.

---

## Implementation handoff

- **Completed reference work:** The [Storybook color reference](../tasks/storybook-color-reference.md) presents the current palettes and semantic roles without changing tokens. Implementation and validation are complete; Dimi authorized documentation finalization, commit and push on 2026-09-16. FS-1.3 remains complete. FS-1.4 implementation and validation are now recorded separately.

- **Recommended first step:** read this plan, the accepted FS-1.1 contract and completed FS-1.2 task record; verify the current branch, HEAD and accessible diff before continuing. The FS-1.2 record identifies its accepted implementation patch on base `655f53857ebf55da57e928532e8c74b9990881cc`. Earlier SHAs are historical provenance, not reset targets.
- **Codex next action:** review the [implemented R3 correction](../tasks/fs-1.7-essential-component-acceptance.md#sites-r3-correction-and-review-handoff--2026-09-18) on `fbfea569`, including constrained/enlarged pending states, preserved 48px layout, the new real-component regression and recorded source-run dialog-touch failure/recheck. Earlier R1/R2 findings are resolved; implementation checks do not replace this review.
- **Sites handoff:** FS-1.3 is complete; implementation, source assets, native API examples, pending/focus policy, checks and manual/visual acceptance are recorded in the [Standard Button task](../tasks/fs-1.3-standard-button-family.md#final-dimi-acceptance-and-completion--2026-09-15).
- **FS-1.4 handoff:** implementation, full Figma matrix, icon-only Storybook samples, native behavior and validation are complete and manually/visually accepted; see the [Hexagonal Button task](../tasks/fs-1.4-hexagonal-button-family.md).
- **FS-1.5 handoff:** native fields, associations, controlled fixtures and status presentation are complete. Dimi reports manual/visual tests PASS and authorizes documentation finalization, commit and push; see the [final acceptance record](../tasks/fs-1.5-essential-form-primitives.md#final-manualvisual-acceptance-and-commit-authorization--2026-09-16). Codex compatibility review remains at FS-1.7.
- **FS-1.6 handoff:** complete and manually/visually accepted, with both triggers, secondary hexagonal Close, Escape, blue focus, focus fallback/override and owned scroll cleanup. Ninety-five Storybook browser tests and eight unfiltered application home/foundation tests passed. Sites owns returned fixes; Codex is the next owner at FS-1.7.
- **FS-1.7 handoff:** the accepted `fbfea569` baseline is followed by the R3 correction, which Dimi has authorized committing and pushing. The existing task record retains the EPIC 2 control/API/import inventory and approved substitutes; production APIs and architecture are unchanged. Codex reviews this five-file candidate; no page implementation starts here.
- **Dimi next action:** review the corrected constrained/enlarged Pending Paired Icons story and the preserved normal 48px arrow/ellipsis presentation. Actual device/browser versions and the [assistive-technology spot-check](../tasks/fs-1.7-essential-component-acceptance.md#dimi-phonedesktop-checklist--pending-for-this-candidate) outcome remain unspecified; earlier manual/visual acceptance is preserved for its original candidate.
- **Do not change:** accepted gameplay/public contracts, original assets, unrelated work, generated token outputs by hand, or later milestone scope. Current authorization includes the bounded R3 correction and its [requested commit/push](../tasks/fs-1.7-essential-component-acceptance.md#r3-commit-and-push-authorization--2026-09-18). No PR, merge, settings, deployment, branch deletion, live email or page implementation is authorized. Technical re-review and changed-presentation acceptance remain pending; FS-G1 remains a later gate.
- **Completion summary expected:** task ID, qualified revision and accessible diff, actual files, contract changes, checks/outcomes and limits, owned follow-ups, counterpart findings and Dimi's recorded acceptance.

Game continuation is the separate [Wave Survivor EPIC 7](wave-survivor-implementation-plan.md#epic-7--portfolio-play-shell-and-accessible-application-ui) after portfolio FS-6.6/FS-G3. `/play/wave-survivor` remains future integration work. Do not apply homepage particle/global-control or ordinary-scroll layout choices to the portrait game arena.
