# basic-ftp security backport

`basic-ftp@5.3.1.patch` backports the directory-listing parser fix from
[upstream commit d0d9e07c56e519587bb50532ac6eadbb0cb0cfe9](https://github.com/patrickjuchli/basic-ftp/commit/d0d9e07c56e519587bb50532ac6eadbb0cb0cfe9),
released in basic-ftp 6.2.1 for [GHSA-c475-qrg2-pj4r](https://github.com/advisories/GHSA-c475-qrg2-pj4r).
The upstream library is MIT licensed; the dependency retains its original license.

The patch changes only the compiled Unix and DOS listing regular expressions.
It anchors both expressions and bounds Unix owner/group word repetitions,
preserving the existing capture-group indices and public API. Following the
upstream fix, a Unix owner or group may have at most eight words, and unexpected
non-numeric text before an entry no longer matches. This is an intentional parser
compatibility boundary; the project uses basic-ftp through the two `get-uri`
tooling paths, not the portfolio contact service.

Run `node scripts/test-basic-ftp-security.mjs` after a frozen installation. The
script exercises both installed `get-uri` owners with a fake FTP client, checks
ordinary Unix/DOS listings and runs the upstream-style malicious inputs in child
processes with a deadline. It makes no network request. Run normal tooling and
Lighthouse checks separately as appropriate for dependency changes.

Registry audit identifies the package by its unchanged version and will continue
to report the advisory against 5.3.1. Do not suppress or describe that report as
cleared; record the applied patch, its hash, tests and review. Revisit the backport
when the owning packages publish a compatible dependency update.
