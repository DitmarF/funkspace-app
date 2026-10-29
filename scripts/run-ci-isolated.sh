#!/usr/bin/env bash
# Run one CI command with no inherited credentials or external network. Linux
# network namespaces also constrain native browsers, not just Node transports.
set -euo pipefail

if [ "$(uname -s)" != Linux ] || [ "$#" -eq 0 ]; then
  echo "Usage: Linux CI runner with passwordless sudo: run-ci-isolated.sh command [args...]" >&2
  exit 2
fi

task_workspace="$(pwd -P)"
task_label="${FS_CI_LABEL:-check}"
task_animations="${FS_CI_ANIMATIONS:-false}"
task_suite="${FS_CI_SUITE:-none}"
task_origin="${FS_CI_ORIGIN:-http://localhost:3000}"
task_evidence="${FS_CI_EVIDENCE_DIR:-${RUNNER_TEMP:-/tmp}/funkspace-ci-evidence}"
case "$task_label" in *[!a-zA-Z0-9_-]*|'') echo "Invalid CI label" >&2; exit 2;; esac
case "$task_animations" in true|false) ;; *) echo "Invalid animation flag" >&2; exit 2;; esac
case "$task_suite" in none|production|theme|storybook|demo) ;; *) echo "Invalid CI suite" >&2; exit 2;; esac
case "$task_origin" in http://localhost:3000|http://localhost:3100|http://localhost:5173|http://127.0.0.1:3000|http://127.0.0.1:3100|http://127.0.0.1:33054|http://127.0.0.1:33155|http://127.0.0.1:6006|http://127.0.0.1:5173) ;; *) echo "Invalid local origin" >&2; exit 2;; esac
if [ ! -f "$task_workspace/scripts/ci-deny-egress.cjs" ]; then
  echo "CI egress preloader is missing" >&2
  exit 2
fi

# Refuse every source .env* file. Dependencies and Git metadata are installed
# separately and never provide application configuration.
if find "$task_workspace" \( -name .git -o -name node_modules -o -name .next -o -name .next-dev -o -name storybook-static \) -prune -o -name '.env*' -print -quit | grep -q .; then
  echo "CI candidate contains an environment file" >&2
  exit 2
fi

task_output="$task_evidence/$task_label"
mkdir -p "$task_output"
task_tmp="$(mktemp -d "${RUNNER_TEMP:-/tmp}/funkspace-ci-${task_label}.XXXXXX")"
task_uid="$(id -u)"
task_gid="$(id -g)"
task_path="$PATH"
task_ip="/usr/sbin/ip"
task_guard="$task_workspace/scripts/ci-deny-egress.cjs"
task_log="$task_output/denied-egress.jsonl"
task_selftest_log="$task_output/guard-selftest.jsonl"
if [ -e "$task_log" ] || [ -e "$task_selftest_log" ]; then
  echo "CI label has already been used; refusing to overwrite evidence" >&2
  exit 2
fi
for task_binary in /usr/bin/sudo /usr/bin/unshare /usr/bin/setpriv /usr/bin/env "$task_ip"; do
  if [ ! -x "$task_binary" ]; then
    echo "Required system program unavailable: $task_binary" >&2
    exit 2
  fi
done

# Only namespace/loopback setup runs as root. The application command runs
# under the original runner UID/GID with supplementary groups cleared.
set +e
/usr/bin/sudo -n /usr/bin/unshare --net --fork -- /bin/bash -euc '
  workspace=$1 uid=$2 gid=$3 runtime_path=$4 ip=$5 output=$6 scratch=$7 guard=$8 log=$9
  shift 9
  selftest_log=$1 animations=$2 origin=$3 suite=$4
  shift 4
  "$ip" link set lo up
  if [ -n "$("$ip" -4 route show default)" ] || [ -n "$("$ip" -6 route show default)" ]; then
    echo "Network namespace unexpectedly has an external default route" >&2
    exit 1
  fi
  cd "$workspace"
  exec /usr/bin/setpriv --reuid="$uid" --regid="$gid" --clear-groups /usr/bin/env -i \
    PATH="$runtime_path" TMPDIR="$scratch" CI=true \
    NEXT_TELEMETRY_DISABLED=1 STORYBOOK_DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 \
    CONTACT_ENABLED=false RESEND_API_KEY= CONTACT_FROM= CONTACT_TO= \
    CONTACT_ALLOWED_ORIGINS="[\"$origin\"]" \
    CONTACT_E2E_WORKSPACE="$workspace" CONTACT_STORYBOOK_DIR="$workspace/frontend/storybook-static" \
    CONTACT_EGRESS_PRELOADER="$guard" \
    FS_CI_WORKSPACE="$workspace" \
    FS_CI_PHASE_OUTPUT="$output" \
    NEXT_PUBLIC_ANIMATIONS_ENABLED="$animations" FS35_AVAILABLE="$animations" FS_CI_SUITE="$suite" \
    PLAYWRIGHT_BROWSERS_PATH=0 \
    npm_config_userconfig="$scratch/no-user-npmrc" npm_config_globalconfig="$scratch/no-global-npmrc" \
    XDG_CONFIG_HOME="$scratch/config" \
    FS_CI_EGRESS_GUARD="$guard" FS_CI_EGRESS_LOG="$selftest_log" FS_CI_RUN_LOG="$log" \
    /bin/bash -euc '\''
      export NODE_OPTIONS="--require=$FS_CI_EGRESS_GUARD"
      node scripts/ci-egress-selftest.cjs
      node scripts/ci-loopback-selftest.cjs
      export FS_CI_EGRESS_LOG="$FS_CI_RUN_LOG"
      exec "$@"
    '\'' ci-command "$@"
' ci-namespace "$task_workspace" "$task_uid" "$task_gid" "$task_path" "$task_ip" "$task_output" "$task_tmp" "$task_guard" "$task_log" "$task_selftest_log" "$task_animations" "$task_origin" "$task_suite" "$@" 2>&1 | tee "$task_output/command.log"
task_result=${PIPESTATUS[0]}
set -e

# Coverage, Playwright and Lighthouse output locations are directed into this
# phase's evidence directory. Copy only known contact result paths and LHCI's
# raw assertions from this invocation's scratch; never copy workspace outputs.
case "$task_label" in
  contact-routes)
    for task_item in funkspace-fs-5.4-e2e-results funkspace-fs-5.4-e2e.json; do
      if [ -e "$task_tmp/$task_item" ]; then cp -R "$task_tmp/$task_item" "$task_output/$task_item"; fi
    done
    ;;
  contact-fixtures)
    for task_item in funkspace-fs54-manual-e2e-results funkspace-fs54-manual-e2e.json; do
      if [ -e "$task_tmp/$task_item" ]; then cp -R "$task_tmp/$task_item" "$task_output/$task_item"; fi
    done
    ;;
  lighthouse-off|lighthouse-on)
    if [ -d "$task_tmp/.lighthouseci" ]; then
      cp -R "$task_tmp/.lighthouseci" "$task_output/lighthouse-raw"
    fi
    ;;
esac
# This path was allocated uniquely by this invocation's mktemp call and is
# outside the workspace. Never remove existing workspace outputs.
case "$task_tmp" in
  "${RUNNER_TEMP:-/tmp}/funkspace-ci-${task_label}."*) rm -rf -- "$task_tmp" ;;
  *) echo "Refusing to remove an unexpected scratch path" >&2; exit 1 ;;
esac
if [ -s "$task_log" ]; then
  echo "Unexpected Node transport was blocked; inspect $task_log" >&2
  exit 1
fi
exit "$task_result"
