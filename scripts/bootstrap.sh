#!/usr/bin/env bash
# bootstrap.sh — onboard a fresh clone on any device to DRIVE the automation.
# Installs local deps + the Playwright browser, then reports which auth/tools
# still need setting up. Idempotent; safe to re-run. See docs/AUTOMATION.md.
set -uo pipefail
cd "$(dirname "$0")/.."
echo "== FOUNDER MODE bootstrap =="

need(){ command -v "$1" >/dev/null 2>&1; }

# --- required to run the game/tests ---
if need node; then echo "✓ node $(node -v)"; else echo "✗ node MISSING — install Node 20+ (nodejs.org / nvm)"; fi
if need npm; then
  echo "• installing npm deps…"; npm ci || npm install
  echo "• installing Chromium for Playwright…"; npx playwright install chromium >/dev/null 2>&1 && echo "✓ Chromium ready" || echo "⚠ playwright install failed — run: npx playwright install --with-deps chromium"
fi

echo
echo "== tools that DRIVE the cloud automation =="
# --- gh: manual triggers, issues, PRs ---
if need gh; then
  if gh auth status >/dev/null 2>&1; then echo "✓ gh authenticated"; else echo "→ run: gh auth login"; fi
else echo "✗ gh MISSING — install GitHub CLI (cli.github.com), then: gh auth login"; fi

# --- vercel: deploys ---
if need vercel; then
  if vercel whoami >/dev/null 2>&1; then echo "✓ vercel authenticated ($(vercel whoami 2>/dev/null))"; else echo "→ run: vercel login && vercel link"; fi
else echo "✗ vercel MISSING — install: npm i -g vercel, then: vercel login && vercel link"; fi

# --- supabase admin token (board wipes/reseeds) ---
if security find-generic-password -s "Supabase CLI" -w >/dev/null 2>&1; then
  echo "✓ Supabase token in keychain"
else
  echo "→ Supabase admin token not in keychain (only needed for board admin):"
  echo '    security add-generic-password -s "Supabase CLI" -a posthog -w'
fi

echo
echo "== self-check: run the exact CI battery locally =="
echo "   bash qa/ci-sweep.sh && cat /tmp/ci-report.md"
echo
echo "Full map + enabling the LLM jobs: docs/AUTOMATION.md"
echo "The GitHub jobs already run 24/7 in the cloud — nothing to start per device."
