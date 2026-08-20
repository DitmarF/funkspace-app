# Task [ID] — [Task title]

> Copy this file to `docs/tasks/<task-id>-<task-slug>.md` when a bounded task needs a durable implementation record. Replace bracketed placeholders, remove unused guidance, and use `Not applicable` with a reason instead of leaving sections ambiguous. Use [`feature-plan.md`](./feature-plan.md) for larger features, epics, or changes that require product and rollout planning.

## Task metadata

- **Status:** Draft | Ready | In progress | Blocked | Complete
- **Task group or epic:** [Parent reference]
- **Owner:** [Person, team, or agent]
- **Last updated:** YYYY-MM-DD
- **Related documentation:** [AGENTS.md, architecture docs, ADRs, feature plans, or issues]

## Requested outcome

[Preserve the intended result from the task request in one or two sentences. Describe the outcome rather than adding an implementation that was not requested.]

### Acceptance criteria from the request

- [ ] [Copy or faithfully restate each acceptance criterion as an independently verifiable result.]

## Context and repository evidence

Record what was inspected before implementation. Keep repository instructions and historical documents separate from the requested outcome.

- **Inspected paths:** [Files, directories, manifests, tests, or configuration]
- **Current behavior:** [What the repository does now]
- **Relevant constraints:** [Architecture, dependency, accessibility, performance, security, or scope rules]
- **Duplicated or outdated guidance:** [Finding and authoritative replacement, or `None found`]

### Assumptions and open decisions

- **Safe assumptions:** [Reversible assumptions that do not materially change scope, or `None`]
- **Open decisions:** [Only decisions that can change behavior, architecture, or acceptance, or `None`]

## Scope

### In scope

- [Required deliverable or behavior]

### Out of scope

- [Explicit non-goal]

### Protected areas

- `[Path, behavior, or public contract]` — [Why it must remain unchanged]

## Planned changes

List paths only after inspecting the repository. Mark new paths as `Proposed`.

| Path              | Status   | Planned change | Boundary or reason              |
| ----------------- | -------- | -------------- | ------------------------------- |
| `[existing/path]` | Existing | [Modify]       | [Why this is the correct owner] |
| `[proposed/path]` | Proposed | [Create]       | [Why it is needed]              |

### Implementation sequence

1. [Smallest safe change]
2. [Integration or behavior change]
3. [Tests, documentation, and final review]

## Dependencies and risks

- **Internal dependencies:** [Packages, services, tokens, contracts, or `None`]
- **External dependencies:** [New dependency and rationale, or `None`]
- **Primary risks:** [Concrete failure modes]
- **Mitigations:** [Prevention, fallback, or rollback]

## Validation plan

Map every command or manual check to a changed behavior or acceptance criterion. Documentation-only work normally needs formatting, link, content, and diff review rather than application builds.

```bash
# Replace with the narrowest relevant commands.
pnpm -F frontend exec tsc --noEmit
pnpm test
```

### Manual checks

1. [Action and expected result]

## Completion record

Complete this section after implementation. Do not mark the task complete until every required criterion has evidence or an explicitly reported blocker.

- **Outcome:** [Concise summary of delivered behavior or artifact]
- **Files changed:** [Created and modified paths]
- **Acceptance evidence:** [Criterion mapped to test, command, inspection, or observable result]
- **Validation results:** [Exact commands/checks and pass/fail result]
- **Deviations from plan:** [What changed and why, or `None`]
- **Remaining work:** [Follow-up with owner, or `None`]
