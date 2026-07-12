# PARTNERS.md — billboard status tracker
### One row per board. Flip **Status** as yeses land; flip `partner:true` in the
### `BILLBOARDS` array only after a WRITTEN yes is noted here (verbal = get it in
### writing same day, even a DM screenshot). `partner:true` = REAL corner badge +
### the once-per-run "SPOTTED" popup. Billboards NEVER appear on the badge,
### obituary, or share text (gated by qa/billboards-probe.js) — that's a separate
### consent from "appear in the world" (docs/BILLBOARDS.md §5).

| Board | Company | Relationship | Real or parody now | Status | Yes evidence |
|---|---|---|---|---|---|
| CLEAN | tryclean.ai | you know them | REAL (partner) | ✅ seed partner | owner-confirmed (record link/screenshot here) |
| MANUFACT | mcp-use, YC S25 | your network (Warp tab) | REAL | ping for verbal yes | — |
| INSFORGE | insforge.dev, YC P26 | your network (Warp tab) | REAL | ping for verbal yes | — |
| HYPERSPELL | YC F25 (agent memory) | reachable | REAL | DM founder | — |
| CALLIX | callix.io (GTM agents) | your network? | REAL | ping for verbal yes | — |
| AGENTMAIL | YC | reachable | REAL | DM founder | — |
| FIRECRAWL | firecrawl.dev | meme-fluent | REAL | DM @firecrawl_dev | — |
| BROWSER USE | YC W25 | reachable | REAL | DM | — |
| SUPERMEMORY | supermemory.ai | 19yo founder, reachable | REAL | DM Dhravya | — |
| KINECT | YC | reachable | REAL | DM | — |
| EXA | exa.ai | reachable | REAL | DM | — |
| RESEND | resend.com | dev-darling | REAL | DM | — |
| SUPERSET | YC P26 (agent IDE) | reachable | REAL | DM founder | — |
| VERCEL | vercel.com | aspirational (big) | affectionate-and-true tagline | approach w/ proof | — |
| WARP | warp.dev | aspirational (big) | affectionate-and-true tagline | approach w/ proof | — |
| DEEL | deel.com | aspirational (big) | affectionate-and-true tagline | approach w/ proof | — |

## Removed in the v2 owner pass (2026-07-12)
GOJIBERRY, REPLIT, SUPABASE — owner call ("remove some, make it less cramped").
Any of them can return on a written yes; there are free slots in every zone.
Panels also shrank 180×40 → 132×30 with a steel frame/rivets/catwalk detail
pass, and spacing widened to ≥290px (same-height neighbors ≥590px). CALLIX
moved back to the Sand Hill GTM row (x6060) — the slot GOJIBERRY vacated.

## Placement deviations from docs/BILLBOARDS-FINAL.md (owner told Claude Code to nudge + note)
The spec's ≥900px spacing is geometrically impossible for 19 boards in a 9,200px
world minus three boss arenas; instead boards alternate two heights (y66/y108,
reads as stacked-101 skyline) with ≥240px world gaps and ≥400px between
same-height neighbors — no two panels ever overlap on screen. The spec's draw
formula `x - cam*0.5` also un-anchors boards (x=8220 would need cam≈16k, past
the 8720 clamp); the shipped form is `(x - cam) * 0.5`, which keeps each board
in its named zone. Nudges: VERCEL 600→700 · CLEAN 5800→5760 · GOJIBERRY
6120→6060 · INSFORGE 6350→6360 · CALLIX 6380→7130 (was 30px from INSFORGE and
heading into CHAD's arena 6420-7030; still Sand Hill) · SUPERMEMORY 7300→7390 ·
HYPERSPELL 7150→7650 (stays adjacent to rival SUPERMEMORY per the spec note) ·
AGENTMAIL 7620→7910 · KINECT 7940→8160 · DEEL 8220→8400 (last board before
SYNERGY.AI's arena at 8460). All 19 verified outside the three arena bands by
qa/billboards-probe.js.

## Swap procedure (parody→real, or new board)
1. Get the yes in writing; paste evidence link in the table.
2. Edit the board's entry in `BILLBOARDS` (index.html): name/tagline/colors, set `partner:true`.
3. Add the name to `ALLOWED_REAL` in qa/billboards-probe.js.
4. `node qa/billboards-probe.js && node test/smoketest.js` — both green before commit.
