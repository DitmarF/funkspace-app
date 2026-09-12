> **Archived supplied source — not the current feature plan.** Added 2026-09-12 after Dimi supplied the missing detailed EPIC 0 plan. The [authoritative feature plan](../features/funkspace-minimum-usable.md) owns current scope/status; [FS-0.4 reconciliation](../tasks/fs-0.4-authoritative-feature-plan.md#detailed-source-reconciliation-and-current-readiness--2026-09-12) maps this source to actual evidence. The text below is preserved with Markdown formatting normalized. Historical revisions, proposed paths and embedded execution steps are reference material, not current facts or authorization.
>
> Original file: `/Users/dimi/Downloads/FunkSpace_EPIC_0_Detailed_Plan.md`; original-byte SHA-256 `57bde4a6ba34308e6e59193159d5298372ff9115f0175570ceb040f8efa4ca1f`. The supplied parent source is [archived alongside it](FunkSpace_Minimum_Usable_Development_Plan.md).

# FunkSpace — EPIC 0 detailed execution plan

## Repository baseline, maintenance, and durable planning

**Prepared:** 2026-09-11

**Status:** Proposed task elaboration; not an implementation report.

**Scope source:** `FunkSpace_Minimum_Usable_Development_Plan.md`, prepared 2026-09-11.

**Product owner / gate approver:** Dimi.

**Existing task IDs:** FS-0.1 through FS-0.5; exit gate FS-G0.

**Recorded historical baseline:** `feature/wave-survivor` at `b8128d5220a09a6f79117ace388d7ae1b54b7d68`. This comes from the supplied plan, not a fresh repository inspection.

**Current execution:** None. This document does not establish the current local tree, branch tips, tool versions, test results, or remote CI state, and authorizes no repository or external actions.

The parent plan remains the authority for the milestone. The steps, evidence fields, and review structure below are proposed execution detail within its existing scope. Proposed record paths and branch names must be reconciled with the repository's actual workflow before use.

## 1. Outcome and boundary

Finish EPIC 0 with a trustworthy answer to five questions:

1. What exact repository state are we starting from, and what must be preserved?
2. Which tools and commands reproduce it, and what do the checks actually establish?
3. Which reviewed base will portfolio development use?
4. Where can another agent recover the current plan and decisions?
5. Which inputs are approved, and who owns everything still pending?

This is not the phase for new controls, page implementation, particle runtime, motion-service implementation, contact delivery, game integration, broad upgrades, or repository-wide cleanup.

A documented unmerged game base is allowed. Known nonblocking defects are allowed when their impact, owner, and required repair point are explicit. Neither an unexplained failure nor a suppressed check is evidence of correctness.

## 2. Ownership, sequence, and evidence

| Participant | EPIC 0 responsibility                                                                                                                                  | Boundary                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Codex       | Lead FS-0.1–FS-0.4; inspect, reconcile tooling, run checks, propose integration, maintain repository guidance                                          | Does not approve product scope, invent local-state evidence, or execute unauthorized external actions              |
| Sites       | Review visual/component reuse; provide component and interaction requirements; prepare the design/content checklist; verify it can consume the handoff | Does not independently upgrade packages, merge/delete branches, or begin new portfolio implementation before FS-G0 |
| Dimi        | Lead FS-0.5; identify protected local work; approve scope, architecture choices when due, branch approach, and gate                                    | Does not become the routine command runner or mediate concurrent edits to the same files                           |

Recommended default sequence: **FS-0.1 → FS-0.2 → FS-0.3 → FS-0.4 → FS-0.5 → FS-G0**.

This execution preference does not change the original dependencies: FS-0.4 can begin after FS-0.1, and FS-0.5 depends on FS-0.4. Dimi can gather assets/content earlier. Early document preparation must be reconciled with the final tooling and branch decisions before the gate.

Use one current writer per task. Sites supplies review findings or an accessible checklist; Codex integrates shared baseline/plan changes while it owns those files. An ownership transfer must be explicit.

Every handoff records task ID, inspected base revision, candidate revision or qualified working-tree state, accessible diff/artifact, actual changed files, contract changes, commands and outcomes, blockers, and the next requested acceptance action. Commit, push, PR, merge, deletion, deployment, settings changes, and live sending remain separately authorized actions.

## 3. FS-0.1 — Inventory the real starting point

**Lead:** Codex. **Counterpart:** Sites. **Dimi:** identify unpushed work, local assets, and preservation requirements. **Dependency:** none.

### 3.1 Establish the evidence boundary

Record where inspection occurs and what is accessible: local worktree, remote branch, or both. Capture the current branch and full commit SHA, upstream/tracking state, staged/unstaged changes, untracked files, and any inaccessible evidence.

Compare that result with the historical SHA in the supplied plan. A difference triggers investigation and a recorded explanation, not an automatic reset to the old revision.

A remote view cannot establish whether Dimi's local tree is clean. A commit SHA alone does not identify uncommitted changes. Record the relevant nonsecret diff or artifact reference and distinguish repository-visible files from assets that exist only on Dimi's machine. Do not copy secrets into evidence.

### 3.2 Inspect instructions before implementation details

Read the applicable AGENTS.md instructions, existing AI workflow, feature/task templates, and relevant architecture decisions. Determine whether any nested instructions govern the areas likely to change.

Record the existing architecture and public boundaries the milestone must preserve. Locate the actual task-record convention rather than creating a competing directory structure.

### 3.3 Build the reuse and gap inventory

Sites reviews user-facing reuse; Codex checks dependency and ownership implications. The following are inventory targets reported by the parent plan, not newly verified findings:

| Area                                         | Inspection question                                                         | Later consumer                   |
| -------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------- |
| Semantic tokens and generated CSS/TypeScript | Where are source tokens, generators, generated outputs, and theme bindings? | FS-1.2 and components            |
| ThemeService                                 | Which initialization/provider/subscription contract already exists?         | FS-3.3 and scene themes          |
| Standard Button                              | Which existing props, semantics, styles, and stories can be extended?       | FS-1.3                           |
| Logo / LogoMotion                            | What assets, feature flag, motion behavior, and static fallback exist?      | FS-2.2 and FS-3.5                |
| Form/dialog/overlay utilities                | Are suitable implementations already present?                               | FS-1.5 and FS-1.6                |
| Motion modules and reduced-motion hook       | What can be retained, and where is the current responsibility boundary?     | FS-3.4 and FS-3.5                |
| Particle sandbox                             | Is it only a placeholder, or does it contain any reusable code?             | EPIC 4 planning                  |
| GameHost and standalone game                 | What is the public boundary and independent validation path?                | Game protection and later EPIC 7 |
| Storybook, tests, scripts, CI                | Which areas are really covered and which commands depend on prior builds?   | FS-0.2                           |

For each entry, record the real path, status, public contract, tests/stories, reuse recommendation, and constraints. Useful statuses are **implemented**, **partial**, **placeholder**, **missing**, and **not inspected**. A filename or story is not proof of integrated behavior.

### 3.4 Inspect branch relationships without cleanup

Compare ancestry, ahead/behind information where available, unique commits, tracking branches, and acceptance evidence. Associate existing CI results with the exact commit tested.

For branches apparently already integrated, distinguish an ancestry-preserving merge from squash/cherry-pick integration where necessary; retained content must be checked before suggesting deletion. Do not infer disposability from age or a branch name.

No reset, clean, forced checkout, stash/pop, history rewrite, branch deletion, or merge is part of inventory. Any necessary later operation needs a safe plan and the applicable approval.

### 3.5 Classify findings

Use a compact findings register:

`Finding ID | evidence/path | impact | verified or reported | disposition | owner | latest-needed task`.

Classify findings as **baseline blocker**, **bounded FS-0.2 correction**, **later milestone task**, or **unrelated backlog**. Track uncertainty explicitly.

The documented contrast suppression is a reinspection target assigned to FS-1.2, not a reason to claim accessibility is already verified. Typography/token reconciliation belongs to FS-1.2 rather than becoming incidental baseline cleanup.

### Deliverable and acceptance

Produce one consolidated baseline record, following the existing workflow. A proposed fallback location is `docs/development/funkspace-baseline.md`; it is not an existing-path claim.

It contains identity/access limits, protected work, branch relationships, reuse map, generated-file rules, findings, and missing evidence. Dimi confirms preservation requirements. Sites confirms the reuse map is usable. No repository changes or cleanup are needed merely to complete inventory.

## 4. FS-0.2 — Reconcile tooling and run the baseline

**Lead:** Codex. **Counterpart:** Sites consumes the final commands. **Dimi:** approve choices changing scope or cost. **Dependency:** FS-0.1.

### 4.1 Reconcile the actual toolchain contract

Compare package manifests, package-manager declarations, runtime-version files if present, the lockfile, workspace configuration, README instructions, local tool versions, and CI setup.

Determine the compatible Node and pnpm versions from inspected project evidence. Do not choose arbitrary latest versions or silently treat whichever runtime is installed as authoritative.

Inspect scripts for prerequisites and side effects, including automatic fixes and generated files. Establish the installation method and build order that preserve the intended dependency graph. Check which workspace commands actually include the standalone game.

### 4.2 Capture before-and-after evidence

Record the initial result of checks that can run safely. Where setup prevents execution, capture that blocker before making a correction. After each justified maintenance change, rerun affected checks and the required regression checks.

Separate the **pre-maintenance snapshot** from the **validated portfolio candidate**. If edits remain uncommitted, attach a reproducible nonsecret diff/artifact reference rather than attributing results solely to the unchanged HEAD SHA.

### 4.3 Apply only bounded corrections

Confirm and correct Tailwind scanning for `frontend/features` using the inspected configuration's actual path convention and supported file types. Verify a representative affected class is emitted; do not redesign components to demonstrate it.

Align inconsistent toolchain declarations or build prerequisites where necessary. Inspect generated-output changes after generation; do not hand-edit generated token artifacts or commit unrelated churn.

Perform the installed/locked dependency review and record its coverage and limitations. For a proposed dependency fix, document the affected dependency path/advisory, relevance, exact version change, expected lockfile scope, compatibility impact, and verification. Unrelated upgrades remain backlog work; a mandatory security-related blocker must not be dismissed merely because it is inconvenient.

### 4.4 Run the verified command matrix

The parent plan supplies the following candidate commands. Codex must verify their current existence, prerequisites, coverage, and environment requirements before treating them as executable instructions. These commands have not been run during this planning task.

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

# Standalone game regression commands recorded in the parent plan:
pnpm -F @funkspace/wave-survivor typecheck
pnpm -F @funkspace/wave-survivor test
pnpm -F @funkspace/wave-survivor demo:build
```

Check browser installation and project selection deliberately. Do not assume the default E2E command covers WebKit, every route, or the game demo. Verify that the enabled Lighthouse run actually measures the enabled build variant.

Running these commands establishes a baseline, not final acceptance of features that do not exist yet. Baseline defects and environment limits remain explicit; not every future milestone requirement must pass now.

### 4.5 Use an honest result log

For each command, record:

`revision/diff | working directory | prerequisites | command | tool/environment versions | outcome/exit code | evidence location | skips/suppressions | diagnosis | owner/next action`.

Use outcomes **PASS**, **FAIL**, **BLOCKED**, or **NOT RUN**. Separately identify known baseline failures, suspected new regressions, and coverage limitations. An empty or skipped test set is not useful passing coverage. A dependency review without registry access is not a clean security result.

Record the existing contrast-test suppression, its exact inspected scope, and the planned FS-1.2 repair. The parent plan reports a suppressed 2.4:1 contrast issue. Repair the relevant source colors and remove the suppression together in FS-1.2; do not lower thresholds, broaden exclusions, or describe the filtered test as complete contrast evidence.

### Deliverable and acceptance

Update the baseline record with confirmed toolchain/install/build instructions, initial and final command results, bounded fixes, dependency-review findings, game regression evidence, and explicit limitations. Update the relevant repository guidance when authorized.

Sites confirms it can use the same commands or records its own environment gap. Reproducibility and preservation blockers must be resolved or have an accessible validated execution path before FS-G0; named nonblocking defects may remain.

## 5. FS-0.3 — Choose and prepare the branch integration path

**Lead:** Codex. **Counterpart:** Sites consumes the recorded base. **Dimi:** approve the approach and each specified external action. **Dependency:** FS-0.2.

### 5.1 Present two concrete candidates

| Path                   | Sequence                                                                                                                                               | Evidence / consequence                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| A — preferred          | Review the accepted game baseline; obtain the necessary approval; integrate into main; validate the resulting main revision; base portfolio work on it | Confirm the exact accepted game tip, integration method, required CI, and any deployment triggered by main                |
| B — permitted deferral | Leave main unchanged; base portfolio work on the validated game tip; record the inherited game dependency and later integration order                  | Keep game and portfolio changes distinguishable; avoid claiming the portfolio branch is independent of unmerged game work |

`feature/funkspace-minimum-usable` is a proposed portfolio branch name, subject to the repository convention and Dimi's agreement. Record the actual name and exact base when chosen.

Do not invent a validated main revision when no merge occurred. A selected strategy is not proof that its actions have been executed.

### 5.2 Review action-specific consequences

Before any authorized integration, check target/base revisions, the accessible diff, conflicts, unique retained work, applicable CI/check policy, and deployment behavior. Passing results for an older revision are historical evidence, not validation of the new merge result.

Record authorization for commit/push/PR/merge/settings actions as applicable. Inability to inspect a remote policy or deployment configuration is an explicit limit and may block that path. The documented unmerged-base path can remain available.

Do not bypass protections or change repository settings merely to make integration succeed. Branch deletion is optional and requires separately confirmed retention, integration status, and approval.

### 5.3 Publish the integration decision

Record: chosen strategy, actual base SHA, portfolio branch or proposed branch status, included game work, integration dependencies, expected deployment effects, authorizations, executed actions, validation evidence, and deferred actions.

Sites starts only from that accessible revision/diff. No automatic synchronization between sessions is assumed.

### Deliverable and acceptance

A branch/integration decision linked from the authoritative plan and baseline record. If a merge was authorized and executed, the result is validated. Otherwise, a precise unmerged-base plan is sufficient. Deleting old branches is not required for FS-G0.

## 6. FS-0.4 — Publish one authoritative feature plan and update stale guidance

**Lead:** Codex. **Counterpart:** Sites supplies component/interaction decisions and later maintains its own task evidence. **Dimi:** approve release scope and architecture decisions when due. **Dependency:** FS-0.1.

### 6.1 Integrate with the existing document system

Read and use the existing feature template and AI workflow. Place the milestone plan at the proposed path `docs/features/funkspace-minimum-usable.md`, unless inspection identifies a necessary convention adjustment that is recorded explicitly.

Preserve all existing portfolio task IDs, owners, dependencies, deferred scope, protected areas, acceptance conditions, and gates. Add the detailed EPIC 0 execution information without silently rewriting downstream tasks.

The feature plan is the milestone authority. The baseline record holds inspection and command evidence. Task records hold substantial task-level work and handoffs. Link between them rather than maintaining independent copies of status and scope.

### 6.2 Reconcile old guidance selectively

Review `docs/features/full_screen_animate_layout.md`, `docs/features/home-animations.md`, `docs/motion.md`, README, and relevant agent guidance.

| Topic                | Current milestone direction                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Page movement        | Ordinary scrolling and content-driven sections, not forced slide navigation/snapping         |
| Homepage animation   | One bounded Canvas scene with a deliberate static alternative                                |
| Animation navigation | No scene carousel, counter, dots, or previous/next controls                                  |
| Motion ownership     | One decorative-motion preference for logo and scene; no coupling to gameplay time            |
| Game continuation    | Separate Wave Survivor plan; game integration resumes with EPIC 7 after portfolio acceptance |

Mark superseded sections and link to current guidance. Preserve still-applicable constraints and historical decisions. Do not erase the old game roadmap or apply the website's scrolling rules to the game's arena.

AGENTS.md should contain stable operating rules and entry-point links, not become a duplicate of the entire milestone plan. Modify templates only for a demonstrated gap; do not replace the workflow for convenience.

### 6.3 Keep records proportional

Create task records as substantial work starts, following the existing convention. Do not create 44 empty task documents in advance.

Record decisions with a small structure: decision, status, owner, rationale or options, and latest-needed task. Completion status changes require evidence; draft code or prose is not task acceptance.

### 6.4 Test context recovery

Sites performs a read-only review using the repository documents and supplied artifacts, not assumptions about another agent's conversation. It should be able to identify the current base, next task, reuse contracts, writer ownership, commands, protected work, blockers, and required Dimi decisions.

Codex checks links, task references, dependency consistency, statuses, and the final documentation diff. Before FS-G0, reconcile early document drafts with the actual FS-0.2/FS-0.3 outcomes.

### Deliverable and acceptance

One discoverable feature plan, a linked baseline/evidence record, narrowly updated stale guidance, and a tested handoff path. Historical plans remain distinguishable from current authority. Documentation-only work is validated with content/link/diff checks rather than unrelated application-test claims.

## 7. FS-0.5 — Approve product, content, and operating assumptions

**Lead:** Dimi. **Counterparts:** Sites prepares the design/content checklist; Codex prepares bounded technical options. **Dependency:** FS-0.4.

### 7.1 Confirm the minimum product boundary

Record the initial language; English remains a reversible implementation default, not an invented final approval.

Confirm the three homepage sections — Start, About, Contact/footer — and proposed routes `/`, `/about`, `/impressum`, `/privacy`. Keep `/play/wave-survivor` as later game-integration scope, without an unfinished public navigation destination.

Confirm one scene, its independent trusted SVG aperture, bounded customization, ordinary scrolling, and the static alternative. Do not reopen the approved scope into a carousel or visual editor.

Choose the intended preview-versus-public target. A verified preview can meet integration readiness, but it does not count as a completed public launch. Real provider-backed contact delivery still belongs to the milestone.

### 7.2 Record inputs and latest-needed points

| Input / decision                                     | Responsible owner                                   | Latest-needed point                                                                   | Work that can proceed                                        |
| ---------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Initial language and route/section acceptance        | Dimi; Sites records requirements                    | Scope approval now; page/content work consumes the decision in EPIC 2                 | Inventory and tooling                                        |
| Original icons, substitutes, control matrix          | Dimi with Sites                                     | FS-1.1 contract; FS-1.3/1.4 visual finalization                                       | Token inspection and preparation                             |
| About copy and public contact address                | Dimi                                                | FS-2.3/FS-2.4 completion                                                              | Explicitly temporary development layouts                     |
| Actual operator/legal information                    | Dimi; Codex provides technical facts                | FS-2.4 content requirements; FS-5.5 finalization and public release                   | Page structure, not claims of legal completeness             |
| Representative phone/browser                         | Dimi with Codex                                     | Nominate during planning; required for FS-4.7 and FS-6.2 evidence                     | Accurately labeled automated checks                          |
| Particle reference and second trusted aperture       | Dimi with Sites                                     | Reference before FS-4.2; second shape at FS-4.4 acceptance                            | Static site and architecture proposal                        |
| Host, mail provider, recipient, secure configuration | Dimi; Codex proposes options                        | FS-5.1 infrastructure/contract decisions; FS-5.2 live adapter verification and FS-5.6 | Approved-contract tests and UI with a controlled test double |
| Shared motion-policy design                          | Dimi after Codex proposal and Sites contract review | Before FS-3.4 implementation                                                          | Static UI and policy proposal                                |
| Scene renderer boundary                              | Dimi after Sites proposal and Codex review          | FS-4.1 approval before FS-4.2 implementation                                          | Static framing and renderer proposal                         |
| Contact/server boundary                              | Dimi after Codex proposal and Sites contract review | FS-5.1 approval before FS-5.2 implementation                                          | Fields, fallback contact, and contract discussion            |
| External actions, deployment, and live sending       | Dimi                                                | Before each specified action                                                          | Review and authorized local preparation                      |

Where a decision can remain pending, record its owner and latest-needed task. Do not demand secrets, a provider account, or all finished content just to inspect the repository or build unrelated UI. Do not use that flexibility to accept incomplete delivery/legal work later.

### 7.3 Prepare bounded decisions, not early implementations

Sites provides the small checklist of required visual/content inputs and genuine ambiguities. Codex describes the smallest options consistent with the existing architecture and records tradeoffs only where a choice is needed.

No new global motion service, renderer boundary, or server contact flow is implemented before its approval point. Account/DNS configuration and live mail remain separately authorized. Dimi enters secret values through the intended secure provider mechanism, never source code, fixtures, or chat.

### Deliverable and acceptance

A decision register linked from the feature plan. Every material decision is approved, explicitly provisional, or pending with a named owner and latest-needed task. Dimi approves the milestone boundary; later architecture choices may remain owned and scheduled until their defined prerequisite.

## 8. FS-G0 — Epic exit and next handoff

Codex assembles the evidence summary, Sites confirms it can consume the documented base/contracts, and Dimi approves the gate.

| Gate criterion                     | Required evidence                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Starting point identified honestly | Full base revision, worktree/access qualifications, and accessible nonsecret diff/artifact where needed      |
| Protected work preserved           | Reviewed preservation list and no unexplained loss or unrelated edits                                        |
| Tooling reproducible               | Confirmed environment/setup/build order and exact command log                                                |
| Outcomes transparent               | Passes, failures, blockers, unrun checks, and suppressions clearly distinguished                             |
| Game baseline protected            | Applicable standalone validation and any limitations, with no accepted-behavior change hidden in maintenance |
| Integration approach approved      | Actual/proposed portfolio base, known deployment implications, and authorization/action status               |
| Plan recoverable                   | Feature-plan entry point, current task/owner, linked evidence, and corrected stale guidance                  |
| Decisions owned                    | Approved scope plus owners and latest-needed tasks for remaining inputs                                      |
| Defects assigned                   | Impact, disposition, owner, and required repair point, including FS-1.2 contrast repair                      |
| Dimi acceptance recorded           | Dated FS-G0 decision tied to the reviewed evidence/candidate                                                 |

**Do not pass:** preservation is uncertain; there is no reproducible accessible starting point; the chosen base is ambiguous; maintenance introduces an unresolved blocking regression; or a material risk is hidden behind a green/suppressed check.

**May remain open with ownership:** unrelated nonblocking dependency updates, the planned FS-1.2 contrast repair, later content/assets/provider inputs, optional branch cleanup, and public launch.

Gate approval is not blanket authorization for commit/push/merge/deploy/send operations. When required baseline execution evidence is genuinely unavailable, record the gate as blocked rather than calling planning prose a verified baseline.

After approval, Sites and Dimi proceed to FS-1.1, with Codex using its completed baseline for the later FS-1.2 token/contrast work. The next agent receives a concrete revision/artifact, not just a statement that the previous session finished.

## 9. Immediate division of work

Start with Codex's FS-0.1 inspection. Dimi's immediate contribution is the protected-work/local-assets information. Sites contributes a read-only component-reuse review and begins the bounded content/design checklist. New portfolio implementation waits for FS-G0.

The purpose of the epic is to make subsequent work reproducible and recoverable, not to make every old branch, warning, or future decision disappear.
