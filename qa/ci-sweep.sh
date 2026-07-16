#!/usr/bin/env bash
# ci-sweep.sh — the DETERMINISTIC half of the research job, runnable by a GitHub
# Action (no LLM needed). Standing security sweeps + the full asserting test
# battery. Writes a markdown report to $1 (default /tmp/ci-report.md).
#
# Exit codes: 0 = all hard gates green, 1 = a hard gate failed (canon leak,
# real secret committed, or a test/probe regression). The fullrun bot is
# ADVISORY — its death budget straddles on hard daily seeds by design
# (CLAUDE.md known-issue), so it's reported but never fails the gate.
#
# Local use: bash qa/ci-sweep.sh && cat /tmp/ci-report.md
set -uo pipefail
cd "$(dirname "$0")/.."
REPORT="${1:-/tmp/ci-report.md}"
FAIL=0
now="$(date -u '+%Y-%m-%d %H:%M UTC')"
hash="$(git rev-parse --short HEAD)"
{ echo "## $now · main @ $hash"; echo; } > "$REPORT"

section(){ echo "**$1**" >> "$REPORT"; }
line(){ echo "- $1" >> "$REPORT"; }

# ---- standing sweeps ----
section "Standing sweeps"

# canon grep — these strings must never appear in the game file
if grep -iEq 'yc accepted|yc mode|patagonia|wework|y combinator' index.html; then
  line "❌ CANON LEAK: banned string found in index.html"; FAIL=1
else line "✓ canon grep clean"; fi

# secret scan — match VALUE shapes (real keys/JWTs), not the words that appear
# in docs/logs. Covers Anthropic (api/oat/sid), OpenAI, GitHub PAT, AWS, Vercel,
# PostHog and JWTs. Scan tracked files; skip only this script + the research
# logs that quote patterns (CHANGELOG is included — a pasted key there is real).
SECRET_RE='sk-ant-(api|oat|sid)[0-9]{2}-[A-Za-z0-9_-]{30,}|sk-proj-[A-Za-z0-9_-]{30,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|phx_[A-Za-z0-9]{30,}|eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}'
SECRET_HITS="$(git ls-files | grep -vE 'ci-sweep\.sh|RESEARCH-LOG\.md|CI-SWEEP-LOG\.md' \
  | xargs grep -lEI "$SECRET_RE" 2>/dev/null)"
if [ -n "$SECRET_HITS" ]; then
  line "❌ SECRET SHAPE FOUND in: $SECRET_HITS"; FAIL=1
else line "✓ secret scan clean (no key/JWT value shapes in tracked files)"; fi

# dependency audit (report only — 0 today; a new advisory shouldn't red the gate
# by itself, but it must be visible)
AUDIT="$(npm audit --omit=dev 2>&1 | grep -iE 'vulnerabilit' | head -1 || true)"
line "npm audit: ${AUDIT:-no output}"

# api param clamps still present — a HARD gate (the comment always said "guards
# the plausibility gate from silent edits", but a warn-only line guarded nothing:
# deleting the clamps kept the sweep green)
if grep -q 'val > Math.ceil(Math.max(raised, 1) \* 390)' api/leaderboard.mjs \
   && grep -q "raised > 6000" api/leaderboard.mjs; then
  line "✓ leaderboard plausibility clamps intact"
else line "❌ leaderboard plausibility clamps MISSING — board is forgeable"; FAIL=1; fi
echo >> "$REPORT"

# ---- asserting test battery (hard gates) ----
section "Test battery (hard gates)"
run_gate(){ # name, command...
  local name="$1"; shift
  if "$@" >/tmp/ci-"$name".log 2>&1; then line "✓ $name"; else line "❌ $name FAILED (see log)"; FAIL=1; fi
}
run_gate smoketest node test/smoketest.js
run_gate playtest  node test/playtest.js
run_gate deathtest node test/deathtest.js
for f in qa/*-probe.js qa/verify-daily-seed.js; do
  [ -e "$f" ] || continue
  run_gate "$(basename "$f" .js)" node "$f"
done
echo >> "$REPORT"

# ---- fullrun bot (advisory) ----
section "Fullrun bot (advisory — never fails the gate)"
if node test/fullrun.js >/tmp/ci-fullrun.log 2>&1; then
  d="$(grep -oE '\"unplannedRecoveries\": [0-9]+' /tmp/ci-fullrun.log | grep -oE '[0-9]+' || echo '?')"
  line "clean profile PASS · $d recoveries"
else
  d="$(grep -oE 'FAIL: [0-9]+ unplanned deaths' /tmp/ci-fullrun.log || echo 'bot error')"
  line "clean profile over budget on today's seed ($d) — advisory, see CLAUDE.md seed note"
fi
git checkout -- qa/overnight 2>/dev/null || true  # discard screenshot churn

echo >> "$REPORT"
if [ "$FAIL" -eq 0 ]; then echo "**RESULT: all hard gates green ✅**" >> "$REPORT"
else echo "**RESULT: HARD GATE FAILED ❌ — triage before next deploy**" >> "$REPORT"; fi
echo >> "$REPORT"
exit "$FAIL"
