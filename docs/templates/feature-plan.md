# Feature plan: [Feature name]

> Copy this file to `docs/features/<feature-slug>.md`. Replace bracketed placeholders, remove guidance that does not apply, and keep an explicit `Not applicable` with a reason when omitting a concern. Base the plan on inspected repository evidence rather than assumptions.

## Plan metadata

- **Status:** Draft | Ready for review | Approved | In progress | Complete
- **Owner:** [Person or team]
- **Related epic/task:** [Reference]
- **Target release:** [Release, milestone, or `Not scheduled`]
- **Last updated:** YYYY-MM-DD
- **Related ADRs:** [Links to relevant files in `docs/decisions/`]

Before implementation, separate what is known from what still needs a decision:

- **Verified facts:** [Current behavior, inspected paths, configuration, or measurements]
- **Assumptions:** [Safe, reversible assumptions used by this plan]
- **Open questions:** [Only questions that could materially change scope, behavior, or architecture]

## Goal

[Describe the desired outcome in one or two sentences. State the result, not the implementation.]

### In scope

- [Required capability or deliverable]

### Out of scope

- [Explicit non-goal that prevents scope drift]

## User value

### Primary user

[Who benefits from this work?]

### User story

As a [user], I want [capability], so that [value].

### Success evidence

- [Observable behavior, metric, feedback, or operational improvement]

## Current problem

[Describe the current behavior, limitation, or failure. Include evidence and concrete repository paths where relevant.]

- **Affected workflow:** [What users or maintainers do today]
- **Root cause or constraint:** [Known cause, architectural constraint, or `Unknown - investigation required`]
- **Cost of not changing:** [User, maintenance, accessibility, performance, or delivery impact]

## Proposed solution

[Summarize the smallest coherent solution and how it addresses the problem.]

### User flow or behavior

1. [Starting state or user action]
2. [System response]
3. [Successful result]

### Key implementation decisions

- [Decision and brief rationale]
- [Existing component, service, port, or token to reuse]
- [Fallback, disabled, empty, error, and reduced-motion behavior]

### Delivery sequence

1. [Smallest independently verifiable step]
2. [Next implementation step]
3. [Integration, migration, rollout, or cleanup step]

### Rollout and rollback

- **Feature flag:** [Name and safe default, or `Not required`]
- **Rollout:** [Preview, staged, immediate, or migration plan]
- **Rollback:** [How to disable or revert without data loss]

## Architecture impact

Review `AGENTS.md`, `docs/architecture.md`, and relevant ADRs before completing this section. New decisions that conflict with or extend accepted ADRs require a new ADR.

| Layer or concern           | Planned change                                        | Boundary or contract            | Why it belongs here |
| -------------------------- | ----------------------------------------------------- | ------------------------------- | ------------------- |
| Domain                     | [Pure rules/types, or `None`]                         | [Inputs/outputs/ports]          | [Reason]            |
| Application                | [Use cases/orchestration, or `None`]                  | [Service contract]              | [Reason]            |
| Infrastructure             | [Browser/storage/network/renderer adapter, or `None`] | [Implemented port]              | [Reason]            |
| Presentation               | [Route/component/hook, or `None`]                     | [Props/user interaction]        | [Reason]            |
| Tokens/design system       | [Token/component impact, or `None`]                   | [Shared semantic token/API]     | [Reason]            |
| Data, privacy, or security | [Data flow/storage/input impact, or `None`]           | [Validation/retention boundary] | [Reason]            |

### Dependency direction check

- [ ] Domain remains framework-free and deterministic.
- [ ] Application depends on Domain abstractions, not concrete adapters.
- [ ] Presentation does not introduce direct Infrastructure dependencies.
- [ ] Cross-layer construction remains in the composition root.
- [ ] Interactive work remains isolated according to ADR-003.
- [ ] Any exception is documented and approved before implementation.

## Files affected

List expected changes after inspecting the repository. Mark uncertain paths as `Proposed`; do not invent files and present them as existing.

| Path                          | Status   | Change   | Reason    |
| ----------------------------- | -------- | -------- | --------- |
| `[existing/or/proposed/path]` | Existing | [Modify] | [Purpose] |
| `[proposed/path]`             | Proposed | [Create] | [Purpose] |

### Files or areas intentionally unchanged

- `[path or area]` - [Why it is outside scope or protected]

## Dependencies

### Internal dependencies

- [Existing component, service, port, token, workspace, or `None`]

### External dependencies

- [Package/service and version constraint, or `None`]
- **Rationale:** [Why existing capabilities are insufficient]
- **Alternatives reviewed:** [Smaller or existing options considered]
- **Operational impact:** [Bundle size, license, security, network, build, or maintenance impact]

### Environment and coordination

- **Environment variables/configuration:** [Changes or `None`]
- **Content/design/assets:** [Required inputs or `None`]
- **External approval or migration:** [Required action or `None`]

## Risks

Include product and technical risks. Accessibility, performance, security/privacy, data loss, compatibility, and rollout should be considered explicitly.

| Risk                    | Likelihood      | Impact          | Mitigation                      | Verification                   |
| ----------------------- | --------------- | --------------- | ------------------------------- | ------------------------------ |
| [Specific failure mode] | Low/Medium/High | Low/Medium/High | [Preventive action or fallback] | [Test, measurement, or review] |

## Testing strategy

Tests should map to behavior and risk. Use `Not required` with a reason instead of silently skipping a level.

| Level                   | Coverage planned                       | Key cases                                      |
| ----------------------- | -------------------------------------- | ---------------------------------------------- |
| Domain/unit             | [Test files or `Not required`]         | [Rules, boundaries, deterministic state]       |
| Application/integration | [Test files or `Not required`]         | [Use cases and adapter contracts]              |
| Component/hook          | [Test files or `Not required`]         | [User behavior, keyboard, states]              |
| Storybook/visual        | [Stories or `Not required`]            | [Themes, responsive states, reduced motion]    |
| End-to-end              | [Playwright specs or `Not required`]   | [Critical user flow and fallback]              |
| Accessibility           | [Automated/manual checks]              | [Semantics, focus, keyboard, contrast, motion] |
| Performance             | [Budget/measurement or `Not required`] | [Bundle, LCP/INP/CLS, frame lifecycle]         |

### Validation commands

Run only the checks relevant to the change, starting with the narrowest affected scope.

```bash
# Replace with the exact commands this feature requires.
pnpm -F frontend exec tsc --noEmit
pnpm lint
pnpm test
pnpm build
```

### Manual verification

1. [Setup and starting state]
2. [Action]
3. [Expected observable result]

## Acceptance criteria

Write criteria as independently verifiable outcomes. Avoid implementation-only statements such as "component exists" unless the artifact itself is the deliverable.

- [ ] Given [starting condition], when [action], then [observable result].
- [ ] [Accessibility, reduced-motion, or keyboard outcome].
- [ ] [Failure, empty, disabled, or rollback outcome].
- [ ] [Performance or quality threshold, when relevant].
- [ ] Relevant tests and validation commands pass.
- [ ] Documentation and feature flags reflect the delivered behavior.

### Acceptance evidence

| Criterion           | Evidence or test                                                      |
| ------------------- | --------------------------------------------------------------------- |
| [Criterion summary] | [Automated test, manual result, screenshot, measurement, or document] |

## Implementation handoff

Complete this section when the plan is approved or handed to another human or AI agent.

- **Recommended first step:** [Small, safe starting action]
- **Do not change:** [Protected behavior, paths, or contracts]
- **Known blockers:** [Blocker and owner, or `None`]
- **Completion summary expected:** [What the implementer must report]
