# Architecture review checklist

Use this checklist before merging AI-generated changes. Review the final diff and repository state, not only the implementation summary. Mark every item as complete or `Not applicable` with a brief reason; unresolved items block approval.

## Review metadata

- **Change or task:** [Reference]
- **Reviewer:** [Name]
- **Date:** YYYY-MM-DD
- **Relevant plans or ADRs:** [Links or `None`]

## Scope and duplication

- [ ] The final diff contains only changes required by the task.
- [ ] Existing components, services, ports, utilities, tokens, and package APIs were inspected before adding new functionality.
- [ ] **Does this duplicate existing functionality?** If yes, the duplication is removed or explicitly justified.
- [ ] Unrelated user changes and protected generated files remain untouched.

**Evidence or notes:** [Paths inspected, reused implementation, or justification]

## Dependencies and boundaries

- [ ] **Are dependencies correct?** Imports follow the repository and Clean Architecture dependency direction.
- [ ] Domain remains framework-free and deterministic.
- [ ] Application depends on Domain abstractions rather than concrete Infrastructure implementations.
- [ ] Presentation does not introduce a new direct dependency on concrete Infrastructure outside an approved composition boundary.
- [ ] `common` remains platform-independent, games do not import `frontend`, and frontend game access stays inside its integration adapter.
- [ ] New external dependencies are declared by the consuming package and justified against existing capabilities.
- [ ] Public APIs are intentional and no package private source is deep-imported.

**Evidence or notes:** [Dependency scan, package manifests, or boundary explanation]

## Abstractions and complexity

- [ ] **Are abstractions justified?** Each new interface, service, adapter, utility, or shared module has a current responsibility and consumer.
- [ ] Shared code represents demonstrated reuse rather than speculative generalization.
- [ ] The solution is the smallest coherent change that satisfies the acceptance criteria.
- [ ] **Does this increase unnecessary complexity?** If complexity increased, the benefit and simpler alternatives are documented.
- [ ] Naming, ownership, lifecycle, data flow, and failure behavior are understandable without prior conversation history.

**Evidence or notes:** [Responsibility, consumers, alternatives, or simplification]

## Tests and validation

- [ ] **Are tests updated?** New or changed behavior has proportionate automated coverage.
- [ ] Tests verify behavior and public contracts rather than implementation details.
- [ ] Failure, cleanup, accessibility, reduced-motion, and boundary cases are covered where relevant.
- [ ] The narrow affected checks pass, followed by broader checks justified by the change risk.
- [ ] Validation results in the handoff match commands that were actually run; skipped or failing checks are reported.

**Evidence or notes:** [Test files, commands, results, or justified `Not applicable`]

## Documentation

- [ ] **Is documentation updated?** Public behavior, architecture, setup, configuration, and package responsibilities match the implementation.
- [ ] Relevant ADRs are preserved; a conflicting or superseding decision has its own ADR.
- [ ] Comments explain non-obvious constraints rather than restating code.
- [ ] Generated documentation and examples are current and reproducible.

**Evidence or notes:** [Updated documents, ADR review, or justified `Not applicable`]

## Final AI-change review

- [ ] The final diff was checked for accidental files, generated output, secrets, debug code, disabled assertions, and suppressed errors.
- [ ] No acceptance criterion is claimed complete without observable evidence.
- [ ] Remaining risks, assumptions, migrations, and follow-up work are explicit.
- [ ] A new AI agent could understand the delivered architecture from the repository alone.

## Review outcome

- **Decision:** Approve | Changes required
- **Blocking findings:** [List or `None`]
- **Follow-up tasks:** [List with owner or `None`]
- **Summary:** [Why the change is or is not ready to merge]
