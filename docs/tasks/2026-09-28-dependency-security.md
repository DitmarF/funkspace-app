# Dependency security remediation — 2026-09-28

## Task metadata

- **Status:** Local remediation and validation complete; ready for review/integration. Default-branch integration has not been authorized or performed, so GitHub alert closure remains pending.
- **Owner/current writer:** Codex.
- **Request:** Resolve the dependency vulnerabilities reported by GitHub after the EPIC 3 push. This is separate maintenance, not EPIC 4 implementation.
- **Candidate base:** Clean `feature/funkspace-minimum-usable`, `f4395a662bda7cd56faf55c1b44420fcd9b549a4`.
- **Observed default branch:** `main`, `31abe42d97563775272d8a99e5021f3b39bc86ab`. The local portfolio candidate and GitHub's default branch are distinct.
- **Guidance:** [AGENTS](../../AGENTS.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), [previous dependency maintenance](2026-09-12-branch-and-dependabot-review.md).

## Inspection and scope

The previous push message said 15 vulnerabilities. The fresh GitHub API returned **13 open alerts** (5 high, 3 medium, 5 low). The initial full pnpm audit returned **18 affected findings** (7 high, 4 moderate, 7 low); these counts describe different inventories and must not be equated. Inspected dependency paths put the findings in LHCI, Storybook and game build tooling. GitHub classifies some Storybook paths as runtime; this record retains that distinction instead of dismissing alerts.

Read the actual workspace manifests, lockfile, CI, Lighthouse configurations, existing tests, parent dependency ranges and installed consumer calls. Queried current registry metadata and [Puppeteer's archive implementation](https://github.com/puppeteer/puppeteer/blob/main/packages/browsers/src/fileUtil.ts). The [extract-zip fix proposal](https://github.com/max-mapper/extract-zip/pull/160) has no published patched package available; a local patch or audit suppression is not used.

Only dependency configuration, the generated lockfile and maintenance documentation change. Application behavior, theme/motion contracts, animation timing, performance budgets, CI assertions and game simulation are protected. No audit exclusions, broad framework migration, deployment, alert dismissal, commit, push or merge are part of this change.

## Remediation and compatibility decisions

| Owning path                                 | Before → after                                                               | Reason and compatibility boundary                                                                                                                                                                                                                               |
| ------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Game Vite → esbuild                         | Vite `7.3.5` → `7.3.6`; vulnerable esbuild `0.27.7` removed, `0.28.2` reused | Vite patch release explicitly supports the patched esbuild range. No Vite major migration.                                                                                                                                                                      |
| Storybook Next-Vite → image-size            | `2.0.2` → `2.0.4`                                                            | Compatible 2.x image-parser security fixes.                                                                                                                                                                                                                     |
| Storybook optional Webpack peer             | `5.102.1` → `5.111.1`                                                        | Scoped vulnerable-version override retains Webpack 5 and repairs both HTTP-loader advisories.                                                                                                                                                                   |
| LHCI → Express                              | `4.21.2` → `4.22.3`                                                          | Retains Express 4; resolves `qs` to `6.16.0`, `path-to-regexp` to `0.1.13`, and `body-parser` to `1.20.8`, including findings newer than the GitHub snapshot.                                                                                                   |
| LHCI / external-editor → tmp                | `0.1.0` / `0.0.33` → `0.2.7`                                                 | Parent-scoped overrides retain used synchronous file/directory APIs and cleanup while rejecting unsafe path components.                                                                                                                                         |
| LHCI → uuid                                 | `8.3.2` → `11.1.1`                                                           | Parent-scoped override retains the CommonJS `v4()` API used by LHCI; avoids later ESM-only majors.                                                                                                                                                              |
| Lighthouse → Puppeteer → browser downloader | Puppeteer `24.28.0` → `25.12.0`; browsers `2.10.13` → `3.2.3`                | All available Puppeteer 24 releases still depend on vulnerable `extract-zip`. The narrow Lighthouse override removes that package while retaining **Lighthouse 12.6.1's measurement model**. Requires Node >=22.12, within the repository's >=22.13.1 contract. |
| Downloader optional peers                   | `proxy-agent 8.0.1`, `yauzl 3.4.0`                                           | A version-scoped package extension supplies supported proxy and ZIP fallback peers under Puppeteer, instead of accidentally inheriting LHCI's incompatible proxy 6. LHCI itself retains proxy 6.                                                                |

Compatible lockfile refresh was restricted to named vulnerable packages, with explicit transitive depth. Their dependency closures include normal supporting package/platform changes, including Rollup `4.63.2` → `4.63.5`. The final frozen install succeeds. Remove the scoped overrides/extensions when owning upstream releases supply these fixes; re-run compatibility and audits when changing them.

## Validation and evidence

Evidence directory on this machine: `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/dependency-security-2026-09-28/`. Artifacts are not assumed accessible from another machine. The tracked record summarizes results; raw audit snapshots, logs, compatibility script and exact dependency patch are retained there.

The executable dependency patch against the recorded base has SHA-256 `1e3b1711a3931f2af29084b6b63d763055f4b5dee4cc0f5ab33ac334e5fddb41`; `dependency-candidate.json` records each configuration/lockfile hash. No source or generated application file is part of that patch.

- **PASS:** Fresh `pnpm audit --json`: **0 vulnerabilities** across all severities. `pnpm audit --prod --json`: **0 vulnerabilities**. This means no currently reported advisories in this dependency graph, not proof that all dependencies are defect-free.
- **PASS:** `pnpm install --frozen-lockfile`.
- **PASS:** `pnpm test`: **1,597 tests / 106 files**.
- **PASS:** Frontend types, `pnpm typecheck:validation` (stories/E2E/configs) and standalone game types.
- **PASS:** `pnpm lint`, including generated theme-bootstrap freshness and repository formatting.
- **PASS:** Fresh flag-on `pnpm build`, `pnpm storybook:build`, standalone `demo:build`.
- **PASS:** Local compatibility smoke: LHCI temporary file/directory creation and cleanup; unsafe prefix rejection; UUID v4; supported proxy construction; native and JavaScript ZIP extraction; escaping ZIP symlink rejected without writing outside the fixture directory. This does not prove every hostile archive shape safe or execute Windows extraction.
- **PASS:** `pnpm -F @funkspace/wave-survivor test`: **920 tests / 58 files**.
- **PASS with existing warning:** `pnpm exec lhci autorun --config=lighthouse.security.json` against the fresh flag-on build: all three collections and error-level assertions succeed. LCP **3,090.498 / 3,105.268 / 3,070.956 ms**, CLS **0**; performance score **0.82** remains a warning under the unchanged 0.90 warning threshold. Browser tests ran concurrently, so these are adapter/measurement-availability checks, not a controlled performance comparison or new device acceptance. The committed 5,000 ms LCP budget, CLS limit, three-run count and throttling are unchanged; only the local port/report directory differ.
- **PASS:** `PLAYWRIGHT_BROWSERS_PATH=0 FS35_AVAILABLE=true NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm exec playwright test --config playwright.security.config.ts`: **218/218 production Chromium tests**, zero retries, 4.3 minutes. Includes navigation/focus/history, blocked storage, appearance/motion, responsive accessibility, startup and no-JavaScript behavior.
- **PASS:** Final dependency diff review, local documentation links and formatting, whitespace check, and generated theme/token output comparison. Only the three dependency files and two maintenance records change; the base/branch remain unchanged.

The first browser command omitted `FS35_AVAILABLE=true` while testing a flag-on build. Its false expectation caused animation assertions to fail; the run was interrupted (exit 130) and retained as `e2e.log`. The corrected command sets both `FS35_AVAILABLE=true` and `NEXT_PUBLIC_ANIMATIONS_ENABLED=true`, uses the same tests with zero retries and is recorded separately as `e2e-corrected.log`. This is a test-invocation correction, not an application fix, skipped test or assertion change.

Builds use an isolated source copy at `/tmp/funkspace-security-20260928` with the installed patched graph. The existing development server on port 3000 is preserved. Local ports and artifact destinations may differ from committed test configurations; no assertions or retries are weakened.

## Handoff and remaining limitations

The existing `storybook-design-token 4.1.0` peer warning (`storybook ^9` versus installed 10.5.10) predates this fix; Storybook still builds. It is not suppressed or represented as a security finding. The new downloader peer mismatch was resolved, not ignored.

GitHub alerts will remain open until the reviewed dependency change reaches **main** and GitHub rescans it. A local zero audit does not close those alerts. Dimi owns authorization for a concrete commit/PR/default-branch integration; Codex owns preparing and checking that integration against main without merging portfolio feature work accidentally. No public-release or deployment approval is implied. Windows/Linux downloader execution and fresh remote CI remain unverified locally. A separate flag-off rebuild, dedicated Storybook/game browser suites and physical-device tests were not rerun for this tooling correction. No independent-review claim is made.
