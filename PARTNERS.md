# PARTNERS.md — billboard status tracker
### One row per board. Flip **Status** as yeses land; flip `partner:true` in the
### `BILLBOARDS` array only after a WRITTEN yes is noted here (verbal = get it in
### writing same day, even a DM screenshot). `partner:true` = REAL corner badge +
### the once-per-run "SPOTTED" popup. Billboards NEVER appear on the badge,
### obituary, or share text (gated by qa/billboards-probe.js) — that's a separate
### consent from "appear in the world" (docs/BILLBOARDS.md §5).


> **2026-07-14 reconciliation:** this table now matches the shipped
> `BILLBOARDS` array exactly — **16 boards**, roster v3 (CLEAN and DEEL removed,
> NOZOMIO added, all by owner call). There is **no seed partner**: no written
> yes has been collected for ANY board, so no board carries `partner:true` and
> the SPOTTED popup is dormant until the first yes lands here with evidence.
> The consent rule and the share-surface gate are unchanged and binding.

| Board | Company | Relationship | Real or parody now | Status | Yes evidence |
|---|---|---|---|---|---|
| CURSOR | cursor.com (the AI editor) | aspirational (big) | affectionate-and-true tagline | approach w/ proof | — | <!-- owner swap 2026-07-22: replaced SUPERSET in the SOMA lead slot -->

| VERCEL | vercel.com | aspirational (big) | affectionate-and-true tagline | approach w/ proof | — |
| WARP | warp.dev | aspirational (big) | affectionate-and-true tagline | approach w/ proof | — |
| RESEND | resend.com | dev-darling | REAL | DM | — |
| EXA | exa.ai | reachable | REAL | DM | — |
| FIRECRAWL | firecrawl.dev | meme-fluent | REAL | DM @firecrawl_dev | — |
| BROWSER USE | YC W25 | reachable | REAL | DM | — |
| MANUFACT | mcp-use, YC S25 | your network (Warp tab) | REAL | ping for verbal yes | — |
| NOZOMIO | nozomio.com, YC (context for coding agents) | owner add 2026-07-14 | REAL | DM founder | — |
| INSFORGE | insforge.dev, YC P26 | your network (Warp tab) | REAL | ping for verbal yes | — |
| CALLIX | callix.io (GTM agents) | your network? | REAL | ping for verbal yes | — |
| SUPERMEMORY | supermemory.ai | 19yo founder, reachable | REAL | DM Dhravya | — |
| HYPERSPELL | YC F25 (agent memory) | reachable | REAL | DM founder | — |
| AGENTMAIL | YC | reachable | REAL | DM founder | — |
| KINECT | YC | reachable | REAL | DM | — |
| IMAGINE AI | imagineai.me, YC F25 | DM Sky Yang — on-theme | REAL | easy yes per owner | — |

## Removed in the v3 owner pass (2026-07-14)
CLEAN (tryclean.ai) and DEEL — owner roster call. CLEAN had been the
provisional "seed partner" but no written yes was ever recorded, so nothing
was lost consent-wise; DEEL was an aspirational big-brand slot. Either can
return on a written yes. NOZOMIO took CLEAN's 5760/y56 slot (the CV agents
row's 500px rhythm has no legal ≥400px same-height gap — nudge noted).

## Removed in the v2 owner pass (2026-07-12)
GOJIBERRY, REPLIT, SUPABASE — owner call ("remove some, make it less cramped").
Any of them can return on a written yes; there are free slots in every zone.
Panels also shrank 180×40 → 132×30 with a steel frame/rivets/catwalk detail
pass, and spacing widened to ≥290px (same-height neighbors ≥590px). CALLIX
moved back to the Sand Hill GTM row (x6060) — the slot GOJIBERRY vacated.

## BUILD-v1.2 Part A reconciliation (2026-07-13)
The v1.2 spec's board list predates the owner's live-review cuts (GOJIBERRY /
REPLIT / SUPABASE stay cut) and the v2 renderer (132×30 framed panels, sky-band
tiers). Per the spec's own smaller-diff rule, the shipped system stands; the
net-new delta is IMAGINE AI ("we reverse-engineer your LinkedIn"), slotted into
THE CLOUD row, which respaces to 7150/7400/7650/7900/8150/8400 (Δ250, height-
staggered — spec x8500 sat inside SYNERGY.AI's arena). 17 boards total.

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
