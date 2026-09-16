# Task FS-1.6 — Shared dialog primitive

## Task metadata

- **Status:** Complete — implementation and validation delivered; Dimi reports FS-1.6 manual and visual tests PASS on 2026-09-16, including the current Close-icon and blue-focus corrections. Separate FS-1.7 compatibility/component-set review remains pending.
- **Lead/current writer:** Sites. **Next owner:** Codex for FS-1.7 compatibility review; Sites owns returned implementation corrections. **Approver:** Dimi.
- **Last updated:** 2026-09-16.
- **Base:** `feature/funkspace-minimum-usable`, `16cc8b1bcd2e3f338123696e31ce453ca8857675`; working tree was clean before Stage A. Stage C preserved the two-file A/B documentation candidate and extends it with the implementation below. Dimi now authorizes committing and pushing the complete accepted 33-file candidate against this base; final acceptance is recorded below.
- **Prerequisites:** accepted [FS-1.3](fs-1.3-standard-button-family.md) and [FS-1.4](fs-1.4-hexagonal-button-family.md). Their later FS-1.7 compatibility review remains separate; it is not an invented prerequisite.
- **Related:** [feature plan](../features/funkspace-minimum-usable.md), [FS-1.1 contract](fs-1.1-asset-and-component-contract.md), [architecture](../architecture.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md).

## Requested outcome and stage boundary

**Current stage:** FS-1.6 manual/visual acceptance and authorized commit/push. Dimi approved the implemented candidate after the secondary HexButton Close icon and shared blue-focus corrections. These supersede the historical text-only Close and gray dark-focus choices; lifecycle boundaries are unchanged. Stages A/B and earlier handoffs retain historical evidence. Navigation/settings, FS-1.7 execution, merge and deployment remain outside this instruction.

### Recorded Stage B technical review — 2026-09-16

Codex's verdict: **ready to implement; no blocking contract or file-boundary finding**. Review base was `16cc8b1bcd2e3f338123696e31ce453ca8857675`, proposal SHA-256 `4d2c35da3a190472c1bd2bc4b20ede221b651417345b6af487553e6d424db1ab`. The separately returned review is preserved at `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-1.6-stage-b-review.md`.

The review approved reuse decisions, a narrow generic Domain port without browser constraints/defaults, per-instance factory injection through the existing composition root, the explicit fallback/return-target API and top-level preview fixture. No dependency exception or ADR is required. Required implementation evidence remains queued native-close/reopen and Strict Mode behavior, unmount cleanup, single dismissal intent, rollback/style ownership, focus restoration/destination override, scroll containment, both triggers and ten-cycle checks. This is technical boundary approval, not visual/device acceptance. Sites remains the sole implementer.

**Historical Stage A request:** inspect available implementations and propose the smallest shared dialog contract and ownership model. Dimi reserved Codex review for Stage B, which is now recorded above. Stage C implementation and evidence follow at the end of this record; the earlier proposal alone did not establish working behavior or visual acceptance.

### Stage A acceptance criteria

- [x] Recheck components, hooks, browser adapters, focus/scroll utilities and composition.
- [x] Define the minimum consumer contract, lifecycle responsibilities and cleanup policy.
- [x] Identify proposed files and dependency direction without implementing effects.
- [x] Provide browser coverage for both accepted triggers, full-document modality, focus, scroll and repeated cycles.
- [x] Record the bounded proposal and hand it to Codex.
- [x] Codex records technical review in Stage B; no blocking findings were returned.
- [x] Stage C implementation and validation, with Dimi's actual phone observation recorded below. This does not close FS-1.7 or invent final component-set acceptance.

## Context and inspected evidence

Read root `AGENTS.md` (no nested instructions found), `README.md`, workflow, feature plan, task template, package scripts and architecture. Read FS-1.6 in the supplied `/Users/dimi/Downloads/FunkSpace_EPIC_1_Detailed_Plan.md`; its proposed repository archive is not assumed to exist. Repository status and recorded approvals govern. The plan supplies task detail, not permission to implement later stages.

| Existing source                                                                                                                                         | Finding and reuse decision                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/components/`, `frontend/hooks/`, `frontend/application/`, `frontend/infrastructure/`                                                          | Searches for dialog/modal/showModal/aria-modal and focus/scroll implementations found no suitable shared dialog, modal lifecycle binding or document scroll lock. No dialog dependency appears in the package manifests.                       |
| [Button](../../frontend/components/Controls/Button.tsx), [HexButton](../../frontend/components/Controls/HexButton.tsx), their stories/tests             | Reuse native triggers and their refs, names and focus styling. Reuse the accepted text-only Standard Button for Close; no new icon export. Production Menu retains its visible label. Dialog opening is not a selected/toggle state.           |
| [focusIntoSection](../../frontend/utils/focusIntoSection.ts), its tests; [FocusManager](../../frontend/infrastructure/dom/FocusManager.ts)              | Both serve section navigation, call `scrollIntoView`, and may wait on scroll/timers/animation frames. Neither supplies modal focus ownership or cancellation/cleanup. Do not use them for ordinary dismissal or consolidate them in this task. |
| [FullscreenScroll](../../frontend/components/Layouts/FullscreenScroll.tsx), its focus-demo stories/tests                                                | Scroll-snap container layout, not document scroll locking. Preserve it; modal content must scroll without converting the page to this layout.                                                                                                  |
| [ScrollService](../../frontend/application/scroll/ScrollService.ts), [useScrollProgressService](../../frontend/hooks/useScrollProgressService.ts)       | Viewport/progress tracking, not modality. Existing DOM-bearing services/ports are migration context, not permission to add DOM types to pure Domain.                                                                                           |
| [ServiceProvider](../../frontend/application/providers/ServiceProvider.tsx), [createServices](../../frontend/infrastructure/services/createServices.ts) | Existing explicit composition root and typed context. Proposed adapter construction belongs here, not in Dialog or its hook. Provider creation must remain safe during server rendering.                                                       |
| [Storybook preview](../../frontend/.storybook/preview.ts), [browser configuration](../../playwright.storybook.config.ts)                                | Preview already supplies ServiceProvider, local fonts and ThemeService. Chromium tests can open a preview document directly. Reuse that setup; no new server, route or provider system.                                                        |

No suitable implementation was found to reuse wholesale. Recommend the detailed plan's small native `<dialog>` approach. Reuse existing controls, tokens, provider and test infrastructure. No new package, token source, animation runtime, modal service or overlay stack.

## Reviewed consumer contract — implemented in Stage C

One `Dialog` component with the following deliberately bounded surface:

| Input                                              | Proposed meaning                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open: boolean`                                    | Consumer owns visibility. No internal competing open state or uncontrolled mode.                                                                                                                                                                                                                      |
| `onCloseRequest(reason)`                           | Reasons: `close-button`, `cancel`, `native-close`. Consumer updates `open` to false. This is intent, not a second visibility store or a delivery/navigation event. Consumers must honor dismissal promptly; confirmation workflows are outside scope.                                                 |
| `title: string`                                    | Required visible, nonempty heading, stable generated ID and `aria-labelledby`. Proposed `h2` for the initial consumers.                                                                                                                                                                               |
| `description?: string`                             | Optional short visible summary with its own stable ID. Omit `aria-describedby` when absent; do not flatten long children into a description.                                                                                                                                                          |
| `children: ReactNode`                              | Structured content and existing controls. Keep mounted while closed to preserve consumer values; parent unmount still belongs to the consumer. No primitive-owned form state.                                                                                                                         |
| `initialFocusRef?: RefObject<HTMLElement \| null>` | Optional focusable element inside this dialog. Default to the visible title with `tabIndex=-1`, suitable for long content. Invalid/unavailable target falls back to title. Do not give the dialog itself a tabindex.                                                                                  |
| `returnFocusRef?: RefObject<HTMLElement \| null>`  | Optional target consulted at actual closure. This single override supports explicit pointer-trigger restoration and, later, a destination selected by a consumer. Without it, use the opener captured before modal opening. No routing, scrolling-to-sections or destination lookup in the primitive. |
| `fallbackFocusRef: RefObject<HTMLElement \| null>` | Required stable logical target outside the dialog, such as the owning section heading with `tabIndex=-1`. Used if the override/opener cannot receive focus. Required rather than guessing an unrelated control or silently leaving focus on body. Consumer keeps it mounted through teardown.         |

The component always supplies a visible text-only **Close** button (`type="button"`) using the accepted Standard treatment. No hide-close flag, backdrop flag, arbitrary native `open`/event overrides, imperative public dialog handle, alert-dialog mode, portal selector or transition API. Stable unique IDs use the existing React `useId` pattern. DOM refs are presentation types, never Domain types.

Both trigger examples set a shared return-target ref from `event.currentTarget` before setting `open=true`. This makes pointer opening explicit on browsers where clicking does not focus the button; keyboard/programmatic opening still has captured-active-element fallback. The same instance is demonstrated with a Standard Button and a visibly labeled Menu HexButton. A later consumer may set the same ref to a mounted destination before controlled closure; that is the only proposed destination-focus extension. The required fallback and this override are specific Codex review points, not accepted API yet.

Initial/static focus, short descriptions and logical restoration follow the [WAI-ARIA dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). The proposed defaults do not establish assistive-technology or device results.

## Proposed architecture and files

These are future paths, not files created in Stage A. Existing composition files are the only proposed cross-layer construction points.

| Path                                                                                                 | Status                    | Ownership                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/components/Controls/Dialog.tsx` and `Dialog.module.css`                                    | Proposed                  | Presentation: markup, IDs, visible title/description/Close, content layout and semantic tokens. Calls thin hook; no concrete Infrastructure import.                                                                                                                                                                                                                  |
| `frontend/hooks/useDialog.ts`                                                                        | Proposed                  | Presentation binding: obtains injected factory through `useServices`, attaches one binding to the mounted node, synchronizes controlled input/latest callbacks, disposes on teardown. No document styles, global listeners or route logic.                                                                                                                           |
| `frontend/domain/ports/DialogBindingPort.ts`                                                         | Proposed, review required | Small pure TypeScript port: per-instance `sync(open)` / `destroy()` and a factory accepting a dialog handle, focus-target getters and close-request callback. Two generic handle parameters keep React, HTMLElement, Document and browser event types out of Domain. This defines dependency inversion only, not dialog business state or a generic focus framework. |
| `frontend/infrastructure/dom/NativeDialogBinding.ts` and its test                                    | Proposed                  | Implements that port specialized to `HTMLDialogElement`/`HTMLElement`. Owns native cancel/close listeners, modal opening/closing, focus checks, document style snapshots, scroll restoration and idempotent disposal. Private scroll helpers stay in this module until an actual second consumer warrants extraction.                                                |
| `frontend/infrastructure/services/createServices.ts`                                                 | Existing                  | Inject a side-effect-free binding factory. Each bind creates local state; no singleton open dialog, registry, global modal state or stack. No DOM work during factory construction.                                                                                                                                                                                  |
| `frontend/application/providers/ServiceProvider.tsx`                                                 | Existing                  | Expose the typed factory, specializing generic handles at this existing browser/React composition boundary. Preserve ThemeService/bootstrap and existing service initialization.                                                                                                                                                                                     |
| `frontend/components/Controls/Dialog.test.tsx`, `Dialog.stories.tsx`; `e2e/storybook/dialog.spec.ts` | Proposed                  | Consumer contract tests, short/long/full-document fixtures and real-browser behavior. Test fakes cannot prove native modality.                                                                                                                                                                                                                                       |

Dependency path: Dialog → hook → Application provider → pure Domain port; Infrastructure implements that port. Only `createServices`/ServiceProvider construct and inject Infrastructure. No new Domain state machine/service, package or additional context. Existing browser types in older ports are not copied.

**Stage B resolution:** Codex approved the narrow generic handle port/factory and existing composition boundary. No Application browser-specific contract, direct component-to-adapter import or dependency exception is introduced. Stage C adds the internal binding's `requestClose()` entry so Close and native cancel share one pending-intent guard; this does not expand the consumer API.

## Proposed lifecycle and effect ownership

The browser provides the modal top layer and same-document inactivity via `showModal()`. Use `close()` for closure; rendering or removing an `open` attribute is not the lifecycle. Native focus and close behavior must be accounted for, not duplicated with a manual Tab trap. See the [HTML dialog specification](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element).

| Situation                        | Proposed behavior and cleanup requirement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Mount closed / server render     | Render a closed native dialog. Construction touches no document. Attach listeners only to a mounted node; no lock or focus movement until opening.                                                                                                                                                                                                                                                                                                                                                                       |
| Controlled opening               | Capture opener and viewport position, verify connected node and no competing modal in the same document, then perform modal opening and owned lock as one rollback-safe operation. Focus valid requested target or title; do not repeatedly focus on rerender. Unexpected native opening failure must release all acquired effects and remain visible to the caller/test, not masquerade as success.                                                                                                                     |
| Close button / Escape            | Close requests are local to this dialog. Native `cancel` is prevented and converted to intent so the consumer remains authoritative; no global Escape listener. Consumer acknowledgment (`open=false`) closes the native dialog and releases effects. One request per outstanding dismissal, reset on the next opening; no user-facing dismissal veto or stuck pending policy.                                                                                                                                           |
| Controlled closure               | `sync(false)` closes only if needed, releases effects even if already closed, and does not echo an additional close request. Native `close` is an acknowledgment here.                                                                                                                                                                                                                                                                                                                                                   |
| Unexpected native closure        | A real native `close` while the cycle still expects open releases effects and reports `native-close` once. Wait for consumer false acknowledgment; do not immediately reopen merely because a render still contains the old true prop. A later false→true opens a new cycle. Native form `method=dialog` is not the recommended consumer API; test it as a synchronization edge case.                                                                                                                                    |
| Rapid changes / repeated effects | Stable binding and latest-callback access avoid rebind/reopen on callback or content changes. `sync(true)` twice does not call `showModal` twice. Distinguish expected queued close acknowledgments from unsolicited close events; an old cycle's queued event must not close or restore focus over a new cycle. Codex reviews this ordering before implementation; browser tests exercise close/reopen in the same task and Strict Mode setup/cleanup/setup.                                                            |
| Unmount while open               | Dispose listeners, close if necessary, release exactly the styles/scroll ownership acquired, restore focus, discard cycle references. Idempotent destroy; do not notify a disappearing consumer to set state. A real unmount and Strict Mode replay must both leave balanced resources and no asynchronous restoration stealing focus after reopening.                                                                                                                                                                   |
| Restoration                      | After native closure and lock release, prefer the valid return-focus override, then captured opener, then required logical fallback. Targets must belong to the same document, remain connected, be outside the closed dialog and accept focus; disabled/hidden/inert nodes are unusable. Account for native automatic restoration; skip redundant focus if already correct. Use focus without scroll for ordinary dismissal. No detached-node focus, arbitrary document-wide selector, body fallback or route behavior. |
| Missing fallback too             | A consumer contract failure: release every effect regardless, report in development/test and record the reproduction. Do not invent a focus framework. Consumer owns a stable fallback outside any subtree it removes.                                                                                                                                                                                                                                                                                                   |
| Backdrop                         | No click/pointer light-dismiss handler; do not opt into native `closedby="any"`. Outside activation and inside-to-outside drags must not close. Close plus Escape is the proposed policy unless Dimi later changes it.                                                                                                                                                                                                                                                                                                   |

Only one modal is supported in a document for these initial consumers. Detect a competing modal before acquiring effects; do not steal its lock or add stacking behavior. This is a bounded consumer precondition, not a global modal coordinator.

### Scroll, layout and paint

- Proposed lock: an adapter-owned snapshot of viewport coordinates and only the inline properties it changes. Start with a fixed-body lock plus root overflow containment, preserving horizontal/vertical position and compensating for a removed scrollbar. Exact touched properties and priorities must be explicit in implementation/tests. Do not replace `cssText` or reset the entire style attribute.
- Restore prior property values/priorities (remove properties originally absent), then the saved viewport position without smooth animation on close, native closure, rollback and unmount. Restore only still-owned values; if another writer changed a property, preserve it and surface that conflict. No unrelated global CSS/style cleanup. Lock only the dialog's `ownerDocument`, never a parent frame.
- Native background inactivity and scroll blocking are separate assertions. Test wheel, touch and keyboard scroll, including boundaries of the inner scroller. Avoid document-wide touch/key cancellation that breaks editing or inner scrolling. Existing nested scroll containers must not receive user scroll or have their offsets reset.
- Keep title/Close reachable and let content overflow vertically in a constrained inner region, with viewport/safe-area allowances and no horizontal clipping at enlarged text/mobile widths. Preserve native closed-dialog hiding when applying layout CSS. No fixed content height or motion required; reduced motion works with the same static presentation.
- Reuse approved Work Sans title/control typography, Space Grotesk content, semantic surface/content/border roles and spacing tokens. Reuse Button's accepted focus indicator. Backdrop paint is decorative; document any composed contrast pairings during implementation. A missing semantic role goes to Codex; no token/palette edit is authorized here.

## Validation plan for the implementation stage

Use one story fixture with a long surrounding document, focusable controls before/after it, a stable fallback heading, both native triggers, and short/long dialog content containing existing fields. Fixture actions demonstrate trigger removal, controlled close, external close, unmount and a destination override without real navigation.

Open that story's `/iframe.html?id=controls-dialog--full-document` URL **as the top-level page** in Playwright and manual browser checks. The path name does not make it an iframe when opened directly. Assert `window.top === window` and make the fixture actually scroll the document. This supplies the full-document fixture without adding a production route. Separately inspect the embedded story: same-document background is inactive, while surrounding Storybook manager chrome belongs to another document and is not expected to become inert or scroll-locked.

| Check                                     | Expected evidence                                                                                                                                                                                                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Both triggers, pointer/touch and keyboard | One opening, correct name, visible title/Close, intended initial focus. Enter/Space activates each native trigger once. Default title and supplied field-focus cases.                                                                                                                       |
| Modality                                  | Real `:modal` state, Tab/Shift+Tab remain within dialog content, background controls cannot activate or receive programmatic focus. Native behavior verified in browser, not inferred from ARIA or mocks.                                                                                   |
| Dismissal                                 | Close and Escape each report one intent and return to the correct invoking control; controlled closure sends no extra intent. Outside clicks/drags do not dismiss.                                                                                                                          |
| Synchronization                           | Delayed acknowledgment rerenders, external native close, same-task close/reopen, initial open and Strict Mode replay; no duplicate listener/callback or stale close event affecting a new cycle.                                                                                            |
| Focus edge cases                          | Removed/disabled/hidden trigger uses stable fallback; invalid initial ref uses title. Explicit return override goes to a mounted destination without route/hash changes. Unmount-open cleanup restores sensible focus.                                                                      |
| Full-document scroll                      | Open after nonzero X/Y scroll. Verify no background wheel/touch/key scrolling, internal long-content scrolling works, close/unmount restores offsets and exact owned styles/priorities. Preserve unrelated styles and nested-container offsets; include a later external style write.       |
| Repeated use                              | Ten open/close cycles from both triggers plus repeated unmounts. Same listener/resource balance, no lock left, no extra close callbacks or focus jumps. Regression evidence, not performance certification.                                                                                 |
| Presentation                              | Explicit light/default, dark, muted and dark-high-contrast resolved themes, computed fonts, short/long title, 200% text, narrow viewport, forced colors and reduced motion. Measure actual text/focus/control pairings; do not infer every state from token ratios.                         |
| Manual / device                           | Dimi checks phone opening, Close reachability, Escape with keyboard where available, long-content scrolling and restored page position. Record device/browser and observations actually supplied. Screen-reader checks and non-Chromium results must be separately labeled, never inferred. |

Proposed command sequence uses current scripts: `pnpm check:theme-bootstrap`; focused Vitest for binding/component tests; `pnpm -F frontend exec tsc --noEmit`; `pnpm lint`; `pnpm storybook:build`; `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.storybook.config.ts e2e/storybook/dialog.spec.ts`; `pnpm build`; relevant existing control/provider tests and unfiltered home smoke. Confirm installed browser/server prerequisites and current scripts again at implementation time. Root build runs tokens → common typecheck → game build → frontend; check bootstrap freshness first and review any generated diff rather than regenerating to hide stale input. No new dependency or browser installation is authorized by this proposal. Current Storybook browser configuration establishes Chromium only.

## Completion record — Stage A only

- **Outcome:** bounded contract/architecture/test proposal prepared. No lifecycle implementation or Codex technical review performed.
- **Actual files changed:** this record and the feature-plan status/handoff. No application, dependency, asset, token, generated output or runtime contract change.
- **Validation PASS:** `pnpm exec prettier --check docs/tasks/fs-1.6-shared-dialog-primitive.md docs/features/funkspace-minimum-usable.md` after formatting the new record; local-link validation checked 76 destinations across both documents; whitespace check included the untracked new record; `git diff --check` passed. Content/scope review confirms only these two documentation files changed. Runtime types/lint/tests/builds and browser behavior are **not run** in this documentation-only stage; the table above is a plan, not passing evidence.
- **Protected areas:** ThemeService/bootstrap split, games and shared exports, accepted controls/assets/tokens, existing scroll/navigation utilities and unrelated work.
- **Open review items:** generic-handle port/factory placement; required fallback and return override size; queued native-close and Strict Mode cleanup ordering; fixed-body lock ownership/restoration. These are proposed decisions, not confirmed defects or accepted architecture exceptions.
- **Next owner:** Codex reviews this actual record and current base/diff when Dimi requests the next stage. Sites resolves findings; lifecycle implementation stays paused until the technical review is recorded and its blocking findings resolved.
- **Dimi's acceptance action:** no dialog visual/device acceptance is requested before a working candidate exists. After technical review and separately authorized implementation, Dimi reviews the resulting dialog, dismissal/scroll behavior and phone usability. The earlier button/form approvals do not approve this dialog.

## Stage C implementation and handoff — 2026-09-16

### Delivered scope and actual files

One controlled native dialog, mounted while closed to retain content values. Close and Escape request closure; consumer acknowledgment performs it. Native closure synchronizes once, and stale queued close events cannot dismiss a currently open cycle. Cleanup removes the two node-owned listeners and releases owned root/body properties and scroll before focus restoration. There are no document-global keyboard listeners, manual Tab trap, backdrop dismissal, animations or routing features.

| Actual file                                                                      | Change                                                                                                                                                                                            |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/components/Controls/Dialog.tsx`                                        | Visible title/short description, existing Close Button, persistent content, generated association IDs.                                                                                            |
| `frontend/components/Controls/Dialog.module.css`                                 | Semantic colors/fonts/spacing, wrapping header, bounded scrollable content, safe-area limits and forced-colors focus/border. Closed native dialogs remain hidden.                                 |
| `frontend/components/Controls/Dialog.stories.tsx`                                | Short Content, Long Content, Full Document, Lifecycle and Initially Open fixtures; Standard and visible Menu HexButton triggers, Strict Mode, existing fields.                                    |
| `frontend/components/Controls/Dialog.test.tsx`                                   | Three presentation/binding tests: unique associations, current callbacks, values and balanced Strict Mode cleanup.                                                                                |
| `frontend/hooks/useDialog.ts`                                                    | Thin layout binding with fresh callbacks/refs, per-instance factory lifecycle and controlled synchronization.                                                                                     |
| `frontend/domain/ports/DialogBindingPort.ts`                                     | Pure generic factory/options and `sync`, `requestClose`, `destroy` contract; no React/DOM imports or handle constraints.                                                                          |
| `frontend/infrastructure/dom/NativeDialogBinding.ts`                             | Native modal lifecycle, focus validation/restoration, one outstanding close intent and property-owned scroll lock.                                                                                |
| `frontend/infrastructure/dom/NativeDialogBinding.test.ts`                        | Eight focused adapter tests including rollback, native closure, competing modal rejection, old queued events, style ownership and ten disposal cycles. Platform fakes do not claim real modality. |
| `frontend/application/providers/ServiceProvider.tsx`                             | Typed factory exposure at the existing composition boundary.                                                                                                                                      |
| `frontend/infrastructure/services/createServices.ts`                             | Stateless factory injection; no DOM work during service construction.                                                                                                                             |
| `e2e/storybook/dialog.spec.ts`                                                   | Sixteen real Chromium checks, including mobile touch, embedded preview and top-level full-document fixture.                                                                                       |
| `docs/architecture.md`, this record, `docs/features/funkspace-minimum-usable.md` | Boundary documentation, review/implementation evidence and current handoff.                                                                                                                       |

No dependency, token, generated source, bootstrap source, logo, existing control implementation or game contract changed. The generated output after established builds is byte-identical to HEAD. Native operations are owned by Infrastructure; the hook has no direct Infrastructure import or global effect implementation.

### Consumer example

```tsx
import { useRef, useState, type MouseEvent } from "react";
import Button from "@/components/Controls/Button";
import HexButton from "@/components/Controls/HexButton";
import Dialog from "@/components/Controls/Dialog";

// Render beneath the existing ServiceProvider.
function Example() {
  const [open, setOpen] = useState(false);
  const fallback = useRef<HTMLHeadingElement>(null);
  const returnTarget = useRef<HTMLElement | null>(null);
  const openFrom = (event: MouseEvent<HTMLButtonElement>) => {
    returnTarget.current = event.currentTarget;
    setOpen(true);
  };
  return (
    <>
      <h2 ref={fallback} tabIndex={-1}>
        Example section
      </h2>
      <Button onClick={openFrom}>Open dialog</Button>
      <HexButton onClick={openFrom} />
      <Dialog
        open={open}
        onCloseRequest={() => setOpen(false)}
        title="Example dialog"
        description="A short purpose statement."
        returnFocusRef={returnTarget}
        fallbackFocusRef={fallback}
      >
        <p>Structured content stays separate from the short description.</p>
      </Dialog>
    </>
  );
}
```

The caller keeps the fallback mounted and focusable outside the dialog and promptly acknowledges close requests. `initialFocusRef` optionally chooses a usable descendant; otherwise the title receives focus. A mounted same-document destination can be assigned to `returnTarget.current` before controlled closure. Focus happens after unlock with `preventScroll`; destination visibility/route behavior remains the later consumer's responsibility. No asynchronous route focus promise is made.

The lock owns root `overflow` and body `position`, `top`, `left`, `width`, plus `padding-right` only when compensating for a scrollbar. It restores captured values/priorities only while its own value/priority remains present; external changes are preserved and surfaced in development. It never replaces `cssText`. Native close cleanup runs on the queued close event; tests await observable restoration rather than assuming that hiding the dialog means the event has already executed.

### Validation results

| Check                                                                                                                       | Actual outcome                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:theme-bootstrap` before generation and at cleanup                                                               | PASS; freshness preserved.                                                                                                                                                                                                                                                                                                                                        |
| `pnpm -F frontend exec tsc --noEmit --incremental false`                                                                    | PASS.                                                                                                                                                                                                                                                                                                                                                             |
| Isolated `tsc` for Dialog stories, extending frontend config and including `next-env.d.ts`                                  | PASS. Normal frontend config excludes stories. Initial temporary config omitted Next declarations; corrected without source/type bypasses.                                                                                                                                                                                                                        |
| `pnpm exec vitest run frontend/components/Controls/Dialog.test.tsx frontend/infrastructure/dom/NativeDialogBinding.test.ts` | PASS, 11 tests.                                                                                                                                                                                                                                                                                                                                                   |
| `pnpm test`                                                                                                                 | PASS, 90 files / 1,347 tests.                                                                                                                                                                                                                                                                                                                                     |
| `pnpm lint`                                                                                                                 | PASS after escaping one story apostrophe and formatting; no suppressed rule.                                                                                                                                                                                                                                                                                      |
| `pnpm build`                                                                                                                | PASS: token generation, common types, game build, bootstrap generation/freshness and Next production build.                                                                                                                                                                                                                                                       |
| `pnpm storybook:build`                                                                                                      | PASS. Existing addon-major, module-directive and chunk-size warnings remain; no dependency changes.                                                                                                                                                                                                                                                               |
| `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.storybook.config.ts --reporter=json`    | PASS: 95 tests, including 16 Dialog tests; zero skipped, unexpected or flaky results, no retries.                                                                                                                                                                                                                                                                 |
| `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test e2e/home.a11y.spec.ts --reporter=line`                      | PASS, four themes with unfiltered default/hover/focus accessibility checks.                                                                                                                                                                                                                                                                                       |
| Additional ad hoc E2E TypeScript compilation                                                                                | Existing compatibility limitation: Axe's `Page` type expects `consoleMessages`, `pageErrors`, `requests` absent from the pinned Playwright type. Reproduced in unchanged `form-fields.spec.ts` as well as the new test. This is outside configured frontend/story checks; browser execution and Axe checks pass. No cast, suppression or dependency change added. |
| Browser availability                                                                                                        | Installed Chromium used. Firefox/WebKit binaries absent; neither installed or claimed tested. Touch is Chromium emulation, separate from Dimi's observation.                                                                                                                                                                                                      |

Final browser suite ran in isolation. An earlier broad run was interrupted by Vite reloads from application build output; another assertion sampled styles before the queued native-close event. The corrected suite awaits owned cleanup. A previous whole-`cssText` assertion also included Storybook's unrelated `filter: none`; the final check compares owned values/priorities and confirms a later unrelated style survives. These changes do not weaken modality/scroll assertions.

Repeated Escape can become non-cancelable in Chromium when a fixture deliberately delays acknowledgment. Native closure still releases effects without issuing a duplicate outstanding request. This is not a dismissal-veto API. The pending-intent test checks repeated Close plus Escape; normal consumer dismissal, unsolicited native close and cleanup have separate coverage.

Actual rendered short-dialog pairings (foreground / opaque dialog background):

This table predates Dimi's later [blue-focus amendment](fs-1.2-token-and-contrast-foundations.md#requested-blue-focus-amendment--2026-09-16).
The current dark focus role is now `#4abaff` (8.088:1 on the dialog surface),
and the shared-control browser suite was rerun for that correction.

| Resolved theme     | Title and description colors | Text ratio | Close keyboard outline / background | Outline ratio |
| ------------------ | ---------------------------- | ---------- | ----------------------------------- | ------------- |
| default/light      | `#1a1a1a` / `#e6e6e6`        | 13.94:1    | `#3b47cc` / `#e6e6e6`               | 5.69:1        |
| dark               | `#e6e6e6` / `#1a1a1a`        | 13.94:1    | `#cccccc` / `#1a1a1a`               | 10.84:1       |
| muted              | `#000000` / `#ffffff`        | 21:1       | `#1e2466` / `#ffffff`               | 14.01:1       |
| dark-high-contrast | `#ffffff` / `#000000`        | 21:1       | `#4abaff` / `#000000`               | 9.76:1        |

Checks require at least 4.5:1 for these sampled texts and 3:1 for the focus outline. Computed title is Work Sans 24px/600; description is Space Grotesk 16px/400. Unfiltered Axe passes for the open dialog in each theme. The backdrop has no text and does not contribute through the opaque dialog surface. This evidence does not certify all future content/states.

Browser coverage includes native Enter/Space, forward/reverse traversal, both triggers, pointer/keyboard return, removed-trigger fallback, explicit field initial focus, destination override, native/controlled/Close/Escape closure, repeated effect setup, open unmount, preserved values, ten cycles per trigger, internal wheel/touch scrolling, outside click/drag non-dismissal, nonzero document-scroll restoration on every close/unmount path, and same-document background inactivity. The top-level full-page fixture asserts document overflow and `window.top === window`; a separate embedded test proves that the Storybook host remains interactive. At Chromium's native tab boundary, browser chrome may receive focus; outside page controls remain inactive. No custom Tab trap is introduced.

Visual inspection of captured desktop/mobile and narrow 200%-text/forced-colors screenshots confirmed visible Close and no horizontal content overflow. This is separate from assistive-technology testing, which was not performed.

Final cleanup: formatting and diff whitespace pass, including new files; 80 local documentation destinations resolve. The complete 14-file patch passes `git apply --reverse --check` against the candidate. Protected token/generated/bootstrap/package/game paths have no diff. No extra progress register, tracked build artifact or dependency change was introduced.

### Dimi's phone observation

Asked to review Short Content and Long Content on the phone for both targets, Close reachability, readability/scrolling and restored page position, Dimi answered:

> it's all fine so fare

Record this as a positive observation of the current candidate. Phone/browser details were not supplied and are not inferred. This is not an invented formal FS-1.7 acceptance or a claim that every browser was tested.

### Close icon amendment — 2026-09-16

Dimi requested the newly supplied Figma Close icon in a **secondary HexButton**
for dismissal, and its addition to the Storybook icon library. This explicitly
replaces the text-only Close substitute. The prior phone observation predates
this amendment; it is not recorded as visual acceptance of the new treatment.

Same branch/base and existing FS-1.6 candidate; one writer. No lifecycle,
Domain, provider, token, generated output, logo, dependency or game changes in
this amendment. The prior implementation is preserved. Source inspection used
the actual Icons page and component nodes `188:242`, `188:251`, `188:255` in
Figma file `o39DgxXnQ0jogb2ez6WKfq`, including design context for `188:242`.

The [asset register](../../frontend/components/Icons/README.md#close-addition--2026-09-16-fs-16)
contains source/export paths, ownership and actual 48/40/26-unit viewBoxes.
The last two names say 36/24 but their actual frames differ. Raw SVG bytes and
path geometry are retained; display sizes are 48/36/24 CSS pixels. Inline paint
uses currentColor and the 48-unit clip ID is isolated per instance. XML parsing
and structural checks found no malformed markup, scripts, handlers, external
references, raster content or metadata.

`HexButton` adds only `icon?: "settings-burger" | "close"`; existing callers
still default to the visible Menu label and original glyph. Close defaults to
icon-only presentation and requires a caller-supplied accessible name. Empty
labels use the existing gallery's square-target recipe in the production CSS;
the redundant story-only stylesheet is removed. The dialog uses:

```tsx
<HexButton
  icon="close"
  variant="secondary"
  size="small"
  aria-label="Close"
  onClick={requestClose}
/>
```

This gives 48px hex artwork, a 24px icon and a measured 52 × 52px native
rectangle including its transparent border. The full target and focus ring
remain unclipped. The glyph is decorative, with one accessible Close name.
No Menu text is introduced into dismissal. Escape, controlled/native closure,
return focus and scroll ownership retain the reviewed implementation.

Actual amendment files:

- `frontend/public/svg/icons/close-{24,36,48}.svg`: three exact Figma exports.
- `frontend/components/Icons/{iconArtwork.tsx,Icon.tsx,Icon.test.tsx,README.md}`:
  registry, frame exceptions, tests and provenance. Existing gallery/name
  controls automatically expose all three new samples (24 total).
- `frontend/components/Controls/{HexButton.tsx,HexButton.module.css,HexButton.stories.tsx,HexButton.test.tsx}`:
  bounded icon option, shared square target, Close story and named activation test.
- `frontend/components/Controls/HexButton.stories.module.css`: removed after
  moving its two declarations to the actual shared control.
- `frontend/components/Controls/{Dialog.tsx,Dialog.test.tsx}`: Close consumer
  and accessible-name regression assertion.
- `e2e/storybook/{icons.spec.ts,dialog.spec.ts}`: complete gallery/frame checks
  and resolved Close paints, accessible name, icon and target dimensions.
- This task record and `docs/tasks/fs-1.1-asset-and-component-contract.md`:
  record the requested substitution and evidence.

Validation on the amended candidate:

| Check                                                                                                                    | Result                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test` (includes bootstrap freshness)                                                                               | PASS: 1,351 tests, 90 files                                                                                                  |
| `pnpm -F frontend exec tsc --noEmit --incremental false`                                                                 | PASS                                                                                                                         |
| Isolated story TypeScript config for Dialog, HexButton and Icon stories                                                  | PASS                                                                                                                         |
| `pnpm lint`                                                                                                              | PASS, no ESLint warnings/errors; formatting passes                                                                           |
| `pnpm storybook:build`                                                                                                   | PASS; existing addon-version/sourcemap/chunk warnings remain                                                                 |
| `pnpm build`                                                                                                             | PASS, including generated tokens/common types, bootstrap and game/application builds                                         |
| `pnpm exec cross-env PLAYWRIGHT_BROWSERS_PATH=0 playwright test --config playwright.storybook.config.ts --reporter=json` | PASS: all 95, zero skipped/flaky/unexpected; includes all 16 dialog tests                                                    |
| SVG structure/path comparison, screenshot inspection, local links, whitespace/diff and protected-output review           | PASS                                                                                                                         |
| Home smoke, Firefox/WebKit, physical device and assistive technology                                                     | Not rerun for this presentation amendment. Prior home smoke evidence remains above; no new phone/browser observation claimed |

Measured Close glyph/background paints in default/light are `#e6e6e6` /
`#1a1a1a`; dark reverses them. Muted uses `#ffffff` / `#000000`; high contrast
reverses them. Both icon paths resolve to the foreground in each case. Existing
HexButton matrix checks also pass for hover, pressed, disabled and focus;
no per-dialog color patch is needed. All four open-dialog Axe checks remain
unfiltered. Captured desktop and mobile images show the new Close control;
enlarged text/forced colors, both triggers, ten cycles, focus restoration and
scroll containment remain browser-tested.

Complete updated patch, file-hash manifest, raw export evidence, command logs,
browser JSON and screenshots are retained in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-1.6-close-icon/`.
The earlier Stage C artifact remains unchanged. Codex is next owner for FS-1.7;
Sites owns corrections and Dimi owns visual/device acceptance of the updated
Close treatment. No commit or push performed.

### Final manual/visual acceptance and commit authorization — 2026-09-16

Dimi states:

> The manual and visual test for the FS 1.6 are PASS

and explicitly requests documentation updates, commit and push. This accepts
the current FS-1.6 implementation, Figma Close icon/secondary hexagonal dismissal
control and blue focus correction. Device/browser details remain unspecified;
none are invented. FS-1.6 is complete. This does not claim or start the separate
FS-1.7 compatibility/component-set review.

Before acceptance edits, all 33 changed/deleted/new files matched the last
validated `artifacts/fs-focus-blue/candidate-manifest.json` byte-for-byte.
Its full candidate patch SHA-256 is
`c699215a6df308daac3bd41bdb56ff94c0cefb3ec828b59ff81ce741105502db`.
The remote branch tip also matched the base above. Only this record and the
feature plan change during finalization; runtime, SVG, test and generated
content remain exactly as validated. The accepted evidence includes 1,351
unit tests, 95 Storybook and eight application browser tests, frontend/common/
game types, lint, both builds, two stable token generations and bootstrap
freshness. No full rerun is needed for these documentation-only edits.
Finalization checks cover formatting, local links, whitespace, staged scope,
bootstrap freshness and generated-output hashes.

The authorized commit contains the 33 scoped files listed in the candidate
manifest, with these final acceptance-documentation edits. There are no new
dependencies, generated build artifacts, unrelated edits or suppressed checks.
Sites owns any returned fixes; Codex is next owner at FS-1.7 when requested.
Dimi's FS-1.6 acceptance action is complete; later component-set acceptance
remains a separate gate.

### Candidate and next owner

Evidence is retained under `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-1.6-stage-c/`: `storybook-results.json`, browser screenshots/attachments, the complete `candidate.patch`, and its `candidate-manifest.json` with base/file hashes. The patch includes Stage A/B documentation and Stage C source/tests against the recorded base; no commit or push was performed.

**Next owner: Codex at FS-1.7**, when requested, reviews the exact candidate, shared control compatibility, lifecycle/cleanup implementation and adequacy of browser evidence. Sites owns corrections. Dimi owns final component-set visual/device acceptance; the positive phone observation above is available to that review. Navigation, settings/customization, page placement and contact delivery remain out of scope. Storybook is intentionally left available on port 6006 for review; the smoke test's owned application server was stopped by Playwright.
