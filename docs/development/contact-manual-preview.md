# Safe phone preview — FS-5.4

This local fixture uses the actual ContactForm, shell, validation and browser
adapter. **No email is sent.** Its injected fetch returns controlled Response
objects in page memory; it never delegates to network fetch. The static server
has no API/backend. A separate actual Next preview keeps the source release lock
false, CONTACT_ENABLED=false, empty mail configuration and Node fetch denied.
The [accepted contract](../features/FunkSpace_EPIC_5_Detailed_Plan.md#frozen-uiserver-contract)
and [phone checklist](contact-ui.md#dimis-phone-checklist--acceptance-recorded) still apply.
FS-5.5 has not started.

Dimi reported successful phone/accessibility manual testing on 2026-10-14 and
authorized documentation, commit and push; the [acceptance record](../tasks/fs-5.4-manual-preview.md#dimi-manual-acceptance-and-git-authorization--2026-10-14)
preserves the exact report and unspecified device/per-check details. This does
not verify provider delivery or close legal/external/live prerequisites.

## Local test links

Candidate: `feature/funkspace-minimum-usable` at
`fd46474a1420d614dbb31c48fb16d9d6779d471e` plus the verified preview change.
The containing Git commit identifies delivery; these addresses belong to the
temporary local test setup, not a deployed service.

The temporary previews were stopped after Dimi's reported manual acceptance.
Restart the documented isolated setup if further regression testing is needed.

- [Simulated form and controls](http://192.168.0.179:33154/iframe.html?id=contact-manual-preview--manual&viewMode=story)
- [Actual /contact with sending disabled](http://192.168.0.179:33156/contact)

Keep the Mac awake and connect the phone to the same Wi-Fi. Use the exact URL;
localhost on the phone refers to the phone. Private addresses may change. No
public hosting, tunnel, DNS, firewall or account settings were changed. A different
network/protected hosting step requires separate authorization. Phone connectivity
and Vercel/provider/protection/alias coverage are not inferred from desktop checks.

## Manual procedure

Use `example@example.com` and sample text. The public email link opens your mail
application; do not send that email. Open **Test request and retry evidence** to
see counts and synthetic IDs, with no draft content logged or stored.

1. Submit empty/invalid fields. Check labels, help/error association, first-error
   focus and keyboard. Invalid input must produce no simulated request.
2. Choose **Next response**, enter valid sample text and submit. Test accepted,
   server field-error, unavailable/quota/throttle, rejection, uncertain, malformed
   and mismatched-ID responses. Only matching 202 accepts; all failures keep text.
   Acceptance wording appears inside a clearly marked simulation.
3. Choose **Hold submission**; send once and try duplicate click/Enter and edits.
   Fields stay read-only and count stays one. Use **Release accepted response**
   or **Release uncertain response** within 15 seconds; the held exchange retains
   the real browser deadline. There is no pending spinner/announcement.
4. Choose either **Browser timeout** and wait the actual 15 seconds. One stalls
   before headers, the other during response reading. Both become uncertain and
   preserve text; abort/body-cancellation counts show cleanup. **Server reports
   provider timeout** simulates a returned 504; it does not run a provider or
   measure its eight-second deadline.
5. Choose JSON/HTML 429; edit all fields during the five-second cooldown. Guidance
   remains, focus stays in the field and Send stays disabled. After cooldown,
   choose accepted and send explicitly. Empty 429 without Retry-After uses the
   real conservative ten-minute block. Configuration unavailable remains blocked
   after editing. **Reset test and clear draft** lets you leave these blocked tests.
6. After uncertainty, change response/theme and retry unchanged: last/previous IDs
   match. Edit any field, including edit-and-restore, then submit: new ID and
   possible-duplicate warning. Changing fixture controls alone never retires an
   attempt or remounts the form; there are no automatic retries.
7. After uncertainty, press **Advance retry clock by 23 hours**. Unchanged retry
   closes and text stays. Editing retires the attempt. This offset uses the actual
   form's wake check and does not shorten browser deadlines. It does not certify
   real device sleep or clock rollback; those remain separate phone checks.
8. On acceptance verify read-only text and **Send another message**: clear fields,
   Name focus and no immediate request. Reload loses draft/key/fixture metadata.
   **Reset test and clear draft** deliberately clears the entire test session;
   it is not a production control.
9. Use in-page themes, portrait/short/landscape, enlarged text, reduced motion and
   VoiceOver/TalkBack. Scroll to every field, action, result, Privacy link and
   fallback. Automated Chromium sizes do not close physical-device acceptance.
10. Use the **actual disabled /contact** link for refresh, header/tree, Back,
    Privacy/email fallback and JavaScript-off checks. Fields/Send remain visible
    and disabled. Storybook requires JavaScript and its shell links do not serve
    real routes, so it cannot certify those checks.

Record device/OS/browser/version, candidate, settings, action, expected/actual
result and severity for future regressions. Dimi's manual acceptance is recorded
above; detailed device/per-action results were not supplied.

## Rebuild and stop

Running snapshot: `/private/tmp/funkspace-fs54-manual-build-fd46474`.
The [task record](../tasks/fs-5.4-manual-preview.md) links its preparation artifact.
Build a fresh actual HEAD/diff snapshot without `.env*` files, with denied fetch,
delivery disabled, empty mail variables and Storybook telemetry disabled. Never
reuse a potentially live server. Verify `index.json` includes eight
`contact-contactform--*` stories and `contact-manual-preview--manual`.

Storybook now discovers component and contact-feature stories and resolves `@/`.
Fixture-only v4 UUID generation uses getRandomValues for private HTTP LAN access;
the production browser adapter remains unchanged and uses the deployed HTTPS path.

```bash
node scripts/serve-contact-preview.mjs \
  --dir /absolute/isolated/frontend/storybook-static \
  --host YOUR_MAC_PRIVATE_IPV4 --port 33154
```

The helper requires the manual story, binds only loopback/private IPv4 and serves
GET/HEAD assets with no-store. POST/API/dot/traversal/symlink escapes are blocked;
only startup URLs are logged. Serve the built static directory, never the repo.
No dependency was added. Browser regression config requires an absolute
CONTACT_STORYBOOK_DIR, starts its own loopback server on 33155 and refuses reuse.

The initial request left both previews running for manual testing; after Dimi's
acceptance they were stopped as task cleanup. For a future session, stop owned
previews when finished (Ctrl-C if you started them yourself). No publication,
activation or automatic next task follows.
