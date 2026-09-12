> **Archived supplied source — not the current feature plan.** Added 2026-09-12 at Dimi's request. The [authoritative feature plan](../features/funkspace-minimum-usable.md) owns current scope/status and decisions. The text below preserves the supplied minimum-usable plan, with Markdown formatting normalized only. Its historical revisions, proposed choices and embedded instructions are reference material, not current facts or action authorization.
>
> Original file: `/Users/dimi/Downloads/FunkSpace_Minimum_Usable_Development_Plan.md`; original-byte SHA-256 `6475a13f4538c5d3a3dbfb88be3be971e0291ddca4db27a131185934bf4c8ae1`. This is not the separately requested `FunkSpace_EPIC_0_Detailed_Plan.md`.

# FunkSpace — Minimum Usable Experience

## Detailed development plan: epics, tasks, ownership, and acceptance

**Status:** Proposed execution plan derived from the approved scope; task-level choices still requiring approval are identified below.

**Prepared:** 2026-09-11

**Product owner and final acceptance:** Dimi

**Inspected baseline:** `feature/wave-survivor` at `b8128d5220a09a6f79117ace388d7ae1b54b7d68`; branch collection still reported this tip during planning.

**Proposed repository home:** `docs/features/funkspace-minimum-usable.md`

**Scope authority:** Dimi's supplied screenshots and approved three-section brief in this conversation. Repository documents establish existing implementation and constraints; recommendations here are future work, not claims of completed features.

**Implementation authorization:** None conferred by this document. No prompts are included.

## 1. Purpose and release boundary

Deliver an animation-led, mobile-first website with Start, About, and Contact/footer sections, normal scrolling, the existing FunkSpace logo and semantic design foundations, one customizable Canvas scene behind a replaceable SVG aperture, usable navigation/settings, real contact delivery, and completed secondary pages. End when the portfolio is ready to host game integration. Do not implement game integration in this milestone.

Proposed routes: `/`, `/about`, `/impressum`, `/privacy`. Preserve `/play/wave-survivor` as the following game milestone's route, not a link to an unfinished page.

In scope: the essential Standard/Hexagonal button matrix; your available icons and named temporary substitutes; shared form/dialog primitives; theme and motion controls; a deliberate static scene alternative; testing, documentation, and a deployable candidate.

Deferred: slide navigation, forced scroll snapping, up/down section controls, animation carousel/counter/dots, multiple particle scenes, animated/morphing masks, general visual editor, arbitrary SVG uploads, saved scene presets, CMS, account system, analytics, monetization, leaderboard, sitemap UI, large content catalogue, and unrelated architecture migration. An ordinary technical sitemap may be handled with metadata if justified; it is not a new content-navigation feature.

A verified preview can satisfy integration readiness. A public launch needs its own explicit approval; deferring it must not be mislabeled as a completed production deployment. Real provider-backed contact delivery remains part of the minimum usable experience, even when tested in an approved preview.

## 2. Responsibilities

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

## 3. Architecture and shared constraints

Preserve `Presentation → Application → Domain ← Infrastructure`. Pure rules/configuration validation belong in Domain; orchestration and preference policy in Application; Canvas, clocks, DOM, storage, and mail-provider effects in Infrastructure; page rendering/controls in Presentation. Construct cross-layer dependencies at the appropriate composition root. Static content does not need invented services or domain models.

Reuse ThemeService, existing Button/logo foundations, common pure motion where useful, and the public game boundary. One shared dialog has two current consumers (navigation and customization); one motion preference has two current consumers (logo and scene). Those are concrete reuse cases, not permission to build generic managers.

The particle scene owns a bounded runtime; it does not import Wave Survivor or place per-frame positions in React state. The new motion preference controls decorative presentation, not gameplay time. SVG aperture geometry remains independent of particle rules. Only trusted repository SVG assets are supported.

Use source tokens, regenerate CSS and TypeScript artifacts, and inspect effects across existing themes and the game. No unrelated palette/engine/framework migration is required. Existing debt touched by the requested integration can receive a narrow tested correction; unrelated debt stays recorded.

## 4. Execution order and gates

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

## 5. Epic and task breakdown

All task IDs below are new portfolio IDs. Dependencies indicate required inputs; they do not imply that prior game code should be modified. Each task also requires the relevant epic prerequisites. No task is complete merely because code was generated.

### EPIC 0 — Repository baseline, maintenance, and durable planning

**Goal:** Create a reproducible starting point and a recoverable plan without turning maintenance into a repository rewrite.

**Dependencies:** None. This epic starts from the inspected game-feature branch and current local working tree.

**Affected areas:** AGENTS.md; README.md; package manifests and lockfile; CI; docs/development/; docs/features/; docs/templates/.

**Protected scope:** Accepted game behavior, unrelated local changes, repository settings, and unreviewed dependency upgrades.

#### FS-0.1 — Inventory the real starting point

**Lead:** Codex

**Counterpart:** Sites identifies reusable visual components and consumes the inventory before implementing.

**Dimi:** Identify any unpushed work or local assets and confirm what must be preserved.

**Depends on:** None beyond epic prerequisites.

**Work:** Inspect AGENTS.md, relevant ADRs, code, tests, scripts, branches, and the working tree. Record the exact base revision, component reuse map, generated files, open defects, and protected areas. Compare branch ancestry rather than treating old branches as disposable.

**Complete when:** A baseline record names the inspected revision, existing implementations, missing features, protected work, and prioritized findings. No assumptions about local changes are presented as verified facts.

#### FS-0.2 — Reconcile tooling and run the baseline

**Lead:** Codex

**Counterpart:** Sites consumes the confirmed commands and does not change package versions independently.

**Dimi:** Approve any necessary package/service choice that changes scope or cost.

**Depends on:** `FS-0.1`

**Work:** Resolve the Node/pnpm/CI convention and required build order. Include frontend/features in Tailwind scanning. Run installed-package security/dependency review and make only justified, bounded fixes. Record the existing contrast-test suppression for atomic repair with the relevant colors in FS-1.2. Keep unrelated upgrades in a backlog.

**Complete when:** An exact command log distinguishes passes, failures, environmental blockers, and known baseline defects. Necessary tooling is reproducible; neither a blanket dependency upgrade nor a lowered test threshold is used as a shortcut.

#### FS-0.3 — Choose and prepare the branch integration path

**Lead:** Codex

**Counterpart:** Sites starts only from the recorded portfolio base and does not independently merge or delete branches.

**Dimi:** Approve specific pull-request, commit/push, merge, deletion, or repository-setting actions before execution.

**Depends on:** `FS-0.2`

**Work:** Prefer a reviewed merge of the accepted game baseline into main before starting the portfolio branch. If that merge is deferred, record a portfolio branch based on the validated game tip and the integration dependency. Review CI evidence and deployment consequences. Delete branches only after retained work and merge status are confirmed.

**Complete when:** The chosen base and integration strategy are recorded. Any authorized merge is validated. A documented unmerged-base strategy is a valid outcome; destructive cleanup is not required to pass the planning gate.

#### FS-0.4 — Publish one authoritative feature plan and update stale guidance

**Lead:** Codex

**Counterpart:** Sites supplies component and interaction decisions; it updates its own task completion records during implementation.

**Dimi:** Approve the release scope and any architecture decision; reject additions that do not serve this milestone.

**Depends on:** `FS-0.1`

**Work:** Place the approved plan at proposed docs/features/funkspace-minimum-usable.md using the existing feature template. Update the current full-screen-layout/home-motion guidance to reflect normal scrolling and the bounded Canvas scene. Reuse the existing AI workflow. Use task records for substantial work, not 44 empty documents created in advance.

**Complete when:** A fresh agent can identify scope, owners, dependencies, protected areas, and acceptance gates from the repository. Historical slide-navigation and game plans remain clearly distinguished from the current work.

#### FS-0.5 — Approve product, content, and operating assumptions

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

**Lead:** Dimi

**Counterpart:** Sites maps the screenshots into required component variants and records temporary substitutes. Codex checks export/build implications.

**Dimi:** Export available custom icons as clean SVG; identify editable design sources, essential variants, and approved substitutes for missing icons.

**Depends on:** `FS-0.5`

**Work:** Agree icon sizing/viewBox conventions, standard and hexagonal control sizes, filled/outlined and accent/neutral treatments, and interaction states. Keep default, hover, keyboard focus, pressed, selected, disabled, and loading conceptually distinct. Reuse the existing logo assets rather than redrawing them from screenshots.

**Complete when:** The minimal variant matrix, asset locations, missing-icon list, and replacement ownership are documented. Screenshots are design references, not claimed production vectors.

#### FS-1.2 — Reconcile required tokens and repair contrast evidence

**Lead:** Codex

**Counterpart:** Sites supplies needed visual pairings and verifies their component usage.

**Dimi:** Approve visible changes needed for readable colors while retaining the design identity.

**Depends on:** `FS-1.1`, `FS-0.2`

**Work:** Verify typography-source drift and align required sources with Work Sans and Space Grotesk. Expose needed spacing consistently. Fix concrete foreground/background/focus pairings across existing themes; add narrowly justified semantic roles only where required. Regenerate CSS/TypeScript artifacts and remove the 2.4:1 contrast suppression with its cause addressed.

**Complete when:** Token generation is reproducible, changed game-facing output is reviewed, and unfiltered accessibility checks cover the repaired state. No generated artifact is edited by hand and no unrelated token migration is required.

#### FS-1.3 — Extend the Standard Button family

**Lead:** Sites

**Counterpart:** Codex reviews shared API changes at the component gate rather than rewriting the component in parallel.

**Dimi:** Approve the selected size, icon spacing, and visual states in Storybook.

**Depends on:** `FS-1.2`

**Work:** Extend the existing Button with the approved treatments, size choices, leading/trailing icons, and required submitting/disabled states. Share styling with genuine navigation links without pretending that links are buttons. Preserve useful existing props and defaults.

**Complete when:** The agreed matrix renders, links navigate natively, buttons activate by keyboard, submitting does not shift layout unexpectedly, and focused component tests protect behavior.

#### FS-1.4 — Implement the Hexagonal Button family

**Lead:** Sites

**Counterpart:** Codex reviews semantics, focus treatment, and actual reuse of shared styling.

**Dimi:** Check thumb reach and confirm that the custom icon plus visible Menu label is understandable.

**Depends on:** `FS-1.2`, `FS-1.3`

**Work:** Build a focused hexagonal presentation with accessible names and selected/disabled treatments. Prefer a generous rectangular control area with the hexagon inside; retain a visible, unclipped focus indicator. Use a proposed 48-pixel mobile target rather than copying the smallest screenshot artwork as the hit area.

**Complete when:** Mouse, touch, keyboard, and focus states work without relying only on color. Decorative clipping does not hide focus or unnecessarily shrink the intended touch area.

#### FS-1.5 — Add essential form primitives

**Lead:** Sites

**Counterpart:** Codex reviews the later server-contract compatibility; no server validation is replaced by these components.

**Dimi:** Approve label wording and readability of errors and status text.

**Depends on:** `FS-1.2`

**Work:** Create or extend only the needed labeled input, textarea, field help/error, and status treatments. Support required indicators, autocomplete, email input, disabled/submitting state, and error associations. Use native semantics instead of placeholder-only labels.

**Complete when:** Storybook covers normal, invalid, disabled, and pending form presentation. Tests confirm accessible labels and error associations; no delivery backend is implied.

#### FS-1.6 — Build one shared dialog primitive

**Lead:** Sites

**Counterpart:** Codex reviews lifecycle/focus boundaries and existing utilities before any replacement abstraction is introduced.

**Dimi:** Test opening, closing, Escape, and the reachability of controls on the phone.

**Depends on:** `FS-1.3`, `FS-1.4`

**Work:** Use the existing suitable implementation if found; otherwise prefer a small native-dialog-based primitive. Define labeling, initial focus, close control, background inactivity, scroll handling, and focus restoration. Keep platform effects at the appropriate adapter boundary. Navigation and scene customization will reuse this primitive.

**Complete when:** Keyboard interaction and teardown are tested. Long dialog content scrolls, the background does not receive unintended input, and repeated open/close cycles leave no locked body or stale listener.

#### FS-1.7 — Review the complete essential component set

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

**Lead:** Sites

**Counterpart:** Codex reviews route boundaries and keeps future game imports out of the shell.

**Dimi:** Approve section order and labels: Start, About, Contact; plus About, Impressum, and Privacy pages.

**Depends on:** `FS-1.7`

**Work:** Use stable section IDs and one small typed destination definition. Implement or plan /, /about, /impressum, and the existing /privacy route. Use /#contact from secondary pages. Preserve ordinary links as the fallback; do not expose unimplemented Games/Experiments destinations.

**Complete when:** Every visible destination resolves to real content, URLs are coherent, and mobile/desktop navigation will consume the same data.

#### FS-2.2 — Build the static Start section and reuse the logo

**Lead:** Sites

**Counterpart:** Codex reviews existing logo integration, static fallback, and multiple-instance SVG identifiers.

**Dimi:** Approve the scene framing, short introduction, typography, and logo placement.

**Depends on:** `FS-2.1`

**Work:** Reuse the animated-logo component with a deliberate static state while motion policy is unavailable. Reserve one responsive scene area and a purposeful static preview that later scene work will enhance. Keep essential words as semantic HTML. Remove 01/03, dots, and previous/next animation controls.

**Complete when:** The opening section looks intentional without animation, has one clear page heading, and reserves stable space. Logo reuse does not cause duplicate-ID or hydration failures.

#### FS-2.3 — Build About preview and About page

**Lead:** Sites

**Counterpart:** Codex checks server/client boundaries and route behavior at the site gate.

**Dimi:** Provide and approve the short introduction and longer About copy; do not delegate factual biography invention.

**Depends on:** `FS-2.1`

**Work:** Adapt the wireframe to a naturally growing section with a descriptive More about FunkSpace link. Create a small complete /about page using the same shell and typography. Avoid forcing long content into a single viewport or an unnecessary nested scroller.

**Complete when:** Both pages use real approved copy, contain no lorem ipsum, and the preview link works with keyboard, direct loading, and browser navigation.

#### FS-2.4 — Build Contact/footer and legal-page structure

**Lead:** Sites

**Counterpart:** Codex flags configuration/privacy dependencies that must be finalized with the real mail provider in EPIC 5.

**Dimi:** Supply the public contact address and accurate operator/legal information, using appropriate review where needed.

**Depends on:** `FS-2.1`

**Work:** Create the Contact/footer section with a working email fallback and links to Impressum and Privacy. Establish readable legal-page layouts using supplied content. Reserve the future form location, but do not present a fake Send or fake success state. Provider-specific privacy wording remains explicitly pending until FS-5.5.

**Complete when:** Visitors can make contact and reach legal information. Missing legal input is recorded as a release blocker rather than replaced with fabricated text.

#### FS-2.5 — Complete responsive shell and ordinary scrolling

**Lead:** Sites

**Counterpart:** Codex reviews overflow, viewport, layering, and future play-route containment.

**Dimi:** Check the phone layout, larger screens, landscape/short screens, and enlarged text.

**Depends on:** `FS-2.2`, `FS-2.3`, `FS-2.4`

**Work:** Use one page shell rather than duplicating the wireframe header in every section. Make narrow and wide layouts deliberate; keep decorative corner marks hidden from assistive technology. Allow content-driven heights, safe-area spacing, and room for the later mobile menu trigger.

**Complete when:** There is no horizontal overflow, scroll hijacking, unreachable footer, or content covered by fixed controls at the agreed test sizes.

#### FS-2.6 — Finish semantic, metadata, and static-route behavior

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

**Lead:** Sites

**Counterpart:** Codex reviews the shared data/overlay contract.

**Dimi:** Approve hierarchy and wording, including a visible Menu clue beside the custom icon.

**Depends on:** `FS-2.6`, `FS-1.6`

**Work:** Use separate Navigation, Appearance, and Motion groups, with secondary legal links. Render website navigation as ordinary links, not an application command menu. Reuse the dialog primitive and shared destination data. Show no empty future destinations.

**Complete when:** Users can distinguish navigation from settings. All visible actions have meaningful labels and the layout remains readable with larger text.

#### FS-3.2 — Implement navigation lifecycle across mobile and desktop

**Lead:** Sites

**Counterpart:** Codex checks cleanup, focus destinations, and the bounded overlay state.

**Dimi:** Test the trigger with a thumb and check that it never obscures Contact or legal links.

**Depends on:** `FS-3.1`

**Work:** Add the mobile trigger and compact desktop navigation. On ordinary closure, return focus to the trigger; on navigation, close and focus the destination appropriately. Support Escape, Back/route changes, safe areas, and long panel content. Keep only one overlay open; customization joins the same small state later.

**Complete when:** No focus/scroll lock survives closure or route changes. Destination focus differs correctly from dismissal focus, and all navigation remains available outside the overlay fallback.

#### FS-3.3 — Connect appearance controls to ThemeService

**Lead:** Sites

**Counterpart:** Codex reviews subscriptions, existing initialization, and storage-error behavior.

**Dimi:** Approve the existing theme choices in the new controls and check an actual reload.

**Depends on:** `FS-3.1`

**Work:** Consume ThemeService through the established provider/hook boundary. Keep its selected/resolved theme contract and pre-hydration initialization. Add no component-local theme authority or direct scattered localStorage writes. Handle blocked storage and immediate theme changes.

**Complete when:** Controls, page, logo, and later scene receive consistent theme updates. Reload and system changes do not produce a second authority or a fatal storage error.

#### FS-3.4 — Implement the shared motion-preference and suspension policy

**Lead:** Codex

**Counterpart:** Sites consumes the approved API and supplies logo/scene needs; it does not maintain another persisted motion preference.

**Dimi:** Approve Follow system, Reduced, and Off semantics and the feature-flag interaction.

**Depends on:** `FS-0.5`, `FS-2.6`

**Work:** Build the smallest policy in the existing application/composition structure. Distinguish user preference, local Pause, feature-flag availability, document/scene visibility, and unresolved initialization. Do not start decorative motion before preferences are known. Reduced/Off keep a static particle scene; environmental resume cannot override explicit Pause.

**Complete when:** Unit/integration tests cover precedence, storage failure, preference changes, visibility changes, and cleanup. Exactly one preference authority serves the logo and scene; no game clock is coupled to it.

#### FS-3.5 — Wire motion settings and the existing logo

**Lead:** Sites

**Counterpart:** Codex checks that any necessary migration of touched logo infrastructure access stays narrow and tested.

**Dimi:** Test preferences and confirm a complete static logo when animation is unavailable.

**Depends on:** `FS-3.1`, `FS-3.4`

**Work:** Connect the settings UI to the motion policy and adapt the current logo consumer to it. Preserve the existing feature-flag gate and useful logo API. Animate one prominent instance rather than replaying every copy. Avoid an initial unwanted-motion flash.

**Complete when:** Changing a setting updates visible behavior without reload. Off/Reduced/flag-disabled paths remain complete and no missing or invisible logo is accepted as a fallback.

#### FS-3.6 — Validate the static site and control flows

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

**Lead:** Sites

**Counterpart:** Codex reviews the renderer plan, resource budget, and architecture decision before implementation.

**Dimi:** Provide an accessible reference clip/stills or describe the required motion. Approve trails/connections/pointer behavior explicitly rather than assuming the inaccessible video was inspected.

**Depends on:** `FS-3.6`, `FS-1.1`

**Work:** Specify one particle behavior, a centered circular aperture, density/speed/size controls, Pause, and Reset. Begin with a proposed DPR cap of 2 and a bounded count. Record device/viewport, frame-work and bundle targets before optimization; all numeric tuning remains a measured project decision.

**Complete when:** A visual acceptance description and testable resource limits exist. Unknown reference behavior is resolved or explicitly replaced by a Dimi-approved candidate; no matching-video claim is invented.

#### FS-4.2 — Implement pure particle state and update rules

**Lead:** Sites

**Counterpart:** Codex reviews deterministic boundaries and unnecessary reuse/extraction.

**Dimi:** Review a simple preview for the agreed behavior rather than choosing internal data structures.

**Depends on:** `FS-4.1`

**Work:** Keep movement/configuration rules in pure TypeScript with controlled randomness and bounded delta handling. Validate configuration and define deterministic resizing/bounds behavior where applicable. Use tests for equivalent scripted updates, limits, invalid values, and reset; keep positions out of React state.

**Complete when:** Rules run without DOM, Canvas, or uncontrolled clocks. Configuration remains bounded and tests protect the agreed behavior.

#### FS-4.3 — Implement Canvas rendering and lifecycle adapter

**Lead:** Sites

**Counterpart:** Codex reviews scheduling, initialization cancellation, browser resources, and exception cleanup.

**Dimi:** Check that scrolling and touch behavior remain normal around the scene.

**Depends on:** `FS-4.2`

**Work:** Own one active animation-frame chain for this scene, separate from game runtimes. Handle responsive size/DPR, drawing, pause/resume/reset/destroy, visibility suspension, unavailable Canvas, and mount/unmount races. Reuse the existing runtime vocabulary, not the game engine. Reserve initial geometry and provide a static render.

**Complete when:** Paused/hidden/destroyed scenes schedule no continuous frames; repeated mount/unmount does not multiply loops, observers, or listeners. Browser APIs remain at the infrastructure boundary.

#### FS-4.4 — Implement SVG overlay and prove asset replacement

**Lead:** Sites

**Counterpart:** Codex reviews mask semantics, SVG safety, identifiers, and sizing.

**Dimi:** Export a second trusted test aperture from Illustrator following the agreed asset guide and confirm that the workflow is practical.

**Depends on:** `FS-4.1`, `FS-4.3`

**Work:** Place a theme-colored SVG covering layer above Canvas and expose particles through a circle. Define one explicit luminance-mask convention, valid viewBox, scaling/centering, unique mask IDs, and non-intercepting decorative layers. Replace the circle with a trusted second shape without modifying particle rules. Document SVG export constraints.

**Complete when:** Two shapes work at narrow/wide aspect ratios and in all themes. Simulation code does not change when the aperture is replaced; IDs do not collide and malformed/missing assets have a deliberate fallback.

#### FS-4.5 — Integrate scene themes, motion policy, and local Pause

**Lead:** Sites

**Counterpart:** Codex verifies that preferences and local/environmental pause reasons remain separate.

**Dimi:** Test theme changes, OS reduced motion, settings, Pause, scrolling away/back, and background/foreground transitions.

**Depends on:** `FS-4.3`, `FS-4.4`, `FS-3.3`, `FS-3.4`

**Work:** Supply resolved semantic colors from the frontend boundary and subscribe through existing services. Keep simulation independent of visual theme. Add an obvious scene Pause control. Reuse the static preview when motion is disallowed; do not make Off or Reduced a blank hole.

**Complete when:** Theme changes redraw safely, explicit Pause survives environmental resume, reduced motion is respected before playback, and the feature-flag-disabled experience remains complete.

#### FS-4.6 — Add the contextual customization overlay

**Lead:** Sites

**Counterpart:** Codex reviews configuration validation and ensures no second overlay/settings system is added.

**Dimi:** Approve slider ranges, reset behavior, labels, and the live/static preview experience.

**Depends on:** `FS-4.5`, `FS-1.6`, `FS-3.2`

**Work:** Reuse the shared dialog for density, speed, size, and Reset. Keep values local to the scene and temporary. Apply configuration without destroying/recreating the runtime on each input. Under Reduced/Off/Pause, changes may redraw a static preview but never silently start continuous motion.

**Complete when:** Controls are keyboard-operable, constrained to safe ranges, visibly update the permitted preview, and do not conflict with the main menu. No arbitrary SVG/color upload or persisted preset editor is added.

#### FS-4.7 — Review performance, failure paths, and lifecycle

**Lead:** Codex

**Counterpart:** Sites owns targeted visual/runtime corrections identified by the review; it does not edit the same files concurrently.

**Dimi:** Provide observations from the nominated real phone and report heat, stutter, input delay, or discomfort.

**Depends on:** `FS-4.6`

**Work:** Measure against FS-4.1 budgets on representative conditions. Inspect flame/frame evidence and repeated route/visibility/pause sequences. Test missing assets, failed initialization, denied/blocked storage interactions, feature flag off, reduced motion, and absent Canvas. Fix bounded causes before proposing workers/WebGL or broad scheduling infrastructure.

**Complete when:** Measurements and limitations are recorded, resource counts remain bounded, controls stay responsive, and failure produces a usable static scene. Simulated browser evidence is not labeled real-device evidence.

#### FS-4.8 — Approve the signature experience

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

**Lead:** Codex

**Counterpart:** Sites provides form-state requirements and consumes the typed request/result contract.

**Dimi:** Select the host/mail provider, create required accounts, approve cost/data processing, and configure secrets securely. Approve any DNS or provider-side changes before execution.

**Depends on:** `FS-0.5`, `FS-1.5`, `FS-2.4`

**Work:** Propose one server-handled path within the existing Next.js deployment. Define name/email/message inputs, required fields (proposed: email/message), limits, accepted/error/rate-limited outcomes, timeout behavior, and user-facing wording. Choose one transport, not both route handlers and server actions. Document the server-only composition and provider boundary.

**Complete when:** The approved contract supports UI work with a fake adapter while real-provider configuration proceeds. Missing credentials are a visible delivery blocker, not a reason to simulate successful sending.

#### FS-5.2 — Implement validation, contact use case, and mail adapter

**Lead:** Codex

**Counterpart:** Sites implements only the presentation side against the public contract.

**Dimi:** Confirm the intended recipient, sender identity, and actual field requirements.

**Depends on:** `FS-5.1`

**Work:** Implement server-side validation, bounded payload/field lengths, fixed recipient/sender configuration, safe reply-address handling, timeouts, and explicit provider failures. Keep pure rules separate from the network adapter and HTTP mapping. Keep the provider credential server-only and use a test double in ordinary automated tests.

**Complete when:** Valid requests reach the fake/approved adapter, invalid requests do not, headers cannot be injected, and a success response means provider acceptance rather than guaranteed inbox delivery. Tests cover all declared outcomes.

#### FS-5.3 — Add abuse controls and privacy-conscious operations

**Lead:** Codex

**Counterpart:** Sites maps rate limits and errors into understandable UI without exposing infrastructure details.

**Dimi:** Approve provider/platform choices and the retention/data-processing implications of abuse protection.

**Depends on:** `FS-5.2`

**Work:** Apply server/platform request limits, suitable rate limiting, origin protections, and a lightweight spam strategy. Do not rely on per-process memory as the sole production limit across multiple instances. Minimize logging and avoid message bodies or secrets. Keep CAPTCHA and extra infrastructure out unless measured abuse or host constraints justify them.

**Complete when:** Abusive/oversized requests are rejected predictably, limits work in the selected deployment model, and diagnostics do not unnecessarily retain contact content. Security review records assumptions and residual limits.

#### FS-5.4 — Implement the live contact-form interface

**Lead:** Sites

**Counterpart:** Codex verifies contract usage, validation parity, and that tests do not send mail unintentionally.

**Dimi:** Approve field/help/status wording and test it with the phone keyboard.

**Depends on:** `FS-5.1`, `FS-1.5`, `FS-2.4`

**Work:** Build idle, invalid, pending, accepted, rate-limited, timeout, and failure states against the contract. Preserve user input on failure, prevent repeated pending submissions, associate errors with fields, announce status, and retain the email fallback. Wire the real endpoint only after the server tasks are validated.

**Complete when:** Component tests cover all states with controlled responses. Production never reports success from a timer or mock, and the form remains usable with narrow/short viewports and accessible error feedback.

#### FS-5.5 — Finalize legal content and the contact operating guide

**Lead:** Dimi

**Counterpart:** Sites publishes approved copy in the existing page structure. Codex supplies the actual data flow, provider configuration, logging, failure, and rollback facts.

**Dimi:** Supply and verify actual operator/privacy information and obtain appropriate advice where needed; approve the stated purpose, retention, recipients, and legal basis.

**Depends on:** `FS-5.1`, `FS-5.3`, `FS-2.4`

**Work:** Finalize Impressum and Privacy for the real deployment and contact flow; do not invent operator details or insert a compulsory consent checkbox without a justified decision. Document environment-variable names without values, sender/recipient setup, no-body logging, failure diagnosis, and safe form-disable/email-fallback operation.

**Complete when:** Published information matches the actual technical flow and contains no placeholders. An operator can diagnose delivery failure without exposing secrets or changing the UI to claim false success.

#### FS-5.6 — Verify end-to-end delivery and failure recovery

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

**Lead:** Codex

**Counterpart:** Sites runs its focused checks first and supplies acceptance evidence for the UI work.

**Dimi:** Review the summarized blockers rather than becoming the routine command runner.

**Depends on:** `FS-4.8`, `FS-5.6`

**Work:** Run types, lint/format, unit/integration tests, production build, Storybook, accessibility and key-route E2E, and performance checks in the documented order. Verify flag-on/off paths and game regression coverage after shared changes. Independently review server-only secrets, import boundaries, unused code, and lifecycle cleanup.

**Complete when:** A release-candidate report identifies the exact build, commands, outcomes, and unverified areas. Automated checks are not called manual accessibility or real-device certification.

#### FS-6.2 — Complete the human acceptance matrix

**Lead:** Dimi

**Counterpart:** Sites provides a short interaction checklist. Codex provides a reproducible candidate and records environment limitations.

**Dimi:** Test real phone and desktop, keyboard navigation, short/landscape screens, enlarged text, all themes, reduced motion, overlays, the actual form, and repeat visits.

**Depends on:** `FS-6.1`

**Work:** Record device/browser, build reference, action, expected result, actual result, and severity. Include Safari/WebKit coverage where available; simulated WebKit is not physical iPhone testing. Check that fixed controls, virtual keyboards, and the artwork never hide essential information.

**Complete when:** Every required manual criterion has evidence or a clearly recorded blocker. A vague "works on my phone" does not replace targeted checks for the risky paths.

#### FS-6.3 — Resolve bounded acceptance findings

**Lead:** Codex

**Counterpart:** Sites owns UI/scene corrections; Codex owns infrastructure/shared-policy/server corrections. Fixes are separate, nonconcurrent tasks assigned back to the original owner.

**Dimi:** Prioritize experience issues and explicitly defer cosmetic enhancements that do not block the milestone.

**Depends on:** `FS-6.2`

**Work:** Triage blockers versus follow-up enhancements. Keep each correction scoped, update its test, and rerun affected checks. Do not use this cleanup phase for a framework upgrade or unrelated refactor. Codex coordinates the candidate after the correction handoffs.

**Complete when:** No unresolved acceptance blocker is hidden by a new test exemption. The candidate still satisfies the original scope and has a clean, reviewed intentional diff.

#### FS-6.4 — Prepare the deployable candidate and rollback plan

**Lead:** Codex

**Counterpart:** Sites verifies final content/link presentation and actual metadata against the approved destination.

**Dimi:** Approve the preview/public target and enter environment secrets via the provider interface; authorize external configuration changes individually.

**Depends on:** `FS-6.3`

**Work:** Prepare repeatable installation/build steps, deployment-dependent URLs and identity, environment-variable documentation, and the required preview protections. Verify that the animation can fall back statically and a mail outage can fall back honestly to contact-by-email. Document rollback to the previous known-good build.

**Complete when:** The approved target has a reproducible candidate, no scaffold metadata or leaked secrets, and a tested/documented recovery path. Repository scripts match the intended deployment configuration.

#### FS-6.5 — Perform authorized preview or public rollout

**Lead:** Codex

**Counterpart:** Sites performs the post-rollout UI smoke check. Dimi executes account-console steps that cannot be delegated safely or lack tool access.

**Dimi:** Authorize the specific rollout. Public launch remains optional; confirm domain/provider settings and check the deployed experience.

**Depends on:** `FS-6.4`

**Work:** Deploy only to the expressly approved target, or record public launch as deferred. Run deployed-route, static fallback, contact, and settings smoke checks appropriate to that target; obtain separate approval for any live email tests. Roll back if a release blocker appears.

**Complete when:** The authorized target is verified with evidence. No live deployment is claimed from a local build, and a deferred public launch is distinguished from an approved usable preview.

#### FS-6.6 — Close the portfolio milestone and prepare game EPIC 7

**Lead:** Codex

**Counterpart:** Sites documents shell, navigation, scene, and overlay interfaces relevant to future integration.

**Dimi:** Approve FS-G3 and authorize returning to game integration rather than adding more portfolio polish.

**Depends on:** `FS-6.5`

**Work:** Record the final revision and status in the authoritative feature plan. Check that Wave Survivor still builds/runs independently and that loader/theme/public lifecycle boundaries remain intact. Note /play/wave-survivor as future work and prevent homepage particles/global controls from being forced into the play layout. Preserve pending game-specific UI as EPIC 7 scope.

**Complete when:** A fresh agent can continue EPIC 7 from repository evidence: known base, available shell APIs, protected game behavior, passing checks, and explicit remaining work. No integration task is silently marked complete.

**Epic exit:** FS-G3: Dimi approves integration readiness based on actual evidence. Public launch is a separate explicit authorization and may be deferred without pretending it happened.

---

## 6. Common definition of done and validation

For every implementation task, the lead must meet the task outcome, preserve protected behavior, add proportionate tests, review the diff and cleanup, and record exact evidence. Code checks normally include focused type/lint/tests; docs-only tasks need content, link, formatting, and diff review instead. Storybook is not a substitute for page-level tests. Automated checks are not a substitute for Dimi's phone review.

For the final candidate, Codex verifies the current scripts and prerequisite build order before execution. The inspected scripts support this planned command set; maintenance may change a command only with the updated documentation and evidence recorded:

```bash
pnpm build:tokens
pnpm -F @funkspace/common typecheck
pnpm -F @funkspace/wave-survivor build
pnpm -F frontend exec tsc --noEmit
pnpm lint
pnpm test
pnpm coverage
pnpm storybook:build
pnpm build
pnpm e2e
pnpm lhci:off
pnpm lhci:on

# Standalone game regression guard after shared changes:
pnpm -F @funkspace/wave-survivor typecheck
pnpm -F @funkspace/wave-survivor test
pnpm -F @funkspace/wave-survivor demo:build
```

Add focused game-demo E2E and any required WebKit project through the inspected existing configurations; do not assume the current default E2E invocation tests every browser or the standalone game. Verify that the flag-on measurement actually builds the intended enabled variant. Install/configure required browsers deliberately; unavailability is reported, not bypassed.

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

## 7. Pending decisions and latest-needed points

| Input or decision                                                             | Owner                               | Needed before                                       | Safe progress while pending                          |
| ----------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| Original icon SVGs, approved missing-icon substitutes, minimal control matrix | Dimi with Sites                     | FS-1.3/1.4 visual finalization                      | Token checks and component contract work             |
| Exact particle reference behavior                                             | Dimi with Sites                     | FS-4.2                                              | Static site and scene architecture planning          |
| Second Illustrator aperture                                                   | Dimi                                | FS-4.4 acceptance                                   | Circle proof and SVG export guide                    |
| Initial language, About text, public contact details                          | Dimi                                | FS-2.3/2.4 completion                               | Layouts with explicitly temporary development copy   |
| Actual legal/operator/privacy information                                     | Dimi; agents supply technical facts | FS-5.5 and public release                           | Page structure, not claims of legal completeness     |
| Host/mail provider, recipient, secure secrets/configuration                   | Dimi; Codex proposes integration    | FS-5.2 live adapter verification and FS-5.6         | Mocked contract/UI tests                             |
| Runtime/service and network-boundary approvals                                | Dimi after Codex review             | FS-3.4 and FS-5.2; scene architecture before FS-4.2 | Bounded proposals and static UI                      |
| Merge/deletion/PR/deploy/send authorization                                   | Dimi                                | Each specified external action                      | Local read-only review and documented candidate work |
| Representative phone and browser coverage                                     | Dimi with Codex                     | FS-4.7 and FS-6.2                                   | Automated checks marked with their real environment  |

## 8. Planning validation and limitations

This artifact was created during a planning task. No source repository files were changed; no commands above were executed against the application; no branch was merged/deleted; no mail was sent; no deployment occurred. The live branch collection, existing AI workflow/templates, and validation scripts were read again. Earlier code findings refer to the same inspected baseline. This is not a fresh build, accessibility, performance, or security certification.

All 44 task IDs have one assigned lead, explicit Dimi responsibilities, counterpart involvement, dependencies, a scoped deliverable, and an acceptance condition. The task graph is checked for missing references and cycles during artifact creation. No tool prompts are included.

## 9. Repository sources and design inputs

Primary design/scope inputs are Dimi's six supplied screenshots and explicit approved brief. Their screenshots are available in this conversation; the original editable design assets still require the owner handoff. The linked YouTube video was not successfully inspected in the preceding audit, so this plan intentionally leaves visual confirmation in FS-4.1.

The existing repository files below are pinned to the inspected revision. They support baseline/workflow facts, not claims that the proposed implementation already exists. Historical game planning is kept separate; the attached `Plan EPIC 6 Tasks.txt` informs continuity of task/gate structure only.

- [AGENTS.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/AGENTS.md) — AI operating guide and architecture constraints.
- [docs/development/ai-workflow.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/docs/development/ai-workflow.md) — Existing Sites/Codex workflow and authorization rules.
- [docs/templates/feature-plan.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/docs/templates/feature-plan.md) — Feature-plan structure.
- [docs/templates/task.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/docs/templates/task.md) — Task evidence and completion structure.
- [package.json](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/package.json) — Workspace validation scripts.
- [games/wave-survivor/package.json](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/games/wave-survivor/package.json) — Standalone game validation scripts.
- [frontend/components/Controls/Button.tsx](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/frontend/components/Controls/Button.tsx) — Existing Standard Button foundation.
- [frontend/components/Logo/LogoMotion.tsx](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/frontend/components/Logo/LogoMotion.tsx) — Existing animated-logo implementation.
- [frontend/app/sandbox/particles/page.tsx](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/frontend/app/sandbox/particles/page.tsx) — Particle sandbox is placeholder work.
- [frontend/tailwind.config.ts](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/frontend/tailwind.config.ts) — Typography bindings and content scanning.
- [frontend/hooks/useReducedMotion.ts](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/frontend/hooks/useReducedMotion.ts) — Current OS-preference hook.
- [frontend/application/animations/AnimationService.ts](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/frontend/application/animations/AnimationService.ts) — Current animation-service scope.
- [docs/architecture/design-tokens.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/docs/architecture/design-tokens.md) — Documented token hierarchy/current drift.
- [e2e/home.a11y.spec.ts](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/e2e/home.a11y.spec.ts) — Existing contrast suppression to repair.
- [.github/workflows/ci.yml](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/.github/workflows/ci.yml) — CI triggers and toolchain.
- [docs/features/full_screen_animate_layout.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/docs/features/full_screen_animate_layout.md) — Earlier Storybook-focused full-screen plan.
- [docs/features/home-animations.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/docs/features/home-animations.md) — Existing progressive-motion spec.
- [docs/motion.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/docs/motion.md) — Shared motion boundary and feature flag.
- [frontend/features/games/GameHost.tsx](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/frontend/features/games/GameHost.tsx) — Existing portfolio/game integration boundary.
- [docs/features/wave-survivor-implementation-plan.md](https://github.com/DitmarF/funkspace-app/blob/b8128d5220a09a6f79117ace388d7ae1b54b7d68/docs/features/wave-survivor-implementation-plan.md) — Separate game roadmap; EPIC 7 follows this milestone.
