# Task FS-2.4 — Contact/footer and legal-page structure

## Task metadata

- **Status:** Complete — Dimi explicitly accepted the bounded Contact/footer and draft legal structure on 2026-09-20. Required legal facts and final wording remain publication blockers.
- **Owner:** Sites implementation; Dimi content/acceptance; Codex technical facts and integrated FS-2.6 review.
- **Last updated:** 2026-09-20
- **Related documentation:** [Feature scope](../features/funkspace-minimum-usable.md#fs-24--build-contactfooter-and-legal-page-structure), [workflow](../development/ai-workflow.md), [FS-2.1](fs-2.1-page-structure-and-navigation.md), [FS-0.5](fs-0.5-product-and-technical-decisions.md).

## Requested outcome and acceptance

Provide an honest no-JavaScript email fallback, compact shared footer and readable Impressum/Privacy structure. Use supplied facts and Codex's technical evidence; no invented legal content or simulated form journey.

- [x] Contact has `id="contact"`, H2, readable approved email and genuine mailto link.
- [x] Secondary pages retain a compact footer with native `/#contact`, `/impressum` and `/privacy`, without duplicating the homepage Contact section.
- [x] Legal routes load directly with headings, supplied material and explicit incomplete-content notices.
- [x] No fake Send/success, inactive fields, reserved empty viewport, API, provider adapter, tracking or speculative consent controls.
- [x] Email URI/text, direct loads/refresh, cross-page navigation, reflow and fresh no-JavaScript use have passing evidence.
- [ ] Dimi supplies and approves missing operator/privacy facts and final legal wording. **Deferred from bounded task closure; still a release blocker. Authorized readable drafts pass route usability but do not satisfy legal completeness. Dimi explicitly accepted the bounded EPIC 2 static checkpoint after integrated review; see [closure and P3 clarification](fs-2.6-semantics-metadata-and-static-routes.md#integrated-codex-review-and-dimi-completion--2026-09-20).**

## Context and repository evidence

- **Authorized checkout/base:** `/Users/dimi/Projects/funkspace-app`, `feature/funkspace-minimum-usable`, `6203e89607b9b58a0592502ed1b35ffb4f853dca`. Clean starting tree; no protected local changes.
- **Inspected:** current root AGENTS/no nested guidance, workflow/template, feature plan and supplied detailed EPIC 2 plan, FS-0.5/FS-1.7/FS-2.1 accepted foundations, FS-2.3, package scripts, root/providers/bootstrap, Contact placeholder, shell/navigation/footer, ButtonLink API, section framing, About/Privacy and affected tests.
- **Reused:** PortfolioShell, PortfolioSection, accepted ButtonLink, typography/tokens and the seven-destination source. No existing Contact/footer component was available beyond inline shell/home markup.
- **Attributable technical fact sheet:** [Codex, 2026-09-20, exact base 6203e89](/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.4-technical-facts/fact-sheet.md). It distinguishes source behavior, dated FS-0.3 deployment observations and **no currently verified deployed configuration**. The 51 focused preparation tests are Codex's preceding evidence, not a fresh implementation check.
- **Material reconciliation:** older task notes assigned Impressum to FS-2.5; current authoritative scope assigns legal structure to FS-2.4, while FS-2.5 is responsive shell work. The old font plan's no-storage assumptions are stale: bootstrap writes `localStorage["theme"]="system"` for missing/invalid preferences before interaction; runtime selections update that key. No storage policy is changed here.

### Supplied content and decisions

| Input                     | Status/provenance                                                        | Implementation consequence                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `diamondfunk13@gmail.com` | Approved current public email, supplied by Dimi in technical preparation | Shared contact value; visible native `mailto:diamondfunk13@gmail.com`. Not a backend sender/provider decision or verified delivery |
| Contact invitation        | Dimi: “Use only the Contact heading and email for now”                   | No invitation paragraph, fabricated availability or response-time promise                                                          |
| Operator/legal material   | Dimi: “use placeholders for now”                                         | Explicit missing-fact notices, no example identity/address or legal boilerplate; does not approve legal completeness               |
| Storage/font facts        | Code-inspected by Codex; wording is development draft                    | Preserve self-hosted-font fact, describe actual theme storage, replace overbroad cookie/request claims; no host/retention promise  |

## Scope and protected areas

In scope: Contact, legal page structure/content drafts, footer links, shared email/links, tests, story and task evidence. Dimi separately authorized documentation closure, commit and push on 2026-09-20. Out of scope: real form, API, mail provider, delivery testing, final legal advice/content, motion policy and deployment.

Preserve root layout, ThemeService/providers/bootstrap, control/logo APIs/geometry, Start/About behavior, tokens/fonts, destination labels/hrefs, public game boundary and universal-shell isolation. New page/section code stays server-renderable. Existing navigation overlay remains the only interactive boundary affected by the additional legal link.

## Planned paths and sequence

1. New `frontend/data/contactContent.ts` for the supplied address/href and `sections/Contact.tsx` for content-driven section framing. No additional service or form-slot API.
2. Extend existing PortfolioShell/Navigation with shared `PortfolioLegalLinks` list items for two real consumers. Footer contains compact navigation, not contact content duplication.
3. Add `/impressum` and update `/privacy` with the existing shell/typography, H1/H2 structure and real email. No guessed operator/provider facts or hidden content.
4. Add Contact story/SSR check and `e2e/contact-legal.spec.ts`; update shell/route/About regressions and reconcile documentation.

**Future form location:** inside Contact's existing content column after the email link. It will grow in ordinary document flow. No rendered placeholder, fixed height, empty slot component or inactive controls are added now. Implementation awaits the separate FS-5.1 contract and EPIC 5 work.

## Gap/approval register

| Gap                                                                                                            | Owner                                                               | Latest needed / effect                                                                                                      |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Actual operator legal name, postal address and other applicable supplied legal material                        | Dimi supplies/verifies; Sites incorporates                          | Final legal acceptance before publication; bounded EPIC 2 checkpoint accepted in FS-2.6                                     |
| Current deployed host/configuration, logging categories, access/recipients, processing locations and retention | Dimi supplies approved evidence; Codex verifies; Sites incorporates | Current FS-2.4 privacy baseline before publication, rechecked at FS-5.5/rollout; dated Vercel records are not current proof |
| Existing mailbox correspondence purpose/access/processing and retention/deletion facts                         | Dimi                                                                | FS-2.4 public email/privacy acceptance; address is known, account operation/delivery is not verified                        |
| Final legal wording                                                                                            | Dimi; Sites prepares supplied content                               | Before legal acceptance and publication; bounded structure accepted below, legal completeness remains unapproved            |
| Future provider/account, sender/recipient, transport, fields and limits                                        | Dimi decisions; Codex contract; Sites consumer                      | FS-5.1/5.2 before real adapter; no provider selected here                                                                   |
| Actual future form flow, abuse controls, provider processing, logging, retention and operating guide           | Codex facts; Dimi approves; Sites publishes approved wording        | FS-5.3 and FS-5.5 finalization; separate from current operator/hosting/mailbox gaps                                         |
| Live acceptance and inbox receipt                                                                              | Dimi separately authorizes and confirms; Codex records              | FS-5.6; routine tests do not open mail handlers or send messages                                                            |

## Validation plan

Bootstrap freshness before any generation; tokens → common types → workspace game build → frontend types. Focused/full unit regressions, lint, production and Storybook builds, production route/browser checks and local Lighthouse budgets. Browser tests verify the exact supplied text/URI and pointer/keyboard reachability without activating `mailto:`; no delivery claim follows from those checks. Check 320px short screens, landscape/wide layouts, enlarged text, themes, static HTML and fresh JavaScript-disabled contexts. Review protected/generated file diffs and source boundaries before handoff.

## Completion record

Contact/footer and development legal structure are implemented and complete by Dimi's explicit decision below. Required legal/operator facts and their approval remain missing. Task closure does not approve public release or legal completeness. The later FS-2.6 completion decision accepts the bounded EPIC 2 static checkpoint with these named release blockers.

### Actual validation

| Check                                                                                                                                         | Outcome                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:theme-bootstrap` before generation                                                                                                | PASS; tracked bootstrap fresh                                                                                                                                                                                                                                       |
| `pnpm build:tokens` → `pnpm -F @funkspace/common typecheck` → `pnpm -F @funkspace/wave-survivor build` → `pnpm -F frontend exec tsc --noEmit` | PASS in prerequisite order; final frontend types repeated successfully                                                                                                                                                                                              |
| `pnpm test`                                                                                                                                   | PASS, 96 files / 1,371 tests, including exact email SSR contract, four-route shell/native links and existing logo/theme regressions                                                                                                                                 |
| `pnpm lint`                                                                                                                                   | PASS; zero ESLint warnings/errors and repository formatting clean. Existing Next lint deprecation notice remains                                                                                                                                                    |
| `pnpm build`                                                                                                                                  | PASS; legal routes prerendered, no static-export/deployment change                                                                                                                                                                                                  |
| `pnpm storybook:build`                                                                                                                        | PASS; Contact email story included. Existing Vite client-directive/sourcemap and large-chunk warnings remain                                                                                                                                                        |
| `pnpm e2e --output <artifact-root>/browser --reporter=line` against production                                                                | PASS, 54/54 Chromium checks without retries; includes 9 new Contact/legal cases plus existing About, routing, logo, settings, theme, accessibility and first-load cookie/request checks                                                                             |
| Email/reflow                                                                                                                                  | Exact `diamondfunk13@gmail.com` text and `mailto:` URI, native keyboard focus and pointer trial checks; no email link activated. Contact/legal content at 320×360, 844×390 and 1440×900 with 200% text, JS on/off; no horizontal overflow or nested/clipped content |
| Routes/no-JS                                                                                                                                  | All four portfolio documents have unique IDs, one shell/H1 and working skip links; legal initial HTML contains email; direct load/refresh, legal footer links, secondary-page `/#contact`, Back and no console/page errors checked                                  |
| Themes/visuals                                                                                                                                | Unfiltered Axe on both legal routes in four themes PASS; five normal-size screenshots plus browser enlarged-text captures. Agent inspected mobile Contact/Impressum and desktop dark Privacy; no Dimi device/visual result is inferred                              |
| Boundaries/self-review                                                                                                                        | 57 local source modules from root/Home/About/Privacy/Impressum, no game host/runtime imports or new client boundary. Root/providers/bootstrap, logo/control APIs, tokens/fonts, package files and generated tracked outputs unchanged                               |
| `pnpm exec lhci autorun --config=<artifact-root>/lighthouse.json`                                                                             | PASS; 3 local runs each on Home, Impressum and Privacy. Performance 100 in all 9; LCP 643.6–684.6 ms; maximum CLS 0.004971. Existing LCP ≤2500 ms / CLS ≤0.1 budgets retained; filesystem reports only, no upload                                                   |

The email `href` and actionability checks are not delivery evidence. Current legal-page notices disclose incompleteness; no names, postal addresses, host/mail-provider processing, retention periods or legal bases were filled in. The earlier broad cookie/third-party sentence was replaced because it omitted theme storage and exceeded verified deployment evidence; the supported self-hosted-font fact is retained.

### Candidate and handoff

- **Exact base:** `6203e89607b9b58a0592502ed1b35ffb4f853dca`; the validated pre-closure candidate is preserved in the task patch. The Git commit containing this completion record is the final candidate on the authorized branch. Commit/push are now explicitly authorized; deployment is not.
- **Artifact root:** `/Users/dimi/.codex/.chatgpt-projects/g-p-6a8710cd7ee88191854df38f76499083/artifacts/fs-2.4`. `candidate.patch` includes modifications and new files; `manifest.json` records SHA-256 values and patch replay verification. `handoff.md` includes final results, technical fact-sheet attribution and acceptance limits. Other sessions must receive that artifact or exact diff; synchronization is not assumed.
- **Contract changes:** Approved route labels/hrefs unchanged. `/#contact` now contains the actual supplied email; `/impressum` is reachable with email and authorized missing-operator notices; `/privacy` contains verified storage/font facts and explicit missing-privacy notices. Compact footer exposes Contact/Impressum/Privacy everywhere; overlay shares the same legal links. No backend contract exists or changes.
- **Technical verdict:** Bounded implementation checks pass and Dimi has accepted task completion. The subsequent integrated FS-2.6 review passed, followed by explicit EPIC 2 closure. Required routes are usable with authorized drafts; legal-content acceptance and publication remain blocked. Remaining input/owners/deadlines are the gap register above; provider-specific FS-5.5 work does not replace current legal fact requirements.
- **Precise acceptance still needed from Dimi:** supply and approve actual operator, hosting and mailbox-processing facts and final legal wording before publication. Bounded structure acceptance is recorded below separately from approval of complete legal content. No independent Codex site-gate review, legal certification or FS-G1 acceptance is claimed.

## Dimi completion and commit/push authorization — 2026-09-20

Dimi's actual instruction: “FS-2.43 is done, update the documentation then commit and push the changes.” The reference is interpreted as FS-2.4, the current Contact/footer and legal-structure task; no separate FS-2.43 task is created.

This explicitly closes the bounded implementation with the supplied email and authorized legal placeholders, and authorizes documentation updates, commit and push. It does not supply missing legal facts, approve final legal wording, certify legal completeness, authorize deployment or close FS-2.6/FS-G1. No named manual/device test or independent review is inferred from the completion instruction.

Before closure, all 17 candidate file hashes matched the validated manifest at the recorded base. Only this task record and the feature plan were changed for closure; implementation/test files retain their validated content. The pre-closure patch and manifest remain immutable evidence. Documentation formatting, local link targets, diff checks and final candidate consistency are checked before commit; the final commit, remote verification and outcomes are recorded in `artifacts/fs-2.4/closure.md` under the accessible artifact root above.
