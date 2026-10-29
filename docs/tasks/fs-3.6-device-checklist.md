# FS-3.6 — Dimi's action and expected-result checklist

**Candidate:** `53f1ed0f9ec760cc386d5af347f7fa8eb2bf0eef` plus the validation diff
and the settings contrast/tooling and performance corrections identified in
[the execution record](fs-3.6-integrated-validation.md#performance-capture-and-homepage-timing-correction--2026-09-27).
**Dimi decision:** explicit FS-G1 approval received 2026-09-27.
**Status: COMPLETE — FS-3.6, EPIC 3 and FS-G1 closed on 2026-09-27.**
Dimi subsequently confirmed “all tests are done” and explicitly requested EPIC 3
closure. Independent functional review is PASS and both built variants pass the
approved 5-second LCP budget. The score warning and missing test-detail fields
remain visible limitations. The earlier evidence-detail hold is superseded by
the explicit closure; no per-action or device result is invented.

## Actual report and evidence limits — 2026-09-27

Dimi: “Firefox/WebKit test are through, FS-G1 is accepted.” This records reported
completion of Firefox/WebKit testing and an explicit decision, not inferred praise.
The follow-up request for devices/OS, versions, individual actions/outcomes and
confirmation of the one-second-logo candidate received “ok”; it supplied no
additional test facts. Do not reuse FS-3.2's Firefox/Safari versions here.

Latest decision: “ok lets close up the EPIC 3, all tests are done. re-review and
update the documentation”. Record overall test completion and closure; this
does not provide the omitted device/version/action/build detail.

| Evidence field                            | Actual supplied evidence                                                                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Decision / date recorded                  | FS-G1 explicitly approved, then all-tests-complete and EPIC 3 closure confirmed on 2026-09-27, Europe/Berlin. Actual testing date not supplied. |
| Browsers                                  | Firefox and WebKit named. Versions unspecified; WebKit is not identified as physical Safari or an automated runner.                             |
| Device / OS / input / viewport            | Not supplied. Sony Xperia / Android 14 and MacBook Pro below are requested samples, not confirmed tested devices.                               |
| Actions / expected versus actual outcomes | Dimi explicitly reports all tests done and closes EPIC 3. Individual action outcomes were not itemized; expected results remain below.          |
| Candidate used by Dimi                    | Not confirmed. Current repository candidate is identified in the execution record; do not claim it is the tested build.                         |
| Performance budget amendment              | Dimi explicitly raised LCP to 5 seconds on 2026-09-27; fresh flag-on LCP passes. Score warning and prior 2.5-second failures remain recorded.   |

The per-action NOT ITEMIZED cells mean **individual outcome not supplied**,
not pending acceptance or an assertion that Dimi did not perform the action.
Dimi reports all tests complete. More granular details can be appended later;
no application retest is performed or fabricated by this documentation update.

Record the tested revision/patch, date, device, OS, browser and version before
testing. Requested devices are Sony Xperia XQ-CC54 / Android 14 and MacBook Pro.
Record the actual mobile browser and available desktop Safari/Chrome/Firefox;
mark unavailable combinations NOT RUN. Do not reuse old browser versions or
FS-3.5 acceptance as new observations.

| Action                                                                                                                                     | Expected result                                                                                                                                                            | Dimi result  |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Open `/`, `/about`, `/impressum`, `/privacy` directly, then refresh.                                                                       | Correct page, readable content, stable appearance, no flash of the wrong theme.                                                                                            | NOT ITEMIZED |
| Find the icon-only navigation/settings hex-button; open and use Close. Repeat landscape and portrait.                                      | One full-screen overlay; button alignment stays stable; Close remains reachable.                                                                                           | NOT ITEMIZED |
| Open using keyboard; Tab/Shift+Tab; Escape.                                                                                                | Focus stays inside while open and returns to the actual visible opener after dismissal.                                                                                    | NOT ITEMIZED |
| Follow Home, About, Contact, Privacy policy and Legal notice from the overlay.                                                             | Correct native destinations, overlay closes, scrolling works, next Tab continues at the destination. About is the full page.                                               | NOT ITEMIZED |
| Follow Contact twice, then from `/about` and each legal page.                                                                              | Real homepage Contact receives focus/scroll; next Tab reaches the email link. No later jump to the old trigger. Inspect email address only—do not send mail for this test. | NOT ITEMIZED |
| Use Back/Forward with the overlay open, including from a scrolled page.                                                                    | Ordinary page history; no stale overlay, locked page or late scroll jump.                                                                                                  | NOT ITEMIZED |
| Open About in a new tab using the browser's normal modified-click action.                                                                  | Original tab remains usable; new tab opens the real destination.                                                                                                           | NOT ITEMIZED |
| Increase text to 200%; try short landscape; read all settings and reach footer/legal links.                                                | Wrapping, reachable controls and visible keyboard focus without clipping/overlap.                                                                                          | NOT ITEMIZED |
| In each theme, hover and hold down an unselected Appearance choice; hover/press selected and unselected Motion choices; navigate with Tab. | Text remains readable in every state; selected choices remain distinct and keyboard focus remains visible. Individual contrast observations were not itemized.             | NOT ITEMIZED |
| Repeat open/Close/Escape ten times, change width/orientation while open.                                                                   | One overlay, no stuck scroll or focus on an invisible trigger.                                                                                                             | NOT ITEMIZED |
| Try System, Default, Dark, Muted, High Contrast; close/reopen, navigate and reload. Change OS scheme under System and an explicit choice.  | Live page/logo and selection agree; only System follows the OS; ordinary storage persists explicit choices.                                                                | NOT ITEMIZED |
| Try Follow system with OS motion on/off; explicit On with OS reduction; Reduced; Off. Refresh for a new eligible introduction.             | System follows OS; On overrides that preference; Reduced uses a complete-logo fade; Off stays static. Other logo copies stay static.                                       | NOT ITEMIZED |
| With animation available, refresh and watch startup.                                                                                       | Top-left logo first (1,000 ms for draw and Reduced fade), then menu (400 ms), then content (800 ms); no initial complete-logo blink or replay on settings changes.         | NOT ITEMIZED |
| Switch Off during a draw/fade, then return to Follow system.                                                                               | Complete artwork immediately; no unintended replay of the consumed introduction.                                                                                           | NOT ITEMIZED |
| Open a second foreground/background tab; activate it later.                                                                                | Eligible first presentation can animate; no missing content. Any fallback-revealed unstarted logo stays complete when late loading finishes.                               | NOT ITEMIZED |
| Use the supplied flag-off build and a fresh no-JavaScript load.                                                                            | Complete static site, ordinary navigation/skip/legal/email links. No unusable replacement trigger.                                                                         | NOT ITEMIZED |

For the current local preview, `http://localhost:3000` uses the existing enabled
development configuration. The automated production copies are retained at
`/tmp/fs36/on` and `/tmp/fs36/off`; they were actually built with the corresponding
flags. Their temporary test servers stop after validation. The owner can start
either existing build with `pnpm -F frontend start -H 0.0.0.0 -p <free-port>` from
that copy, and provide its address for device testing. Do not infer flag-off
behavior by changing an environment variable on an already-enabled build.

Agents own reproducible storage-denial, delayed-script and failure fixtures;
Dimi need not simulate those internals. Automation does not substitute for
physical keyboard/touch, native browser behavior or visual pacing observations.

**FS-G1 decision from Dimi:** APPROVED explicitly on 2026-09-27.
**FS-3.6 / EPIC 3 / FS-G1:** COMPLETE / ACCEPTED on 2026-09-27.
**EPIC 4:** prerequisite satisfied; not started or authorized by this closure.
See the [final closure record](fs-3.6-integrated-validation.md#epic-3-closure-and-final-re-review--2026-09-27).
