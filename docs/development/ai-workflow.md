# AI development workflow

This workflow is the default path for AI-assisted changes in FunkSpace. It is designed so a new ChatGPT Sites or Codex-style session can continue work using repository evidence without relying on previous conversation history.

The user request and its acceptance criteria define the task. Repository documents provide project constraints and context; they do not silently expand the requested scope.

```text
Planning -> Implementation -> Review -> Testing -> Cleanup -> Handoff
                ^              |
                +-- changes required --+
```

## 1. Planning

### Inspect before proposing changes

1. Read `AGENTS.md`.
2. Inspect the working tree and preserve unrelated changes.
3. Inspect the requested files, nearby code and tests, package manifests, architecture documentation, and relevant ADRs.
4. Identify current behavior, existing abstractions, dependency direction, generated files, and protected areas.
5. Separate verified facts, safe assumptions, and decisions that require user or architecture review.

### Choose the planning depth

- Use [`docs/templates/task.md`](../templates/task.md) for a bounded task that needs a durable execution record.
- Use [`docs/templates/feature-plan.md`](../templates/feature-plan.md) for a larger feature, epic, migration, rollout, or cross-cutting change.
- Skip a persistent plan only for a trivial, low-risk change whose scope and validation are immediately clear.

Large features require task decomposition before implementation. Split work into independently verifiable tasks when it spans multiple packages or architecture layers, changes a public contract, introduces a dependency or migration, carries rollout risk, or cannot be reviewed as one coherent diff. Each task must state its own goal, scope, protected areas, dependencies, acceptance criteria, and validation.

### Architecture review gate

AI must not directly expand the architecture without review. Stop at a proposal when a change would introduce or materially expand any of the following:

- A workspace package, framework, runtime, deployment unit, global service, or cross-package dependency.
- A shared abstraction without demonstrated consumers.
- A new architecture layer, dependency direction, public integration pattern, or exception to an accepted ADR.
- A game engine, renderer strategy, persistence model, network boundary, or security-sensitive data flow.

Document the need, consumers, alternatives, consequences, migration path, and smallest viable option. Obtain the required user or architecture approval and add or supersede an ADR when the decision changes accepted direction.

### Planning exit criteria

- The requested outcome and acceptance criteria are explicit.
- In-scope and out-of-scope work is clear.
- Existing abstractions to reuse are identified.
- Planned paths and dependency direction match inspected repository evidence.
- Material architecture decisions are approved or implementation remains paused.

## 2. Implementation

Implement the smallest coherent change that satisfies the current task.

1. Reuse existing components, services, ports, adapters, utilities, tokens, and package APIs before creating another abstraction.
2. Follow Clean Architecture and workspace dependency rules from `AGENTS.md` and `docs/architecture/`.
3. Keep side effects at boundaries and game or animation loops outside React rendering.
4. Add only the public API and dependency surface required by current consumers.
5. Preserve generated files, unrelated work, compatibility behavior, accessibility, reduced-motion behavior, and cleanup semantics.
6. Add or update tests with the behavior rather than postponing all verification until the end.
7. Update documentation when implementation changes setup, public behavior, architecture, or package responsibilities.

An AI agent must not turn local duplication into shared infrastructure speculatively. Extraction is justified when responsibilities are stable and real consumers demonstrate reuse. If implementation reveals a material assumption or architecture conflict, return to Planning instead of silently widening the solution.

### Implementation exit criteria

- The requested behavior exists within the approved scope.
- Existing abstractions are reused or a reviewed justification explains why they are insufficient.
- New code belongs to the correct package and layer.
- Failure, lifecycle, accessibility, and cleanup behavior are implemented where relevant.
- No unresolved architecture decision is hidden in the diff.

## 3. Review

Review the complete diff, including documentation, configuration, manifests, lockfiles, and untracked files. Do not review only the files named in the original plan because implementation may have affected additional boundaries.

1. Apply [`docs/checklists/architecture-review.md`](../checklists/architecture-review.md).
2. Check for duplicated functionality, invalid dependencies, speculative abstractions, unnecessary complexity, missing tests, and stale documentation.
3. Verify that package public entry points are used instead of private source imports.
4. Confirm the change does not contradict an accepted ADR or expand architecture without approval.
5. Inspect for accidental generated output, secrets, debug code, disabled assertions, suppressed errors, and unrelated formatting.
6. Map every acceptance criterion to observable evidence.

AI self-review is required but does not replace human or designated architecture review for decisions caught by the architecture review gate.

### Review exit criteria

- The architecture checklist has no unresolved blocking finding.
- The diff is minimal, understandable, and within scope.
- Acceptance criteria have planned evidence.
- Issues found during review are fixed and reviewed again.

## 4. Testing

Run checks in increasing scope and cost.

1. Format, static analysis, and type-check the affected files or package.
2. Run focused unit, component, integration, or contract tests for changed behavior.
3. Run broader repository tests when shared code, configuration, packages, or public contracts changed.
4. Run production builds, Storybook, E2E, accessibility, performance, or standalone application checks when the change can affect those surfaces.
5. Perform the manual checks defined by the task or feature plan.

Documentation-only changes normally require content, link, formatting, and diff validation rather than application builds. Never weaken tests, lower thresholds, skip failures, or claim a check passed when it was not run successfully. Report environmental limitations and pre-existing failures separately from failures caused by the change.

### Testing exit criteria

- Every acceptance criterion has automated or manual evidence.
- Required checks pass, or exact blockers and unverified areas are reported.
- Test coverage is proportional to behavior and risk.
- Standalone packages still work independently when their boundary changes.

## 5. Cleanup

1. Remove temporary files, debug output, unused imports, dead code, abandoned abstractions, and unrequested generated artifacts.
2. Review `git status`, the final diff, formatting, and lockfile changes.
3. Confirm tests do not leave processes, timers, listeners, build output, or local servers running.
4. Update task or feature completion records with actual files, validation results, deviations, and follow-up work.
5. Provide a concise handoff describing the outcome, important boundaries, validation performed, and anything not verified.

Do not commit, push, merge, deploy, publish, or change external state unless the user explicitly authorizes that action.

### Cleanup exit criteria

- The working tree contains only intentional task changes.
- Documentation matches delivered behavior.
- No temporary process or artifact remains.
- The handoff is sufficient for a future session to resume without conversation history.

## Workflow completion

A task is complete only when the approved scope is delivered, the architecture review has no blocking findings, validation evidence supports the acceptance criteria, cleanup is finished, and remaining work is explicit. If any condition is missing, report the task as incomplete rather than presenting partial work as done.
