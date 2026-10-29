# Task FS-1.5 — Add essential form primitives

## Task metadata

- **Status:** Complete — implementation and automated validation passed; Dimi approved presentation/readability and reports manual and visual tests PASS on 2026-09-16. Codex compatibility review remains FS-1.7.
- **Lead/current writer:** Sites, one local writer. Codex reviews compatibility at FS-1.7.
- **Last updated:** 2026-09-16.
- **Base:** `feature/funkspace-minimum-usable`, `46e32f048a2712111b1b1fa2f356712ffd1c8f65`; clean working tree at start.
- **Candidate:** accepted 10-file change against that base. Dimi explicitly authorized documentation finalization, commit and push on 2026-09-16. No deployment or later task is authorized.
- **Prerequisite:** [accepted FS-1.2 foundation](fs-1.2-token-and-contrast-foundations.md#dimi-acceptance--2026-09-15).
- **References:** [feature plan](../features/funkspace-minimum-usable.md), [FS-1.1 field pairings](fs-1.1-asset-and-component-contract.md#required-bindings-and-pairings-for-codex-fs-12), [workflow](../development/ai-workflow.md), [task template](../templates/task.md).

## Requested outcome and acceptance criteria

Add only labeled text/email input, textarea, help/error and nonurgent inline status presentation. Consumers own values, errors, pending policy and required fields. No schema/validation framework, registry, backend, delivery or FS-5.1 contract.

- [x] Persistent labels, meaningful required wording and actual-error-only invalid semantics.
- [x] Stable unique generated IDs and merged caller description IDs.
- [x] Native IDs/names/refs/values/default values/events/type/autocomplete/required/disabled/read-only retained.
- [x] Textarea rows/cols/wrap and native vertical resizing/overflow retained.
- [x] Controlled normal, invalid, disabled and pending name/email/message stories, labeled as fixtures.
- [x] Nonurgent status updates do not steal focus or mutate unchanged message text.
- [x] Unit, type, lint, build and rendered browser evidence.
- [x] Dimi accepts readability and visual presentation; actual decision below.

## Inspection and plan

Read repository AGENTS (no nested instructions), README, AI workflow, feature/task/template records, accepted FS-1.2 evidence, source/generated token bindings, current scripts, local font loading, Storybook/Vitest/Playwright configuration, existing Base/Controls code and relevant tests. Read the supplied `/Users/dimi/Downloads/FunkSpace_EPIC_1_Detailed_Plan.md` FS-1.5 section; its proposed archive location is not assumed to exist.

There was no shared field component or description-ID helper. Existing inputs are bounded demo/native controls, not reusable labeled primitives. Reuse **Base/Text** for help/errors/status and **Button** for fixture actions. A small private FieldFrame/useField helper has two actual consumers, TextField and TextAreaField. No architecture expansion or package change.

The supplied Figma UI Library exposes Icons, a separator and Buttons pages; no dedicated form specification was identified in the inspected sources. These primitives consume the accepted typography/spacing/semantic contract rather than claiming an unverified Figma form match. Dimi reviews their presentation.

Implementation sequence: native field composition and associations → controlled fixtures and status → behavior/pairing tests → cleanup and handoff. Sites profile is portable/unconfigured; existing tooling is preserved.

## API and ownership

- **TextField:** native input props, restricted `type?: "text" | "email"` (default text), plus required `label: string`, optional `help?: string` and `error?: string`.
- **TextAreaField:** native textarea props with the same label/help/error contract; rows defaults to 4 and remains caller-controlled. Width is responsive; cols remains a native attribute. Vertical resizing and scrolling use browser behavior, without a DOM measurement loop or auto-growth engine.
- Both forward the actual native ref. `className` and `style` extend the control. They do not copy values to local state, coerce defaults or implement a pending switch. Controlled/uncontrolled mode remains the caller's choice; do not switch modes during a mounted instance.
- Caller `id` is preserved; absent IDs use React useId. Help/error IDs use a separate stable per-instance prefix. Caller-supplied IDs must themselves be unique.
- Nonempty help/error messages receive associated IDs. `aria-describedby` is merged in caller/help/error order with duplicates removed. Whitespace-only errors do not produce error content or invalid semantics.
- The primitive owns `aria-invalid` and error associations, so direct `aria-invalid`/`aria-errormessage` props are omitted from its TypeScript API. An actual error sets `aria-invalid=true`; required/empty fields alone do not. Field errors are plain associated text with **Error:**, not alerts or live regions.
- Native `required` adds readable **(required)** to the persistent label. No email/message requirement is built in.
- **InlineStatus:** `message?: string`, `id?: string`, `className?: string`. Keep it mounted and update the caller-owned message. One `role=status`, polite/atomic region; no timers, effects, focus calls or repeated forced announcements. It is separate from field errors and does not repeat them globally.

### Consumer examples

```tsx
import TextField from "@/components/Controls/TextField";
import TextAreaField from "@/components/Controls/TextAreaField";
import InlineStatus from "@/components/Controls/InlineStatus";

// In a consumer that already owns draft, pending and presentation messages:
<TextField
  label="Email"
  name="email"
  type="email"
  autoComplete="email"
  value={email}
  onChange={(event) => setEmail(event.target.value)}
  error={emailError}
  readOnly={pending}
/>
<TextAreaField
  label="Message"
  name="message"
  rows={6}
  value={message}
  onChange={(event) => setMessage(event.target.value)}
  help="Add the details you want to include."
  error={messageError}
  readOnly={pending}
/>
<InlineStatus message={statusText} />
```

`emailError`/`messageError` are ordinary caller-supplied strings. A later feature may map a server-derived public field error to exactly the same prop; the primitive does not require a transport/result shape, parser or client validation framework. This is an integration seam, not a proposed FS-5.1 server contract.

Uncontrolled use is also supported:

```tsx
<TextField label="Example name" name="name" defaultValue="Alex" />
<TextAreaField label="Optional notes" name="notes" defaultValue="Draft" rows={3} />
```

### Pending and submission policy

The controlled fixture uses **readOnly** during pending, retaining focusability and native FormData inclusion. A separate disabled fixture retains displayed/control-state values but demonstrates their native omission from FormData. Returning to normal restores editing with the same values.

Consumers own submission snapshots, duplicate prevention, error timing, live announcement wording and any later success/delivery claims. No primitive disables itself, clears a draft, marks itself busy or submits data. The fixture's `Inspect local values` button only reads local FormData. All three contact-shaped sample fields are optional; the separate required-field story demonstrates a caller-selected requirement on generic example text.

## Bindings and rendered evidence

| Role                     | Existing binding                                                                  |
| ------------------------ | --------------------------------------------------------------------------------- |
| Label                    | Work Sans 16px/600, normal line-height                                            |
| Input/textarea           | Space Grotesk 16px, normal line-height; 48px minimum height                       |
| Help/error/status        | Existing Base/Text small size (14px/20px), content-primary                        |
| Field gap/padding/radius | space-xs gap/radius and vertical padding; space-sm horizontal padding             |
| Value/surface            | content-primary / surface-background                                              |
| Normal boundary/focus    | border-strong / border-focus, 2px outline with 2px offset                         |
| Error                    | feedback-error border; content-primary text with explicit Error prefix            |
| Disabled                 | content-primary / surface-elevation-1, dashed border and native disabled behavior |
| Forced colors            | Field/FieldText, ButtonText/GrayText, Highlight focus; error text remains visible |

Readable primary error/help/status text uses the approved FS-1.1 alternative instead of assuming every semantic feedback paint is suitable for small text. No token role/value or generated output changed.

Actual Chromium measurements on **surface-background and surface-elevation-1**, using resolved theme attributes and computed local fonts:

| Theme                   | Minimum text ratio (4.5 target) | Minimum enabled field border/interior (3 target) | Minimum focus/outer surface (3 target) |
| ----------------------- | ------------------------------: | -----------------------------------------------: | -------------------------------------: |
| default, explicit light |                           8.301 |                                            3.947 |                                  3.385 |
| dark                    |                           6.773 |                                            4.770 |                                  5.264 |
| muted                   |                          21.000 |                                           11.861 |                                 14.005 |
| dark-high-contrast      |                          21.000 |                                            8.778 |                                  9.759 |

Pairing attachments record element/state, resolved foreground/background, ancestor compositing, font and applicable checks. Error boundaries are measured against the actual control interior, which remains surface-background even when read-only. Disabled values also meet the chosen text target; inactive borders are not certified as enabled controls. These measurements do not certify arbitrary future surfaces or placeholder usage as a replacement for labels.

## Changed files and protected scope

| Path                                                                                | Change                                                                                |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [TextField.tsx](../../frontend/components/Controls/TextField.tsx)                   | Native text/email field and forwarded ref                                             |
| [TextAreaField.tsx](../../frontend/components/Controls/TextAreaField.tsx)           | Native textarea and forwarded ref                                                     |
| [field.tsx](../../frontend/components/Controls/field.tsx)                           | Private shared IDs, label/help/error composition                                      |
| [InlineStatus.tsx](../../frontend/components/Controls/InlineStatus.tsx)             | Stable polite inline status via Base/Text                                             |
| [fields.module.css](../../frontend/components/Controls/fields.module.css)           | Semantic typography, surfaces, focus, disabled and forced colors                      |
| [FormFields.stories.tsx](../../frontend/components/Controls/FormFields.stories.tsx) | Controlled state examples, native/required example, associations and surface pairings |
| [FormFields.test.tsx](../../frontend/components/Controls/FormFields.test.tsx)       | 11 behavior/association/value/status tests                                            |
| [form-fields.spec.ts](../../e2e/storybook/form-fields.spec.ts)                      | 13 rendered/browser checks                                                            |
| This task record and [feature plan](../features/funkspace-minimum-usable.md)        | Stage, evidence, API and handoff                                                      |

Presentation only. Protected: token sources/generated files, bootstrap/ThemeService, Base/Text and existing buttons/icons/logo, application/domain/infrastructure, package/lockfiles and isolated game exports. No page or form integration, dialog, delivery/provider, schema system or business validation.

## Validation and completion record

- **PASS:** `pnpm check:theme-bootstrap` before builds; freshness also enforced by lint/tests.
- **PASS:** `pnpm -F frontend exec tsc --noEmit`; explicit temporary story TypeScript config (stories are excluded from the normal frontend tsconfig).
- **PASS:** `pnpm exec vitest run frontend/components/Controls/FormFields.test.tsx` — 11/11.
- **PASS:** `pnpm lint`; `pnpm test` — 88 files, 1,336 tests.
- **PASS:** focused Storybook Playwright `form-fields.spec.ts` — 13/13, no retries/skips. Includes unfiltered axe on four states in four themes and both supported pairing surfaces, label/description associations, controlled drafts, native reset/required, real FormData omission/inclusion, 320px width, 200% root text size, real textarea resize-handle drag/scrolling and forced colors.
- **PASS:** `pnpm storybook:build`; `pnpm build` in established token → common → game → frontend order. Existing nonfatal Storybook use-client/sourcemap/chunk notices remain.
- **PASS:** screenshots inspected for invalid/pending and enlarged-text presentation. No browser-test failure required a suppression or lower target.
- **PASS:** generated CSS/TypeScript/bootstrap unchanged; final scoped diff/format and local documentation-link review.
- **Not run:** physical phone/browser-keyboard checks, screen-reader speech output, Safari/Firefox or Lighthouse. DOM tests establish status semantics, node stability and no focus stealing/unchanged-message mutation; they do not claim a measured assistive-technology announcement. New components are not wired into application routes, so application/home/browser and standalone-game demo suites were not repeated; production build and repository tests cover their existing dependency integration.

Evidence, full pairing JSON, screenshots, command logs and candidate patch are in the session's `artifacts/fs-1.5` bundle, based on the exact HEAD above.

## Review and next owners

**Dimi:** no further FS-1.5 presentation acceptance is needed. Controls → FormFields retains Normal, Invalid, Disabled, Pending, Native And Required and Description Associations for later review. Device, browser and screen-reader details were not supplied and are not inferred.

**Sites:** own any presentation corrections. **Codex:** review native prop/ref/value semantics and compatibility at FS-1.7; do not infer a server result shape. **EPIC 5 consumer:** choose required business fields, validation timing, error-summary focus, pending/submission policy and delivery wording. FS-1.6 has not started.

## Dimi presentation acceptance — 2026-09-16

Asked whether the labels, help text, errors and inline status are readable in the normal, invalid, disabled and pending Storybook examples, Dimi answered:

> Readable; approve the presentation

This accepted FS-1.5 presentation/readability without inventing physical-device or assistive-technology coverage or defining later validation/delivery rules. Commit/push authorization followed in the final decision below. The candidate remains based on `46e32f048a2712111b1b1fa2f356712ffd1c8f65`.

## Final manual/visual acceptance and commit authorization — 2026-09-16

Dimi's actual decision:

> The manual and visual test for the FS 1.5 are PASS

Dimi also explicitly requested: “Update the documentation if necessary, then commit and push changes.” This accepts the complete FS-1.5 candidate and authorizes its scoped commit/push on `feature/funkspace-minimum-usable`. No PR, merge, deployment or FS-1.6 work is included.

The implementation patch before documentation finalization is archived as `artifacts/fs-1.5/fs-1.5.patch`, SHA-256 `9d550d96527a502f2580166f2e04c53fab0e60566586940b99018d00aa9eada1`. Finalization changes documentation only; the accepted implementation and recorded tests/build results remain applicable. Formatting, local links, bootstrap freshness and staged scope/diff checks are performed before commit.

FS-1.5 is complete with no further acceptance action required. Device/browser and screen-reader details remain unspecified. Codex owns compatibility review at FS-1.7; Dimi chooses when to start FS-1.6.
