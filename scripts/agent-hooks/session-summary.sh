#!/usr/bin/env bash

set -euo pipefail

event="${1:-stop}"

if [ "$event" = "start" ]; then
  echo "[agentpacks-hook] Session checks enabled: ui actions/mobile, mode governance, contracts impact, code health, observability."
  exit 0
fi

echo "[agentpacks-hook] Session wrap-up reminder:"
echo "[agentpacks-hook] - UI work: confirm list actions and mobile responsiveness."
echo "[agentpacks-hook] - Mode work: run /mode-check when mode or autopilot files changed."
echo "[agentpacks-hook] - Contracts work: run /impact and keep docblocks in sync."
echo "[agentpacks-hook] - Code health: run /audit-health if files were added or refactored."
echo "[agentpacks-hook] - Observability: run /audit-observability if services or handlers were modified."
echo "[agentpacks-hook] - Session retro: run /audit-session to detect governance gaps in agentpacks."
echo "[agentpacks-hook] - Plan ready? run /review-plan before switching to build mode."

exit 0
