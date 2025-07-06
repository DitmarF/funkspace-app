#!/usr/bin/env bash
set -euo pipefail

OWNER="DitmarF"                       # change if you fork
REPO="funkspace-app"
JSON_FILE=".github/branch-protection.json"

gh api \
  --method PUT \
  "/repos/${OWNER}/${REPO}/branches/main/protection" \
  --header "Accept: application/vnd.github+json" \
  --input "${JSON_FILE}"

echo "Branch protection applied to ${OWNER}/${REPO}:main"
