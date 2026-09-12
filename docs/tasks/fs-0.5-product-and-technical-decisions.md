# Task FS-0.5 — Product answers, technical options and decision register

## Task metadata

- **Status:** Decision preparation complete; later approvals/input remain pending in the linked register. This does not close the FS-0.4 source blocker or authorize implementation.
- **Task group or epic:** Minimum Usable Experience, EPIC 0.
- **Owner:** Dimi, lead/approver. Codex is technical counterpart and designated documentation writer; Sites supplies the design/content checklist and later consumer reviews.
- **Last updated:** 2026-09-12.
- **Related documentation:** [Feature plan and canonical decision register](../features/funkspace-minimum-usable.md#pending-decisions-and-latest-needed-points), [FS-0.4](fs-0.4-authoritative-feature-plan.md), [baseline](fs-0.1-inventory-real-starting-point.md), [tooling evidence](fs-0.2-tooling-baseline.md), [branch decision](fs-0.3-branch-integration-decision.md), [AGENTS](../../AGENTS.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md).

## Requested outcome

Consolidate the Sites checklist, actual Dimi answers and the smallest remaining technical proposals in the existing authoritative decision register. Distinguish settled scope, provisional defaults and pending decisions; assign owners, latest-needed tasks and safe independent work. Prepare decisions only.

### Acceptance criteria from the request

- [x] Actual language/routes/target/device answers incorporated without inventing other approvals.
- [x] Hosting, contact/provider, semantic theme/motion, trusted SVG and scene boundaries grounded in inspected code and dated evidence.
- [x] Required Codex/Sites/Dimi approval sequence recorded before FS-3.4, FS-4.2 and FS-5.2 implementation.
- [x] One eight-field register retains answered, provisional and owned pending items, including configuration and authorized live delivery.
- [x] FS-G0 decisions distinguished from later approvals; real preview contact delivery and accurate legal/operator inputs retained.
- [x] Documentation references, preserved task contracts, formatting and final diff validated; application checks explicitly NOT RUN.

## Context and repository evidence

Local inspection used `/Users/dimi/Projects/funkspace-app`, branch `feature/funkspace-minimum-usable`, full HEAD and cached upstream `65eefa1db2656e78b169882414dfedb4715aa408`. It was clean, including index/untracked state, before these two documentation edits. No remote fetch or live project/settings inspection was performed. Current provider configuration must not be inferred from cached refs or dated deployment logs.

This session's working directory is the separate ChatGPT project mirror `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083`. Its synced sources are read-only. The protected clone beneath it remains at `63d117358d67137cebff744a29fa3a9a49d82415`, with three untracked files under `games/wave-survivor/src/domain/combat/`: `BasicAttackDefinition.ts`, `BasicAttackDefinition.test.ts`, `index.ts`. Fingerprints, status and refs were compared before/after. Other Dimi-only work/assets remain unconfirmed, not disposable.

The feature plan remains a qualified draft. The complete minimum-usable source and its recorded digest are available; the detailed EPIC 0 source is still not accessible locally. Dimi said it would be added later. That blocks unsupported FS-0.4 publication, not this bounded preparation from accessible evidence. The [FS-0.3 record](fs-0.3-branch-integration-decision.md) establishes option A and the actual validated portfolio base `9f3f01d8e2745408a8523c07198aec0e73eed52b`; this task's input includes subsequent documentation commits. Older application/CI validation is not a newly executed FS-0.5 check.

### Recorded product answers

The Sites FS-0.5 checklist and these subsequent Dimi answers are supplied in this task's conversation, not a separately verified Sites file or new visual review. The register consolidates that input; no shared files were assigned to a concurrent writer.

1. Dimi: “English first, maby we will add German and other languages later”. English is selected. Possible later languages do not add localization implementation now.
2. Dimi: “yes the routs are suitable.” The preceding checklist names `/`, `/about`, `/impressum`, `/privacy`. Those routes are confirmed; unfinished game navigation remains excluded.
3. Dimi: “a separately authorized public release.” This selects the completed portfolio target; it does not authorize a deployment, new settings or live email. A verified preview may establish readiness and still needs real contact delivery.
4. Dimi: “Mobile device, Sony Expiria XQ-CC54 Android 14. Mac book pro, browser Safari, Chrom, Firefox.” The register normalizes spelling to Sony Xperia and Chrome. No mobile browser, macOS/browser versions, physical test result or visual acceptance was supplied.

Start/About/Contact-footer, normal scrolling, one scene/static alternative and the separate game roadmap are existing requested milestone scope. This record does not fabricate a new approval of specific visuals, button variants, numeric budgets, motion semantics or a mail provider. The original FS-0.5 task's English-default wording is preserved as source provenance; the current answer in the register supersedes that default.

### Inspected implementation boundaries

| Actual path/evidence                                                                                                                                                                                                                                       | Current fact                                                                                                          | Consequence for the proposal                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [Frontend manifest](../../frontend/package.json), [README](../../README.md), [FS-0.3](fs-0.3-branch-integration-decision.md)                                                                                                                               | Next 15.5.23 App Router and existing Vercel deployment evidence                                                       | Reuse existing deployment; do not create a second backend service              |
| [Backend stub](../../backend/README.md), [app routes](../../frontend/app/)                                                                                                                                                                                 | Backend README stub; no contact route/provider implementation found in inspected frontend                             | `/api/contact` and its implementation paths remain proposed                    |
| [ThemeService](../../frontend/application/theme/ThemeService.ts), [ServiceProvider](../../frontend/application/providers/ServiceProvider.tsx), [createServices](../../frontend/infrastructure/services/createServices.ts)                                  | Theme/scroll/animation services composed for browser clients                                                          | Keep theme authority; mail must not enter the client provider                  |
| [AnimationService](../../frontend/application/animations/AnimationService.ts), [reduced-motion hook](../../frontend/hooks/useReducedMotion.ts), [CSS helpers](../../frontend/utils/motion.ts), [common lifecycle](../../common/motion/AnimationRuntime.ts) | Existing orchestrator access, OS preference hook and pure lifecycle vocabulary; no shared persisted decorative policy | Reuse primitives; implement only the reviewed missing policy later             |
| [Game theme adapter](../../frontend/features/games/theme/FunkSpaceGameThemeAdapter.ts), [ADR-003](../decisions/ADR-003-interactive-experience-boundary.md), [ADR-004](../decisions/ADR-004-game-development-architecture.md)                               | Resolved immutable semantic game theme; isolated runtime/public API                                                   | Reuse the boundary pattern, not game-specific objects or engine internals      |
| [LogoMotion](../../frontend/components/Logo/LogoMotion.tsx), [legacy logo exports](../../frontend/data/animations/logo.ts), [original SVG](../../frontend/public/svg/fs/FunSpace_logo.svg)                                                                 | Existing geometry/orchestrator; ineffective `pathCount` and throwing compatibility stubs                              | Preserve original vectors; retain baseline corrections at their assigned tasks |
| [Particle sandbox](../../frontend/app/sandbox/particles/page.tsx)                                                                                                                                                                                          | Isolated placeholder, not an integrated Canvas runtime                                                                | No claimed production renderer or frame-rate evidence                          |
| [Token ADR](../decisions/ADR-002-design-token-source-of-truth.md), [tokens](../../tokens/), [generated CSS](../../styles/tokens.css), [generated TS](../../common/generated/)                                                                              | Source/generated separation                                                                                           | Source repair and contrast suppression removal remain together in FS-1.2       |

## Technical proposals and tradeoffs

### Hosting and preview

Recommend retaining the existing Vercel/Next deployment. FS-0.3 records project `funkspace-app-frontend`, frontend root with outside-root workspace sources enabled, Node 22.x, install `pnpm install --frozen-lockfile`, build `pnpm --workspace-root build`, and production branch `main`. FS-0.2 owns the local Node 22.22.0/pnpm 10.30.3 prerequisites and tokens → common typecheck → game build → Next build order. Those are dated project evidence, not a fresh live-settings check or new permission to push to an auto-deploying branch.

Keeping that setup avoids a migration and another operational surface. A different host is only worth evaluating if Dimi's actual account, cost or runtime constraints rule out the existing one. No plan upgrade is selected. Recheck the particular preview URL, reviewer access, environment scope and server behavior before using it for acceptance. Preview does not imply private access. Vercel documents separate Preview/Production variable scopes and configurable protection with plan-dependent methods. Account entitlement, current protection, runtime limits and pricing for Dimi's project remain unverified. [Environment scopes](https://vercel.com/docs/environment-variables), [deployment protection](https://vercel.com/docs/deployment-protection), accessed 2026-09-12.

The public portfolio release target is settled; the exact reviewed revision, target and action authorization belong to FS-6.4/6.5. Preview contact verification still requires real configuration, authorized sending and confirmed recipient receipt. No existing production game-baseline approval is reused as portfolio launch permission.

### One contact path and provider boundary

**Provisional Codex recommendation for FS-5.1:** one `POST /api/contact`, with proposed route `frontend/app/api/contact/route.ts`, pure validation, one application use case and a narrow mail-provider port implemented by a server-only adapter. The route delegates through a server composition boundary; it must not construct adapters inside UI components or expose secrets through the existing client ServiceProvider. Exact new module names and composition placement require the FS-5.1 architecture review; none exists by virtue of this proposal.

Next's version-15 documentation supports `route.ts` handlers and POST using Request/Response. This supports the approach in principle, not exact deployed-provider compatibility or an upgrade from the locked version. [Official Next.js route-handler documentation](https://nextjs.org/docs/15/app/getting-started/route-handlers-and-middleware), accessed 2026-09-12.

An explicit HTTP endpoint provides a small consumer/error contract that Sites can exercise with fakes. A Server Action could provide tighter framework-managed form integration, but implementing both would duplicate the contact path. A separate backend would add deployment/configuration without an evidenced need. Recommend the single route already proposed by the source plan; Dimi approves only after Codex's concrete proposal and Sites' consumer contract at FS-5.1, before FS-5.2.

Keep the provider replaceable behind one port, without a generic messaging platform. Dimi's provider/account, verified sender, recipient and acceptable operating constraints are missing. Evaluate the smallest compatible provider at FS-5.1 against current authoritative API/SMTP support, account restrictions, quotas/cost, deployment runtime, delivery diagnostics and actual processing terms; no vendor or paid service is chosen here. Prefer an existing suitable account if one is supplied. HTTP versus SMTP compatibility and pricing are unverified until a specific option is evaluated.

The later contract must agree fields, size/time limits, validation/errors and honest success semantics. Fixed server-side sender/recipient and validated reply details must not let browser input choose arbitrary destinations or mail headers. Keep message bodies and secret values out of routine logs. FS-5.3 must establish abuse controls that work in the chosen deployment model, without assuming a process-local counter is a distributed limit. These are acceptance requirements, not implemented security controls.

Routine tests use a fake adapter. Actual provider configuration and separately authorized live delivery are required before live adapter verification and FS-5.6 can pass. Provider acceptance is distinct from inbox receipt; Dimi confirms receipt. Secrets go through the intended secure local/host/provider configuration mechanism, never this register or chat. Document variable names without values in the implementation/operating guide. Final legal/operator content must reflect the real host/provider/data flow at FS-5.5 and before public release. A mock form or email link alone does not complete real delivery, including preview acceptance.

### Semantic theme and motion reuse

Keep ThemeService as the sole theme authority and generate semantic output from existing source tokens. Adapt resolved semantic values at the frontend scene boundary, following the existing game adapter's separation without importing game internals. Reuse AnimationOrchestrator, CSS motion helpers and useful pure common motion. No parallel theme manager, manifest builder or token source is proposed. Preserve the owned ThemeService storage-consistency correction and logo static-reset work at FS-3.3 and FS-2.2/3.5 respectively; this task fixes neither.

**Provisional Codex policy proposal:** one application-level decorative preference for logo and scene, integrated through existing composition conventions. Retain the source's Follow System / Reduced / Off choices. While preference initialization is unresolved, present static content; Reduced and Off keep a deliberate static alternative. Combine the existing animation flag, OS preference and user choice explicitly. Keep scene-local Pause separate from environmental suspension; visibility/flag changes must not silently clear a user's Pause. If persistence fails, maintain coherent in-memory selection and notifications rather than repeatedly reading stale storage.

Sharing one policy avoids logo/scene disagreement. Static Reduced is simpler and more predictable than inventing a second animated mode, at the cost of less decorative motion. The exact truth table, initialization, storage behavior and labels remain a concrete FS-3.4 proposal, with Sites consumer review and **Dimi approval before implementation**. The current OS hook starts false and updates after mount; it is not evidence that this conservative policy exists. No decorative preference controls gameplay time or replaces game lifecycle ownership.

### Trusted SVG and control inputs

Reuse the original logo and existing Button before selecting additions. Custom icon SVGs/editable sources and substitutes remain Dimi inputs; scaffold icons are not an approved branded icon set. Sites proposes the minimal Standard/Hexagonal state matrix at FS-1.1, with named missing-icon substitutes and Dimi acceptance before FS-1.3/1.4 visual finalization. The source's 48-pixel target is still provisional. Do not settle detailed component variants here.

For the scene, retain trusted repository SVG only. Recommend retaining editable originals alongside reviewed exports with stable geometry/viewBox, scoped IDs and no scripts, event handlers or unexpected external references. Define mask/clip/export conventions and decorative pointer behavior in FS-4.4, preserving the logo's existing target IDs. Trusted review avoids building an arbitrary-upload sanitization service; replacing an aperture still needs an actual valid vector and measured consumer behavior. Screenshots/video do not prove SVG availability. Dimi supplies the second trusted aperture for FS-4.4 replacement acceptance; a circle proof/export guide can proceed within its task gates meanwhile.

### Scene renderer boundary

The source chooses one bounded Canvas scene; its concrete renderer design still needs **Sites' FS-4.1 proposal, Codex review and Dimi approval before FS-4.2 implementation**. Codex's recommendation for that review is pure bounded scene/configuration rules, one Canvas 2D infrastructure adapter and the existing `AnimationRuntime` vocabulary (`update`, `pause`, `resume`, `reset`, `destroy`). React owns controls and discrete state, not per-frame particle positions. Theme values and motion policy enter through frontend-owned boundaries; visibility, clock, Canvas and cleanup remain adapter effects.

Canvas fits the requested particle surface without a DOM node per particle, but pixel workload, DPR and fallback need measurement. SVG remains useful for the trusted aperture and static presentation; no general engine, worker or WebGL renderer is justified by the placeholder. Preserve ADR-003's evidence requirement: FS-4.1 must record the reference behavior, workload/device/bundle/frame budgets and why the bounded Canvas choice fits. DPR cap 2 and numeric particle tuning are proposals, not approved budgets or measured performance. One scene, temporary density/speed/size controls, Pause/Reset and complete static fallback remain the scope. There is no carousel, editor or game-runtime reuse.

## Scope and planned changes

Expand the existing feature-plan decision table in place and add this substantial task record using the existing template. No parallel register or speculative ADR is needed. All code, assets, tokens/generated output, configuration, dependencies, refs/index, gameplay and protected clone files stay outside this task's edits. No external mutation or sending is authorized.

| Path                                                    | Inspected status                   | Change and boundary                                                                                                      |
| ------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Feature plan](../features/funkspace-minimum-usable.md) | Existing                           | Expand its existing register, record actual answers, update FS-0.5 status and current handoff; preserve all 44 contracts |
| This task record                                        | Proposed before editing; now added | Own rationale, inspection, checks and handoff; link register rather than duplicate decision status                       |

Implementation sequence: inspect instructions/evidence and actual answers; draft narrow technical recommendations; consolidate the existing register; validate references, contracts and protected diff. No application implementation step is included.

### Assumptions, dependencies and risks

The accessible FS-0.4 draft is sufficient for bounded decision preparation, not unsupported final publication. Recorded FS-G0 approval is retained; missing detailed source and preservation disclosures remain owned inputs. Later choices may proceed incrementally at the register's deadlines. Selecting scope never grants permission for future implementation or external actions automatically. Particular earlier commit/push/settings approvals are not reused for this task.

The main risks are confusing proposals with approvals, claiming placeholder integration, inferring private preview/provider capability, or inventing assets/legal facts. The register distinguishes each state; current code and dated artifacts establish implemented facts. Dimi owns missing facts and approvals; Codex owns reconciliation. FS-0.2 security findings and FS-1.2 contrast/typography work stay at their recorded owners. No clean security report, new suppression, dependency upgrade or legal approval is implied.

## Validation and completion record

- **PASS — content/graph:** all 44 task titles and Lead/Counterpart/Dimi/Depends on/Work/Complete when fields match the complete minimum-usable source after whitespace normalization; dependency references remain valid/acyclic. FS-G0 stays approved and FS-G1–FS-G3 pending. Manual review checked actual-answer provenance and future approval chains.
- **PASS — links/register:** local Markdown targets and anchors resolve; each of the 22 register rows has all eight fields, explicit status, owner, deadline and safe work. The three official capability documents above were read; no provider pricing or account compatibility was asserted.
- **PASS — format/diff/preservation:** targeted Prettier check and `git diff --check`; final two-file diff reviewed. The first formatting check reported both edited files needing formatting (FAIL); applying Prettier's output corrected this before the final PASS. Tracked file fingerprints outside these docs, index, refs and protected clone/untracked files remain unchanged.
- **NOT RUN — application:** install, token generation, lint/typecheck, unit/coverage, Storybook/build, E2E, Lighthouse, game checks, deployment smoke tests and live email. None is needed to validate these documentation-only edits; older evidence remains linked, not rerun.
- **BLOCKED — separate FS-0.4 publication:** detailed source absent; Dimi supplies, Codex reconciles before closure. No other failure is converted to PASS.
- **Environment:** macOS arm64; local baseline Node 22.22.0/pnpm 10.30.3. Read-only shell/code inspection and documentation tools only; no mutating setup/build commands.
- **Evidence:** `/private/tmp/fs-0.5-evidence/validation.json`, `format-check.txt`, `diff-check.txt`, `target-before.json`, `protected-before.json`; reviewable `/private/tmp/fs-0.5-evidence/final.diff` includes the new task file. These local artifacts are not assumed visible to another environment.
- **Outcome/files/contracts:** canonical register expanded and this task record added; no runtime/public contract changes. Documentation preparation delivered; later decisions remain owned. No deviation into implementation or parallel planning systems.

### Handoff and next acceptance action

Sites can recover from [the register](../features/funkspace-minimum-usable.md#pending-decisions-and-latest-needed-points) and this record. Compare checkout `65eefa1db2656e78b169882414dfedb4715aa408` plus `final.diff` with actual accessible files before drawing current-state conclusions. Codex remains the documentation writer; return any correction read-only. This author's consistency review is not a new independent Sites review or Dimi visual approval.

**FS-G0:** no repeat choice is requested; Dimi already approved it. The supplied English/routes/public-target/device choices are recorded. Dimi's next input is the missing detailed source/preservation information when available and then assets/control inputs for FS-1.1. Phone browser/version details are needed for FS-4.7/FS-6.2, not a premature gate now. Motion, renderer and contact architecture approvals occur at the named later tasks after their counterpart review. Provider/sender/recipient and secure configuration must be real before live verification; no secret values are requested here.
