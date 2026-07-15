# RESEARCH LOG — continuous vulnerability & bug analysis

Branch `research` only — findings never touch main until the owner triages
them. Appended by the recurring 4-hour analysis job; newest entry last.
Each run: (1) review commits landed on main since the last entry's hash,
(2) one rotating deep lens, (3) standing sweeps. Findings must be VERIFIED
against the code (file:line + failure scenario) before they're logged —
no speculation. Severity: P0 exploitable/run-breaking · P1 visible flaw ·
P2 smell/debt.

**Rotating lenses (cycle in order):** server/API security (param bounds,
board POST gate, forgeability) → client XSS/DOM (innerHTML sites, esc()
coverage, name fields) → economy/exploit math (valuation caps vs multiplier
chains, farmables) → sim core (timing, state mutation in draw, playMs) →
input/UX edge cases (pause states, mini-game reentry, touch) → secrets +
deps (key scans, npm audit, deploy surface).

**Standing sweeps every run:** canon greps (`yc accepted|yc mode|patagonia|
wework|y combinator` must be empty in index.html); secret scan (`sk-ant`,
`service_role`, `SUPABASE_SERVICE_KEY` values, bearer tokens — repo must
be clean); celeb/billboard names off share surfaces; `npm audit
--omit=dev`; api/*.mjs param clamps unchanged.

---

## 2026-07-15 — run 0 (seed entry, branch created at 712e18e)

Log initialized. Baseline posture from docs/AUDIT-2026-07-13.md §8: both
economy exploits fixed, tests asserting, plausibility gate live
(raised ≤ 6000, val ≤ raised×390+10 ≤ 2.4M, win ≥ 45s), profanity+leet
filter, HMAC consciously declined (client is open text; caps bound damage).
Known-open by design: board POSTs are forgeable within the caps (joke-board
tradeoff, owner-accepted); localStorage flairs are client-trust; RISKY_CAMEOS
right-of-publicity is an owner-owned business risk, gated + grep-enforced.
Next run starts the lens cycle at: server/API security.

## 2026-07-15 — run 1 · lens: server/API security

**Commits since seed:** none (branch cut at main tip 712e18e).

**Standing sweeps:** canon grep 0 ✓ · secret scan clean ✓ · `npm audit
--omit=dev` 0 vulnerabilities ✓ · api param clamps intact ✓.

**Gate verified SAFE (no false-positive):** val plausibility ceiling is
`raised×390+10`. Actual max legit WIN multiplier = 2.0 speed × 1.75
discipline × 1.1 corgi × 100 pedigree = **385**. Confirmed hearts cannot
exceed 5 (index.html:1048 start = bull?4:3 + mom?1 = max 5; :1403 TERM SHEET
`if (hearts<5)`; :1395 angel = max(maxHearts,3); :1179 mom round sets 2) →
discipline caps at 1.75. 385 < 390 → the strongest possible real run posts.
Absolute $2.4B ceiling also clears (6000×385 = 2.31M). Gate is correctly
tuned; leave it.

**F1 · P2 · api/leaderboard.mjs:96 — no POST rate limit / unbounded rows.**
POST accepts unlimited distinct `(seed,name)` rows; the unique index only
dedupes identical names. A script posting many distinct names inflates the
table (Supabase row cost) indefinitely. Not a gameplay exploit (junk low-val
rows sort last under won/val ordering, never displace legit entries in a
limit≤200 GET). Failure scenario: `for name in wordlist: POST {seed:today,
name}` → thousands of rows, all passing the gate. Mitigation options for
triage: per-IP rate cap at the edge, or a daily row-count ceiling per seed.

**F2 · P2 · api/leaderboard.mjs:66 — future-seed poisoning.** `seed =
body.seed | 0` is fully attacker-controlled; nothing pins it to today. A
POST to tomorrow's seed pre-fills a board before anyone plays it (still
within value caps, so entries look plausible). Low severity — joke board,
and qa/seed-board.js legitimately relies on posting to an arbitrary seed —
but worth an owner decision: clamp accepted seed to [today-1, today] server
side if pre-seeding is always done via the trusted script anyway.

**No P0/P1 this run.** `| 0` coercion is applied before BOTH the gate check
and the insert, so int32-wrap cannot smuggle an out-of-range value past the
check (checked value == stored value). Name filter `[A-Z0-9 .-]` +
encodeURIComponent blocks PostgREST injection on the exists-query. GET seed
is `| 0`-bounded (no injection). Next run lens: client XSS/DOM.
