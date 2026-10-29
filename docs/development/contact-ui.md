# Contact page and controlled form checks — FS-5.4

The [accepted contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract),
[FS-5.4 evidence](../tasks/fs-5.4-contact-page.md) and
[external operating gates](contact-operations.md) govern this slice. Current
[server setup](contact-server.md#delivery-defaults-off) and
[completed live acceptance/shutdown](contact-acceptance.md) supersede the earlier
FS-5.4 source-lock and pending-task assumptions; this guide authorizes no new send.
The actual page is `/contact` in the existing PortfolioShell; header/tree links
share its destination and main-content focus handoff. Home still has Start/About
only and no `/#contact` destination or decorative contact scene.

## Availability, feedback and state

The server page passes only a safe availability boolean from existing composition.
Delivery now defaults off under exact `CONTACT_ENABLED=true` plus complete valid
server configuration; there is no unconditional source lock. Dimi's follow-up amendment keeps Name,
Email and Message visible while sending is disabled, including server rendering,
no JavaScript and prehydration. These fields and the ordinary Send message button
are natively disabled, with the plain message “Sending is currently disabled.
Please contact me by email.” associated with the form. Before readiness, the button
also has type button and the submission handler rejects attempts. No visitor draft
is invited while sending is unavailable. The public mail link remains readable
and actionable without exposing configuration or appearing to submit.
No production fake, test flag or new backend/server action is added.

Dimi reconfirmed the accepted presentation amendment during FS-5.4: ordinary
Button, no Button.pending/InlineStatus/spinner/dedicated pending announcement.
Submitting remains internal, with a synchronous guard and read-only fields.
Field errors use shared associations and focus the first invalid field; other
outcomes focus ordinary result text. Pending/accepted data cannot be edited.
Confirmed acceptance preserves the snapshot until explicit Send another message;
that action cancels native click activation before resetting to avoid submitting
the cleared form during React's reuse of the button.

Visible inputs are optional Name and required Email/Message. Shared normalization
and validation are authoritative; native constraints are input aids. The hidden
empty `website` trap is excluded from assistive technology/Tab navigation and
has autocomplete off, no label/required constraint and no visible field.

`createServices`/`ServiceProvider` compose a narrow browser submission port. The
native browser adapter posts exact JSON to relative `/api/contact`, with same-origin
cookies, no redirects/retries/storage, bounded fatal UTF-8 reading and a 15-second
whole-exchange deadline. Caller cancellation, timeouts, malformed or mismatched
responses stay uncertain. Exact HTTP/envelope/code/identifier parity is checked
before acceptance; raw API error strings are never displayed. Any HTTP 429 is
recognized before body parsing, including HTML/empty/stalled platform bodies.
Valid integer Retry-After 1–600 is used; absent/malformed/date information uses
the conservative ten-minute recovery. The edge body is discarded, not relied on.

Draft/normalized payload/key/first-attempt time are page memory only. An unchanged
explicit retry preserves its key and payload; any visible edit retires the key,
even if restored later. Editing an uncertain attempt explains possible duplication.
At 23 hours the unchanged retry is disabled and text remains. The adapter counts
the greater wall/monotonic interval, rechecks expiry on page wake/focus and checks
the whole-exchange deadline before returning a result. Some browser performance
clocks pause during device sleep; using only that clock could extend the retry
window. [MDN documents this browser difference](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#ticking_during_sleep).
A clock rollback conservatively closes existing retry windows early. These clocks
are browser safety aids, not a trusted server clock. Reload/navigation loses
draft/identity. Rate limits
have a cooldown but no automatic retry; configuration unavailable blocks further
submission while preserving text. Editing retains the active configuration-unavailable
or rate-limit guidance and keeps Send disabled; it does not remove either blocker
or move focus away from the field. The edited attempt still retires its key. After
cooldown, only explicit submission sends the edited draft with a new identity;
no automatic retry is introduced. Conflict recovery does not promise a safe resend.

## Controlled verification

The [safe phone preview](contact-manual-preview.md) supplies manual controls,
actual browser timeout paths and a 23-hour fixture clock advance. Its
[task record](../tasks/fs-5.4-manual-preview.md) corrects earlier Storybook evidence:
contact stories were not discovered by the components-only glob. Discovery and
the frontend alias are now fixed; index/rendering are verified separately.
Dimi's phone/accessibility manual acceptance is recorded below.

Eight ContactForm stories use explicit injected ports: accepted, uncertain,
rate-limited, unavailable, rejected, field errors, internal submitting and delivery
disabled. Fill the enabled fixtures and submit to inspect outcomes; pending is
internal only. Story fixtures are excluded from production bundling. Navigation
stories include ContactActive. No story sends mail.

Unit coverage includes shared rules/browser response grammar, full browser
deadline/cancellation/429 behavior, sleep/clock-rollback safety, all form outcomes,
error focus, duplicate guards, retry identity/edit/wake expiry, reset and unmount.
Dedicated contact coverage
retains existing thresholds and explicitly includes new browser/pure response code.
The unchanged server/contact suites continue to use denied-fetch guards.

Browser tests require `CONTACT_E2E_WORKSPACE`: an absolute isolated built candidate
without environment files and a verified `deny-contact-egress.cjs` preloader
blocking external Node transport. Current configuration checks that the preloader
exists; existence alone does not verify its contents or prove no egress. This is
a test-only path, not application configuration. The
config refuses an occupied port and never reuses the user's preview. It starts
fresh with `CONTACT_ENABLED=false` and empty mail credentials; actual default /contact
and an approved-origin API request verify disabled behavior.

Enabled-form E2E mock only the exact `/contact` document's serialized availability
boolean, asserting one matching marker. SSR/prehydration disabled fields stay identical.
Separate `/api/contact` response interception exercises the actual browser adapter
and component. The application has no availability override or fake production
adapter. Browser interception alone is insufficient; exact off configuration,
empty credentials, a fresh environment-file-free snapshot and verified server
egress denial provide independent protection. Protected-preview cookies,
live provider behavior and WAF coverage are not inferred from these mocks.

Example against a prepared isolated snapshot:

```bash
CONTACT_E2E_WORKSPACE=/absolute/path/to/isolated-built-candidate \
  PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright test \
  --config=playwright.contact.config.ts e2e/contact-page.spec.ts
```

The task handoff includes the actual build snapshot preparation script/evidence.
Tests must use a matching current candidate, not an arbitrary previously enabled
deployment. Production build, Storybook and browser evidence are separate from
physical-device/assistive-technology or legal acceptance. Automated QA servers
stop after checks. The requested phone previews remain running until manual
testing ends; no external publication follows automatically.

## Dimi's phone checklist — acceptance recorded

On 2026-10-14 Dimi reported “Phone/accessibility works well after manual testing”
and authorized documentation, commit and push of the controlled preview. See the
[acceptance and delivery record](../tasks/fs-5.4-manual-preview.md#dimi-manual-acceptance-and-git-authorization--2026-10-14).
Device/browser/assistive-technology and individual checklist details were not
supplied; the checklist remains reusable guidance, not invented per-action evidence.

Use an approved, reachable controlled fixture for enabled-form checks; the delivery-disabled
candidate displays disabled fields and an email fallback. Localhost on the development computer
is not automatically reachable on a phone. Record target/candidate, device/OS,
browser/version, orientation, text settings and result for each check. No live
provider mail is required or authorized by this checklist.

1. Open `/contact` directly, refresh and navigate there from header/tree. Confirm
   Contact is the disabled current item, Back works and Home still has Start/About.
   With JavaScript off or delivery disabled, verify all three fields remain visible
   and disabled, the Send message button is disabled and the availability message
   is clear. Read and activate the public email fallback. Do not send the email.
2. In a controlled enabled fixture, check portrait, short screen and landscape,
   200% text, Light/Dark/Muted/High Contrast and device reduced motion. Scroll to
   every field, action, result, Privacy link and fallback without horizontal page
   clipping or trapped document scrolling. The contact page should remain static.
3. Check Name autocomplete, email keyboard/autocomplete, required indicators,
   multiline Message, Tab/focus styling and long text. With VoiceOver/TalkBack,
   verify labels/help/error association and that the first invalid field or plain
   final result is announced through focus once. The hidden trap must not appear.
4. Attempt duplicate click/Enter while the controlled response is held. Confirm
   fields stay read-only and only one request occurs, without spinner/pending copy
   or duplicate announcements. Test invalid, rejected, unavailable, HTML 429 and
   uncertain responses; all text must remain and email fallback remain reachable.
   After configuration unavailable or 429, edit each field: guidance must remain
   visible, focus stay in that field and Send stay disabled. After cooldown, a
   manual send uses the edited draft's new identity, without an automatic request.
5. In controlled responses, retry unchanged uncertain text, edit-and-restore it,
   and test expired retry. Confirm unchanged identity, new identity after editing,
   duplication warning and no unchanged retry after 23 hours, including after
   sleep/wake. Clock rollback should close an existing retry window early. No
   automatic sends.
6. Confirm acceptance says accepted for delivery, not mailbox receipt; retain the
   read-only snapshot. Activate Send another message and verify empty fields, Name
   focus and no immediate empty submission. Reload/navigation should discard draft.

Codex technical review is PASS with F1 closed by independent re-review; see the
[review and delivery record](../tasks/fs-5.4-contact-page.md#f1-re-review-pass-and-authorized-git-delivery--2026-10-13).
Phone/accessibility acceptance is recorded above. Separate design/wording details
were not supplied. The later FS-5.5 legal approval and FS-5.6 live acceptance,
receipt and named-target shutdown are complete in the
[current acceptance record](contact-acceptance.md). Their recorded limits remain;
this historical phone checklist supplies no fresh device result or new live-send
authorization.
