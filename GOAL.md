# GOAL.md — the overnight mission
### Scope: everything that can be finished unattended, locally, with tests green. No deploys, no accounts, no purchases, no posting.

Read `CLAUDE.md` first (rules, canon, verification). Then execute these phases **in order**. If a phase fails and can't be fixed within its own scope, write what happened to `MORNING-REPORT.md`, skip to the next phase, and never leave `index.html` in a state where the three tests fail — revert to the last green commit instead.

---

## Phase 0 — Baseline (M0)
1. `git init`, add `.gitignore`, commit everything as `war-room build baseline`. Tag `v0.2-rc1`.
2. Run all three tests (`node test/smoketest.js && node test/playtest.js && node test/deathtest.js`) and the canon greps from CLAUDE.md. Record results in `MORNING-REPORT.md` as the baseline.

## Phase 1 — Sanitize for public
3. Strip the entire "TIER 2 — YOUR CALL" section from `design/CAMEOS.md`, replacing it with: *"Thin-veil variants were evaluated and rejected; see private notes."* (FINAL-REVIEW §4.4 — this must happen before any public push.) Commit.

## Phase 2 — v0.2 copy-deck completeness pass
The fixers implemented FINAL-REVIEW's items; some MASTER-PLAN/Bible copy may not have landed. Diff against `qa/CHANGELOG.md` and add whatever is missing (copy only — no new mechanics):
4. The seven v0.2 signs from `docs/MASTER-PLAN.md` §1.6 at their verified x positions (skip any already present; if a cameo/sign now occupies a position, shift ±40px onto solid ground — validate against `segs`).
5. The fund-district sign row from `docs/FOUNDER-MODE-BIBLE.md` §8 (A17Z, SEQUOIADENDRON, FOUNDERS ETC., HF-0 MONASTERY) placed on Sand Hill Road ground segments, ≥120px apart, outside boss arenas.
6. Boss quip additions (MASTER-PLAN §1.4 v0.2 sets) and the expanded buzzword pool (`SLOP`, `AI-NATIVE`, `ROADMAP`, `ALIGNMENT`, `WEB-SCALE`) — verify the drawn pill sizes to measured text (FINAL-REVIEW item 31 behavior) still holds for the longest words.
7. Rotating badge one-liner pools (MASTER-PLAN §1.6): win pool + loss pool, seeded per run, replacing the single hardcoded quotes — but keep the zone-aware loss lines from the war-room build (compose: zone line stays, quote rotates).
8. Tests + screenshot pass after each item. Commit per item.

## Phase 3 — Daily seed + market conditions (ROADMAP §7, local-only)
9. Date-derived seed + tiny seeded RNG. Title-screen ticker shows today's condition (the 10 modifiers in MASTER-PLAN §1.6, exact strings). Wire each modifier to its existing lever (boss HP, coin value, burn tick, extra spawns, start runway). `daily seed #N` line on the title. **All timer logic reads `playMs`.**
10. Add a probe (`qa/verify-daily-seed.js`): fake two different dates → visibly different modifiers; same date twice → identical run layout. Tests green. Commit.

## Phase 4 — Deploy-ready scaffolding (files only, nothing goes live)
11. Create `api/og.jsx` from ROADMAP §8's code verbatim (dynamic badge endpoint, ready for Vercel; the game itself stays one file and does not reference it).
12. Add the OG meta tags from BUILD-GUIDE Step 4 to `index.html` `<head>`, pointing at `og.png` via the `GAME_URL` placeholder root.
13. Write `vercel.json` if needed for the static + edge-function layout. Commit.

## Phase 5 — Full-game QA sweep + evidence
14. Run a scripted full playthrough bot (extend `test/playtest.js` patterns): verify win path, death path, checkpoint respawn with the −25% haircut, customization persistence across reload, each of the 3 easter eggs (evaluate-driven), daily-seed determinism, and each biome. Capture one screenshot per zone + title + win badge + loss badge into `qa/overnight/`.
15. Re-run every `qa/verify-*.js` probe that exists; any probe that fails because its bug is now fixed gets its expectation inverted (per FINAL-REVIEW item 33), not deleted.

## Phase 6 — The morning report
16. Write `MORNING-REPORT.md`: what shipped (per phase, with commit hashes), test/probe status table, screenshots index, anything skipped and why, and the **human-decision list** — exactly: (a) choose/buy the domain and replace `GAME_URL`, (b) create the Vercel project and deploy (BUILD-GUIDE Step 2), (c) Supabase project for the leaderboard (ROADMAP §9) if wanted for launch, (d) pick the launch day (Tue/Wed/Thu) and run `docs/LAUNCH-PLAYBOOK.md`. Final commit.

---

## Hard rules for the night
- Tests green after every change; revert rather than push through.
- No re-litigating FINAL-REVIEW rulings (§2, §6). Held easter eggs stay held. Risky cameos stay dead.
- Nothing in the canon-grep list re-enters the file. No frameworks, no assets, no second required file for the game.
- Do not touch `index.v0.1.bak.html`, `qa/FINAL-REVIEW.md`, or `qa/CHANGELOG.md` history (append new entries to CHANGELOG instead).
- If uncertain between two interpretations, pick the smaller diff and note it in the report.
