#!/usr/bin/env bash

set -euo pipefail

payload=""
if [ ! -t 0 ]; then
  payload="$(cat || true)"
fi

combined="$*"
if [ -n "$payload" ]; then
  combined="$combined
$payload"
fi

normalized="$(printf "%s" "$combined" | tr '[:upper:]' '[:lower:]')"

if ! printf "%s" "$normalized" | grep -Eq "build|typecheck|lint|test|turbo|bun run"; then
  exit 0
fi

if printf "%s" "$normalized" | grep -Eq '"exitcode"[[:space:]]*:[[:space:]]*[1-9]|"success"[[:space:]]*:[[:space:]]*false|failed|error'; then
  echo "[agentpacks-hook] Shell command appears to have failed."
  echo "[agentpacks-hook] Fast recovery sequence:"
  echo "[agentpacks-hook] 1) bun run build:types"
  echo "[agentpacks-hook] 2) bun run lint"
  echo "[agentpacks-hook] 3) bun run test"
  echo "[agentpacks-hook] 4) bun run build"
  echo "[agentpacks-hook] After recovery, run /audit-health to verify code organization and observability."
fi

exit 0
