# Portfolio release and recovery — FS-6.4

This is the portfolio release checklist, not authorization to publish. Contact configuration, abuse protection, email operations and immutable-target retirement remain governed by [contact operations](contact-operations.md), [contact server](contact-server.md) and [contact acceptance](contact-acceptance.md). Current source, observations and decision packet are in the [FS-6.4 release record](../tasks/fs-6.4-release-preparation.md).

## Reproducible build and target

On 29 October 2026 the Vercel UI for `DitmarF/funkspace-app` project `DitmarF's projects / funkspace-app-frontend` showed Next.js, root directory `frontend`, files outside root enabled, install override `pnpm install --frozen-lockfile`, build override `pnpm --workspace-root build`, output override disabled and Node `22.x`. The inspected source pins pnpm `10.30.3`; `.nvmrc` specifies Node `22.22.0`. The root build generates tokens, checks common and builds the frontend/game chain. Vercel's major-version selector does not prove its exact patch version; capture actual hosted output. Recheck settings before a release.

The intended canonical target approved by Dimi is `https://funkspace.de/`. The domain UI showed the apex and `funkspace-app-frontend.vercel.app` attached to Production with valid configurations. A browser visit to `https://www.funkspace.de/` ended at the apex, but this observation does not identify the redirect rule/status or prove all aliases. At inspection the apex served the older Production deployment, not the new candidate. Inventory all aliases, immutable deployments, certificate and direct unauthenticated access before publication.

Vercel reports pushes to `main` update Production; Git integration also creates deployments for pushed commits. Preview and Production consequences must be reviewed before Git delivery. Project authentication was enabled with `(Legacy) Standard Protection`; that setting alone does not prove all deployment aliases, bypass routes or protection behavior. CI and GitHub protection evidence is in the release record.

The isolated particle-fixture job starts a development server because production
blocks diagnostic routes. Its server-only preload returns an offline 503 for
Next's exact development version lookup, allowing Next's unknown-version
fallback without network access. Other requests still pass through the egress
guard, and the network namespace remains active. Regression checks verify the
real Next caller and rejection of other callers; changes to Next's internal
caller or URL fail the check rather than opening network access.

## Preparation and recovery gates

1. Verify the exact final feature head, current main and merge-result tree, changes since review and successful hosted PR CI plus retained evidence. CI is a mandatory human release gate even if GitHub rules do not enforce it. Refresh dependency audits and record version-reported warnings, applicable mitigations and provider limits.
2. Before any push that triggers a Preview, privately verify its delivery-off configuration and protection for the concrete new immutable URL and aliases. Do not expose secret values. Before any Production merge, establish the delivery-off Production configuration and target/build identity; a merge may publish immediately. If settings must change, present their exact scope for separate authorization.
3. Dimi directed that diagnostic and typography routes be restricted; the current local correction is recorded in the release record. Verify the restriction on the final authorized deployment, including aliases and normalized paths. Complete the existing legal/operator and device-storage assessments; verify current provider settings/quotas, tracking, retention and mailbox workflow against the Privacy copy. Confirm final copy and canonical/redirect handling. No legal exemption or account configuration is inferred from historical acceptance.
4. Local fallback: the separately compiled animation-OFF, mail-disabled candidate passed static and contact-off checks. A fresh 14-case focused rehearsal on the source-equivalent candidate passed on 29 October under an isolated, credential-free, transport-denied setup. This is local evidence, not a provider rollback.
5. The historical delivery-off protected Preview `BJwbeuR6NUejxG3GDpq3QQHj337q`, immutable URL `https://funkspace-app-frontend-h9uharydb-ditmarfs-projects.vercel.app/`, source `36407f6a790a8d9787bdc3123041e24e181bdfee`, was previously verified disabled and is shown **Ready** in Vercel on 29 October. Its current effective settings, alias/protection and suitability for Production recovery have not been reverified. It is a named recovery candidate, not an authorized or rehearsed provider rollback. Retention and access need confirmation.
6. Vercel currently identifies Production deployment `7M81shJMQrQgUco9FsGAKmLcJNZt`, immutable host `funkspace-app-frontend-ge9ui8dnb-ditmarfs-projects.vercel.app`, source main `31abe42d97563775272d8a99e5021f3b39bc86ab`, as Ready. Restoring it could restore the earlier site, not the accepted finished portfolio. Its exact recovery method, access, duration and suitability need verification. Do not execute promotion/alias changes without explicit authorization.
7. For serious scene, navigation, contact or security failure, first preserve evidence and prevent delivery. Apply the separately authorized recovery procedure: use a verified off/static artifact, deploy/promote or move the specific alias only as approved, then verify public routes, static artwork, focus, contact-off behavior and retained restrictions. Record actual time and impairment. Do not claim provider recovery steps or recovery duration as tested.
8. Disabling delivery in a new deployment does not disable previously enabled immutable deployments. Identify and individually restrict/retire each such target under the approved [contact operations](contact-operations.md); preserve retry identity and never automatically resend uncertain messages.

Production mail, an authorized controlled live message, mailbox receipt and presentation-device acceptance remain FS-6.5 checks. TOOL-05 is Dimi's accepted Codex follow-up by 2 November. No step here grants commit, push, PR, merge, deployment, settings, DNS or live-mail authorization.
