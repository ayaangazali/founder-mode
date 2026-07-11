---
description: Run the overnight mission (GOAL.md) — unattended, tests-green, no deploys
---

Read `CLAUDE.md` in full, then read `GOAL.md` in full, then execute GOAL.md's phases 0–6 in order, unattended.

Non-negotiables while running: all three Playwright tests pass after every meaningful change (revert to the last green commit rather than proceed broken); the canon greps in CLAUDE.md stay empty; no deploys, account signups, purchases, or posting — file-level work only; finish by writing `MORNING-REPORT.md` per Phase 6 even if some phases were skipped.
