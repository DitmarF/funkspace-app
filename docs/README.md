# Documentation

Start with the [repository README](../README.md) for the live project, setup and primary checks. This index points to current contracts and keeps dated plans and evidence available for deeper review.

## Understand the system

- [Architecture overview](architecture.md): frontend layers, providers, contact, motion, dialogs and game boundary.
- [Workspace responsibilities](architecture/packages.md): package ownership and allowed dependencies.
- [Design tokens](architecture/design-tokens.md): token sources, generated outputs and proposed evolution.
- [Architecture decisions](decisions/): the monorepo, token source of truth, interactive-experience boundary and Wave Survivor architecture.
- [Motion foundations](motion.md): shared timing and runtime concepts.

## Run and operate

- [Contact server](development/contact-server.md): server-side contract and safe setup.
- [Contact operations](development/contact-operations.md): provider, delivery, protection and recovery authority.
- [Controlled contact preview](development/contact-manual-preview.md): isolated fake-delivery fixture for manual checks.
- [Portfolio release and recovery](development/portfolio-release.md): release configuration and recovery guidance; the rollout record provides current evidence.
- [AI-assisted development workflow](development/ai-workflow.md): planning, implementation, review and validation.

## Roadmap and evidence

- [Portfolio milestone](features/funkspace-minimum-usable.md): current milestone status and links to accepted decisions.
- [Public rollout](tasks/fs-6.5-public-rollout.md) and [portfolio closure / game handoff](tasks/fs-6.6-portfolio-closure-game-handoff.md): deployed identity, acceptance, follow-ups and the separate game continuation.
- [Wave Survivor implementation plan](features/wave-survivor-implementation-plan.md): accepted standalone game and future portfolio play work.
- [Task records](tasks/): dated design decisions, validation and handoffs. Older pending statuses describe their original checkpoints; follow later linked decisions for current status. Some historical evidence links point to paths on the original machine, such as `/private/tmp/` or `/Users/...`; those files are unavailable to external readers unless separately transferred.
- [Historical reference material](global/): supplied source material, not current implementation instructions.

The detailed EPIC 5 contact plan was removed from the current tree after its historical checkpoint. Existing contract references point to its [preserved 27 October Git revision](https://github.com/DitmarF/funkspace-app/blob/07a75a713242a0b6b4d8fde336856b13a8033e44/docs/features/FunkSpace_EPIC_5_Detailed_Plan.md); current operation and release evidence are linked above. The historical deletion reason was not established, and the original deletion is preserved.
