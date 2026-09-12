# Repository maintenance — Branch and Dependabot review, 2026-09-12

## Task metadata

- **Status:** Cleanup executed and verified; configuration improvement prepared on the portfolio branch. Default-branch activation remains a separately authorized integration.
- **Owner/current writer:** Codex; Dimi requested repository review, bounded improvements and closure of unnecessary branches. This is separate authorized maintenance, not a new portfolio task or permission to implement EPIC 1.
- **Input:** clean `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, full SHA `e69c4526e955666966248c9611c2db511faa377a`; GitHub confirms the same portfolio head. Previous FS-G0 documentation was already committed/pushed, so no empty initial commit was created.
- **Workflow:** [AGENTS](../../AGENTS.md), [task template](../templates/task.md), [AI workflow](../development/ai-workflow.md), [FS-0.3 retention/integration evidence](fs-0.3-branch-integration-decision.md), [FS-0.2 owned dependency findings](fs-0.2-tooling-baseline.md#dependencysecurity-review).

## Requested outcome and scope

Review the roughly 25 repository branches, improve demonstrated branch/dependency maintenance problems, preserve valuable work and close unnecessary branches. Inspect actual patches, ancestry, tracking, PR ownership and exact-head CI before deletion. The request authorizes this cleanup; it does not justify accepting every dependency update or merging the portfolio into production.

No dependency version, lockfile, application/game code, runtime public contract, coverage threshold, contrast filter or CI workflow was changed. The only tracked configuration change is `.github/dependabot.yml`; this task record holds evidence and the disposition register.

## Inspection and findings

Live GitHub inspection found **25 branches and 22 open Dependabot PRs**, all targeting `main`. Main remains `9f3f01d8e2745408a8523c07198aec0e73eed52b`; accepted game branch remains `988f64e298ba885671433468a12454d7f4c41137`. The active portfolio branch remains protected from cleanup. Its development history and accepted standalone game are retained.

Every dependency branch contains one unique bot-authored update commit changing only manifests/the shared lockfile or the CI action reference. These are proposed dependency changes, not already-integrated work. At inspection, #253 has main as its parent; the other 21 proposals diverge by one commit on each side. Behind-main status, branch age and bot ownership alone are not deletion reasons. Exact branch SHAs, commit/files/manifest deltas, PR metadata and CI snapshots are saved in the nonsecret local evidence directory below.

### BR-01 — Duplicate pnpm jobs create unusable proposals

The old config schedules npm independently at `/`, `/frontend`, `/backend` and `/common`, each with a ten-PR limit. The root job already updates frontend manifests together with the shared root `pnpm-lock.yaml` (for example #258, #268, #270, #271 and #273). There is no backend package manifest. The separate frontend job produces ten manifest-only proposals, none updating the shared lockfile. All ten have failed CI; sampled full logs for #254 and #255 show `ERR_PNPM_OUTDATED_LOCKFILE` at the frozen install. This is a verified configuration/path defect, not a reason to disable frozen installation.

Four of those proposals duplicate a retained working root proposal: #254 → #270, #259 → #273, #263 → #271, #269 → #268. The other six carry desired updates that remain follow-up requirements: #255 autoprefixer 10.5.4; #257 @storybook/react 10.5.10; #261 react 19.2.8; #264 @storybook/nextjs-vite 10.5.10; #266 react-dom 19.2.8; #267 postcss 8.5.26. Closing their malformed branches does not reject those upgrades or establish their safety. Codex owns fresh root-workspace replacements/compatibility review in the next dependency-maintenance task, before any affected dependency acceptance; React/React DOM/types and the Storybook family must be coordinated. FS-0.2 security deadlines still apply where relevant.

### BR-02 — Too many independently proposed related updates

The bounded config improvement uses one npm job at `/` for the actual pnpm workspace and shared lockfile, with groups for Storybook, Next/React and companions, remaining development dependencies and remaining production dependencies. First-match ordering keeps family members together before broad groups. Minor/patch grouping preserves the existing major-version ignore rule. Weekly Monday 05:00 UTC scheduling remains unchanged; the npm version-update PR limit becomes four. The Actions job remains enabled, groups its version proposals and has a limit of two. No action version is upgraded by this config change.

Groups explicitly apply to **version updates**. No alerts are dismissed, security-update setting changed, blanket dependency ignore added or auto-merge enabled. The options and first-match/group behavior were checked against the [official Dependabot reference](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference) and [grouping guide](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/optimizing-pr-creation-version-updates), accessed 2026-09-12.

This patch is on the portfolio branch. Dependabot normally reads the default-branch configuration, so this review does **not** claim the new policy is active on GitHub yet. Main integration needs an exact reviewed change and approval accounting for its automatic CI/deployment consequences. Existing closed versions are not guaranteed to reopen automatically; the six replacement requirements above remain explicit. [Default-branch configuration](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configuring-dependabot-version-updates).

### BR-03 — Security inventory access limit

The live alerts endpoint returned HTTP 403 with “Dependabot alerts are disabled for this repository” and an additional CLI scope hint. This is an observed response, not proof of a complete vulnerability inventory or authorization to change account scopes/settings. Existing FS-0.2 dependency findings remain open. Dimi owns any decision to enable/configure alert access; Codex must inspect current advisories and compatibility before accepting relevant upgrades. This review does not re-audit/install a new graph or claim that closed PRs were free of security relevance.

## Branch and PR disposition

The following exact-head CI conclusions were inspected, not rerun here. Passing old-head CI is useful evidence for retaining a proposal, not permission to merge it into current main. Vercel status and mergeability snapshots are in the artifact; they do not establish current production safety.

| PR                                                        | Inspected full head                        | Proposal                                                                          | Recorded CI | Disposition                                                                                    |
| --------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| [#252](https://github.com/DitmarF/funkspace-app/pull/252) | `04a97dc479104482a28e7eb7dd8f54c16be9c15e` | chore(deps): bump actions/checkout from 4 to 7                                    | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#253](https://github.com/DitmarF/funkspace-app/pull/253) | `f56df269e0c579bfd45c75e0fdaf6c871f2b6f47` | chore(deps): bump actions/setup-node from 4 to 7                                  | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#254](https://github.com/DitmarF/funkspace-app/pull/254) | `a880d62d4525089ca1af7a69a03babbfa2cd487f` | chore(deps-dev): bump @storybook/addon-themes from 10.0.3 to 10.5.10 in /frontend | FAILURE     | Closed; manifest-only duplicate of retained #270                                               |
| [#255](https://github.com/DitmarF/funkspace-app/pull/255) | `1425908cb328af0df0297654a55b21e8b8bafd8a` | chore(deps-dev): bump autoprefixer from 10.4.21 to 10.5.4 in /frontend            | FAILURE     | Closed malformed per-directory proposal; retain desired update for a root-lockfile replacement |
| [#256](https://github.com/DitmarF/funkspace-app/pull/256) | `cf85597ef48b2e2584d7ac880d8c4c979b685643` | chore(deps-dev): bump @eslint/eslintrc from 3.3.1 to 3.3.6                        | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#257](https://github.com/DitmarF/funkspace-app/pull/257) | `688531d2fdba8e179ce9cc5fafd5ba084315b892` | chore(deps-dev): bump @storybook/react from 10.0.6 to 10.5.10 in /frontend        | FAILURE     | Closed malformed per-directory proposal; retain desired update for a root-lockfile replacement |
| [#258](https://github.com/DitmarF/funkspace-app/pull/258) | `8db40f2e2772ec5a973537ea2c2e985b677fe9d2` | chore(deps-dev): bump @storybook/addon-a11y from 10.0.3 to 10.5.10                | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#259](https://github.com/DitmarF/funkspace-app/pull/259) | `95c4380c5219afd897aacb1add203eb9dedff8aa` | chore(deps-dev): bump storybook from 10.0.6 to 10.5.10 in /frontend               | FAILURE     | Closed; manifest-only duplicate of retained #273                                               |
| [#260](https://github.com/DitmarF/funkspace-app/pull/260) | `854958024507e434f144965128bf9569326c87d7` | chore(deps-dev): bump tsx from 4.20.6 to 4.23.12                                  | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#261](https://github.com/DitmarF/funkspace-app/pull/261) | `bb7acca6b91610e085b5e3d71c700181f0d5aded` | chore(deps): bump react and @types/react in /frontend                             | FAILURE     | Closed malformed per-directory proposal; retain desired update for a root-lockfile replacement |
| [#262](https://github.com/DitmarF/funkspace-app/pull/262) | `59eec805903dec8b97ab4826924af3cd09ec07de` | chore(deps-dev): bump @types/node from 20.19.4 to 20.19.43                        | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#263](https://github.com/DitmarF/funkspace-app/pull/263) | `22a6bc584b2e59118c7d3287eed60fb0ee5c0d82` | chore(deps): bump framer-motion from 12.23.24 to 12.43.0 in /frontend             | FAILURE     | Closed; manifest-only duplicate of retained #271                                               |
| [#264](https://github.com/DitmarF/funkspace-app/pull/264) | `82f1790025a5086459fe2da01d5082cb85535a4e` | chore(deps-dev): bump @storybook/nextjs-vite from 10.0.3 to 10.5.10 in /frontend  | FAILURE     | Closed malformed per-directory proposal; retain desired update for a root-lockfile replacement |
| [#265](https://github.com/DitmarF/funkspace-app/pull/265) | `ba022546b98fd46ad2e517dd029c571519988d1e` | chore(deps-dev): bump style-dictionary from 5.1.1 to 5.5.2                        | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#266](https://github.com/DitmarF/funkspace-app/pull/266) | `ae9abe3e944e3e77c4b0d13a9d5543f195a1251a` | chore(deps): bump react-dom and @types/react-dom in /frontend                     | FAILURE     | Closed malformed per-directory proposal; retain desired update for a root-lockfile replacement |
| [#267](https://github.com/DitmarF/funkspace-app/pull/267) | `0d115a1564a9ab059259fbb232f2592035d3fe00` | chore(deps-dev): bump postcss from 8.5.6 to 8.5.26 in /frontend                   | FAILURE     | Closed malformed per-directory proposal; retain desired update for a root-lockfile replacement |
| [#268](https://github.com/DitmarF/funkspace-app/pull/268) | `a0f50c3c3e7d4e740a81acdedaa3cdd3e2beb959` | chore(deps-dev): bump @storybook/addon-docs from 10.0.3 to 10.5.10                | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#269](https://github.com/DitmarF/funkspace-app/pull/269) | `03eebdd2ab248b2a484ce127444c037fa45884e7` | chore(deps-dev): bump @storybook/addon-docs from 10.0.3 to 10.5.10 in /frontend   | FAILURE     | Closed; manifest-only duplicate of retained #268                                               |
| [#270](https://github.com/DitmarF/funkspace-app/pull/270) | `dd9bb44c941f63a176164d457c3f650e7c8286e5` | chore(deps-dev): bump @storybook/addon-themes from 10.0.3 to 10.5.10              | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#271](https://github.com/DitmarF/funkspace-app/pull/271) | `d25bbfdb0630e01221a1d479bb0f5574ab1e70b7` | chore(deps): bump framer-motion from 12.23.24 to 12.43.0                          | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#272](https://github.com/DitmarF/funkspace-app/pull/272) | `595f0c426c6997806a52f97dc841a93b147c543a` | chore(deps-dev): bump @testing-library/user-event from 14.6.1 to 14.6.5           | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |
| [#273](https://github.com/DitmarF/funkspace-app/pull/273) | `a6c17a1169ccf8af48ddc7bc2b165139ea817771` | chore(deps-dev): bump storybook from 10.0.6 to 10.5.10                            | SUCCESS     | Keep: unique root-lockfile or Actions update proposal; review and refresh CI before any merge  |

Retain all twelve passing root/Actions proposals: #252, #253, #256, #258, #260, #262, #265, #268, #270, #271, #272, #273. They contain unique unmerged updates; several concern dependency families with owned security findings. They are not unnecessary merely because Dependabot created them. A future reviewed grouped replacement or accepted integration can make their branches disposable.

The local-only `docs/expand-agent-guide` branch at `b5eec35` was separately verified as an ancestor of main and not checked out in any target-repository worktree. Its content is retained in main and the recovery bundle; ordinary `git branch -d` removed it. The accepted game branch is kept because it remains a named protected baseline/handoff reference, even though squash-integrated content is verified retained.

## Execution and recovery

Before deletion, Codex created and verified `/private/tmp/funkspace-branch-review/retained-branches.bundle`, containing all 25 observed remote heads and the merged local documentation branch. Full branch SHAs, each PR patch and inspection metadata are retained beside it. The bundle is a recovery artifact, not a new set of remote backup branches.

For PRs #254, #255, #257, #259, #261, #263, #264, #266, #267 and #269, fresh API reads verified open state, bot ownership, exact branch name and unchanged reviewed head immediately before closure. Each was closed without merging. No PR comments/messages or dependency changes were sent.

An attempted atomic branch-deletion push used an exact-SHA lease for every target. It was rejected because several refs had already disappeared after closure; atomic rejection changed none of the remaining refs. Fresh `ls-remote` and GitHub branch/PR reads then verified **all ten closed branches absent**, **15 remote branches remaining**, and **12 PRs still open**. No blind retry or history rewrite was performed. Eleven specifically verified-absent remote-tracking refs (the ten closed branches plus the old documentation ref) were removed with expected-old-SHA guards; no broad prune/reset/clean occurred.

## Validation and limits

- **PASS:** initial clean/current pushed state; complete 25-branch and 22-PR inventory; patch/file scope and exact-head checks; known game/main/portfolio retention and merged-doc ancestry.
- **PASS:** recovery bundle verification, ten actual closed/unmerged PR responses and fresh remote absence/count checks. The rejected atomic deletion is retained as an expected safety-guard outcome, not hidden as a successful push.
- **PASS:** YAML parse, two-job/root-workspace structure, group matching/ordering, unchanged major-ignore/security/schedule behavior and targeted Prettier/diff checks. Original package manifests, lockfile, runtime/assets and protected separate clone remain unchanged.
- **FAIL, historical PR CI:** all ten per-frontend proposals; representative logs prove frozen-lockfile mismatch. Existing twelve proposal CI runs passed at their recorded heads, not at a new merged candidate.
- **BLOCKED:** full live Dependabot security-alert inventory (HTTP 403). No permissions or security settings changed.
- **NOT RUN:** application builds/tests, new install/audit, actual hosted Dependabot execution of the proposed config, live production/provider checks and new dependency compatibility testing. These are not implied by YAML validation.

Artifacts: `/private/tmp/funkspace-branch-review/` contains before/after branches and PRs, all 22 patches, exact-head CI summaries, sampled failed logs, closure results, recovery bundle and validation/diff evidence. Local artifacts must be explicitly shared with another environment; they are not assumed remotely accessible. The review creates no independent-review claim.

## Completion and next actions

Cleanup reduced remote branches from 25 to 15, closed the ten malformed proposals, removed the merged local documentation branch and retained all unique accepted work and twelve useful proposals. The config patch addresses the demonstrated cause without modifying the installed/locked dependency graph or portfolio scope.

Codex owns root-workspace replacement/update review and fresh validation before merging any dependency change. Dimi's next approval point for activating the configuration is its particular integration into `main`, including automatic deployment consequences; this task does not merge the portfolio or grant that action. Dimi separately owns any security-alert enablement/access decision. FS-1.1 remains the next portfolio task; this maintenance does not begin it.
