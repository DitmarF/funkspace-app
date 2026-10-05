# Text-button typography — 2026-10-05

## Current amendment — medium weight and lowercase alignment

Dimi supersedes the 400-weight trial below with **500** for every frontend text
button. Standard Button/ButtonLink, optional Hex captions, navigation/fixture
overrides and native theme/demo controls use the existing medium weight token or
equivalent utility. Initial lowercase and interior capitalization remain intact.

Standard and Hex label boxes move upward by **0.06em** for optical lowercase
centering. This font-relative correction scales with text size and preserves line
wrapping; icons, target bounds, focus rings and explanatory status text do not
move. Work Sans's local font metrics are 930/-243 ascent/descent, 500 x-height and
660 cap height per 1000 units. The small adjustment balances lowercase and mixed
case labels rather than claiming identical ink centering for every word. Native
theme/demo buttons retain their existing symmetric text layout. No font file,
generated token, shared behavior or scene implementation changes.

Current validation and exact candidate evidence are recorded in the
[medium-weight evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/button-text-medium-2026-10-05/README.md).
The 400-weight results below remain historical evidence. Dimi's visual acceptance
is separate from implementation checks; no remote actions are authorized here.

Fresh medium-weight validation: **27/27** affected unit/integration tests,
validation types, lint, production build and Storybook build PASS. Final browser
checks: **50/50** production and **49/49** Storybook PASS, no skipped tests or
retries. Covers themes, native behavior, focus, pending geometry, narrow layouts,
200% text, navigation and customization accessibility. Light/dark control and
actual mobile-homepage screenshots were visually inspected. Final production
build: `v5Iy9Wf7ljTjtSG8YrKIh`.

Initial browser failures and their evidence remain available: replace the old
line-box-center expectation with the optical-lift expectation; use relative
positioning instead of a transform to avoid 0.000002px scroll rounding drift in
the existing exact geometry assertion. That assertion is unchanged. The final
trace-enabled suite completed 49/49 tests but stalled in cleanup (interrupted,
exit 130). The complete repeat with trace recording off exits 0 with all 49 tests
passing. No contrast/accessibility or behavioral assertions were removed.

Fresh final-build Lighthouse uses the existing three desktop/devtools samples:
LCP **3119.644–3125.183ms**, CLS **0.0117781**; existing 5000ms/0.1 limits PASS.
Scores **0.82/0.81/0.82** retain the existing 0.9 warning (LHCI reports 0.82).
These are local samples, not field p75 or a full FS-4.7 performance certification.
All 48 other pending files match the preceding evidence manifest; generated
outputs and scene behavior remain unchanged. Test ports were released.

## Request and candidate

Dimi requests trying normal font weight for all existing text buttons, with
labels starting in lowercase. Interpret this as a lowercase initial letter,
preserving interior spelling/case such as WEB, FunkSpace and Off. This is an
authorized visual trial, not a new claim of Dimi's final acceptance.

Repository `/Users/dimi/Projects/funkspace-app`, branch
`feature/funkspace-minimum-usable`, HEAD
`737d5fa9147eb9f3cac0ce0f3f8edc3c73e3ae8c` plus preserved pending work. One writer.
Inspected current Standard/Hex controls, every native frontend button consumer,
navigation/theme/motion choices, animation fixtures, source tokens, Storybook
stories/matrix tests and prior FS-1.3/1.4 contracts. Existing AGENTS, architecture,
workflow/template and build prerequisite rules apply. Older Figma weight choices
are superseded by this explicit instruction; no unseen new Figma claim.

## Implementation

- Standard Button/ButtonLink and optional Hex captions use existing
  `--fs-font-weight-regular` (400) at all sizes. Navigation and animation fixture
  overrides also use regular weight; no source/generated token values change.
- First-letter CSS on label blocks lowercases only the initial character. The
  original strings/accessible names remain intact. No text-copy traversal,
  rendering helper, control API or second source of labels is introduced.
- Native theme/demo buttons follow the same first-letter rule and regular weight.
  Remove their heavier utility choices; retain their existing interactions.
- Icon-only controls, artwork, focus/target geometry, shared services, motion
  policy and game implementation are unchanged. This covers the portfolio
  frontend and its Storybook; the independently runnable game is outside scope.
- Add a composed typography story with a leading icon, disabled control, native
  link, Hex caption and native theme choices. Update old weight assertions to
  400, retaining existing contrast/focus/size/interaction assertions.

## Validation and handoff

Fresh validation: **27** tests across the four existing Button/HexButton/theme
unit/integration files PASS; frontend build type validation, dedicated validation
types and full lint PASS. Production and Storybook builds PASS. **50/50** actual
production navigation/theme/customization/action journeys PASS with no skips or
retries. The initial Storybook run records **45/47** PASS; two explicit scans
collided with the addon scan and its completed runner stalled (stopped with
SIGINT, exit 130). Both errors are scan ownership failures, not contrast failures.
Reuse the already-reviewed EssentialSet per-visit `a11y.manual:!true` setting in
the two affected fixtures, retaining every explicit Axe assertion. The affected
two files then pass **8/8**. Initial errors/traces remain in the packet.

Final legacy demo-link casing classes were added and both builds repeated; the
final typography suite passes **6/6** (four themes plus two native demo journeys).
Other component/browser results above precede only that final demo-link class
change. Rendered text, interior capitals, accessible names, 400 weight, target
geometry, focus, 200% text and all existing contrast assertions are preserved.
Light-theme and actual homepage screenshots were visually inspected. Final
production build ID: `JJLZrvp6M2W3hpjECoxRT`.

Lighthouse's existing three-run desktop/devtools method passed LCP <=5000ms and
CLS <=0.1: LCP 3098.69–3125.121ms, CLS 0.0117781. The existing performance warning
remains (0.81/0.81/0.82 scores; LHCI reports 0.82). This measurement preceded the
last two demo-link casing classes; no field p75 or complete FS-4.7 audit claimed.
Physical devices, Safari/Firefox and a fresh flag-off measurement are not covered.
Independent review and Dimi's visual acceptance remain separate from these checks.

Exact diff, hashes, commands and screenshots:
[local evidence packet](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/button-text-2026-10-05/README.md).
No commit, push, deployment or independent approval authorized by this request.
