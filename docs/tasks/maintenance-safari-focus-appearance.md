# Safari pointer focus appearance — 2026-10-13

## Dimi manual confirmation — 2026-10-13

Dimi reports that all manual tests on the smartphone, Safari and Firefox pass
and requests documentation and re-review of the pending corrections. Record this
as **Dimi-reported manual PASS**, including the reported focus-appearance issue.
It supersedes the pending physical-pointer confirmation below; the earlier
automation limitation remains a historical fact, not a successful automated run.
The report does not specify browser/OS versions, device measurements or a
per-case checklist. See the [current combined re-review](fs-4.7-scene-performance-review.md#fs-47a-correction-re-review--2026-10-13)
for the exact candidate and remaining EPIC gates. No FS-4.8 acceptance or remote
action is inferred.

## Requested outcome and evidence

Dimi supplied Safari screenshots showing an outline around the About content after
navigation and around Close after opening navigation. Codex reproduced the latter
in the actual installed Safari 27.0 (21625.1.29.18.28), using a pointer click on
the menu in the :3001 production preview. The focused element was Close; its ring
was visible despite pointer activation. The existing focus handoff is intentional
and must stay intact for keyboard and assistive-technology use.

WebKit has documented related scripted-focus heuristics, including
[pointer-opened dialog focus](https://bugs.webkit.org/show_bug.cgi?id=309245) and
[focus-visible behavior](https://webkit.org/blog/12179/the-focus-indicated-pseudo-class-focus-visible/).
These explain the investigation; direct local browser evidence owns this repair.

## Scope and implementation

Current writer: Codex. Candidate is `749342717ddac85b67a3275d669363ef9bf86d2e`
plus preserved pending FS-4.7A, preview isolation and touch-hover corrections.
This task adds only the following focus-appearance repair:

- `PortfolioNavigationHandoff.ts`: reuse existing captured pointer/keyboard
  events to expose `data-portfolio-pointer-focus` while portfolio navigation is
  observed. Retain the last input across route owners. Overlapping observers and
  repeated release retain correct attribute/listener ownership; restore the prior
  attribute after the final release. No extra listener, service, dependency or
  new focus destination is introduced.
- `PortfolioShell.module.css`: suppress focus outline/shadow only on the shell's
  links, buttons, summaries and programmatic `tabindex=-1` targets during pointer
  use. A non-modifier key restores existing focus styling before its default
  action. Native input/textarea/select styling remains untouched.
- `PortfolioNavigationHandoff.test.ts` and new
  `e2e/navigation-focus-appearance.spec.ts`: resource ownership and route/dialog
  appearance tests, preserving actual focus and keyboard recovery.

Unknown input and no-JavaScript retain browser focus defaults. This is a bounded
presentation cue in the existing DOM adapter, not a new settings authority or
focus manager. Dialog/route focus, scroll, history and motion contracts stay intact.

## Validation and limits

Implemented; bounded technical checks pass. Actual Safari inspection against
development :3000 shows Close and About arrival without the unwanted outlines,
with actual focus retained in the accessibility tree. Tab restores the visible
focus ring on the Animations disclosure. Screenshots are retained in this task's
conversation. Native coordinate clicking later failed with `noWindowsAvailable`,
although accessibility actions still worked. A production customization opening
through an accessibility action displayed the default title ring; that action is
not evidence of a physical pointer event. Final physical-pointer Safari
confirmation remains with Dimi; do not classify the automation failure as PASS.

- `pnpm exec vitest run frontend/infrastructure/dom/PortfolioNavigationHandoff.test.ts
frontend/infrastructure/dom/NativeDialogBinding.test.ts --maxWorkers=2`:
  **30/30 PASS**, including overlapping observer ownership, repeated cleanup,
  route-owner replacement and immediate keyboard recovery.
- Chromium, one worker, zero retries: **43/43 PASS on development :3000** and
  **43/43 PASS on production :3001**. The external configuration selects
  `navigation-focus-appearance.spec.ts`, `navigation-transition.spec.ts`,
  `navigation-lifecycle.spec.ts` and `customization-pointer-states.spec.ts`.
  This covers pointer/keyboard route and dialog focus, Escape/return focus,
  repeated modal cycles, failure/redirect/history behavior and touch-hover repair.
- `pnpm check:theme-bootstrap && pnpm build && pnpm storybook:build`: **PASS**.
  Production build ID: `KjrafQG-kqcdKVfCguqkh`; the animation flag remains true.
  Existing Storybook module-directive/chunk-size advisories remain warnings.
- Frontend TypeScript, validation TypeScript, `pnpm lint`, formatting and
  `git diff --check`: **PASS**. The first standalone type check raced the build
  replacing `.next/types` and failed with TS6053; the unchanged post-build run
  passed. Future checks must run after build output is stable.

The temporary Safari verification tab was closed; the original preview was
reloaded with customization closed. Development and production previews remain
available. No full coverage, Lighthouse or physical mobile audit was rerun for
this focus-only correction; FS-4.7/4.8 acceptance remains separate.

Source snapshots, hashes, build logs and browser configuration are at
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/safari-focus-2026-10-13/`.

No commit, push, deployment or EPIC acceptance is authorized by this repair.
