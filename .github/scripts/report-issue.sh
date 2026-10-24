#!/usr/bin/env bash
# Keeps one open GitHub issue per problem type in sync with a check's result.
#
#   report-issue.sh <label> <title> <output-file> <exit-code>
#
# Failure: opens an issue with <label>, or comments on the one already open.
# Success: closes the open issue, if there is one.
set -euo pipefail

label="$1" title="$2" output="$3" code="$4"
run_url="${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"
open=$(gh issue list --label "$label" --state open --json number --jq '.[0].number // empty')

if [ "$code" != "0" ]; then
  body=$(printf '```\n%s\n```\n\nRun: %s' "$(cat "$output")" "$run_url")
  if [ -n "$open" ]; then
    gh issue comment "$open" --body "Still failing:"$'\n\n'"$body"
  else
    gh label create "$label" --color d73a4a --force >/dev/null
    gh issue create --label "$label" --title "$title" --body "$body"
  fi
elif [ -n "$open" ]; then
  gh issue close "$open" --comment "Checks pass again: $run_url"
fi
