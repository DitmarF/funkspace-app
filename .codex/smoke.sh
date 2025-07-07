set -euo pipefail
export NEXT_TELEMETRY_DISABLED=1          # silence analytics prompts

# 0. Add a proper pnpm-workspace file (fixes warning)
cat > pnpm-workspace.yaml <<'YAML'
packages:
  - "frontend"
  - "backend"
  - "common"
YAML

pnpm install --recursive --frozen-lockfile   # installs root + workspaces

# 1. Dev compile (Turbopack, 15 s budget)
(timeout 15 pnpm -F frontend dev -p 4000 > /tmp/dev.log 2>&1 || true)
grep -q "Ready in" /tmp/dev.log              # new success token

# 2. Prod build — skip font optimisation to work offline
echo "module.exports = { optimizeFonts: false };" > frontend/next.config.js
pnpm -F frontend build | tee /tmp/build.log
grep -q "Compiled successfully" /tmp/build.log

# 3. Prod boot (10 s budget)
(timeout 10 pnpm -F frontend start -p 4001 > /tmp/start.log 2>&1 || true)
grep -q "Ready in" /tmp/start.log   # confirm server started

# 4. Lint
pnpm -F frontend lint

echo "✅ Next.js smoke-tests passed"
