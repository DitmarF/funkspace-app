# Contact acceptance — FS-5.6

The controlled contact journey is accepted by Dimi: the browser showed acceptance,
the message arrived in Workspace, and the sender/Reply-To checks passed by his
report. Technical acceptance and actual receipt are recorded separately below.
The current Preview is disabled and the old enabled deployment is deleted.
FS-5.6/EPIC 5 are complete and FS-G2 is satisfied. EPIC 4 stays closed;
EPIC 6, Production activation and DMARC publication remain separate.
[Task evidence](../tasks/fs-5.6-contact-acceptance.md) and
[operations](contact-operations.md) own the detailed checks and operating limits.

## Current candidate and observed evidence — 27 October 2026

| Item                   | Verified or reported result                                                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository/revision    | `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, `36407f6a790a8d9787bdc3123041e24e181bdfee`; approved 15-file candidate committed/pushed with matching remote revision. Closure begins from this clean base.                               |
| Accepted Preview       | `6N37XmGQ3LDAnWvAwmrmJXFmUizx`, Ready; immutable origin `https://funkspace-app-frontend-4twqcqhug-ditmarfs-projects.vercel.app`.                                                                                                                                    |
| Actual form Origin     | `https://funkspace-app-frontend-git-feature-fun-606557-ditmarfs-projects.vercel.app`; this configured branch address is the test entry point. The immutable host is not an allowed form Origin.                                                                     |
| Technical acceptance   | Exact deployment-filtered log at 16:10:07.70 CET: `202`, `accepted`, `code:null`; accepted browser screen independently observed. Valid provider ID and matching browser submission identity are required by unchanged code; raw IDs were not copied independently. |
| Actual receipt         | Dimi confirms the message arrived in his Workspace inbox, sender verified and Reply-To works. This is operator evidence separate from provider acceptance; full headers/individual DMARC results were not retrieved.                                                |
| Earlier failed attempt | 16:01:14.02 CET, same deployment: `403/origin_rejected` from the immutable-host form. Rejected before delivery. Original text preserved; no wildcard/origin exception added.                                                                                        |
| Current off Preview    | `BJwbeuR6NUejxG3GDpq3QQHj337q`, same revision, Ready at 16:18 CET; `https://funkspace-app-frontend-h9uharydb-ditmarfs-projects.vercel.app`. Scoped false switch saved; replacement and branch Contact show disabled controls and email fallback.                    |

The accepted operator test used his own harmless draft, rather than the originally
proposed marker. No human-field/body content is stored here. One accepted message
is evidenced; the preceding origin rejection did not invoke the provider. The
assistant sent/retried no message or reply.

The prior protection record remains: Vercel Require Log In/(Legacy) Standard
Protection enabled; four cookie-free GET checks on the initial `36407f6` off
Preview's branch/immutable page/API URLs redirected to SSO. The named project
WAF rule is POST `/api/contact`, IP-only five requests per 600-second fixed
window, returning 429. The earlier bounded run evidenced five typed 400s, one
rule-attributed 429 and one reset recovery. That is observed branch enforcement,
not fresh all-alias/path/region/global coverage. No batch is repeated for closure.

The dated provider/account facts and Resend terms/DPA/US-processing approval
remain in [operations](contact-operations.md). Ireland sending is not a claim of
EU-only storage. The UI showed no configured tracking domain; literal saved
open/click flags were not individually retrieved. No legal certification or new
provider/copy approval is inferred or required for this accepted journey.

## Local and delivery-off safeguards

The current composition has no unconditional source lock. Delivery defaults off;
only exact `CONTACT_ENABLED=true` with all valid configuration creates a delivery
adapter. Off/invalid-origin configuration avoids credential reads. Invalid mail
configuration also fails closed without constructing delivery.

Routine checks use isolated environment-file-free snapshots, a false switch,
blank credentials, fresh non-reused servers, verified egress denial and injected
provider responses. The exact implementation passed 294 contact tests, 64 UI
tests, 42 Chromium cases, types, affected lint and production bundling. No routine
test contacted Resend. Closure documentation needs formatting/link/diff checks,
not a repeat live test or application build.

The [frozen contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract)
is unchanged: matching 202 means provider acceptance, not mailbox receipt;
eight-second provider/fifteen-second browser deadlines; no automatic retries;
unchanged manual identity for less than 23 hours; page-memory draft/key only.
Keep no-JavaScript email fallback. Origin is defense in depth: direct clients can
forge it, so exact-origin rejection is not a replacement for platform protection.

## Local approval and remaining single-message authorization record

This is the completed test's authorization/provenance record, not a new send
budget. Dimi approved source/copy/provider decisions, specifically authorized
the 15-file Git delivery and protected off Preview, then performed Preview
activation/redeployment and the accepted manual submission. His receipt and
closure instruction are the final human decision for that observed journey.

The server fixes sender `FunkSpace <contact@mail.funkspace.de>`, recipient
`info@funkspace.de` and subject `FunkSpace contact message`; visitor Reply-To is
structured from validated input. Dimi confirmed receipt/sender/Reply-To; this
does not independently document every authentication header or current account
setting. Secrets remain out of source, prompts, fixtures and artifacts.

Additional live submissions, enabling, Production deployment and DMARC changes
require their own specific authorization. No extra acceptance phrase or repeat
phone/legal/provider review is needed to recognize Dimi's current acceptance.

## Execute only after exact authorization

For any future expressly requested live operation, pin its project/environment,
source revision, returned immutable identity, configured branch/public Origin,
applicable protection, message count and shutdown plan before sending. A new
commit or returned URL is recorded after its authorized creation; a moving alias
alone does not pin a candidate. Do not apply old test permission to a new message.

Use the configured form address. If an attempt is uncertain, do not infer
non-delivery or automatically retry. Preserve identity within its allowed window
and inspect approved evidence. Never send an unsolicited reply. Provider outcome
and mailbox receipt remain separate facts.

## Disable, recover and accept

The scoped Preview switch was restored to false and a cache-free replacement of
the same source became Ready as recorded above. Both the stable Contact page
and the new immutable Contact show disabled fields/Send, the availability text
and `mailto:info@funkspace.de` fallback. Production was not changed; DMARC remains
unpublished. No extra API POST/provider call was needed for those off-page checks.

Vercel environment edits affect later deployments; they do not change the old
enabled immutable version. Dimi specifically confirmed deletion of
`6N37XmGQ3LDAnWvAwmrmJXFmUizx`; the assistant deleted only that old test Preview.
Its old `/contact` and `/api/contact` both now return platform
`404 DEPLOYMENT_NOT_FOUND`. Vercel still identifies `BJwbeuR6N` as the active
branch Preview, and the stable Contact page was rechecked disabled with its
email fallback. No key revocation, additional provider request or mail was needed.
This closes the known enabled test target; unrelated deployments/keys are not
covered by that retirement claim.

With verified retirement, Dimi's successful receipt/sender/Reply-To confirmation
and explicit closure instruction complete FS-5.6/EPIC 5 and satisfy FS-G2 alongside
the accepted EPIC 4 scene. His acceptance does not authorize public launch,
Production enabling, DMARC publication, Git delivery of new closure records or
automatic EPIC 6 execution. Preserve the existing evidence limits and do not
invent fresh global-protection, device or legal acceptance results.
