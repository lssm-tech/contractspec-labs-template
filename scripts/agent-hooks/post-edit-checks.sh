#!/usr/bin/env bash

set -euo pipefail

project_root="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
if ! cd "$project_root" >/dev/null 2>&1; then
  exit 0
fi

tracked_changes="$(git diff --name-only HEAD 2>/dev/null || true)"
untracked_changes="$(git ls-files --others --exclude-standard 2>/dev/null || true)"

changed_files="$tracked_changes"
if [ -n "$untracked_changes" ]; then
  if [ -n "$changed_files" ]; then
    changed_files="$changed_files
$untracked_changes"
  else
    changed_files="$untracked_changes"
  fi
fi

if [ -z "$changed_files" ]; then
  exit 0
fi

ui_changed=false
mode_changed=false
contracts_changed=false
size_warnings=""
console_warnings=""
layer_warnings=""

while IFS= read -r file_path; do
  [ -z "$file_path" ] && continue

  # --- Existing checks: UI / Mode / Contracts ---

  case "$file_path" in
    packages/apps/web-application/src/app/\(app\)/*|packages/apps/web-marketing/*|packages/bundles/*/src/presentation/*)
      ui_changed=true
      ;;
  esac

  case "$file_path" in
    packages/apps/web-application/src/app/api/mode/*|packages/bundles/example-product/src/modules/mode/*|packages/bundles/example-product/src/modules/autopilot/*|packages/libs/contracts-contractspec-studio/src/mode/*)
      mode_changed=true
      ;;
  esac

  case "$file_path" in
    packages/libs/contracts-contractspec-studio/*)
      contracts_changed=true
      ;;
  esac

  # --- File size check ---

  case "$file_path" in
    *.ts|*.tsx)
      if [ -f "$file_path" ]; then
        line_count=$(wc -l < "$file_path" 2>/dev/null | tr -d ' ')
        if [ "$line_count" -ge 250 ]; then
          size_warnings="${size_warnings}  VIOLATION  ${file_path} (${line_count} lines, limit 250)\n"
        elif [ "$line_count" -ge 200 ]; then
          size_warnings="${size_warnings}  WARNING    ${file_path} (${line_count} lines, approaching 250 limit)\n"
        fi
      fi
      ;;
  esac

  # --- console.log in production code ---

  case "$file_path" in
    *.test.ts|*.test.tsx|*.spec.ts|*.spec.tsx|*.sh|scripts/*|*.config.*|*.mjs)
      # Skip test files, scripts, and config files
      ;;
    *.ts|*.tsx)
      if [ -f "$file_path" ]; then
        if grep -nE 'console\.(log|warn|error|info|debug)\(' "$file_path" >/dev/null 2>&1; then
          matches=$(grep -nE 'console\.(log|warn|error|info|debug)\(' "$file_path" 2>/dev/null | head -3)
          console_warnings="${console_warnings}  ${file_path}:\n${matches}\n"
        fi
      fi
      ;;
  esac

  # --- Business logic in apps layer ---

  case "$file_path" in
    packages/apps/*/src/*.ts|packages/apps/*/src/*.tsx)
      if [ -f "$file_path" ]; then
        if grep -qE '(export class .+Service|export class .+Repository|export class .+UseCase|export async function (create|update|delete|process|handle|compute|calculate|validate)[A-Z])' "$file_path" 2>/dev/null; then
          layer_warnings="${layer_warnings}  ${file_path} -- business logic detected; consider moving to packages/bundles/\n"
        fi
      fi
      ;;
  esac

done <<< "$changed_files"

# --- Output results ---

if [ "$ui_changed" = true ]; then
  echo "[agentpacks-hook] UI surface changed."
  echo "[agentpacks-hook] Verify list-level quick actions: search/filter/refresh/create/import."
  echo "[agentpacks-hook] Verify explicit item actions: view plus edit/delete/retry/sync where relevant."
  echo "[agentpacks-hook] Verify mobile behavior around 375px and keyboard-reachable controls."
fi

if [ "$mode_changed" = true ]; then
  echo "[agentpacks-hook] Mode or autopilot surface changed."
  echo "[agentpacks-hook] Run /mode-check and confirm assertCapability plus recordAudit coverage."
fi

if [ "$contracts_changed" = true ]; then
  echo "[agentpacks-hook] Contracts surface changed."
  echo "[agentpacks-hook] Run /impact and /contracts to confirm drift and downstream impact."
  echo "[agentpacks-hook] Run 'bun scripts/check-drift.ts --changed-only' to detect contract drift in changed files."
fi

if [ -n "$size_warnings" ]; then
  echo "[agentpacks-hook] File size issues detected:"
  printf "$size_warnings"
  echo "[agentpacks-hook] See code-splitting.md: components 150, services 200, any file 250 max."
  echo "[agentpacks-hook] Run /refactor to split oversized files."
fi

if [ -n "$console_warnings" ]; then
  echo "[agentpacks-hook] console.* usage detected in production code:"
  printf "$console_warnings"
  echo "[agentpacks-hook] Use the shared logger utility instead. See observability.md."
fi

if [ -n "$layer_warnings" ]; then
  echo "[agentpacks-hook] Business logic detected in apps layer:"
  printf "$layer_warnings"
  echo "[agentpacks-hook] Apps should be thin adapters. Move logic to bundles/libs."
  echo "[agentpacks-hook] See package-architecture.md for placement rules."
fi

exit 0
