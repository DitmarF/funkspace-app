# Task FS-0.4 — Publish the authoritative feature plan

## Task metadata

- **Status:** Blocked for final publication — accessible-source draft, selective guidance reconciliation and read-only counterpart review/incorporation delivered. Complete detailed EPIC 0 source reconciliation remains pending.
- **Task group or epic:** Portfolio EPIC 0; [Minimum Usable Experience](../features/funkspace-minimum-usable.md).
- **Owner/current writer:** Codex. Sites counterpart review is read-only; no shared-file ownership transfer.
- **Last updated:** 2026-09-12.
- **Workflow:** [AI workflow](../development/ai-workflow.md), existing [feature](../templates/feature-plan.md) and [task](../templates/task.md) templates, root [AGENTS](../../AGENTS.md), [architecture](../architecture.md) and ADRs 001–004. No template or speculative ADR changes.

## Requested outcome

Publish one recoverable portfolio plan preserving all 44 source task IDs, leads, counterpart/Dimi responsibilities, dependencies, scope and FS-G0–FS-G3 gates. Reconcile stale scrolling/motion guidance without implementing UI or treating documentation as human acceptance. Incorporate a read-only context-recovery review as the designated writer.

### Acceptance criteria from the request

- [x] Read the complete accessible minimum-usable plan and current instructions/workflow/templates, baseline, tooling outcomes and branch decision.
- [ ] Read and reconcile the complete detailed EPIC 0 plan before final publication; not accessible yet.
- [x] Preserve all 44 task contracts/dependencies and gate semantics, verified against the supplied source.
- [x] Separate milestone scope/status, baseline evidence and substantial task handoffs; no 44 empty records or game EPIC 6 task import.
- [x] Mark historical layout guidance superseded while retaining applicable constraints and game-arena independence.
- [x] Validate paths, references, task graph, owners, gate/status claims, formatting and intentional diff.
- [x] Receive the read-only counterpart context-recovery review and incorporate actionable findings.

## Context and repository evidence

- **Target:** `/Users/dimi/Projects/funkspace-app`; local Codex desktop terminal, macOS arm64, zsh, Node 22.22.0, pnpm 10.30.3.
- **Inspected base:** `feature/funkspace-minimum-usable`, full HEAD/cached upstream `8a054ae755315b334f18ac4b53ac4cce541e3519`; initially clean index, tracked worktree and untracked files. Local main is `9f3f01d8e2745408a8523c07198aec0e73eed52b`. No branch/ref/index/remote mutation is part of this task.
- **Current candidate:** that base plus the documentation worktree/patch linked below; no new candidate commit. Prior main application validation remains bound to its original revision, not rerun here.
- **Source:** complete 751-line `/Users/dimi/Downloads/FunkSpace_Minimum_Usable_Development_Plan.md`; SHA-256 `6475a13f4538c5d3a3dbfb88be3be971e0291ddca4db27a131185934bf4c8ae1`. This task distinguishes its written scope from source assertions about inaccessible screenshots/video.
- **Missing source:** `FunkSpace_EPIC_0_Detailed_Plan.md` not found in target, Downloads, Documents or the empty local project `sources/`. Dimi previously said the local source will be added later. No new source contents inferred from assignment prompts. This blocks final reconciliation/publication, not the safe draft or stale-guidance edits.
- **Instructions:** root target AGENTS is the only located repository AGENTS; ancestor paths contain none. Project-mirror instructions protect synced sources as read-only. Read the full minimum plan, workflow/templates, affected guidance, architecture, accepted ADRs, baseline and FS-0.2/0.3 evidence; inspect manifests, CI and Vitest configuration to qualify setup claims.
- **Access limits:** this task uses local Git/configuration and prior accessible evidence. It makes no fresh remote/production, advisory, visual or device certification. Unsaved buffers, other devices, undisclosed assets and preservation intent remain unconfirmed.

### Assumptions and open decisions

- **Safe assumption:** preserve the accessible source task definitions verbatim apart from Markdown formatting and added current-status annotations. The proposed feature path matches the existing workflow and did not exist at inspection.
- **Approval provenance:** Dimi explicitly approved strategy A, branch name, FS-G0 and the specified game-baseline settings/production merge. FS-0.3 records execution/validation. The source expected EPIC 0 planning before FS-G0; actual approval preceded FS-0.4/0.5 completion. Retain both facts without manufacturing completion or revoking Dimi's approval.
- **Owner consistency:** FS01-S03 assigns Codex the ThemeService persistence correction; the source keeps Sites as FS-3.3 task lead with Codex counterpart. Preserve the source lead; when FS-3.3 is assigned, explicitly hand the bounded service correction to Codex as current writer before edits, then return ownership for integration. No concurrent writers or silent task reassignment.
- **Pending choices:** initial language, route/copy/assets, nominated phone, motion semantics/renderer/network architecture, provider/recipient/privacy and future portfolio target remain at their source owners/latest-needed tasks. Existing Vercel use and a game-baseline release do not approve a mail provider or the completed portfolio release.

## Scope

### In scope

One feature-plan draft, this substantial record, targeted historical-scope notices/motion clarification, README corrections and stable AGENTS entry links; recovery pointers on existing evidence records rather than replacement status/log copies.

### Out of scope

Application/UI/runtime/configuration/dependency changes, token/contrast repair, generated outputs, gameplay/integration, new services, templates or ADRs, history cleanup, commits/pushes/PRs/settings/deployment and live email.

### Protected areas

All original application/game code, tokens/generated values, lockfile, original SVG/font assets, Git refs and unrelated work. The separate project-mirror clone at `63d117358d67137cebff744a29fa3a9a49d82415` and its three untracked combat files are independently fingerprinted and retained. Source plans are read-only. Ignored build/dependency trees are not exhaustively fingerprinted and are not regenerated.

## Planned changes

| Path                                                                                                                                         | Status at inspection  | Change and boundary                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `docs/features/funkspace-minimum-usable.md`                                                                                                  | Proposed, now drafted | Single intended scope/status home; missing-source publication limit explicit                                |
| `docs/tasks/fs-0.4-authoritative-feature-plan.md`                                                                                            | Proposed, now created | This substantial execution and review handoff                                                               |
| `docs/features/full_screen_animate_layout.md`                                                                                                | Existing              | Historical banner; preserve old sections/examples without authorizing them                                  |
| `docs/features/home-animations.md`, `docs/motion.md`                                                                                         | Existing              | Reconcile portfolio/Canvas/static/policy scope and qualify historical measurement claims                    |
| `README.md`, `AGENTS.md`                                                                                                                     | Existing              | Stable entry links; remove verified stale path/scaffold claims; align documented Vercel command with FS-0.3 |
| `docs/tasks/fs-0.1-inventory-real-starting-point.md`, `fs-0.2-tooling-baseline.md`, `fs-0.3-branch-integration-decision.md` in `docs/tasks/` | Existing              | Brief dated recovery pointers; preserve original inspection/command/decision evidence                       |

### Implementation sequence

1. Snapshot local identity/protected files and read all accessible sources/evidence.
2. Draft with the existing feature template's concerns and complete source task breakdown; annotate current status separately from source contracts.
3. Reconcile selected stale guidance and historical evidence entry points.
4. Validate content/graph/links/format/diff, supply a read-only counterpart handoff, incorporate findings as sole writer and revalidate affected documentation.
5. Reconcile missing detailed source when supplied before declaring publication/closure complete.

## Dependencies and risks

FS-0.1 supplies reuse/access evidence; FS-0.2 supplies tooling/known security and contrast limits; FS-0.3 supplies exact selected base and approval/execution evidence. No new software dependency. The main risks are changing downstream task scope, mistaking historical pending statuses for current decisions, treating draft scope or old CI as fresh acceptance, and assuming unavailable vectors. Preserve exact task bodies, use dated source hashes and linked evidence, and record unresolved inputs explicitly.

## Validation plan

Documentation-only validation: compare all source task bodies after excluding status/formatting, verify IDs/counts/leads/responsibilities/dependency targets and an acyclic graph, verify gate claims against recorded approvals, check local Markdown paths/anchors, run scoped `pnpm exec prettier --check`, inspect complete tracked and added-file diffs, and compare tracked/protected fingerprints and refs. External URLs are retained provenance links, not freshly fetched assertions. Application checks are NOT RUN.

## Completion record

- **Outcome:** Safe draft/reconciliation prepared; final publication blocked on the detailed source. No public/runtime contract changes. No implementation, future gate or new product approval claimed.
- **Files changed:** The ten documentation paths in the table above (two new, eight existing).
- **Validation results:** Documentation checks recorded below; final machine-readable results in [validation.json](/private/tmp/fs-0.4-evidence/validation.json). No application command executed.
- **Deviations:** Missing detailed source prevents complete source reconciliation. Existing feature template is adapted by adding the full multi-epic task breakdown, not changing templates or creating another planning system.
- **Remaining work:** Dimi supplies the source; Codex reconciles it before publication/closure. Counterpart findings received and incorporated below. Preservation disclosures remain Dimi-owned before any affected-area changes.

### Validation performed and evidence limits

| Check                                                                                                                             | Outcome and evidence                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Complete source task comparison                                                                                                   | PASS: 44 unique IDs/titles and all 264 lead/counterpart/Dimi/dependency/work/completion fields equal the source after normalizing Markdown spacing and excluding added status annotations. Epic counts 5/7/6/6/8/6/6. No task contract rewritten.                            |
| Task graph and owners                                                                                                             | PASS: all dependency references resolve; graph acyclic; every lead remains Codex, Sites or Dimi as assigned. Epic prerequisites retained. FS-3.3 service-correction handoff clarified outside its task contract.                                                             |
| Gates/status provenance                                                                                                           | PASS: manual comparison with FS-0.3 approvals/result and local Git history; approved FS-G0 kept separate from unfinished FS-0.4/0.5 and pending FS-G1–G3. Local documentation head is not represented as a newly tested application revision.                                |
| Local links/anchors and paths                                                                                                     | PASS: checker covers the ten changed documents, including links into untouched evidence; exact count in validation.json. External provenance links not fetched. Proposed runtime paths/route choices remain labeled.                                                         |
| Scoped Prettier                                                                                                                   | PASS: `pnpm exec prettier --check` on the ten changed Markdown files. No repository-wide formatting or executable/configuration changes.                                                                                                                                     |
| Whitespace/full diff review                                                                                                       | PASS after correction: tracked `git diff --check` plus added-file `git diff --no-index --check`. Initial added-file check flagged source-inherited two-space Markdown hard breaks; replaced with paragraph spacing, preserving text. No exclusions/whitespace rules changed. |
| Preservation                                                                                                                      | PASS: other tracked target files, source hash, protected clone's files/status/refs, target HEAD/refs and empty index unchanged. Ignored trees not exhaustively fingerprinted or regenerated.                                                                                 |
| Counterpart                                                                                                                       | PASS with three bounded findings incorporated. Independent Codex subagent in Sites role; no external Sites product session or human visual acceptance claimed.                                                                                                               |
| Detailed EPIC 0 source                                                                                                            | BLOCKED: unavailable in the inspected local locations. Dimi supplies; Codex reconciles before final publication/closure.                                                                                                                                                     |
| Application lint/types/tests/coverage/generation/builds/Storybook/E2E/LHCI, current audit, live provider/remote and device checks | NOT RUN in FS-0.4. Prior baseline/result evidence stays bound to its recorded revisions; no current pass or clean security claim inferred.                                                                                                                                   |

The initial validation helper had a greedy heading matcher and a spacing-sensitive gate assertion; both were corrected to inspect the unchanged source semantics. A pre-artifact link check also correctly reported the review patch absent before it was generated. These were validation-helper/setup failures, not application regressions; final checks rerun against the completed candidate. No FAIL is hidden by a suppression.

### Accessible counterpart handoff

Review entry point: [feature-plan draft](../features/funkspace-minimum-usable.md). Local base `8a054ae755315b334f18ac4b53ac4cce541e3519` plus [candidate diff](/private/tmp/fs-0.4-evidence/review.diff). The diff includes new files, which ordinary `git diff` omits. [Evidence directory](/private/tmp/fs-0.4-evidence/) holds snapshots and validation artifacts; these local files must be supplied to another environment explicitly. No remote synchronization is assumed.

The linked review.diff is the frozen **pre-incorporation** candidate. The current deliverable is [final.diff](/private/tmp/fs-0.4-evidence/final.diff), including all ten files and the incorporated findings, plus the [evidence archive](/private/tmp/fs-0.4-evidence.tar.gz). Recheck base and supplied patch before later work; neither patch is a pushed commit.

Verify the exact base and supplied diff before drawing current-state conclusions. Return a compact read-only review of recoverable scope, 44-task ownership/dependencies, pending choices, reuse/asset assumptions, base/status/gates and superseded guidance. Do not edit shared files or infer Dimi visual acceptance. Codex remains the writer for incorporation. The publication blocker is not a request to invent missing EPIC 0 details.

### Read-only review and incorporation

An independent Codex subagent performed the requested Sites-role review read-only; this was not an external Sites product session. It verified HEAD and byte-identical review.diff/worktree before conclusions, with reviewed patch SHA-256 `f852ca78f7137edc813f42f85876cfabf14644d63cd1c8552ad0167db3ce254f`. It independently compared the 44 task contracts and epic constraints against the source. The [review record](/private/tmp/fs-0.4-evidence/counterpart-review.md) preserves findings and limits. Codex incorporated them as sole writer after the review; the frozen reviewed patch is retained separately from final.diff.

| Finding  | Evidence/impact                                                                                                                              | Disposition / owner / latest needed                                                                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FS04-S01 | Verified: “A11y target” / “Aim for unfiltered” softened the zero-violation requirement while describing current filters.                     | Incorporated: explicit zero unfiltered violations required; both filters remain limitations pending atomic FS-1.2 repair. Codex / FS-0.4 draft finalization.                    |
| FS04-S02 | Verified: source-inherited architecture prose described dialog/policy consumers as current, although the shared systems are missing/planned. | Incorporated: two planned consumers, baseline link and FS-1.6/3.4 references; task contracts unchanged. Codex / FS-0.4 draft finalization.                                      |
| FS04-S03 | Verified: FS01-S03 Codex correction versus Sites FS-3.3 lead needed visible coordination at the feature entry point.                         | Incorporated outside the preserved task contract: explicit current-writer handoff and return, source lead retained. Codex documentation now; assigned lead before FS-3.3 edits. |
| FS04-B01 | Verified access limit: detailed EPIC 0 source still absent. The draft cannot claim complete-source publication.                              | Unresolved: Dimi supplies source, Codex reconciles before FS-0.4 publication/closure. Safe documentation delivered meanwhile.                                                   |

**Sufficiency:** review found the draft sufficient for context recovery and bounded planning with these corrections; final publication remains blocked by the source. Dimi-only inputs are the missing source, undisclosed preservation facts, original vectors/reference intent, factual copy/legal/operator information, assigned product/service choices and human acceptance. No new Dimi decision is required for the three documentation corrections, and no visual acceptance is claimed.

**Dimi's next action:** provide the complete detailed EPIC 0 source when available; retain the protected clone/assets pending disclosure. Later product/operating choices belong to FS-0.5. Recorded FS-G0 approval remains intact.
