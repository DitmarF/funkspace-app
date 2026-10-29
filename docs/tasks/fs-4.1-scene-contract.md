# FS-4.1 — Scene appearance and measurable limits

## Task metadata

**Current revision: R26 (2026-10-05)** — Dimi removes all visible status copy
beneath WEB. Waiting, restrictions, failure and static descriptions remain
screen-reader-accessible without layout space; customization explanations and
motion rules remain unchanged. See the R26 amendment below.

R25 restored small playback controls and
also removes the visible local-Pause status beneath WEB. The 1px Play-icon offset
and other R24 refinements remain. R24 previously enlarged controls and requested
a 1px rightward Play-icon correction and left-aligned customization text, and
removes the visible playing status and development introduction from Start.
See the R24 amendment below. R23 established paired actions below WEB:
hexagonal Play/Pause on the left, More on the right on the homepage, and Customize
with the Playground icon on the right on the details page. This changes action
presentation only. R22 mobile fitting, R21 built-in WEB, R20 defaults and the
existing motion/dialog contracts remain unchanged. Earlier revisions retain
their historical evidence and approval limits.

**Implementation checkpoint — 2026-09-30:** FS-4.6 C7 received Codex R2 technical
PASS against R19; F1–F3 are closed. See the [review closure and remaining limits](fs-4.6-customization-overlay.md#codex-r2-closure-and-authorized-delivery--2026-09-30).
This adds evidence, not a product-contract revision or final visual acceptance.

- **Contract revision:** R17, 2026-09-29; details-only customization, homepage More link and lightweight thumbnail clarification below. R16, 2026-09-29; explicit Reduced uses a still Canvas and WEB reveals after its first valid frame. R15, 2026-09-29; homepage solid WEB fallback replaces the particle SVG while preserving ready local-Pause Canvas. R14, 2026-09-29; WEB uses Work Sans Black 900. R13, 2026-09-29; WEB replaces SPACE, retaining Work Sans Bold 700 and current particle tuning. R12, 2026-09-29; half-width amendment supersedes R11 thickness only. R11, 2026-09-29; doubled connection range/width supersedes R10 numeric limits below. R10, 2026-09-29; complete proximity graph amendment below supersedes R9 connection/radius tuning. R9, 2026-09-29; connection prominence / smaller particles / larger fixture amendment below supersedes R8 tuning. R8, 2026-09-29; density/speed/connection amendment below supersedes R7 settings. R7, 2026-09-29; 1,000 default / 2,000 toggle amendment below supersedes R6 count settings. R6, 2026-09-29; 480-particle amendment below supersedes the earlier count default/ceiling. R5, 2026-09-29: repository-authored Work Sans SPACE amendment below supersedes Illustrator-delivery prerequisites. R4, 2026-09-28: Dimi's proximity-connection amendment below supersedes only the earlier exclusion of links. Numeric connection styling and density remain provisional candidate values.
- **Status:** R17 records Dimi’s details-only customization instruction; implementation review and visual acceptance remain separate. R16 records Dimi’s explicit still-Canvas and WEB-only reveal request (navigation clarification received); independent implementation review and final visual acceptance remain separate. R15 records Dimi’s accepted solid-homepage-fallback amendment; implementation evidence belongs to FS-4.5. R3 specification completion and R2 technical PASS remain historical facts. R4 records the newly requested connection behavior; it does not claim approval of its provisional tuning, an independent implementation review or new performance results.
- **Owner/current writer:** Codex records Dimi's acceptance and reconciles the feature plan. Sites owns later implementation tasks when authorized. The separate read-only review phase in this same chat is not represented as a separately staffed reviewer.
- **Product owner:** Dimi; exact acceptance and its limits are recorded below.
- **Repository:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`.
- **Inspected HEAD/base:** `1ab13095edb3cf0c9b38897ddcbb75a16d0ff498`; R1 started from a clean tree; R2 started with only the untracked R1 document. The historical reference happens to equal HEAD; no reset or remote fetch was performed.
- **Scope authority:** [feature plan](../features/funkspace-minimum-usable.md), [EPIC 3 closure and API handoff](fs-3.6-integrated-validation.md), [workflow](../development/ai-workflow.md), [task template](../templates/task.md).
- **Candidate identity:** Reviewed R2 was the base above plus this one added document; its exact hash is retained in the acceptance record. R3 also updated the feature plan and had no runtime diff. Exact R3 diff/hashes/checks remain in the acceptance packet. R4 implementation and fresh evidence belong to the FS-4.3 connection amendment.

## R26 — No visible WEB status copy — 2026-10-05

Dimi requests no extra status text beneath WEB, including “Animation waits
until…”. All scene status messages on homepage and details, including loading,
restrictions, failure and no-JavaScript descriptions, remain accessible to screen
readers without occupying layout space. Retain the Pause/Resume description,
disabled-state rules and the existing explanations inside customization. This
supersedes R25's visible restriction/failure copy only; scene behavior is unchanged.
Implementation and evidence: [FS-4.6 status follow-up](fs-4.6-customization-overlay.md#quiet-scene-status--2026-10-05).

## R25 — Small playback controls and quiet Pause — 2026-10-05

Latest optical follow-up: Dimi subsequently requests smaller icons and two
successive 1px left shifts of the whole button. Use 16px display size from the
existing 24px artwork, retaining the small hex/52px native target and internal
Play correction. The final wrapper offset is -2px. See the latest refinement in
the linked FS-4.6 record; the initial 24px icon instruction below is historical.

Restore the existing small Play/Pause control on homepage and details (48px
artwork, 24px icon, 52px native target), retaining Play's 1px rightward adjustment.
Neither ordinary playing nor local-Pause status appears visually beneath WEB;
both remain screen-reader-accessible without reserved layout space. Keep visible
restriction/failure explanations and actual Pause/resume behavior unchanged.
The Playback story follows the same size. This supersedes R24's medium size and
visible local-Pause explanation; all other R24 refinements stand. Implementation
and checks: [FS-4.6 follow-up](fs-4.6-customization-overlay.md#small-playback-follow-up--2026-10-05).

## R24 — Playback and copy refinements — 2026-10-05

Dimi requests the next existing playback-button size on homepage and details:
medium (72px hex artwork, 36px icon, 76px native target including border), with
only the triangular Play icon shifted right by 1 CSS px. Pause remains centered.
All customization-dialog text is left-aligned, independent of the right-aligned
trigger row. Remove visible “Animation playing.” below WEB; retain its accessible
status/description without layout space and preserve visible Pause/restriction/
failure explanations. Remove the development introduction paragraph from Start;
retain the existing metadata description. Scene/runtime behavior is unchanged.
This instruction supersedes R23's small playback size and routine visible status.
Implementation/checks are in the [refinement record](fs-4.6-customization-overlay.md#playback-and-copy-refinements--2026-10-05).

## R23 — Paired WEB scene actions — 2026-10-05

Dimi supplies `/Users/dimi/Desktop/scr_01.png` as a mobile wireframe and explicitly
requests an outlined hexagonal Play/Pause button on the left below WEB. The
homepage has the existing native More link on the right, with its More icon.
The details page replaces that link with an outlined Customize button bearing
the Playground icon, opening the existing customization dialog.

Use existing small controls (48px nominal hex artwork and 24px icons). Preserve
the Pause/Resume accessible names, explanatory motion status and all policy
restrictions. More remains available without JavaScript; unavailable playback
or customization must not become a dead no-JavaScript control. Ordinary dismissal
returns focus to Customize. Retain the current heading and scene size; the
wireframe's counters, dots, corner marks and placeholder frame do not authorize
a carousel, counters, border or new animation selection. Implementation evidence
is in the [FS-4.6 action-layout amendment](fs-4.6-customization-overlay.md#paired-scene-actions--2026-10-05).

## R22 — Larger mobile WEB — 2026-10-02

Dimi requests a larger WEB aperture on mobile and states that tablet/desktop
sizing is already satisfactory. Use a centered **96%** fitting box below **640 CSS
px viewport width**, retaining **80%** at 640 px and above. The selected 96% is
the implementation's reversible interpretation of “larger,” not a separately
approved numeric product decision. Preserve intrinsic proportions and apply the
same fitting to the live WEB opening and independent solid fallback, including
no-JavaScript output. Full rectangular cover, scene height, Canvas bounds,
particle settings, motion policy and the diagnostic diamond remain unchanged.
See [implementation evidence](fs-4.4-svg-aperture.md#larger-mobile-web--2026-10-02).

## R21 — Built-in WEB aperture; no circle — 2026-10-01

Dimi's supplied screenshot shows Aperture - 1 playing through a circle instead
of WEB. Dimi explicitly requests fixing the wrong mask and removing the circle.
Use the existing trusted, outlined Work Sans Black WEB geometry as the built-in
native SVG image and loading/error aperture. The production WEB opening must not
depend on fetching its separate export. Remove circle from the selection type
and diagnostic gallery. Keep independent lightweight solid WEB when preparation
or mask support fails; do not restore SVG particle graphs.

The diagnostic diamond remains available for mounted replacement checks, with
validated async loading, cancellation and WEB fallback. Preserve full rectangular
coverage, proportional centered fitting, stable IDs and Canvas continuity. No
particle rules, runtime, shared policy or R20 tuning change is authorized by this
amendment. [Implementation and fresh evidence](fs-4.4-svg-aperture.md#built-in-web-correction--2026-10-01)
are separate from independent review, device certification and FS-4.8 acceptance.

## R20 — WEB animation defaults — 2026-10-01

Dimi explicitly requests density **286 particles**, speed **0.2×** and size
**0.1×**; all other settings remain unchanged. These shared authoring defaults
apply to initial scene configuration and user-facing Reset. Connection degree
100, distance 6×, seed, ranges/steps, resource budgets, theme/motion behavior
and aperture are unchanged. Existing density/size-dependent rendering still
applies; no new visual algorithm is introduced.

Implementation and checks are recorded in the [particle settings task](fs-4-particle-settings.md#r20-default-tuning--2026-10-01). Prior FS-4.7 default measurements
remain historical for 200 / 0.4× / 1×; current-default performance evidence must
use this new configuration. This tuning request is not FS-4.8 acceptance.

## R19 — Aperture - 1 and retained still frames — 2026-09-30

Dimi explicitly requests the following changes, replacing the earlier R16/R17
restrictions where they conflict:

- Name the WEB animation **Aperture - 1** on the homepage, details page and first
  Animations navigation entry. Preserve the existing `/animations/aperture` URL.
- Remove the dialog's WEB artwork section. Reset animation and the transparent
  WEB overlay switch come first, followed by explanations and the five controls.
- Preserve the current paused Canvas behind the open customization dialog. This
  remains one runtime/frame owner; opening the dialog suspends continuous motion
  environmentally and never changes local Pause. Visible edits may redraw a still.
- Explicit **Off**, like the existing Reduced scene behavior, may prepare a single
  still Canvas. The shared resolver exposes an opt-in `supportsOffStill` capability;
  Off always returns `mayRun: false`. The particle controller and its trusted
  startup gate opt in. Other consumers, including the logo, keep their prior Off
  behavior. Pending/disposed policy, unavailable feature, unready intro/cover,
  invalid palette, hidden geometry/document, unknown/unavailable System and failed
  runtime still prevent preparation. Failed/unavailable Canvas and no-JS retain
  independent solid WEB. No automatic failure retry or second preview loop.
- Visible appearance label **Light** retains the persisted `default` value;
  motion label **System** retains the persisted `system` value. No storage migration.

The attached 2026-09-30 13.06.38 screenshot was inspected for the old preview and
background fallback. This is implementation authorization, not Dimi's final
visual acceptance or a new performance result. See FS-4.6 C6 for exact evidence.

## R18 — expanded customization — 2026-09-30

Dimi explicitly requests density 10–1000, connections per particle 1–100,
connection-distance multiplier 1–10, speed 0.1–2, size 0.1–4, and an on/off
transparent WEB overlay. These bounds and controls are authorized by that
request; implementation/visual acceptance remains separate.

Interpret connections per particle as a maximum at both endpoints, selecting
closest pairs first within the bounded spatial graph. This supersedes R10's
unconditional no-degree-quota rule. Keep existing engineering limits absolute
(4800 lines, 38400 candidate visits, 16 passes), independent of the expanded
particle count. Effective distance may be reduced by those limits. Defaults
remain count 200, speed 0.4×, size 1× and distance 6×; the new maximum degree
defaults to 100. Count/degree steps are 1; multiplier steps are 0.1.

Transparent overlay On exposes the full rectangular particle field of a ready
Canvas; Off restores the WEB cutout. This presentation-only state retains
runtime identity and leaves denied/failed static artwork complete. Values stay
local and reset on reload. User Reset restores all five default values, opaque
WEB and seeded particles without clearing Pause or motion/theme preferences.
No extra homepage controls. [Current tuning](fs-4-particle-settings.md#current-tuning--2026-09-30-r18-customization)
and [implementation evidence](fs-4.6-customization-overlay.md#c4--expanded-customization--2026-09-30).

## R17 — details-only customization — 2026-09-29

Dimi explicitly authorizes FS-4.6 and clarifies: no extra customization controls on the main WEB animation; add a **More** link to a separate detailed page. Preserve homepage Pause/Resume. The already accepted `/animations/aperture` route owns its own temporary scene settings and shared **Customize animation** Dialog (D11/D12); closing retains values, leaving/reloading restores defaults. No homepage-to-details settings transfer or persistence. Detailed educational copy remains Dimi's later input.

Dimi's later repository rule against dense particle SVG/DOM constructs also covers customization previews. Reuse the lightweight solid WEB silhouette, explicitly labeled static artwork; it does not pretend to show particle edits. Suspend the covered scene environmentally, keep its runtime and local Pause, and show effective edits on returning to the scene. This reconciles D11's static-thumbnail choice with the newer rendering constraint; no second preview simulation or Canvas loop is introduced.

Approval: the details-only placement and More link are Dimi's explicit instruction; reuse of Dialog and shell-local two-consumer coordination comes from accepted D11/D12. Implementation layout/labels and technical correctness await review and Dimi's feedback, not inferred visual acceptance. [FS-4.6 implementation and validation](fs-4.6-customization-overlay.md). FS-4.7, remote actions and EPIC closure are not authorized by this amendment.

## R16 — Reduced still Canvas and WEB readiness reveal — 2026-09-29

Dimi explicitly requests a paused Canvas in Reduced mode and resolves the ambiguous “main navigation” wording as **the main WEB animation**. The navigation/menu sequence is unchanged. This supersedes R15's solid fallback for explicit Reduced only, and earlier `supportsReducedMotion:false`/Reduced-denies-preparation requirements. Follow system with OS reduction, Off, unavailable/pending policy and flag-off still deny scene preparation and retain solid WEB.

The scene declares its implemented reduced alternative through the existing resolver. Eligible explicit Reduced may prepare one Canvas and issue an initial still draw plus coalesced event-driven redraws; it never calls continuous resume, advances time or clears local Pause. Unknown/unavailable OS signals, geometry, cover/intro readiness, visibility and availability remain independent gates. The snapshot distinguishes Reduced from local Pause; its disabled control explains that the scene stays still. Switching to On may play only when every other gate permits it.

On ordinary eligible full-document startup/reload, the existing parser-owned intro conceals server artwork. The WEB area remains concealed during the content-to-Canvas handoff; the first valid draw triggers a single 400 ms semantic-token fade. Reduced reveals its still without a scene fade. Geometry remains reserved/observable and cannot depend on reveal opacity. No new intro sequence, shared frame owner or navigation delay. No-JS/static markup, existing parser fail-open and fragment/history behavior remain available. Failed mask/runtime preparation reveals solid WEB; a stalled optional Canvas import has a 5 s infrastructure failure deadline and no automatic retry. Actual draw readiness, not that deadline, triggers normal reveal.

Approval: product behavior explicitly requested by Dimi; implementation/testing in [FS-4.5](fs-4.5-scene-policy-and-themes.md#reduced-still-canvas-and-web-reveal--2026-09-29). This does not approve final moving-scene performance/visuals, FS-4.6 or remote actions. Current author tuning is preserved; the historical numeric revisions below are not silently restored.

## R15 — lightweight homepage fallback — 2026-09-29

Dimi explicitly requests: **“keep the frozen Canvas for a ready scene, and replace the thousands of fallback SVG lines with the existing lightweight, solid WEB artwork.”** Start therefore uses the existing Work Sans Black WEB silhouette for SSR/no-JS, pending, denied, unavailable and failed states. A permitted, ready locally paused scene retains its actual Canvas frame; hard policy restrictions still select the independent solid fallback. No denied Canvas preparation is authorized. This supersedes the homepage's earlier pure-particle static representation requirement only; the diagnostic fixture and future customization-preview decisions remain separate. Particle settings, simulation, native aperture fitting and runtime ownership are unchanged. [Implementation and evidence](fs-4.5-scene-policy-and-themes.md#solid-web-homepage-fallback--2026-09-29).

## R14 — WEB Black weight

Dimi requests trying Work Sans Black for WEB. Set the bundled variable font to `wght=900` and regenerate the trusted SVG and identical independent fallback. Preserve current scene tuning, fitting and lifecycle. This authorizes the weight change; visual acceptance remains separate. [Evidence](fs-4.4-svg-aperture.md#web-black-weight--2026-09-29).

## R13 — WEB aperture

Dimi explicitly requests replacing SPACE with WEB. Regenerate the outlined SVG and identical mask-independent fallback from the bundled Work Sans font at the existing weight 700. Keep independent centered 80% fitting, native SVG embedding, circle loading/error fallback and existing particle/runtime settings. This authorizes the word replacement; it does not assert moving-scene acceptance. [Implementation and evidence](fs-4.4-svg-aperture.md#web-aperture--2026-09-29).

## R12 — 50% thinner connections

Dimi requests connection lines 50% thinner. Base width changes 2.4 →1.2 CSS px; the effective size-dependent range changes 1.92–3.6 →**0.96–1.8 CSS px**. Preserve R11's doubled connection reach, 6,400 line ceiling, complete-pair rule, alpha/fade, particle settings and lifecycle. [Current evidence](fs-4.4-svg-aperture.md#half-width-connections--2026-09-29). Earlier revisions remain historical.

## R11 — double connection range and thickness

Dimi explicitly requests lines **2× longer and 2× thicker**. Double the density-adjusted connection cutoff from R10: r=min(80 CSS px, 2√(2TA/(πN(N−1)))), with the same T=min(1,000,N/2). Double the base stroke 1.2 →2.4 CSS px, giving the same radius scaling at **1.92–3.6 CSS px**. Opacity/fade and the complete-nearby-pair rule are unchanged. “Longer” means maximum connection reach, not stretching lines past their particle endpoints.

A doubled radius admits about four times as many pairs in a uniform 2D field. Raise the output ceiling 1,600 →6,400 so the existing overflow-halving guard does not silently undo the requested range. The aggregate visit ceiling remains 204,800 and the eight-pass fallback remains bounded. No frame/bundle budget is relaxed or claimed met. Keep particle radius 1–3, counts 1,600 / 3,200, half-speed and fixture sizes. [Current evidence](fs-4.4-svg-aperture.md#double-connection-range-and-thickness--2026-09-29).

## R10 — every nearby pair without grid grouping

Dimi supplies the screenshot “Screenshot 2026-09-29 at 11.05.30.png”, requests fewer, evenly distributed connections and **1–3 CSS px particle radius**, and explicitly selects **every pair within a shorter, density-adjusted distance**. Restore the seeded radius range 1–3 (effective 0.75–6 with the unchanged size control). Keep 1,600 / 3,200 counts, 0.5× default speed and all three fixture sizes. The supplied screenshot was inspected; its regular clusters match R9's own-cell priority plus degree quota. No unseen video match is claimed.

Remove per-particle degree quotas and cell priority. For N active particles and scene area A (CSS px²), set target T=min(1,000,N/2) and cutoff r=min(40 CSS px, sqrt(2TA/(πN(N−1)))). This targets about 800 links at 1,600 particles and 1,000 at 3,200 for a uniform field, rather than guaranteeing exact counts. Derive every noncoincident unordered pair at Euclidean distance <r, including across cell boundaries, once. Use the grid only as a search index. No new spacing forces, particle reseeding, mask dependence, viewport count multiplier or equal-degree promise.

Bound output to 1,600 links. If a complete graph exceeds that ceiling, halve r and recompute, at most eight passes. Total candidate visits across all passes remain ≤204,800 (=3,200×64); this is an aggregate ceiling, replacing the earlier per-particle quota. Never return an order-biased prefix. Exhausted visits/passes return an empty graph with cutoff 0 and a limited flag. Ordinary seeded fields must produce the complete graph without reaching these guards; pathological dense input is separately tested. The fixed total work ceiling allows small dense inputs enough room for retries; it does not claim performance acceptance.

Both renderers pass actual scene bounds. Retain readable size-dependent strokes: mean effective radius /2 CSS px gives factor clamped 0.8–1.5; width 1.2×factor CSS px; alpha min(0.95,0.85√factor)×√(1−distance/r). Invalid radius uses 2 CSS px; finite positive radius caps at 6 for styling. Count, distance, limited status and visit totals are inspectable pure sample data. Visual tuning remains a candidate, not task closure. [Current evidence](fs-4.4-svg-aperture.md#uniform-nearby-connections-amendment--2026-09-29).

## R9 — connection prominence, smaller particles and large fixture

Dimi requests visibly stronger connections relative to particles, an extra large fixture size, and reduction of the attention-drawing largest particles. Candidate tuning: seeded radius **0.8–1.6 CSS px** (previously 1–3), so default diameters are 1.6–3.2 CSS px and the existing size multiplier gives effective radii 0.6–3.2. This consumes the same seeded sample without changing position, velocity, identity, count (1,600 / 3,200) or half-speed default.

Connections: mean effective endpoint radius / 1.2 CSS px gives a factor clamped to 0.8–1.5. Width = 1.2 CSS px × factor (0.96–1.8 CSS px). Alpha = min(0.95, 0.85 × sqrt(factor)) × sqrt(1 − distance/80). Larger endpoints still receive thicker/brighter lines; the gentler distance fade improves visibility and reaches zero at the unchanged 80 CSS px cutoff. Invalid radius uses 1.2 CSS px; finite positive values cap at 3.2 CSS px for styling.

Raise the connection ceiling from 240 to **2,400 lines**, still degree ≤3, candidate visits ≤64/particle and ≤204,800 at the maximum population. Dense own-cell traversal starts immediately after the current particle, then visits the eight surrounding cells, avoiding repeated earlier-member scans consuming all visits. Stable order, no duplicates, no all-pairs scan, no randomness/forces and no simulation mutation remain invariants. This increases draw work; existing CPU/frame budgets are not relaxed and physical-device performance is still outstanding. Exact numeric tuning is a reviewable implementation choice, not separately approved visual acceptance.

The developer Resize fixture cycles **standard 640 → compact 320 → large 1,280 → standard 640 CSS px maximum width**, each fitting the available viewport and retaining 16:9 unless the existing short-frame toggle is selected. At sufficient width, large is 1,280×720 CSS px; DPR/backing limits remain independent. Same mounted runtime and Pause survive all sizes. [Current evidence](fs-4.4-svg-aperture.md#connection-balance-and-large-fixture-amendment--2026-09-29). Older revision narratives and measurements below remain historical.

## R8 — denser, slower particles and size-dependent connections

Dimi requests **1,600 default particles**, a **3,200 toggle**, **50% default movement speed**, and explicitly chooses thicker **and** brighter connections for larger particles. The fixture toggles 1,600 ↔ 3,200; the normalized range is 40–3,200, step 10. Default speed becomes 0.5× (effective seeded 4–12 CSS px/s), with the existing 0.25–2× range unchanged. Default-restoring Reset targets 1,600 / 0.5× / 1× size; low-level seeded Reset retains current configuration and Pause.

Candidate numeric connection tuning: mean effective endpoint radius / 2 CSS px gives a size factor clamped to 0.5–2. Stroke width = 1.5 CSS px × factor (0.75–3 CSS px). Alpha = min(0.85, 0.6 × factor) × (1 − distance / 80). Thus larger endpoints produce thicker/brighter lines; proximity still fades to zero at 80 CSS px. Nonpositive/nonfinite radius inputs use 2 CSS px; oversized radii cap at 6 CSS px. The same pure sampler supplies Canvas and independent SVG stills without changing simulation state. Width/opacity numeric tuning is an implementation choice for visual review, not separately approved numbers.

Connection limits remain 240 lines, degree 3 and 64 candidate visits per particle; population capacity follows 3,200 (theoretical 204,800 candidate visits). Raster/DPR/delta and performance budgets remain unchanged. No pointer forces, new frame owner, aperture changes or homepage integration. Prior revisions and measurements are historical. [Current task evidence](fs-4.4-svg-aperture.md#density-speed-and-connections-amendment--2026-09-29).

## R7 — 1,000 default and 2,000 toggle

Dimi explicitly requests a default of **1,000 particles** and **2,000** via “Toggle particle count”. The fixture toggles 1,000 ↔ 2,000. The effective range is now 40–2,000 inclusive, step 10; the default-restoring Reset target is 1,000. Low-level seeded Reset retains the current count and Pause. Live and static previews use the same effective configuration.

The shared connection population ceiling becomes 2,000; its 240-line cap, degree 3, 64 candidate visits per particle and visual styling remain unchanged. The theoretical candidate-visit ceiling is 128,000, not measured frame performance. Frame-work, raster, DPR, delta and bundle budgets are not relaxed. R6 and older measurements remain historical. This request approves count settings, not visual acceptance or physical-device performance. See [current evidence](fs-4.4-svg-aperture.md#1000-default--2000-toggle-amendment--2026-09-29).

## R6 — 480 particles

Dimi explicitly requests increasing the particle count to **480**. The effective default and default-restoring Reset target are now 480 particles; the finite range expands from 40–240 to **40–480**, step 10, so runtime validation does not silently clamp the request. Speed, size, seed, motion policy, Pause, aperture fitting and rectangular physics are unchanged.

The connection sampler shares the 480-particle ceiling so IDs 240–479 can participate. The 240-line total cap, degree 3, 64 candidate visits per particle, 80 CSS px distance, width and opacity remain unchanged. The theoretical candidate-visit ceiling therefore becomes **30,720** per sample; this is a work bound, not a measured performance PASS. Existing frame-work, raster/DPR, delta and bundle targets are not relaxed. Current decision tables below use 480; earlier revision narratives and their 120-default/240-maximum evidence remain historical.

The request authorizes this count and the necessary bounded domain/configuration changes. It does not approve the moving composition, provisional connection tuning, physical-device performance or task closure. See [FS-4.4 current count evidence](fs-4.4-svg-aperture.md#480-particle-amendment--2026-09-29).

## R5 — Repository-authored Work Sans SPACE

Dimi explicitly requests creating the SPACE SVG with Work Sans and states that SVGs will be authored here rather than waiting for Illustrator exports. This supersedes the delivery prerequisite in D15 and older missing-export statements: Illustrator files are no longer required to continue asset work. The bundled Work Sans font is the actual source; no Figma/video/Illustrator match is claimed.

The FS-4.4 amendment creates outlined Work Sans Bold (700) with native font kerning, a tight proportional viewBox and preserved P/A counters. Weight 700 is a reversible implementation choice for this candidate, not an invented explicit weight approval. The exact same paths supply the independent solid SPACE fallback. Circle remains the asset-load fallback; the repository-authored diamond remains a diagnostic replacement, not an approved public shape selector. Visual readability, Safari evidence and independent renderer review remain separate acceptance requirements. See the [FS-4.4 current amendment](fs-4.4-svg-aperture.md#work-sans-space-amendment--2026-09-29).

## R4 — Temporary proximity connections

Dimi requests temporary lines between close particles, referring to the supplied YouTube examples. This explicitly supersedes the **no connections/links** portion of D06 and the particle behavior below. The videos could not be fetched during this amendment; no viewed-video match is claimed. Constant seeded drift, no forces/collisions, no trails/glow, independent aperture geometry, local Pause and all existing motion guards remain unchanged.

The controlled FS-4.3 candidate draws a line while two selected neighbors are close, recomputes it from current positions, and fades it with distance until it disappears. It introduces no binding force, timer, connection persistence, new random source or extra frame owner. Static previews derive the same connections without Canvas. Lines will eventually be clipped by the same aperture as particles; no SVG integration is performed here.

**Provisional implementation defaults, not Dimi-approved numeric decisions:** 80 CSS px center-distance cutoff; 1 CSS px stroke in particle color; opacity `0.35 × (1 − distance/80)`; up to 3 incident links per particle, 240 total lines, and 64 candidate checks per particle. These are fixed diagnostic defaults, not added controls. A local grid preserves bounded work (≤15,360 candidate checks at 240 particles) instead of scanning every pair. Stable traversal is deterministic but does not promise every nearby pair or the globally nearest neighbors. Screen-space distance prevents connections across wrapping edges. These choices need visual review, especially under the future SPACE aperture.

Existing count/speed/size/DPR/raster/delta, callback/frame and bundle ceilings remain unchanged. The work row's prior linear particle traversal now additionally includes bounded local connection derivation and ≤240 line draws. The no-all-pairs requirement remains. Earlier FS-4.3 timings/bundle results describe its unconnected candidate; amended evidence belongs to the [current FS-4.3 amendment](fs-4.3-canvas-lifecycle.md#r4-proximity-connection-amendment).

## Dimi acceptance and FS-4.1 completion — 2026-09-28

Dimi: **“I accept all product proposals”**, followed by **“Update the documentation, then commit and push the changes.”** This accepts the written R2 product contract after its technical PASS; it is not a claim that unseen reference videos, artwork, a rendered preview or physical-device performance have been inspected.

- **Technical review:** Codex PASS for R2 SHA-256 `682bb9bb540e6cceb35300a0b359ea847de4216ec98db9c2a93ed31b97de4a39`. F1 (pre-Canvas observation) and F2 (cancellation/rearming/stale settlement) are closed. Review artifact SHA-256 `5f20dc81342088cf6557b70aafb318ef6aec3cfc9584b0523ddc81593a64d209`; [full local review](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.1-r2-review/REVIEW.md). The review verified all 624 tracked source files unchanged, 128 retained baseline files, 1,536 actual-resolver combinations and documentation checks; it did not run a scene implementation.
- **Product acceptance:** D01–D14 below are accepted, including the written calm-drift behavior in place of inferring a video match, SPACE fit/static fallback, Aperture name/route, homepage Pause, and all proposed configuration/resource targets. The primary D11 proposal is selected: a **Customize dialog on the details page**, using the shared Dialog and its static thumbnail. Inline controls were an alternative and are not additionally selected. D12's bounded two-consumer coordination therefore applies to that details surface.
- **Scope:** Initial production aperture remains SPACE. The fixed circle is accepted only as a temporary asset-load fallback/technical fixture, not as a second production scene or public shape selector. Header identity and accepted intro/navigation remain protected; the large Start artwork will be replaced in later implementation.
- **Assets and later acceptance:** D15's delivery requirement is accepted, but the initial SPACE and second original SVG exports have not been supplied/validated. They remain inputs to asset integration. Final typography/rendered appearance, two-asset replacement proof, browser/phone comfort and compliance with approved performance targets still require actual evidence.
- **Completion and authorization:** The observable contract, measurable limits, export guide, technical review and explicit product decision complete FS-4.1. This request authorizes only documentation updates and their commit/push to the current portfolio branch. It does not start FS-4.2, create a PR, merge or deploy.

This dated acceptance supersedes earlier pending-approval language and historical proposal wording retained below. Proposed file paths remain implementation suggestions to inspect when work starts; accepting the contract does not require creating every named file or speculative abstraction.

## Requested outcome and scope

Specify an observable scene, safe ownership boundaries, asset workflow and measurable limits using detailed-plan sections 2–6 and section 9 evidence rules. This task produces documentation only. It does not create a preview, simulation, Canvas runtime, production scene, route or SVG asset. Sites registration/hosting tools are unnecessary for this local specification; no site is registered or published.

Protected: Presentation → Application → Domain ← Infrastructure; provider-owned ThemeService/motion policy; all four motion choices; local Pause; header identity and intro; navigation hydration/focus; generated tokens/bootstrap; game isolation; unrelated content. No engine, scheduler/modal manager, second preference authority, uploads, presets, carousel, contact work, dependency/environment changes or remote writes.

### Request acceptance map

| Requirement                                              | Accepted R3 status / remaining limit                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Inspect actual reuse and latest navigation correction    | Source map below; source inspection, not rerun behavior tests                                     |
| Observable appearance and inspected-reference provenance | Decision register and visual contract; video/Figma visuals unavailable                            |
| Candidate A presented only as a proposal                 | Written drift accepted through SPACE; circle limited to fallback/fixture                          |
| Smallest renderer/static/readiness/overlay boundary      | R2 technical PASS; Dimi accepted the documented boundary                                          |
| All section 4 limits, units, Reset and measurement       | Two decision tables below; targets accepted, compliance unmeasured                                |
| Production baseline or exact capture handoff             | FS-4.1B paired production capture retained and linked below; no scene/physical-phone measurements |
| Early Illustrator guide                                  | Next section, usable before runtime work; exports not yet supplied/validated                      |
| Exact reviewable proposal and validation                 | Exact R2 technical PASS and Dimi acceptance recorded; R3 records closure                          |

## Illustrator aperture export guide — available now

Prepare the initial **SPACE** silhouette and a second original silhouette (typography or geometry). The second asset demonstrates replacement; it does not add a public shape selector. No need to wait for implementation to prepare these files.

1. Retain the editable `.ai` original. Use one intentional artboard; tightly frame the artwork with deliberate, balanced margins. A square `0 0 1000 1000` viewBox is optional, not required for a wide word. Supply the actual dimensions and preserve aspect ratio.
2. Convert SPACE text to outlines, expand appearance, and outline strokes that define the opening. Use solid opaque black fills on transparent surroundings. Remove any exported white artboard rectangle: the host supplies the white mask background. The host, not this export, supplies theme colors.
3. Inspect compound paths and counters (especially P and A). Letter strokes become openings; letter counters and spaces remain covered. Preserve intended holes/fill rules rather than flattening them into filled rectangles.
4. Export plain SVG with a finite, nonzero viewBox. Remove scripts/event attributes, external links/resources/fonts, raster images, `foreignObject`, animation, filters, hidden/off-artboard objects and unnecessary Illustrator metadata. Keep geometry small and reviewable; no invented byte ceiling is an approved asset budget.
5. Open the exported SVG and compare it to the original at narrow and wide sizes. Supply a screenshot of the intended black silhouette, source/export filenames, intended margins, and which file is initial versus second. Font licensing/source remains the asset owner's responsibility; no font choice is inferred from an unseen Figma file.
6. Proposed destinations, not existing assets: `frontend/public/scene-apertures/space.svg` and a descriptively named second SVG; trusted selection metadata in `frontend/data/sceneApertures.ts`. Keep editable originals separately; do not overwrite the current logo asset.

The proposed compositor uses an explicitly **luminance** SVG mask: white retains the theme-colored cover and black removes it to reveal particles underneath. Alpha-only interpretation would not give opaque black this role. See [W3C mask processing](https://www.w3.org/TR/css-masking-1/#mask-processing). This convention is accepted; neither actual export has been tested.

FS-4.4 must verify the actual two assets in target browsers and all themes, capture before/after screenshots, and show a replacement diff with byte-identical particle rules/Canvas update code. A circle fixture can test mechanics but cannot substitute for Dimi's second original export.

## Source provenance and reconciliation

| Source                                                                  | Actually inspected / authority                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dimi's notice in this request, 2026-09-28                               | Written description inspected in full. Direct product direction: remove large Start logo; Canvas under an SVG SPACE cutout; specified colors; details-page link/customization; later educational description; short name requested. It does not approve drift behavior or numeric budgets. |
| `/Users/dimi/Downloads/FunkSpace_EPIC_4_Detailed_Plan.md`               | Actual supplied local file read, especially §§2–6 and 9. SHA-256 `9b910c45941989d599cd8bfe0109c17f0a4792d46cfec8ea8a1d68150cc57178`. It is not stored at an invented repository path; it supplies proposals and historical context, not authorization.                                     |
| [Video 1 at 21:05](https://www.youtube.com/watch?v=gxagf0WKfBo&t=1265s) | URL supplied; web fetch returned cache miss. No frames, playback or transcript inspected.                                                                                                                                                                                                  |
| [Video 2](https://www.youtube.com/watch?v=5dIbK0auaB8)                  | URL supplied; web fetch failed. No frames, playback or transcript inspected.                                                                                                                                                                                                               |
| [Figma design folder](https://www.figma.com/files/folder/490787975)     | Folder URL supplied; web access unavailable. Browser access stopped because the admin-policy security check could not be verified. No design file, node, typography, spacing or screenshot inspected; no access workaround attempted.                                                      |
| Local repository at recorded HEAD                                       | AGENTS, README/package scripts, architecture, relevant ADRs 002/003/004, workflow/template, current feature status, EPIC 3 closure/API handoff, navigation correction, affected code/tests/configs inspected. Source map follows.                                                          |
| Retained local production reports                                       | Three navigation-correction flag-on JSON reports and metadata inspected; older EPIC 3 flag-on/off summary inspected. Accessible paths and evidence limits below. No fresh execution or phone results inferred.                                                                             |

The latest feature summary and explicit 2026-09-27 closure supersede the old FS-G1 pending table and old unimplemented-policy wording. EPIC 3/FS-G1 remain closed. The current code already has four motion choices and the accepted introduction.

Dimi's notice supersedes the older circular production-aperture and homepage customization proposals. It also authorizes replacing the large static Start logo; retaining that large logo as the required error fallback would contradict the new direction. Header identity remains. The accepted details page extends the older four-route list with `/animations/aperture` and the D11 Customize dialog; neither exists yet. Do not enable unrelated disabled navigation entries or build a catalogue. The feature plan remains the milestone entry point; its FS-4.1 acceptance amendment now records the approved route/contract without copying this entire log. Its dated “not started” entries do not evidence runtime implementation.

## Real reuse points and affected contracts

All paths here were inspected unless explicitly marked Proposed. Tests were read for contract coverage; no application tests were run in this documentation task.

| Existing path                                                                                                              | Current fact / reuse or bounded gap                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `frontend/components/sections/Start.tsx`, `Start.module.css`, `Start.test.tsx`                                             | H1 and introduction are semantic siblings of an aria-hidden static LogoMotion. Scene reserves 343:503 below 48rem and 3:2 above, with token padding/border and pointer-events none. Replace only the large decorative content later; add controls as siblings. Existing SSR-logo assertions must be deliberately revised when that authorized behavior changes, preserving semantic/static guarantees. |
| `frontend/app/page.tsx`, `frontend/components/Layouts/PortfolioShell.tsx`                                                  | Homepage shell retains its independent header LogoMotion, menu and server-rendered children. Do not make the full page a per-frame client owner.                                                                                                                                                                                                                                                       |
| `frontend/application/providers/ServiceProvider.tsx`, `frontend/infrastructure/services/createServices.ts`                 | Existing composition exposes per-instance logo/dialog/intro bindings, ThemeService, narrowed motionPolicy, readonly availability and navigation handoff. Add a per-scene factory here only after review; consumer releases its own instance, never initializes/disposes shared services.                                                                                                               |
| `frontend/domain/motion/MotionPolicy.ts`, `frontend/application/motion/MotionPolicyService.ts`                             | Reuse `resolveMotionPermission`, `getSnapshot`, immediate subscribe/unsubscribe. `mayPrepare` is false under hard denial, hidden state or local Pause. No copied policy or separate OS/document preference listener.                                                                                                                                                                                   |
| `frontend/application/theme/ThemeService.ts`                                                                               | Immediate subscription distinguishes selected/resolved themes. Live choice survives failed persistence. Browser adapter resolves/cache-reads semantic colors on relevant changes; Canvas receives actual immutable color values, never unresolved var strings.                                                                                                                                         |
| `frontend/domain/ports/HomeIntroPort.ts`, `frontend/infrastructure/motion/HomeIntroBinding.ts`, `HomeIntroBinding.test.ts` | Binding currently exposes only `logoState` and `release`; no ready notification exists. Actual root phases include preparing/waiting/menu/fading/visible. Animation-end, interaction and fail-open paths reveal content. Proposed narrow notification below must cover all reveal paths.                                                                                                               |
| `frontend/components/Layouts/PortfolioNavigation.tsx`, `frontend/domain/ports/PortfolioNavigationHandoffPort.ts`           | Navigation owns ready/open/category state and destination ticket. No shell overlay selector exists. `whenFallbackIdle` retains open/focused native disclosure until closed and unfocused, then synchronously commits enhancement from an asynchronous one-shot notification.                                                                                                                           |
| [Latest navigation correction](maintenance-navigation-hydration-continuity.md), `e2e/navigation-hydration.spec.ts`         | Preserve delayed-script focus on summary/link, next Tab, native hrefs, idle enhancement and no concurrent modal. Latest independent PASS is historical evidence, not this task's test result.                                                                                                                                                                                                          |
| `frontend/components/Controls/Dialog.tsx`, `frontend/hooks/useDialog.ts`, `frontend/domain/ports/DialogBindingPort.ts`     | Reuse title/focus, close requests, actual invoker, `dismiss`/`navigation`, `onReleased`, error fallback and owned scroll lock. No new modal mechanics.                                                                                                                                                                                                                                                 |
| `frontend/components/Controls/ButtonLink.tsx`, `Button.tsx`, `field.tsx`, `InlineStatus.tsx`                               | ButtonLink is a real anchor; use for details navigation. Reuse Button and field label/help conventions. No range/slider component was found; propose local native range inputs rather than claim a shared slider already exists.                                                                                                                                                                       |
| `common/motion/AnimationRuntime.ts`                                                                                        | Lifecycle vocabulary is update(milliseconds), pause, resume, reset, destroy. Reset stops advancement. Reuse this contract without a game import or external second frame driver.                                                                                                                                                                                                                       |
| `frontend/app/sandbox/particles/page.tsx`                                                                                  | Existing SVG/Canvas placeholders and a legacy reduced-motion hook; no simulation/Canvas adapter to reuse. Do not promote its separate policy pattern into production or refactor it under this task.                                                                                                                                                                                                   |
| `frontend/data/portfolioDestinations.ts`                                                                                   | Current typed destinations have no animation-details route. Proposed route remains explicit new work; no invented existing destination.                                                                                                                                                                                                                                                                |

## Decision register

Dimi accepted all R2 product proposals on 2026-09-28 after technical PASS. “Accepted” below records specification approval, not implementation, actual visual acceptance or measured compliance. D15 remains an outstanding asset input.

| ID  | Decision                                                                                                                                           | Status / owner                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| D01 | Replace large Start logo; retain header identity and accepted intro/navigation                                                                     | Accepted; original direction retained; integration unimplemented                                |
| D02 | Canvas background plus fixed SVG cover; particles visible only through SPACE characters initially                                                  | Accepted; SPACE remains initial production aperture; actual typography/export pending           |
| D03 | Field and cover `--fs-color-surface-background`; particles `--fs-color-content-primary`                                                            | Accepted; future all-theme visual checks still required                                         |
| D04 | Homepage is presentation; real button-styled link below scene leads to details/customization page; educational text later                          | Accepted; details route/layout specified below; unimplemented                                   |
| D05 | Name **Aperture**, link label “Explore Aperture”, route `/animations/aperture`                                                                     | Accepted: Aperture / Explore Aperture / /animations/aperture                                    |
| D06 | Seeded calm drift; no trails/glow/pointer forces. Temporary proximity connections added by R4; circle remains a fixture                            | R3 drift accepted; R4 connection behavior requested, numeric styling/density provisional        |
| D07 | Carry Candidate A's drift through SPACE instead, keeping the same particle rules                                                                   | Accepted written behavior through SPACE; no unseen-video match claimed                          |
| D08 | SPACE fits centered within 80% scene width and 80% scene height, preserving its own aspect ratio; circle fixture diameter 80% of min(width,height) | Accepted 80% fit/centering; exported lettering and rendered optical check remain later          |
| D09 | Independent static SPACE particle still, and solid static SPACE silhouette if masking fails                                                        | Accepted static/error composition; later proof of nonempty/readable output required             |
| D10 | Homepage Pause remains an accessibility action; density/speed/size/Reset only on details page                                                      | Accepted homepage Pause/Resume and details-only configuration/Reset                             |
| D11 | Details page reuses the scene component with its own temporary mount state; Customize opens shared Dialog with static thumbnail                    | Accepted primary Customize-dialog proposal; inline controls remain an unselected alternative    |
| D12 | Shell-local none/navigation/customization state only on a surface hosting both modals                                                              | Accepted details-shell coordination; no global manager or homepage second modal                 |
| D13 | Renderer/static/intro-readiness contracts below                                                                                                    | Technical PASS for R2 and Dimi acceptance recorded; implementation verification remains later   |
| D14 | Configuration/resource tables and default seed                                                                                                     | Accepted configuration/resource targets and seed; compliance not yet demonstrated               |
| D15 | Second original Illustrator export                                                                                                                 | Delivery requirement accepted; initial and second original SVGs still not received or validated |

Dimi selected the written D07 behavior through acceptance of all proposals. Reference access remains unverified; no visual match is claimed. FS-4.2 still requires its own task authorization.

## Observable visual and interaction contract — accepted specification

1. **Composition:** Preserve current reserved responsive frame, H1, copy, ordinary scrolling and header identity. Fill the scene rectangle with the surface color. A full-size covering SVG of that same color reveals particles only through the stationary, centered SPACE letter strokes. Letter counters/spacing stay covered. No exposed edge strips, stretching, animated mask or moving camera. D08 defines the accepted fit, independently of simulation bounds.
2. **Particles:** Under accepted D07, use opaque filled discs with independently seeded direction, radius and base speed. Velocity is constant between explicit inputs; no gravity, collisions, attraction, repulsion, trails, glow or pulsing. R4 adds temporary visual proximity links without changing particle motion. Touch/pointer movement has no effect and normal touch scrolling remains native.
3. **Bounds:** For valid width W and height H in CSS pixels, particle centers wrap modulo W/H into `[0,W)`/`[0,H)`; drawing clips at the outer rectangle. Particles neither collide with nor follow letters/circle. Brief clipping at the outer field boundary is acceptable because that boundary is covered; no edge-duplicate particle system is proposed. On resize preserve fractional positions, identity, base speed/direction/radius. DPR never changes physics.
4. **Static:** SSR/no-JS/pending/denied/error artwork must be complete without Canvas. Use a deterministic, nonempty still from pure bounded data under the selected aperture. Verify SPACE remains intentional at minimum count/size and smallest viewport; if not, return the seed/scale/count proposal for review rather than add hidden particles above the configured count. A mask-independent solid SPACE silhouette is the accepted final fallback. No empty hole, spinner dependence or indefinite hidden content.
5. **Controls:** Place a real ButtonLink below artwork, outside aria-hidden/pointer-events-none wrappers. Keep Pause/Resume beside it under accepted D10. Details controls expose “Particles” as a count, “Speed” and “Size” as multipliers, effective numeric output and Reset. Use labeled native ranges with units, keyboard support, visible focus and 200% text usability. No-JS keeps artwork/link/content; hide inoperative JS controls or expose an honest disabled reason.
6. **Static edits:** Count/size update the still discretely; speed changes only the displayed value and “Speed applies when animation can run” explanation. A paused ready runtime may redraw once without advancing time. No static-preview frame loop, no second Canvas for the dialog.
7. **Identity/error:** Preserve original logo asset and header behavior. New scene failure keeps deliberate SPACE art, semantic page content, details link and navigation usable. Explain unavailable motion inline when controls exist. Do not invent educational copy; Dimi will supply it later.

## Configuration decision table

All rows are **Accepted specification targets**, including default seed; Reset preserves global restrictions/local Pause. Values describe CSS-space simulation, not backing pixels. Actual compliance and rendered appearance remain to be verified.

| Setting               | Default                                     | Bounds / step / unit                                                                                                     | Reset and measurement                                                                                                                            |
| --------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Particle count        | 1,600                                       | 40–3,200 inclusive, step 10, whole active particles across the rectangle                                                 | User Reset →1,600. Count actual state; no viewport multiplier or mask-dependent replenishment                                                    |
| Speed multiplier      | 0.50×                                       | 0.25–2.00×, step 0.05                                                                                                    | User Reset →0.50×. Zero excluded; Pause is separate                                                                                              |
| Size multiplier       | 1.00×                                       | 0.75–2.00×, step 0.05                                                                                                    | User Reset →1.00×. Measure radius, not diameter                                                                                                  |
| Seeded base speed     | Per-particle 8–24                           | CSS px/s; multiplied effective range 2–48 CSS px/s                                                                       | Reset reproduces seed-derived velocities. Test displacement against scripted elapsed milliseconds /1000                                          |
| Seeded base radius    | Per-particle 1–3                            | CSS px radius; effective radius 0.75–6, diameter 1.5–12                                                                  | Reset reproduces seed-derived radii; compare CSS-space geometry independently of DPR                                                             |
| Seed                  | `0x46533431`                                | Fixed unsigned 32-bit seed; not a public control                                                                         | Accepted seed from R1; no algorithm selected yet. Same seed + inputs must reproduce within agreed tests; no Math.random/clock during update/draw |
| Aperture fit          | D08: 80% fit                                | SPACE: contain within 0.8W ×0.8H; circle fixture: diameter 0.8min(W,H)                                                   | Not a slider. Reset does not change selected trusted asset or layout; compare bounding boxes/screenshots                                         |
| Invalid configuration | Last valid value; default on first creation | Reject nonnumeric/nonfinite/malformed fields; clamp finite values, then nearest permitted step from minimum, ties upward | Return effective values to UI. Test direct callers, not only slider constraints                                                                  |
| Resize/invalid bounds | Reserved responsive frame                   | Positive finite W/H; zero/disconnected/invalid suspends without division or reseeding                                    | Preserve last valid state; fraction-preserving resize; same DPR-independent positions                                                            |

Lower-level runtime Reset stops advancement and restores its initial seeded state at current configuration, matching AnimationRuntime. User Reset first restores count/speed/size/default seed, then resets. Neither clears local Pause, theme, shared preference, feature gate or visibility. The controller may resume only if prior local intent and current permission both allow it; Reset is never implicit Play. Settings survive dialog close/reopen on the same mount; route departure/new mount/reload restore defaults. Proposed details-page state does not transfer to the homepage or persist in storage/URL/account. No two route scenes remain mounted/running after navigation settles.

## Resource and measurement decision table

All new ceilings/targets are **Accepted for implementation and later measurement**, not claimed as achieved. Existing Lighthouse assertions remain unchanged. Reset never lifts a ceiling. Record per-run and pooled p95; the review recommends requiring each run to pass, with that aggregation rule to be made explicit in the later measurement protocol before results are judged.

| Concern                 | Proposed default / limit                                                                              | Exact measurement or invariant                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Work                    | 1,600 default / 3,200 maximum; linear update/draw plus bounded connection sampling, no all-pairs work | Domain bounds tests and actual adapter inspection at count/speed/size maxima                                                                                                                                                                    |
| DPR                     | Effective scale ≤2                                                                                    | For valid CSS dimensions, proposed scale `min(validDeviceDpr, 2, 4096/W, 4096/H, sqrt(4000000/(W*H)))`; allow scale below 1; invalid DPR uses 1; floor backing dimensions and suspend if either becomes zero                                    |
| Raster                  | ≤4,000,000 backing pixels total; each side ≤4,096 px                                                  | Assert actual canvas width/height after resize/DPR change; never allocate before guard. CPU budget does not measure GPU memory                                                                                                                  |
| Delta                   | 0–50 ms/update; first resumed frame advances 0 ms                                                     | Nonfinite/negative →0; finite excess dropped. No hidden-tab catch-up. Test 100 ms→50 distinctly from two accepted 50 ms steps                                                                                                                   |
| Scheduling              | ≤1 scene-owned pending animation frame; zero continuous work when settled suspended/destroyed         | Instrument adapter request/cancel ownership, including reentry and exception paths; bounded visible still redraw separately counted                                                                                                             |
| Callback CPU            | Phone p95 ≤6 ms defaults; ≤10 ms at 3,200/2×/2×                                                       | Three 30 s samples after proposed 5 s warm-up; elapsed callback update + draw submission, nearest-rank p95 per run and pooled, sample counts/raw data retained. Keep allocation/instrumentation overhead reported                               |
| Frame delivery          | Default p95 ≤20 ms for measured 60 Hz configuration                                                   | Three same-duration samples; record interval distributions and intervals >1.5× observed refresh period, long tasks and stutter. Report max controls separately; no invented maximum-setting frame-delivery threshold or universal FPS guarantee |
| Initial JavaScript      | ≤15 KiB incremental gzip vs same-flag pre-scene `/` baseline                                          | 1 KiB=1024 bytes. Sum unique initially required JS assets using identical gzip method/cache/build mode; network/import graph distinguishes optional runtime. Record details-route delta separately                                              |
| Lazy Canvas JavaScript  | ≤35 KiB gzip aggregate optional runtime chunks including unique transitive dependencies               | Sum newly fetched optional chunks once, excluding already counted initial files. Record raw/gzip files and manifests; asset/HTML/CSS/static-SVG growth separate                                                                                 |
| Denied/flag-off loading | No optional Canvas preparation/download initiated by scene                                            | Inspect network and import paths at SSR/pending/Off/Reduced/OS-denied/flag-off. Static UI is not claimed zero-cost; production prefetch/preload must also be checked                                                                            |
| Layout/startup          | Existing LCP p75 ≤5,000 ms; CLS p75 ≤0.1; performance score warning below 0.9                         | Existing three-run desktop DevTools-throttled Lighthouse, both compiled flags. No new delay or scene-caused shift permitted; trace intro and scene separately                                                                                   |
| Resource/comfort        | No growth in scene-owned resources after repeated cycles                                              | Proposed 20 route/visibility/Pause/overlay cycles; counters return to baseline, terminal zero. Proposed 10 min Xperia session records heat, input delay, stutter/discomfort; no battery certification                                           |

Measure full frame/paint/compositing separately from callback submission time. Record actual refresh conditions; high-refresh observations do not automatically pass a 60 Hz target. Narrow SPACE openings may reveal few of a rectangular field's particles: visual acceptance of minimum/default counts remains a real risk, not permission to alter density semantics silently.

## Smallest proposed implementation boundary

No new package/global service is needed. Domain owns particle numeric state and pure seed/config/update/resize rules. Application owns permission, local intent and asynchronous generations through a narrow port. Infrastructure owns DOM handles, Canvas, frame timestamps, observers, palette resolution and cleanup. Presentation owns static markup, SVG cover and input controls; it consumes the per-instance factory from existing services and receives only discrete state/status updates, never per-frame React state.

| Proposed path or existing modification                                                                    | Minimum responsibility                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Proposed `frontend/domain/particles/ParticleScene.ts`                                                     | Validated config, seeded state, pure numeric updates, wrap/resize/reset, bounded still data; one module until real complexity requires a split                         |
| Proposed `frontend/domain/ports/ParticleScenePort.ts`                                                     | Browser-free runtime lifecycle/config/resize/palette/status types, opaque generic target specialized at composition; no SVG shape or CSS names in simulation           |
| Proposed `frontend/application/animations/ParticleSceneController.ts`                                     | Consume shared policy, permission reconciliation, local Pause, factory preparation and generation cancellation; no clock/frame loop                                    |
| Proposed `frontend/infrastructure/particles/ParticleSceneBinding.ts`                                      | Lightweight observation before Canvas import; owns intersection/resize observers, cached numeric geometry/palette and instance cleanup; no frame scheduling            |
| Proposed `frontend/infrastructure/particles/CanvasParticleScene.ts`                                       | Separately lazy, sole frame owner; actual context, numeric CSS-size/raster conversion, draw and drawing-resource release; receives geometry, never observes visibility |
| Proposed `frontend/components/Scene/SignatureScene.tsx`, `StaticParticlePreview.tsx`, `SceneAperture.tsx` | Small client boundary, independent static presentation from shared pure data, trusted mask composition; no concrete adapter imports                                    |
| Proposed `frontend/components/Scene/SceneCustomization.tsx`                                               | Details-only controls and existing Dialog, contingent on D11 choice; no second runtime in preview                                                                      |
| Proposed `frontend/app/animations/aperture/page.tsx`                                                      | Details route if D05 approved; same scene component, temporary state, space for later genuine educational content                                                      |
| Proposed asset paths from export guide                                                                    | Trusted finite asset metadata, not a registry/editor/upload pipeline                                                                                                   |
| Existing `createServices.ts`, `ServiceProvider.tsx`                                                       | Inject per-instance scene factory and lazy adapter loader; no eager Canvas construction during provider setup/SSR                                                      |
| Existing `Start`, shell, HomeIntro port/binding and possibly navigation                                   | Only approved scene/readiness/local overlay wiring; protect native fallback and focus receipts                                                                         |
| Proposed colocated tests and `e2e/scene-*.spec.ts`                                                        | Pure rules, controller fakes, actual adapter lifecycle and production consumers; existing regressions retained                                                         |

### API and lifecycle contract — accepted design, not delivered API

- Composition supplies a per-instance scene binding factory specialized to a browser target. Controller accepts a lazy runtime factory/event port, not HTMLCanvasElement or browser imports. Keep mount/drawing handles generic as existing Dialog does. Expose config/effective config, local Pause/Resume, user Reset, discrete presentation visibility, subscription/unsubscribe and destroy; do not expose an imperative per-frame API to React.
- Runtime implements existing AnimationRuntime semantics plus validated configuration, numeric resize and immutable palette update. Controller owns one runtime reference; the adapter owns its state storage and exactly one frame chain. Domain functions manipulate the adapter-owned numeric state; no second React particle store.
- Preparation has two phases on one per-instance binding: lightweight observation first, optional Canvas loading second. The observation and cancellation contracts below are normative parts of this proposal; neither requires a new shared service.
- Only the actual `unprepared` state's `mayPrepare` authorizes invoking the optional loader. Pending, Reduced, Off, flag-off, opted-out, hidden/offscreen/fully covered and local Pause before prepare retain independent static markup. `supportsReducedMotion:false`. On bypasses OS preference only; it does not bypass feature/readiness/visibility/Pause. `mayPrepare:false` while `preparing` is expected, not evidence of intervening denial.
- Pause cancels owned frame and clears timestamp history; resume is idempotent and first delta is zero. Theme/config/resize changes may coalesce one still redraw only when visible/permitted; hidden state stores dirty data. No second animation-frame owner in controller or React. Browser RAF is one-shot; explicit cancellation remains necessary ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)).
- Failure of import/context/draw or context loss exposes static art and stops scheduling. No auto-retry from theme/sliders/preferences. New mount is the recovery boundary unless a later explicit retry design is approved. Terminal destroy invalidates first, then attempts all owned cleanup even if one release throws; no later method resurrects it.
- Static rendering is independent of optional code and may use pure initial still data before any runtime exists. Keep it visible until both a valid first frame and valid cover are ready. Theme changes recolor in place without reseeding, remounting or clearing Pause. Denied runtime preparation cannot be justified as necessary for a preview.

### F1 resolution — observation exists before Canvas loading

The existing composition root supplies one lightweight per-instance browser binding before the controller evaluates preparation. Proposed implementation location: `frontend/infrastructure/particles/ParticleSceneBinding.ts`, beside the separately lazy `CanvasParticleScene.ts`. These names are proposals, not a required class hierarchy. The binding's ordinary import graph must not include the concrete Canvas module, create a Canvas/context, preload its chunk, initialize particles or schedule frames. It owns only browser observation, cached geometry/palette inputs and the lifetime of this scene's runtime. The controller receives numeric/boolean snapshots through its existing proposed port; React receives discrete presentation state only.

1. On mount, install the binding and teardown guards before subscribing to immediate service callbacks. Its initial snapshot is `intersecting:false`, unknown bounds, and `visible:false`. Read the host's finite CSS content-box width/height without Canvas, then maintain them with one local ResizeObserver. Observe the stable scene host with one IntersectionObserver; an entry qualifies only when `isIntersecting` and `intersectionRatio > 0`. The first qualifying entry can enable preparation without any runtime already existing. No polling, observer-owned RAF or global visibility service is needed.
2. Read actual intro readiness from the existing shell/binding proposal below; read cover readiness and full occlusion from presentation-owned asset/shell state. Cover readiness means a usable trusted cover is available independently of Canvas; it must never wait for the first Canvas frame. Unknown readiness is false. A fully covering customization modal suspends the scene; it does not start another runtime. Aperture coordinates remain presentation-only.
3. Compute consumer `visible` as **positive finite width and height AND intersecting AND intro-ready AND cover-ready AND not fully occluded**. Forward this boolean to `resolveMotionPermission`. Shared `documentVisible`, preference, feature availability and local Pause remain their existing separate resolver inputs; do not duplicate policy logic or install another document/OS listener. ThemeService still supplies selected/resolved changes, with actual semantic palette reads cached in this browser binding.
4. A snapshot getter and immediate subscription deliver the latest observations even if their events preceded controller subscription. Later geometry, intersection, intro, cover and occlusion changes reconcile permission while unprepared or preparing, as well as while ready. Zero/nonfinite bounds or unknown/false readiness keep visibility false; a later valid observation can rearm. If required IntersectionObserver/ResizeObserver creation fails or is unavailable, retain independent static output for that mount; do not guess visibility or load Canvas to discover it. This is observation unavailability, not a preparation failure or an automatic retry loop.
5. Unsubscribe removes only that listener. Scene destroy first invalidates the active owner/attempt, then disconnects both observers, unsubscribes its theme/policy/intro/presentation listeners and releases its owned runtime, attempting all cleanup. Queued observer/subscription callbacks check owner liveness and do nothing after destroy. Shared services remain provider-owned. Canvas receives numeric resize/palette updates and owns only its drawing/frame resources; it must not create a second intersection/resize observer.

Static SSR/denied previews and asset loading remain independent of the optional Canvas import. A missing cover keeps them static and cannot trap homepage intro readiness: intro completion never depends on preparing the scene. This breaks the visibility/preparation cycle while preserving zero optional Canvas loading under denied startup.

### F2 resolution — cancellation, rearming and stale settlement

Use a single controller lifecycle state, a monotonically advancing attempt generation and one active-attempt identity per scene owner. These are instance bookkeeping, not a second motion authority. Configuration, seed and explicit local Pause intent survive cancellation. No completed runtime exists while preparing; a ready runtime is paused/resumed rather than re-prepared for ordinary visibility or preference changes.

| Current state / event                                                  | Required transition and effect                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unprepared; actual resolver returns `mayPrepare:true`                  | Allocate/store a new current attempt, set preparing, then invoke the lazy factory. Catch synchronous throws as well as promise rejection. At most one logically current attempt per owner.                                                                                                                                           |
| Preparing; an environmental, presentation or local gate becomes denied | Invalidate generation and clear the active attempt **before** reconciling or notifying; restore unprepared for the live owner, release any resources owned by that canceled attempt, retain static output/configuration/Pause. Cancellation is not failed. Reconcile latest gates only after this transition.                        |
| Unprepared after cancellation; still denied                            | Stay unprepared without invoking the loader. Observation/service subscriptions remain active.                                                                                                                                                                                                                                        |
| Unprepared after cancellation; a later event makes all gates eligible  | The normal actual-state `mayPrepare` check starts a new generation. No remount or explicit retry is needed. Resume must be explicit if local Pause remains set.                                                                                                                                                                      |
| Preparing; current attempt succeeds and remains eligible               | Check owner/attempt/generation and latest gates before construction/attachment and again before publishing ready. Construct paused, without starting a frame chain. Commit ready only for the current attempt; then use the actual ready-state resolver to resume. Retain static output until the first valid draw and usable cover. |
| Preparing; current attempt genuinely fails while still eligible        | Clear that attempt, release its partial resources, enter failed and retain static output. No automatic retry from preferences/theme/config; a new mount remains the recovery boundary.                                                                                                                                               |
| Any stale success or rejection                                         | Never publish ready/failed, clear a newer attempt, attach, schedule, or change newer state. Release only resources belonging to that stale attempt. A rejected stale promise is handled, not left as an unhandled rejection.                                                                                                         |
| Ready; permission denied / restored                                    | Pause/cancel the sole frame chain / resume under the actual resolver, with first delta zero. Preserve the valid runtime and local intent; no new preparation. Actual runtime failure still enters failed.                                                                                                                            |
| Any state; destroy                                                     | Mark disposed and invalidate/clear the attempt first; release all owned resources/subscriptions. Disposed is terminal. Late events cannot return it to unprepared.                                                                                                                                                                   |

**Start permission and in-flight eligibility are distinct.** Starting always uses `resolveMotionPermission` with the actual state `unprepared`. During preparation, evaluate current environmental/product gates using the same resolver with a temporary input copy whose `runtime` is `ready`, and inspect only `mayRun`. This pure eligibility probe does not change actual state, publish its presentation result or authorize frame scheduling. It avoids both duplicating the resolver's policy rules and incorrectly treating `mayPrepare:false` for preparing as cancellation. Only a genuinely committed ready runtime uses actual-state `mayRun` to schedule. Keep the probe private to the controller; no new public policy API is proposed.

For both resolve **and reject**, first require a live owner and matching active attempt/generation. Next read the latest snapshots: if now denied, take the cancellation transition, not the failure transition. Revalidate after any asynchronous stage or callback that can reenter teardown/state updates, including before attaching or publishing. Once cancellation has cleared an attempt, its finalizer must not clear the replacement attempt. If late cleanup throws, continue other owned cleanup and report a diagnostic without turning a newer attempt failed. Pending imports need not be physically abortable; an already-started download may finish after denial, but no new import/construction is initiated while denied and no stale result is adopted. This requires no loader cache, retry framework or additional scheduler.

### Required later verification for F1/F2 — not tests run in R2

| Sequence                                                                                 | Observable acceptance                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Allowed mount → positive bounds → intersecting → actual intro/cover ready                | Observation works with Canvas absent; exactly one current preparation begins once all inputs permit it. Observer callbacks schedule no frames.                                                        |
| Mount under pending/Off/Reduced/flag-off/local Pause, or unknown/zero geometry/readiness | Static output available; optional Canvas loader invocation, chunk download, context creation and frame count all zero. Test each gate separately; do not infer this from a generic static screenshot. |
| Zero size or offscreen → valid visible bounds; intro fail-open/no-intro readiness        | Normal observation rearms without remount or Canvas-dependent readiness. Missing required observers stays static for that mount.                                                                      |
| Allowed → pending import → Off → On; repeat with hidden/visible and Pause/Resume         | Cancellation becomes unprepared, preserves configuration/seed/local intent, and later eligibility starts a new generation. Without explicit Resume, local Pause still denies.                         |
| Attempt A canceled → attempt B current → A resolves or rejects                           | A cannot attach, draw, publish or clear/fail B; A resources are released. Exercise both settlement orders and current B failure separately.                                                           |
| Current import rejects; destroy during import; Strict Mode setup/cleanup/setup           | Genuine current failure stays failed until new mount. Disposed owner ignores late settlement; the replacement owner remains independent.                                                              |

Controller fakes must hold/release/reject preparation deterministically. Actual adapter/browser checks must also prove the lazy import boundary, observation cleanup and at most one runtime frame chain; controller-only tests cannot prove network or browser ownership. These checks belong to later authorized implementation, not this documentation revision.

### Actual intro readiness

Intersection alone is insufficient while an ancestor is hidden by the intro. Proposed narrow extension: add a content-visible snapshot/subscription on the existing per-shell HomeIntro binding, surfaced through shell-local presentation context. Notify on its actual transition to `visible`, including normal content animation-end, interaction, missing script/disabled intro, failure and bounded fail-open. Read current state on subscription so late consumers cannot miss readiness. Forward only a boolean to scene permission; keep DOM reading/observation inside existing infrastructure. If a narrowly scoped root-attribute observer is needed to catch parser-owned fail-open, it belongs in that binding and must be disposed.

Until readiness is known, scene visibility is false; static markup remains ready for reveal. Secondary details page with no intro is ready after normal presentation mount, subject to intersection and shared document visibility. Never guess a 2.2-second delay, add a second intro timer, replay intro on settings changes or wait for Canvas before revealing content. This is a proposed shared-contract change for its current owner to review.

### Navigation and customization coordination

The earlier plan proposed a homepage customization modal. D04 moves customization to details. D11 retains the existing Dialog only there; the homepage has navigation alone. Under accepted D11, the details shell hosts a local `none | navigation | customization` selection and release-aware transition, using props or one narrow shell context. No global registry/service is justified.

Before switching, request the current close, wait for `onReleased`, then open the requested target only if its request generation and route owner are still current. Never two active native modals or competing scroll locks. Dismiss returns focus to the actual invoker; route departure uses `navigation`, cancels queued opens/restoration and preserves destination tickets and normal href/history. Retain navigation's document-overflow strategy and native fallback idle handoff. While a native disclosure is open/focused, do not add competing enhancement/auto-open; a navigation failure must leave ordinary links available.

Customize dialog may contain the reused static thumbnail and necessary labels because native modal presentation makes the rest of that document inert ([MDN showModal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)). Full occlusion suspends the single scene without clearing Pause. Dialog close retains local settings; route departure destroys that instance. Inline controls remain an unselected alternative. Any later change to that choice must remove unused coordination infrastructure; preserve hydration/focus regressions.

### Trusted SVG embedding and failure

Propose a same-origin repository SVG loaded through native SVG `image` within the cover's luminance mask; never inject raw SVG text or assume an SVG-to-React loader exists. Use a full-rectangle cover, explicit mask units/content units and a viewport-sized coordinate system. Fit only the nested aperture with preserved aspect ratio; do not letterbox the cover itself. Use stable React per-instance IDs, including static thumbnails, without random hydration IDs or collision with the logo.

Keep the reviewed static fallback visible while a trusted asset loads. The plan's built-in circle is a proposed temporary asset-load fallback/technical fixture, not the selected SPACE production appearance; Dimi accepted this limited fallback role. Complete static SPACE remains the final mask-independent error composition. Failed/unsupported masking hides Canvas and retains a mask-independent static SPACE silhouette. A successful load event is not proof of correct pixels: cross-browser visual proof is mandatory, including empty/wrong but syntactically valid shapes. Native embedding is the smallest candidate; consider a narrow reviewed build-time conversion only if its proof fails. No generic SVG parser/editor is proposed.

## Pre-scene baseline and evidence handoff

**R1's outstanding capture was completed in FS-4.1B**, using isolated production builds at the unchanged source HEAD above. See the accessible [FS-4.1B review and baseline](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.1b-review/REVIEW.md), [measurement summary](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.1b-review/performance-summary.json) and [hashed evidence index](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-4.1b-review/evidence-index.json). These include separate On/Off builds, three Lighthouse runs per flag, cold/idle evidence and production geometry/navigation checks. The retained On score 0.82 warning remains distinct from the existing error thresholds and proposed scene targets. No scene exists in these builds, and no physical-phone result is claimed. R2 performed no new production measurement; the capture requirements below remain the repeatability contract, not outstanding execution claims.

Accessible local evidence root: `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/`.

| Inspected retained evidence                                                                                                    | Result and exact limits                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `navigation-hydration-continuity-2026-09-28/validation.json`, `lighthouse.navigation.json`, `lighthouse-reports/*.report.json` | Prior build `0UraICxIoB1TToEuxKYWo`, flag On, base `602f8c3a275c946bab92d56c9af18318968a344d` plus recorded patch `52f682a4a5a36410ce6a7917ec5e40b17c695e62def9911ff4915682d3ac0bde`. Seven listed runtime/test file hashes match current HEAD. This is a targeted identity check, not full build reproducibility. Metadata's pending-review field predates the later repository review closure. |
| Same three JSON reports, fetched 2026-09-28 12:40:05/25/45 UTC                                                                 | LCP 3093.678 / 3110.014 / 3100.599 ms; CLS 0 each; score 0.82 each (warning retained). Lighthouse 12.6.1; HeadlessChrome/154.0.0.0; desktop screen emulation 1350×940, scale 1. User-agent string is not proof of actual host OS.                                                                                                                                                                |
| `fs-3.6-budget-amendment/performance-summary.json` and repository closure                                                      | Historical On LCP 3101.830 / 3072.092 / 3084.252 ms, CLS 0, score 0.82; Off 451.390 / 450.761 / 453.586 ms, CLS 0.004603, score 1.00. Earlier candidate; not a current-HEAD paired baseline.                                                                                                                                                                                                     |

No files in another session are presumed accessible: these paths were actually read here. A receiving environment without this local mirror must receive the indexed files or recapture; an inaccessible path is not evidence. The handoff index hashes the inspected metadata/reports. No phone frame-cost, bundle delta or physical comfort result exists.

### Exact fresh-capture requirements for Codex

1. Recheck branch/HEAD/status and full tracked/untracked diff; preserve current work/preview. Pin commit plus patch/file hashes. Capture exact Node/pnpm versions, lockfile hash, OS/hardware, browser executable/version, timestamp/timezone and commands/exit codes. This inspection found Node v22.22.0 and pnpm 10.30.3; future runs must record their own.
2. Before any regeneration run `pnpm check:theme-bootstrap`. Create isolated source/build copies from that exact candidate with its dependencies, without resetting or editing this checkout or changing persistent environment. Ensure each copy includes intended uncommitted files and no secrets. Record any dependency/browser provisioning blocker; do not silently install tooling.
3. Build separately with `NEXT_PUBLIC_ANIMATIONS_ENABLED=false pnpm build` and `NEXT_PUBLIC_ANIMATIONS_ENABLED=true pnpm build`. Record each `frontend/.next/BUILD_ID`, effective flag, full log and source hash. This root command uses existing token/common/frontend build order; frontend build also builds the standalone game package. It does not authorize homepage game imports.
4. Use the inspected `.lighthouse/lighthouserc.off.json` and `.on.json`. Standard scripts `pnpm lhci:off` and `pnpm lhci:on` rebuild the flags and target port 3000. If that preview is occupied, in the isolated copies use temporary config copies changing only server/URL port and filesystem report destination, then `pnpm exec lhci autorun --config=<absolute-config>`. Retain both exact config files/diff and server logs. Do not treat runtime environment or `FS35_AVAILABLE` as replacement for compiled flags. `playwright.navigation.config.ts` is a retained external fixture, not a checked-in root config.
5. Preserve three runs per variant, desktop preset, observed DevTools method, 150 ms request latency, 9216 Kbps upload/download and 1× CPU. Preserve LCP 5000/CLS 0.1 p75 error assertions and score 0.9 warning. Save raw HTML/JSON reports, manifests and all warning text. Record observed viewport/DPR/profile/cache conditions from reports; compare same conditions after implementation. Do not spend LCP allowance on extra scene startup delay.
6. Capture cold-load network and performance traces/screenshots through intro completion separately from settled idle (proposed 5 s warm-up plus 3×30 s samples). Record exact shared preference, OS reduction, theme, visibility and flag; use System/no OS reduction for the primary comparable On sample. Retain off/Reduced/no-JS static screenshots and native navigation checks as explicit separate conditions. Scene configuration/aperture in this baseline are **not applicable: scene absent**, not invented defaults.
7. Archive route JS inventory/import graph, raw/gzip sizes and deterministic gzip method; distinguish initially required, prefetched and lazy files, HTML/CSS/assets and shared chunks. Preserve browser network evidence that no game runtime loads on `/`. Baseline has no scene callback timing; do not call page RAF work particle cost.
8. Record production geometry/screenshots at 320×568, 390×844, 844×390, 768×1024, 1280×720, 1440×900 plus short screens and 100%/200% text where relevant. Keep Lighthouse's own 1350×940 emulation separate. Retain focused intro/navigation hydration evidence with actual production config/ports; default Chromium does not prove Safari/Firefox or a phone.
9. Deliver a browsable local evidence directory with manifest/hash index, exact commands/configs, candidate/build identity, JSON/HTML summaries, screenshots/traces and inaccessible/missing fields explicitly marked. No upload/deploy is implied. Rerun baseline if executable code changes before scene work. Baseline capture itself does not approve this contract.

### Already selected devices

- Sony **Xperia XQ-CC54, Android 14** is the recorded selection. Dimi supplies actual current OS/browser version, CSS viewport, DPR, refresh conditions, build, actions and observations for new tests. No new physical-phone run occurred here; an emulator is labeled emulation.
- **MacBook Pro with Safari, Chrome and Firefox** is the recorded desktop selection. Exact model/chip/OS/browser versions remain capture fields, not inferred from a report's user agent. No new human acceptance is claimed.

## Validation plan, completion record and Codex handoff

Documentation validation covers source/status reconciliation, all local Markdown targets, formatting, whitespace and full diff scope. No executable example/configuration or runtime changed, so application type/lint/test/build/Storybook/browser checks are not applicable to validating this edit and are not reported as run. FS-4.1B measurements and tests remain separately attributed evidence; they were not rerun for R2.

Later implementation must run relevant types/lint/affected tests, actual adapter tests (not just policy fakes), static/motion/error Storybook states, production flag-on/off browsers and Lighthouse according to risk/plan §9. Preserve tests for intro completion/fail-open, open/focused native fallback, dialog release/focus/navigation, theme failed writes, four motion choices, no-JS, denied preparation, late async completion, repeated mount/route cycles and raster bounds. Do not weaken existing assertions to make new behavior pass.

### Completion record

- **Delivered:** R3 records acceptance of the R2 contract and technical PASS, reconciles the feature plan and closes FS-4.1's specification checkpoint. Lifecycle/configuration/resource rules are unchanged from reviewed R2.
- **Files changed:** `docs/tasks/fs-4.1-scene-contract.md` and `docs/features/funkspace-minimum-usable.md` only. Runtime, tests, package files, generated outputs, synced `sources/` and supplied plan are unchanged.
- **Validation evidence:** R1, R2, FS-4.1B baseline and R2-review packets are retained unchanged under the local evidence root. R3 documentation/source-preservation checks and exact diff/hashes are in `artifacts/fs-4.1-acceptance/`. No application type/lint/test/build/Storybook/browser or production-performance check is claimed as rerun for this documentation edit.
- **Durable review outcome:** R2 technical PASS; F1/F2 closed. Actual-source inspection confirmed compatibility with the existing resolver/composition. All 1,536 reviewed resolver-input combinations passed; this is not scene-controller or browser race coverage. Baseline source equality and evidence hashes were verified. The artifact links are local and are not uploaded by this documentation push; a reviewer on another machine must receive the evidence packet or recapture before relying on its raw measurements.
- **Product decision:** Dimi's exact acceptance is recorded above and statuses D01–D15 are reconciled. Technical PASS, written product acceptance and later visual/performance acceptance remain distinct facts.
- **Remaining:** Dimi supplies the initial and second SVG exports; later authorized tasks implement and verify the scene, controls, asset substitution and budgets. FS-4.2 remains not started. Reference visuals are still unseen, and no physical-phone result is invented.
- **Remote actions:** Dimi explicitly authorized committing and pushing this bounded documentation change to the existing portfolio branch. No PR/merge/deployment is included.

### R1 findings and R2 re-review resolution

R1 SHA-256: `4cb958e8fddfc323f11f6e1680c396ccb916f33fe8beb53ae6c8ab8d101131b7`; historical verdict **CHANGES REQUIRED**. R2 SHA-256 and final **PASS** are recorded in the acceptance section. Original snapshots/deltas remain in the local packets; historical line references must be read against their corresponding revision.

| Finding                                                 | R2 correction                                                                                                         | Resolution                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| F1: visibility/preparation cycle                        | Lightweight observation before Canvas; independent readiness and owned cleanup                                        | Closed by Codex R2 re-review; accepted by Dimi                                                |
| F2: canceled preparation cannot rearm / stale rejection | Return to unprepared, current-attempt/generation guards for both settlement paths, private resolver eligibility probe | Closed by Codex R2 re-review; accepted by Dimi                                                |
| Product decisions                                       | D01–D14 accepted; D15 delivery requirement accepted, assets outstanding                                               | FS-4.1 specification complete; rendered/product-performance acceptance belongs to later tasks |

The re-review's implementation guidance remains applicable: preserve navigation tickets and clear local modal ownership on open failure; test static fallback independently of both masking and external-asset success; avoid a global overlay manager. Measurement aggregation must be explicit before later performance acceptance. These checks do not authorize implementation in this documentation task.
