#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

# ❶ guarantee a vercel.json with the correct rootDirectory
jq -n '{rootDirectory:"frontend"}' > vercel.json

# Step 1: Set Vercel project root to frontend (if vercel CLI available)
if command -v vercel >/dev/null; then
  vercel project link --yes --cwd frontend || true
fi

# Step 2: Remove distDir and output from Next.js config if present
for config in frontend/next.config.js frontend/next.config.ts; do
  if [ -f "$config" ]; then
    sed -i '/distDir/d;/output/d' "$config"
  fi
done

# Step 2b: Remove other overrides from vercel.json while keeping rootDirectory
if [ -f vercel.json ]; then
  tmp=$(mktemp)
  jq 'del(.buildCommand, .outputDirectory)' vercel.json > "$tmp" && mv "$tmp" vercel.json
fi

# Step 3: Ensure Turborepo caches .next correctly
if [ -f turbo.json ]; then
  tmp=$(mktemp)
  jq '.pipeline.build.outputs |= (. // []) + [".next/**", "!**/.next/cache/**"] | unique' turbo.json > "$tmp" && mv "$tmp" turbo.json
fi

# ❷ after "next build" make sure the manifest exists (local safeguard)
pnpm -F frontend build
test -f frontend/.next/routes-manifest.json \
  || { echo "routes-manifest missing – aborting"; exit 1; }
