# FS-3.2 — Navigation and focus contract proposal

## Implementation-stage annotation — 2026-09-27

Revision 3 was approved by Codex in this session with no blocking contract
findings. Dimi then explicitly authorized FS-3.2 implementation and supplied
device acceptance; the recorded normal-history Back decision is unchanged.
The [implementation record](fs-3.2-navigation-lifecycle.md) separates those
approvals from automated results, the subsequent independent implementation
approval, and Dimi's explicit FS-3.2 completion after Firefox/Safari testing.
FS-G1 remains unapproved. The proposal-stage status/checkpoint language below
is retained as historical context, not a current prohibition on the authorized
implementation. Exact approved revision-3 artifacts remain unchanged.

**Measured refinement for implementation review:** on a changed same-document
hash, release immediately but let Next capture history before its first scroll;
focus correction uses `preventScroll`. Only an identical current href performs
explicit immediate reveal. Browser testing demonstrated that scrolling a changed
hash before Next commits can corrupt the departing entry's position. No new
public API/history mechanism is added. This supersedes the blanket synchronous
reveal wording in the proposal below; it is highlighted for Codex's code review.

**Query-removal correction for implementation re-review:** supported static
portfolio routes retain their mounted main/overlay owner when a native link
removes a query string. Same-origin, same-path actions therefore use the immediate
release/focus path regardless of search parameters; only cross-path actions wait
for incoming-owner mount. Next still commits the actual href, captures history
and owns the first changed-URL scroll. The existing frame keeps its committed-URL
and owner guards. This is classification inside the existing adapter, not a new
port, route observer, synthetic history event or forced remount. Author tests
are green; Codex's independent re-review remains pending.

## Status, authorization and handoff (proposal-stage record)

- **Stage:** Revised contract proposal (revision 3), 2026-09-27. No lifecycle implementation.
- **Writer:** Sites. **Next technical owner:** Codex, for a separately requested
  read-only re-review. Revision-2 review accepted the history fix at contract
  level but returned P2 “Arrival fallback overrides valid fragment focus.”
  This revision addresses that finding; independent re-review remains pending.
- **Product decision:** Dimi selected “Follow normal page history and close the
  overlay” in this session. No temporary menu history entry. This decision is
  accepted; the technical proposal below is not yet approved for implementation.
- **Base:** `feature/funkspace-minimum-usable` at
  `c0cdda928cea38f12fc11db54ddab689f950a1e1`. The original proposal started clean; this revision preserves
  its two uncommitted documentation files and changes no executable source.
  FS-3.1 is complete and device-accepted in its [completion record](fs-3.1-navigation-settings-overlay.md#dimi-device-acceptance-and-completion--2026-09-25).
  Its two P2 fixes and static-theme/fixture-only Motion boundaries remain intact.
- **Prerequisites:** FS-1.6 shared Dialog and FS-2.6 route/static behavior are
  recorded complete. Historical SHAs are provenance, never reset targets.
- **Authorization:** documentation changes only. Stop before implementation,
  a new Codex review, commit/push, later tasks, PR/merge or deployment. Return
  this revision for review; do not treat author validation as independent approval.

Read root AGENTS, the [workflow](../development/ai-workflow.md),
[task template](../templates/task.md), [authoritative plan](../features/funkspace-minimum-usable.md),
the supplied `/Users/dimi/Downloads/FunkSpace_EPIC_3_Detailed_Plan.md` (especially
sections 3, 5 and FS-3.2), FS-1.6/FS-2.6/FS-3.1 records, architecture and actual
scripts/source/tests. No nested AGENTS files were found. Supplied documents
provide constraints, not authority to implement. Later accepted FS-3.1 decisions
supersede their older visible Menu/title, flat navigation and label proposals.

## Actual starting behavior and reuse

| Evidence at the base                                                                                                                                                 | Consequence for this proposal                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DialogBindingPort.ts:1–20` has close reasons, focus getters, `sync`, `requestClose`, `destroy`.                                                                     | Extend this boundary; retain existing callback meanings and default dismissal.                                                                                              |
| `useDialog.ts:24–44` updates latest props in a layout effect and calls `destroy()` on cleanup.                                                                       | A new prop value in a render that removes Dialog is not a reliable handoff. A stable intent ref and explicit teardown policy must reach cleanup.                            |
| `NativeDialogBinding.ts:7–56,88–106` always restores saved scroll, then return target → captured opener → fallback.                                                  | Omitting `returnFocusRef` does not disable the other two focus paths or scroll restoration. Navigation must suppress the entire application restoration chain.              |
| Binding native-close guards and tests cover queued acknowledgments, repeated sync, rollback and destruction.                                                         | Retain these protections and prove them for the new mode. Do not replace the native modal or implement another Tab trap.                                                    |
| `PortfolioNavigation.tsx:47–77` conditionally mounts Dialog; same-path `onNavigate` flushes closure, cross-route activation retains the overlay until shell unmount. | Preserve the accepted no-flash transition, but distinguish closing a mounted dialog from removing its route owner.                                                          |
| `PortfolioNavigationTree.tsx:64–73` uses Next Link, real hrefs and `onNavigate`, with prefetch disabled.                                                             | Extend this accepted link integration; do not substitute a router, fake href or application-menu semantics.                                                                 |
| `PortfolioShell.tsx:37–48` supplies focusable `#main-content`; Start/About preview/Contact have focusable section IDs. Each page renders its own Shell.              | Prefer existing targets. A cross-route request must outlive the departing Shell without retaining its DOM refs.                                                             |
| Current browser tests prove delayed-route coverage, first Contact focus, modified links, ordinary Back and static legal links.                                       | They do not prove repeated-hash focus, every ordering race or cancellation. The earlier read-only review observed repeated Contact leaving focus on Menu.                   |
| `FocusManager.ts` and `utils/focusIntoSection.ts` choose the first interactive descendant and can use uncancelled smooth-scroll listeners/polling.                   | They are not used by this navigation. Do not add a second copy or route this feature through their incompatible delayed behavior. Leave their broader cleanup out of scope. |

Installed Next **15.5.24** was inspected directly: `dist/client/app-dir/link.js`
lines 47–89 bypass modified/download/external actions before `onNavigate`, then
dispatch navigation; `dist/client/components/layout-router.js` lines 124–227
resolve fragments, scroll and focus on route commit. These are observations of
the installed dependency, not APIs to patch/import. A pathname watcher alone
misses same-path fragments and repeated activations.

Native `dialog.close()` can itself restore previous focus before application
cleanup. The [HTML closing algorithm](https://html.spec.whatwg.org/multipage/interactive-elements.html#close-the-dialog)
also queues a later close event. Require the correct **final** destination focus
and no late application restoration; do not promise that native transient focus
can be disabled by removing refs.

## Revision 2 — response to the first review (historical)

**Owner: Sites.** The revision-2 incoming-main fallback below is superseded by
revision 3; the retained-receipt and non-displacing-lock proposals remain.

1. **P2 — Cancelled transitions lose their destination focus/scroll owner.**
   Withdraw `scroll={false}`. Next keeps its installed scroll/focus behavior on
   every ordinary Link. Distinguish cancellation of a preferred destination
   action from cancellation of the accepted route's arrival record. Dismissing
   the overlay cannot abort Next: retain one downgraded record so an eventual
   mounted page receives a fresh, focus-only arrival at its main target.
   Redirects use the actual mounted page, never the stale requested section.
2. **P2 — Navigation release does not preserve native history/fragment scrolling.**
   Skipping the fixed-body lock's final `scrollTo` is insufficient. Add an
   opt-in, non-displacing overflow lock to the existing native binding for this
   consumer. Keep the default fixed-body strategy for existing consumers.
   Preserve document geometry and real scroll coordinates throughout the open
   cycle so native history/fragment behavior can operate before departure
   events. No history interception, saved-position map or delayed repair.

## Revision 3 — fragment-aware arrival fallback

**Owner: Sites. Status: proposed correction, awaiting Codex re-review.**
The revision-2 review found that unconditional incoming-main focus could undo a
correct Contact arrival and send the next Tab back to earlier content. Resolve
fallback focus from the **actual committed URL and incoming document**. Preserve
valid fragment focus; otherwise focus that fragment if usable. Main is the last
fallback when no meaningful destination target exists. This does not recover a
cancelled request's preferred ID. No API, routing or lock expansion is needed.

## Proposed shared Dialog contract

The single semantic distinction is **dismissal** versus **navigation**. Keep
native close-request reasons unchanged; a request reason is not a cleanup policy.
The following additions are proposals, not existing exported APIs:

```ts
export type DialogCloseDisposition = "dismiss" | "navigation";
export type DialogScrollLock = "fixed-body" | "document-overflow";

// Additions only; existing required fields remain unchanged.
export interface DialogBindingOptions<TFocus> {
  closeDisposition?(): DialogCloseDisposition; // omitted => dismiss
  scrollLock?: DialogScrollLock; // omitted => existing fixed-body strategy
  onReleased?(disposition: DialogCloseDisposition): void;
}

// Extend the existing method; no argument preserves current behavior:
export interface DialogBinding {
  destroy(disposition?: DialogCloseDisposition): void;
}

// Add to DialogBehavior; DialogProps already extends it:
export interface DialogBehavior {
  closeDispositionRef?: RefObject<DialogCloseDisposition>;
  scrollLock?: DialogScrollLock; // fixed for this mounted consumer
  unmountDisposition?: DialogCloseDisposition; // omitted => dismiss
  onReleased?(disposition: DialogCloseDisposition): void;
  onOpenError?(error: unknown): void; // omitted => retain current thrown error
}
```

- `sync(open)` and `requestClose()` keep their signatures. `useDialog` supplies
  a getter reading the stable intent ref at cleanup time, rather than capturing
  a prop value at bind/open time. Latest ordinary callbacks remain supported.
- `destroy(explicitMode)` overrides the live getter for that termination only.
  With no argument it uses the getter/default. Existing consumers omit all new
  options, including stories that deliberately unmount while open: they retain
  restoration and error behavior.
- `onReleased` is a synchronous, once-per-active-cycle acknowledgment **after**
  native closure, owned-style release, mode-specific scroll handling, and any
  dismissal focus restoration. Clear ownership/cycle refs before invoking it.
  Never call it again from a queued close acknowledgment or a second destroy.
  The callback must not update an unmounting consumer's React state; navigation
  uses it only to acknowledge a pending handoff token.
- `onOpenError` runs in the hook only after adapter rollback. Opting into it
  allows the portfolio to reveal the existing ordinary navigation and retain a
  reachable retry/fallback rather than crash or leave an inert Menu. No success
  acknowledgment for failed opening. Unexpected errors remain reported, not
  relabeled as a successful opening.
- In PortfolioNavigation, keep the one Dialog **mounted while its owner is
  mounted**, controlled by `open`. Ordinary Close/Escape sets the ref to
  `dismiss`, then sets `open=false`; a navigation action sets `navigation`
  before closure. Set `scrollLock="document-overflow"` and
  `unmountDisposition="navigation"` on this consumer so an
  unannounced route teardown cannot replay old page focus/scroll. Closed native
  Dialog remains hidden; no new public open-state framework is needed.
- Opening starts a fresh cycle and resets the intent to `dismiss`. A failed
  opening uses rollback/dismiss semantics, never a navigation ticket's policy.

### Lock strategy, release ordering and ownership

Both strategies remain private branches of **the existing `lockScroll` helper**,
owned by one NativeDialogBinding cycle. Do not extract a second manager. Latch
strategy at acquisition; changing it while active is unsupported. The default
`fixed-body` branch retains its current writes and dismissal restoration.

Portfolio's `document-overflow` branch owns `overflow: hidden !important` on the
owner document's root and body, plus measured scrollbar-gap compensation if
needed. It must not write body `position`, `top`, `left`, `width`, viewport
height, transforms or document coordinates. Do not use `overflow: clip`: native
programmatic/history scrolling must remain possible. Preserve original inline
values/priorities and external writers exactly as the existing helper does.
Native dialog supplies modality and focus containment; no custom Tab trap or
blanket keyboard/touch-event cancellation is introduced.

Opening must preserve document extent and X/Y. Overflow prevents user scrolling
of the background while the existing dialog panel remains scrollable. Native
fragment/history scrolling can still occur while the modal is present, before
`hashchange`, `popstate` or `pagehide` reaches the adapter. Cleanup removes styles
without undoing that work. Scrollbar compensation must not change document
height/anchor positions on release; verify this with the actual shell.

**Dismissal:** mark cycle inactive → native close → restore only still-owned
inline values/priorities → restore captured document coordinates once, instantly
→ focus first usable explicit return target, actual opener, then fallback using
`preventScroll` → clear cycle refs → acknowledge release. Existing consumers
retain this behavior. A real departure takes precedence over dismissal; once
navigation is latched, a queued cancel/close acknowledgment cannot restore it.

**Navigation:** latch mode/cycle before any state update → mark cycle inactive
→ native close → restore only still-owned inline values/priorities, **without
saved-coordinate writes** → clear opener and every application restoration path
→ acknowledge release. The browser/router owns route/history scrolling; the
bounded portfolio arrival may adjust focus only. Explicit same-document actions
are the sole custom destination-scroll exception below.

Never queue saved-position restoration. Repeated sync, destroy, native events,
and old cleanup after reopening must be no-ops for the released cycle. Clear
ownership before release callbacks; a callback must not unlock a later cycle.
No new cycle acquires the old cycle's lock. Strict Mode replay must preserve
coordinates with the portfolio overflow strategy, while default shared-consumer
replay retains its existing dismissal semantics.

**Acceptance gate:** desktop Chromium diagnostics support the overflow strategy,
not its production or phone acceptance. Verify wheel, touch, keyboard, overscroll,
short-screen panel scrolling and visual viewport changes in supported browsers.
If a supported phone cannot block background scrolling with this strategy,
return to this contract checkpoint. Do not silently fall back to fixed-body
navigation, add another manager or repair history using delayed scroll writes.

## Proposed portfolio-only handoff boundary

Cross-route Shells unmount, so a component-local ref alone cannot complete focus
on the incoming page. Propose **one pending request slot per existing
ServiceProvider instance**, injected by `createServices`, with browser effects
behind a narrow port. No new provider, route registry, history wrapper, persisted
state, event bus, every-route autofocus or general focus framework.

Proposed `frontend/domain/ports/PortfolioNavigationHandoffPort.ts`:

```ts
export interface PortfolioFocusTarget {
  href: string;
  focusId: string;
}
export interface PortfolioNavigationTicket {
  id: number;
  kind: "same-document" | "client-route";
}
export interface PortfolioNavigationHandoffPort<TFocus> {
  begin(target: PortfolioFocusTarget): PortfolioNavigationTicket;
  released(id: number): void;
  arrived(main: TFocus): void;
  cancelPreferred(id?: number): void;
  cancel(id?: number): void;
  fallbackTarget(): TFocus | null;
  observeDeparture(
    notify: (cause: "history" | "fragment" | "document") => void,
  ): () => void;
}
```

Proposed `frontend/infrastructure/dom/PortfolioNavigationHandoff.ts` implements
URL classification, ownerDocument target resolution, bounded frame work and
`popstate`/`hashchange`/`pagehide`/`pageshow` subscriptions. Factory construction is inert
and SSR-safe. ServiceProvider specializes `TFocus` to HTMLElement, as it already
does for DialogBinding. Root cleanup cancels work; each subscriber removes its
own listeners. Cleanup/setup replay must be reusable in Strict Mode, not leave
a memoized permanently destroyed service.

An actual traversal notification must synchronously select navigation cleanup
and release the active modal before application destination effects. A
`pagehide` also invalidates tickets and closes the controlled overlay; a BFCache
`pageshow` resumes balanced subscriptions for the live owner with the overlay
closed and no revived ticket. Do not use beforeunload as proof that a departure
actually happened, or force focus/scroll on history restoration.

### One slot, two levels of cancellation

`begin` replaces the sole prior record. It holds plain requested URL/focus ID,
intent generation, source-owner identity and readiness flags; no old DOM nodes,
closures, per-history-entry positions or request queue. This is an arrival
receipt for an accepted overlay action, not a route-abort API.

- `cancelPreferred(id)` cancels scheduled destination work and removes its
  preferred target. For a client route it **retains** a downgraded arrival
  receipt; for a same-document action it consumes the record. Close/Escape,
  reopening and newer source-page interaction use this operation. Never revive
  the removed preferred section or a cancelled frame.
- `cancel(id)` discards the entire receipt for actual history/document departure,
  root disposal, failed opening or a superseding accepted link. ID-specific
  cancellation cannot affect a newer intent. A failed route that stays on its
  source page has no arrival and does not focus anything; the one inert receipt
  is replaced/discarded on the next qualifying action, with no timers/polling.
- `released(id)` records only the release associated with that intent's source
  cycle. Wiring captures the ID at that cycle's termination, not from a later
  mutable current-ticket getter. A new opening invalidates old scheduled focus;
  an old acknowledgment cannot release a new cycle or authorize work through it.
- `arrived(main)` is called from the incoming mounted portfolio consumer, after
  its main ref exists. The adapter validates ownerDocument, connected/visible
  current `#main-content`, a different source owner for client routes, and the
  actual committed URL. Derive source/incoming owner identities privately from
  the existing main nodes (weak identities, no retained departing nodes). A source
  rerender is not arrival. It snapshots the
  current generation for bounded work; it does not retain the supplied node.
  Same-document actions use their explicit activation path, including unchanged
  hashes. `popstate` is never a synthetic route-completion event.
- An incoming owner and source release may be observed in either order. Require
  both, and no active modal, before scheduling. Re-resolve targets from the
  current document at execution. Old owner/unmount/frame callbacks cannot
  acknowledge a newer intent. If a newer modal is present on arrival, consume
  the custom work; do not wait indefinitely or override its focus.
- `fallbackTarget()` resolves visible `#main-content` for the existing fallback
  ref. Keep explicit return, actual opener and fallback as separate candidates.

Only an explicitly transferred client receipt survives source teardown. Root
teardown clears everything. Subscriber cleanup must remove its listeners without
cancelling another owner's newer record. The receipt does not outlive a full
page load or history traversal. No receipt means no portfolio arrival autofocus.

### Link integration and destination ownership

Extend shared destination records with `focusId`: `home`, `aboutPage`,
`impressum`, `privacy` use `main-content`; `start`, `about`, `contact` use their
existing IDs. Tree callback receives `destinationKey`. Keep native hrefs, Next
push/replace defaults, `onNavigate` eligibility and **default `scroll` behavior**.
Do not add `scroll={false}`, intercept routing or mutate history. Footer and
static tree behavior remain unchanged.

**Same-document action:** create intent, latch navigation, synchronously close
and release through the existing flush boundary, then resolve and instantly
reveal/focus the explicit section/main. This runs even if URL/hash is identical,
without waiting for hashchange. It occurs before returning from `onNavigate`;
Next then processes the ordinary href. If its normal commit subsequently moves
focus, the one still-current arrival correction may focus the same target with
`preventScroll`, without another scroll. Validate the unchanged-URL path and
first-hash path independently; no late opening-coordinate replay is allowed.

**Client route:** retain the complete overlay while pending to preserve FS-3.1's
no-flash behavior. Source unmount releases using navigation policy; Next keeps
responsibility for its normal commit scroll/focus. One cancellable animation
frame after both release and mounted arrival may make a **focus-only** correction:

| Receipt at arrival                                             | Focus target                                                                                                 | Scroll owner                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| Active preferred action, exact requested route/fragment        | Actual committed fragment first; otherwise shared focus ID, then main                                        | Next                               |
| Preferred action cancelled by dismissal/reopening/source input | Preserve valid actual-fragment focus; otherwise actual fragment, then main; never use cancelled preferred ID | Next                               |
| Redirect to a different committed URL                          | Preserve valid actual-fragment focus; otherwise actual fragment, then main; never use old page's ID          | Next/browser                       |
| No receipt, history traversal or full-document arrival         | No portfolio correction                                                                                      | Next/browser                       |
| New modal or destination-page interaction before the frame     | Cancel correction and consume receipt                                                                        | Next/browser; preserve newer focus |

**Arrival target precedence:** after all owner/generation/user-input guards pass,
read the actual committed URL, safely decode its fragment, and resolve it in the
current incoming document. A usable target must be connected, visible, outside
any modal, non-inert/non-disabled, and programmatically focusable. Use the
existing section/heading IDs; do not add tabIndex to arbitrary elements. Malformed,
missing or unusable fragments do not revive a requested target from another URL.

1. If the committed fragment has a usable target and focus is already on that
   target (or a meaningful focusable descendant within it), leave focus and
   scroll untouched and consume the receipt. Do not call main.focus afterward.
2. Otherwise, if that actual fragment target is usable, focus it once with
   `preventScroll`. Next already owns its reveal; never replay the old source
   coordinates or add a second route scroll.
3. With no usable actual fragment, an active, exact-match preferred action may
   use its shared destination target. Downgraded/redirected arrivals may not.
   If no meaningful target remains, use the incoming main once. If main is also
   unusable, report the contract failure and consume the receipt without retry.

A cancelled Contact request that actually commits `/#contact` therefore uses
Contact because of the **new page's committed fragment**, not because its old
preferred action was revived. A redirect to `/#contact` follows the same rule;
a redirect away from Contact must never focus the stale Contact ID.

The fallback at a downgraded/redirected arrival is new work authorized by that
mounted page and the retained receipt. It does not reactivate the cancelled
preferred action. Source-page input cancels the old target but does not pretend
to stop navigation; destination-page input after arrival supersedes the new
correction. Distinguish these phases by owner/generation, not elapsed time.

The frame rechecks generation, current document/URL, incoming owner and focusable
main/section. It uses `focus({preventScroll:true})` only. Consume the receipt
before focusing, including on missing targets. If main is also missing, report
the contract violation; no body/first-link guess or retry loop. Unknown future
async targets require a separate bounded readiness proposal.

Thus a stalled route remains dismissible; a truly failed route performs no
arrival work; a late successful route still has both Next scrolling and a
meaningful incoming focus target. A redirect or subsequent full-document fallback
never focuses the stale requested target. A newer accepted link replaces the
slot, and history/document departure clears it instead of performing autofocus.

## Interaction and acceptance matrix

| Event                                                                       | Release/history rule                                                                                                                                                                                      | Final focus/scroll and cancellation                                                                                                                                                                                           |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Open via keyboard, pointer or touch                                         | One modal, one lock; reset category/cycle; cancel old frames and downgrade any pending client receipt. Capture the actual invoker.                                                                        | Current hidden-title navigation focuses Close; default other dialogs retain title/explicit initial focus. No document jump.                                                                                                   |
| Close, overlay Menu toggle, Escape                                          | Dismissal, no history write. Native cancellation without actual traversal is also dismissal.                                                                                                              | Valid explicit return target → actual opener → visible main fallback. Restore opening coordinates once, then focus without scroll.                                                                                            |
| Same-page section, including Contact from `/`                               | Release first; preserve actual href and router history behavior.                                                                                                                                          | Focus section itself, not email/first child. Reveal instantly with shell clearance; no later Menu focus or old-coordinate replay.                                                                                             |
| Repeated `/#contact` or same-route Home/About/legal link                    | Explicit action creates a fresh ticket even if location does not change.                                                                                                                                  | Re-establish section/main focus and visibility; do not rely on pathname/hashchange.                                                                                                                                           |
| Client route `/about`, `/privacy`, `/impressum`                             | Preserve full overlay while pending; release at departure; retain Next commit scrolling.                                                                                                                  | Next scrolls; focus-only incoming main after mounted arrival. Downgraded/redirected receipts use actual main. No stale target or unlocked-page flash.                                                                         |
| Cross-route fragment, e.g. `/privacy` → `/#contact`                         | Use shared absolute-page href, never local `#contact`; matching route/fragment readiness and release required.                                                                                            | Incoming Contact target; legal/Contact must clear the launcher. Next owns fragment scroll; unknown/unfocusable target uses focus-only incoming main without rewriting URL.                                                    |
| Full-document navigation / Next hard-navigation fallback                    | Do not intercept browser navigation. On pagehide, navigation cleanup releases owned styles, skips old coordinates and cancels tickets/listeners.                                                          | Browser owns fresh document/fragment focus and scroll. No persisted handoff, forced heading focus on ordinary reload, or delayed work surviving the old document.                                                             |
| Legal links                                                                 | Overlay legal leaves use exactly the same handoff as other ready leaves. Footer ordinary links stay ordinary.                                                                                             | Legal main on enhanced client arrival; native/static navigation remains usable.                                                                                                                                               |
| Back/Forward with overlay open                                              | Dimi's selected normal history policy: no pushState/replaceState menu entry, History monkey patch or compensating history.back. On actual traversal cancel tickets and close with navigation disposition. | Non-displacing lock preserves native position capture; browser/router restores history; no custom destination scroll/focus, no resurrected overlay on Forward. Same-path traversal is covered by popstate, not just pathname. |
| Hash change outside the owned link action                                   | Observe current-document fragment change; distinguish an expected owned arrival from unrelated fragment/history departure.                                                                                | Unrelated change cancels pending work and releases without old restoration. Non-displacing geometry allows browser fragment scrolling before cleanup; do not replay old coordinates.                                          |
| Modified/middle/right click, new tab/window, download, prevented activation | No ticket, dismissal or focus handoff merely from click. Use installed Link eligibility; native full-document departure is handled separately.                                                            | Current page/overlay stays intact if it is not actually leaving. The destination browser context owns itself.                                                                                                                 |
| Failed native opening, detached node or competing modal                     | Roll back only acquired styles/coordinates, acquire no other modal's resources, clear failed-cycle refs/ticket, report failure.                                                                           | Keep a valid opener/fallback; reveal ordinary tree/legal links. Optional portfolio error handling must not leave navigation behind a dead trigger.                                                                            |
| Unexpected native close                                                     | Clean up active cycle once, wait for controlled false acknowledgment; do not reopen from stale true.                                                                                                      | With no navigation intent, existing dismissal defaults. With an owned departure, never repeat the dismissal chain afterward.                                                                                                  |
| Route owner teardown / root teardown                                        | Portfolio opts into navigation on unmount. Ordinary shared consumers still default to dismissal. Clear subscriptions and cycle ownership synchronously.                                                   | Only an explicitly transferred route ticket survives source unmount; cancel on root teardown or unrelated departure. Old cleanup cannot affect incoming focus/scroll.                                                         |
| Rapid close/reopen; Strict Mode; overlapping links                          | New generation invalidates old frames; reopening downgrades the client receipt. Guard cycle/owner-specific acknowledgments. No second modal/lock.                                                         | Stale callbacks cannot dismiss, focus over or unlock the newer cycle. Destination-owner input cancels new arrival focus; source input removes only the preferred target.                                                      |
| Breakpoint/orientation/short-height change while open                       | Presentation change only; do not remount or open a second Dialog. Retain cycle/category/intent.                                                                                                           | Same trigger if valid; if replaced/hidden, try remaining restoration candidates then visible main. Preserve both accepted P2 geometry checks, text wrapping and panel scrolling.                                              |

**Back platform qualification:** the selected policy follows actual history; a
browser/phone may instead deliver a native dialog cancellation gesture. That is
ordinary dismissal, as the supplied detailed plan distinguishes. Never infer
`history.back()` from `cancel` (which also covers Escape). Dimi's policy decision
is recorded; native phone gesture behavior remains a future device test, not an
invented guarantee that every platform emits popstate for its Back gesture.

## Exact proposed file boundaries and tests

All paths below are **future implementation**, not changes in this proposal:

| Path                                                                                                                                            | Proposed change / required evidence                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain/ports/DialogBindingPort.ts`, `hooks/useDialog.ts`, `components/Controls/Dialog.tsx` under `frontend/`                                   | Add optional disposition, lock strategy, release acknowledgment, teardown override and opt-in error handling above. No required migration for existing consumers. Test live ref read before unmount and unchanged close-request signatures/defaults.                                                                           |
| `frontend/infrastructure/dom/NativeDialogBinding.ts` / `.test.ts`                                                                               | Extend the same private lock with the non-displacing opt-in; make release mode-aware; suppress return, opener and fallback together for navigation. Assert strict call ordering, nonzero X/Y restoration only on dismissal, external style ownership, failed-open rollback, at-most-once acknowledgment and queued old events. |
| Proposed `frontend/domain/ports/PortfolioNavigationHandoffPort.ts` and `frontend/infrastructure/dom/PortfolioNavigationHandoff.ts` / `.test.ts` | One injected request slot and browser effects as specified. Test both readiness orders, URL/owner/generation checks, absent targets, cancellation, input races, no indefinite work and balanced listeners/frames.                                                                                                              |
| `frontend/application/providers/ServiceProvider.tsx`, `frontend/infrastructure/services/createServices.ts`                                      | Inject the narrow adapter and cancel pending root work on cleanup; no theme/service destruction during overlay close. Strict Mode cleanup/setup must not disable a reused service.                                                                                                                                             |
| `frontend/components/Layouts/PortfolioNavigation.tsx`, `PortfolioNavigationTree.tsx`, `frontend/data/portfolioDestinations.ts`                  | Keep Dialog mounted, wire intent/tickets/fallback/departure and arrival cues, share focus IDs, retain Next default scroll behavior and separate preferred-action cancellation from arrival receipts. No added destinations or changed history semantics.                                                                       |
| Existing Dialog/navigation tests and stories                                                                                                    | Preserve current cases; add dismissal override/opener/fallback validity permutations, navigation mode with all three valid, failure fallback and two separate triggers. Mocks prove wiring only.                                                                                                                               |
| `e2e/navigation-transition.spec.ts`, `portfolio-navigation.spec.ts`, `navigation-composition.spec.ts`, `e2e/storybook/dialog.spec.ts`           | Real-browser focus/scroll ordering, history, delayed transitions, repeated hash, cross-route fragment, every legal link, no-JS, modified links, hard document/BFCache restoration, failed opening and rapid reopening. Existing no-flash and P2 checks remain.                                                                 |

Required new browser assertions include:

1. Record native/application focus events and scroll writes from activation
   through final arrival and subsequent frames. Final focus must be meaningful;
   after destination ownership begins, no old-coordinate scroll or old Menu focus.
2. Open from nonzero document scroll; test Close, Escape, native close and
   ordinary consumer unmount with explicit return, removed opener, hidden/inert/
   disabled targets, then fallback. Test navigation with all restoration targets
   valid to prove it suppresses all three, not merely missing refs.
3. Contact first activation and repeated hash after manually scrolling away;
   same-route Home/About/legal; cross-route Contact from both legal pages.
   Assert activeElement, URL/history, visible target and absent body lock.
4. Delayed/cached client routes, hard-navigation fallback, abort/failure,
   redirect to unmatched URL and route commit after user cancellation. Assert Next
   scrolling plus actual-fragment focus for downgraded/redirected fragment arrivals
   (main only when no meaningful destination exists), and no
   stale correction after destination input or a new modal. Preserve
   continuous source overlay coverage until departure; no timer guesses.
5. Back/Forward from different routes and same-path hashes while open, including
   nonzero source and destination history positions; direct
   load/refresh and BFCache pageshow; no synthetic entries, stale overlay or
   pending ticket. Compare exact saved nonzero coordinates with an unlocked control;
   test external fragments while the modal is already open. Capture window X/Y
   and document extent before/while/after the lock, not only after closure.
   Do not set global history.scrollRestoration to manual.
6. Same-task close/reopen, older release after a newer begin, source unmount
   before/after arrival, root disposal, Strict Mode replay at nonzero scroll,
   source-input downgrade versus destination-input cancellation, user input before a
   scheduled focus, repeated sync and ten-cycle listener/lock accounting.
7. Narrow/short/wide layouts, 200% text, both P2 regression cases, responsive
   trigger replacement, themes and reduced motion. Real touch/phone and
   Safari/Firefox evidence remain separate from Chromium emulation.

### Required delayed and redirected Contact regressions

These are implementation obligations for `e2e/navigation-transition.spec.ts`,
not executed tests or product acceptance. Use controlled route-response release
and observable mounted/URL conditions rather than sleep-based timing. Exercise
320px and wide layouts, pointer and keyboard activation, and both source legal
pages where applicable.

| Case                                     | Setup and action                                                                                                                          | Required arrival and keyboard assertions                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Delayed Contact after dismissal          | From `/privacy` and `/impressum`, activate `/#contact`; hold the client response, dismiss with Close or Escape, then release the response | URL is `/#contact`; final focus stays on `#contact`, not main/Menu; next Tab focuses Contact's email link                        |
| Delayed Contact after source interaction | While that response is held, dismiss and interact on the source page, then allow arrival                                                  | The downgraded receipt uses actual Contact; final focus and next Tab match the row above; no old frame is revived                |
| Redirect into Contact                    | Hold a client route that redirects to `/#contact`; test both retained and dismissed overlay before releasing it                           | Resolve the actual arrival fragment; final focus is `#contact`; next Tab is the email link, not earlier About/navigation content |
| Redirect away from Contact               | Requested Contact redirects to a page without that fragment                                                                               | Never focus an old Contact node/ID; use that page's meaningful destination/main and assert its own next Tab target               |
| Destination interaction wins             | On mounted Contact, move focus to the email link before the scheduled correction, or open a newer modal                                   | Preserve the newer focus/modal; no Contact or main correction; pressing Tab follows the current destination/modal order          |

For both delayed and redirected Contact, assert the email link's real `mailto:`
href from existing contact data. Capture X/Y after Next's destination reveal,
then assert they remain unchanged through the proposed correction and following
frames. Contact's heading and email link must be visible and clear of the launcher;
Tab must not jump to the page start or an earlier link. Allow only a minimal
native reveal if Tab needs to expose the email link at a short height; also run
one viewport where the link is fully visible and assert identical scroll before
and after Tab. Assert no residual lock and no later Menu/main focus. Include a
control with the cancelled receipt absent to detect accidental replacement of
Next's native fragment behavior.

No FS-3.3 storage fix, motion integration, logo activation, customization UI,
game timing, token redesign or broad focus-helper refactor is included. Future
customization may use this same overlay owner later; no placeholder state or
panel is introduced now.

## Original proposal validation (historical baseline)

- Inspected actual source, existing tests/stories and installed routing code;
  checked committed FS-3.1 handoff and clean starting branch/base.
- `pnpm check:theme-bootstrap` — PASS; no generation performed.
- `pnpm exec vitest run frontend/infrastructure/dom/NativeDialogBinding.test.ts frontend/components/Controls/Dialog.test.tsx frontend/components/Layouts/PortfolioNavigation.test.tsx frontend/components/Layouts/PortfolioNavigationTree.test.tsx`
  — PASS, **17 tests / 4 files**. These validate the existing baseline, not any
  proposed API or browser behavior. Log: `/tmp/funkspace-fs32-contract-baseline.log`.
- `pnpm exec prettier --check docs/tasks/fs-3.2-navigation-focus-contract.md docs/features/funkspace-minimum-usable.md`
  and `git diff --check` — PASS. Local Markdown targets and the new section
  link resolve. Final source comparison against HEAD confirms documentation-only
  changes and no generated drift. No new implementation/browser/performance PASS
  is claimed; the future test matrix above is not executed evidence.

Exact proposal patch, file hashes, base, command results and the baseline log
are retained in
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.2-contract/`.
Only this new task record and the feature-plan stage pointer change. No review
or shared implementation completion record is edited by this proposal.

## Revision 2 validation and limits

- Read-only review findings are recorded above; author revisions are not a Codex
  re-review PASS. Existing code, tests, installed Next behavior and section 5 were
  checked again against the unchanged FS-3.1 base.
- Isolated Chromium diagnostics compared native pages, fixed-body locks and the
  proposed overflow-only geometry: Forward restored 1600px for the unlocked and
  overflow cases, versus 0px for fixed-body. Overflow left a lower fragment at
  viewport top (window Y=1400) after cleanup. These are browser-mechanism probes,
  not an implemented binding or app E2E test. The fragment variant also passed
  with fixed-body and does not independently reproduce the earlier review's
  failing fragment case; retain that regression obligation in the real app.
- The reviewed implementation test matrix above is **required future evidence**,
  not executed or accepted behavior. No phone, Safari, Firefox, BFCache, routing
  cancellation, or production lifecycle PASS is claimed by the probes.
- Revision format/link/diff/source-preservation checks and exact patches are
  recorded in the revision-2 handoff manifest. Original proposal artifacts remain
  unchanged. Only this contract and the feature-plan pointer are edited.

Revision-2 artifacts (including delta from the reviewed proposal and full diff
against the accepted FS-3.1 base):
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.2-contract/revision-2/`.

## Revision 3 validation and handoff

The revised rule and explicit Contact cases are documentation only. Source and
existing Contact markup were inspected; no new lifecycle tests are claimed PASS.
Formatting, local Markdown file targets, whitespace and source preservation are
checked for this revision and recorded with exact diffs/file hashes in:
`/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-3.2-contract/revision-3/`.
Prior revision artifacts and evidence remain unchanged. The review's isolated
keyboard diagnostic is historical evidence for the defect, not validation of
an implemented correction. Phone/browser implementation evidence remains pending.

## Next acceptance action — stop here

**Return revision 3 to Codex for read-only contract re-review.** Review the
retained receipt versus preferred-action cancellation, default Next ownership,
actual-fragment-first fallback and explicit Contact keyboard/scroll assertions,
and the optional non-displacing lock. Check both
release/arrival orders and late old-cycle events. The overflow strategy must be
validated in the existing binding on supported touch browsers during authorized
implementation; a failure returns to this gate, not a hidden alternative lock.

Dimi's recorded Back decision is unchanged. No new product/device approval is
inferred. Independent re-review and then implementation authorization are still
required. No lifecycle implementation, next task, commit, push or deployment has
started. Sites remains the author responsible for revisions; Codex is the next
technical reviewer. The history finding was addressed at contract level in the
prior review; runtime/device evidence is still pending. Do not mark the remaining
arrival-focus P2 independently closed until re-review.
