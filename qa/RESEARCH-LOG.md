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
