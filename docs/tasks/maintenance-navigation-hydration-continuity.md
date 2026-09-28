# Preserve active native navigation during hydration

## Task and candidate

- **Date:** 2026-09-28.
- **Owner/current writer:** Sites implementation; independent Codex read-only review PASS, recorded below.
- **Status:** Implemented and independently reviewed; Dimi authorized commit/push on 2026-09-28. No new device acceptance is claimed.
- **Base:** `feature/funkspace-minimum-usable`, `602f8c3a275c946bab92d56c9af18318968a344d`; clean starting tree.
- **Request:** Resolve P2 Finding 1: hydration must not discard an open native navigation disclosure or move its focused summary/link to the document body.
- **Prerequisites:** [Authoritative feature plan](../features/funkspace-minimum-usable.md), [preceding reload correction](maintenance-navigation-spacing-reload.md), [FS-3.2 contract](fs-3.2-navigation-focus-contract.md), [navigation lifecycle evidence](fs-3.2-navigation-lifecycle.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md), and local `/Users/dimi/Downloads/FunkSpace_EPIC_3_Detailed_Plan.md` sections 3.2, 3.3 and 5. Historical references are not reset targets.

## Reproduction and bounded correction

The readiness effect unconditionally replaced the native disclosure. The new 375px delayed-script test reproduced the reported failure in the actual Next.js `/privacy` route: after hydration, the previously focused summary no longer existed. This is fresh application evidence, separate from the reviewer's isolated DOM experiment.

Defer enhancement while the native disclosure is open **or** contains focus. Closing it while its summary remains focused does not replace that summary. Once it is closed and focus leaves, install the existing enhanced Menu without moving the new focus target. An untouched disclosure still enhances immediately after setup, with identical artwork/coordinates and no intermediate label or marker. A retained fallback's Settings controls become available only after that interaction ends; no second settings/modal interface is introduced.

### Contract and ownership

- Add `whenFallbackIdle(disclosure, notify): () => void` to the existing `PortfolioNavigationHandoffPort<TFocus>`. It notifies once, asynchronously, when the connected disclosure is closed and does not contain the active element. The returned cleanup removes observation and invalidates queued notification.
- The existing DOM adapter owns `toggle` and `focusout` listeners. It coalesces a single microtask to inspect final focus/open state after the native event, rather than using a delay or polling. It removes both listeners before notifying. Disposal, detachment, new focus and a rapid reopen prevent stale notification.
- `PortfolioNavigation` owns the disclosure ref and subscription cleanup. Its idle callback synchronously commits the readiness change, so another input cannot reopen/focus the old disclosure between the adapter's decision and React's replacement. The callback is always asynchronous to setup, outside a React lifecycle call.
- No changes to Dialog/native restoration, provider composition, route identities, CSS, hex artwork, theme/motion authorities, preferences, generated files, game time or deployment configuration. The single existing modal is absent while fallback interaction continues, then mounts through the existing path.

## Files

- `frontend/domain/ports/PortfolioNavigationHandoffPort.ts`: narrow idle-notification contract.
- `frontend/infrastructure/dom/PortfolioNavigationHandoff.ts`: bounded observation inside the existing adapter.
- `frontend/components/Layouts/PortfolioNavigation.tsx`: defer enhancement and own cleanup.
- `frontend/infrastructure/dom/PortfolioNavigationFallback.test.ts`: idle/open/focus behavior, rapid reentry, listener removal, detachment, disposal and repeat setup/cleanup/setup.
- `frontend/components/Layouts/PortfolioNavigation.test.tsx`: asynchronous adapter fixture and readiness assertion.
- `e2e/navigation-hydration.spec.ts`: six real-route continuity regressions.
- `e2e/navigation-visual-regressions.spec.ts`: retain idle pixel/geometry checks; active fallback replacement is no longer the expected behavior.
- This record, the preceding correction record and feature-plan reference.

## Executed validation

- **Baseline FAIL as expected:** `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs-nav-hydration/playwright.config.cjs e2e/navigation-hydration.spec.ts --grep '375px.*open summary'` — focused summary removed after script release on the unmodified application.
- **PASS, focused unit:** `pnpm exec vitest run frontend/infrastructure/dom/PortfolioNavigationFallback.test.ts frontend/infrastructure/dom/PortfolioNavigationHandoff.test.ts frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Layouts/PortfolioShell.test.tsx` — **28/28**.
- **PASS, full unit suite:** `pnpm test` — **1,604 tests / 107 files**; bootstrap freshness passed and no React act warnings were reported.
- **PASS, development browser:** `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test --config /tmp/fs-nav-hydration/playwright.config.cjs` — **18/18**, zero retries. The temporary configuration uses the existing port-3000 preview and the two focused specs. An intermediate six-case failure was a test locator still expecting an exposed About link in the newly idle/closed fixture; it now inspects the hidden native href without opening the disclosure. No visibility, focus or error assertions were removed from the active-use tests.
- **PASS, production browser:** `PLAYWRIGHT_BROWSERS_PATH=0 FS35_AVAILABLE=true NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm exec playwright test --config playwright.navigation.config.ts e2e/navigation-hydration.spec.ts e2e/navigation-visual-regressions.spec.ts e2e/navigation-lifecycle.spec.ts e2e/home-intro.spec.ts e2e/navigation-tree.spec.ts` — **82/82**, zero retries. The isolated configuration keeps production Chromium behavior with owned port 3240 and two workers.
- **PASS:** `pnpm typecheck:validation`, `pnpm lint` (including bootstrap freshness), `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build`, and `pnpm storybook:build`. Build/Storybook run in isolated `/tmp/fs-nav-hydration/source`; the user's development preview remains running. Production build ID: `0UraICxIoB1TToEuxKYWo`.
- **PASS with existing warning:** `pnpm exec lhci autorun --config=lighthouse.navigation.json` — three fresh flag-on runs passed unchanged error-level LCP/CLS assertions. Performance score **0.82** remains warning-only. The temporary configuration changes only the local server/URL port to 3241 and report destination; exact measurements are retained with the logs and reports.

### What the browser assertions establish

At 375px and 1280px, scripts are held while keyboard interaction focuses an open summary, About link, or closed summary. After release, a live OS-theme change establishes that application effects initialized. Each case asserts retained focus and no modal. The next Tab reaches Home, Animations, or footer Contact respectively. The About link still navigates; closing the disclosure and tabbing away enables the enhanced Menu without stealing footer focus, and its normal open/Escape cycle restores Menu focus. Existing production checks cover no-JavaScript links, failed dialog opening, navigation history/focus cleanup, repeated cycles and homepage startup sequencing. Idle reload tests continue to require identical trigger pixels and bounds on all three secondary routes in light/mobile and dark/desktop samples.

Adapter repeat-setup tests model the Strict Mode setup/cleanup sequence; they do not claim a separate physical-device or cross-browser run. Local logs and exact candidate patch/hashes are handed off in `artifacts/navigation-hydration-continuity-2026-09-28/` in the ChatGPT project mirror. Another environment must obtain these files explicitly.

## Review and acceptance handoff

- **Codex:** Read-only review of this exact diff, especially asynchronous one-shot notification, cleanup/reentry, synchronous readiness commit, retained native open/focus state and the separation of idle-paint versus active-interaction tests. Implementation self-review is not independent approval.
- **Dimi:** With slow script delivery, focus/open the hex disclosure or focus About; after the page finishes loading, the same control should retain focus and Tab should continue normally. Close the disclosure and tab away; the enhanced Menu should become available without a focus jump.
- **Limitations at implementation handoff:** Fresh Firefox/WebKit/device observations, independent review, a flag-off rebuild and dedicated Storybook browser checks were not claimed. EPIC 3's historical acceptance and content/legal/public-release limitations are unchanged. The subsequent independent review and commit/push authorization are recorded below; merge and deployment remain outside scope.

## Independent review and delivery authorization — 2026-09-28

A fresh Codex reviewer inspected the unchanged 10-file candidate on base `602f8c3a275c946bab92d56c9af18318968a344d`, patch SHA-256 `52f682a4a5a36410ce6a7917ec5e40b17c695e62def9911ff4915682d3ac0bde`. Verdict: **PASS, no actionable findings**. Independently rerun checks passed **28/28** focused adapter/component tests, **51/51** production Chromium tests and **2/2** supplementary retained-fallback Contact probes. Both Contact probes established destination focus, scroll position and next Tab on the email link without sending email. Local review logs are `/tmp/fs-hydration-review/unit.log`, `browser.log` and `probes.log`; another environment must obtain them explicitly. Fresh Firefox/WebKit/device coverage and a separate React Strict Mode browser experiment were not performed.

Finding 2 subsequently refreshed only the feature plan's current summary and handoff, preserving dated task evidence. Dimi then explicitly requested commit and push of these changes. Pre-commit verification confirmed the runtime/tests match the independently reviewed snapshot and the feature plan matches its validated documentation refresh; only these delivery notes were added afterward. The containing Git commit identifies the final candidate. No new device, FS-G1 or public-release approval is inferred.
