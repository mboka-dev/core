#!/usr/bin/env bash
# Creates GitHub issues from docs/issues/*.md (front matter: title, labels, milestone).
#
# First run, on a fresh repository (data/ and fixtures/ refer to issues #1, #2, #8, #9, #10):
#   scripts/create-issues.sh mboka-dev/core
# Later, to add new issue files to a repository that already has issues and PRs:
#   scripts/create-issues.sh mboka-dev/core --append docs/issues/13-*.md docs/issues/14-*.md
#
# Requires the GitHub CLI (gh), authenticated, and labels created (scripts/create-labels.sh).
set -euo pipefail
REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
shift || true

if [ "${1:-}" = "--append" ]; then
  shift
  [ "$#" -gt 0 ] || { echo "✗ --append needs the issue files to create" >&2; exit 1; }
  files=("$@")
else
  # Issues and pull requests share one numbering: both must be absent.
  existing=$(gh api "repos/$REPO/issues?state=all&per_page=1" --jq 'length')
  if [ "$existing" != "0" ]; then
    echo "✗ $REPO already has issues or pull requests: numbering would not match the references in data/ and fixtures/." >&2
    echo "  To add new issues, use: $0 $REPO --append <files>" >&2
    exit 1
  fi
  files=(docs/issues/[0-9]*.md)
fi

for m in v0.1 v0.2 v0.3 v0.4 v1.0; do
  gh api "repos/$REPO/milestones" -f title="$m" >/dev/null 2>&1 && echo "✓ milestone $m" || echo "· milestone $m already exists"
done

for file in "${files[@]}"; do
  front=$(awk '/^---$/{n++; next} n==1' "$file")
  body=$(awk '/^---$/{n++; next} n>=2' "$file")
  title=$(sed -nE 's/^title: "(.*)"$/\1/p' <<<"$front")
  labels=$(sed -nE 's/^labels: (.*)$/\1/p' <<<"$front" | sed 's/, /,/g')
  milestone=$(sed -nE 's/^milestone: (.*)$/\1/p' <<<"$front")
  [ -n "$title" ] || { echo "✗ no title in $file" >&2; exit 1; }
  url=$(gh issue create --repo "$REPO" --title "$title" --body "$body" --label "$labels" --milestone "$milestone")
  echo "✓ $url  $title"
done
