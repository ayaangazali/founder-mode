# BILLBOARDS — FINAL LOCKED LINEUP (owner's pick)
### 19 boards, paste-ready code, placed by zone. Ship it.

This is the locked list. Because a bunch of these are your personal network (Manufact, Insforge, and likely Hypersell/Callix), the play is different from the parody strategy: **for anyone you can text, skip the parody and ship the REAL board day one** — just get a verbal "yeah do it." Parody is only the fallback for names you can't reach yet.

---

## THE ARRAY (paste into index.html; validate x against live segs/arenas)

```js
// BILLBOARDS — real names for anyone who said yes (partner:true); parody until then.
// x = world coord; drawn parallax .5 in the background pass. Keep ≥900px apart,
// NEVER inside a boss arena (platform/Chad/SYNERGY x-bands) — Claude Code: verify.
const BILLBOARDS = [
  // ── SOMA (devtools) ──
  {x:600,  name:'VERCEL',     tagline:'deploys before you finish the sen—', bg:'#000', fg:'#fff',    partner:false},
  {x:1150, name:'SUPABASE',   tagline:'the backend your agent controls',    bg:'#1c1c1c', fg:'#3ecf8e', partner:false},
  {x:1650, name:'WARP',       tagline:'the terminal that finishes your bash', bg:'#0a0a0a', fg:'#01a2ff', partner:false},
  // ── THE MISSION (AI hype) ──
  {x:2250, name:'REPLIT',     tagline:'vibe-code your way to prod',         bg:'#0e1525', fg:'#f5960a', partner:false},
  {x:2800, name:'RESEND',     tagline:'email that actually lands',          bg:'#000', fg:'#fff',    partner:false},
  {x:3350, name:'EXA',        tagline:'search, but it gets the vibe',       bg:'#1a1a2e', fg:'#8b5cf6', partner:false},
  // ── CEREBRAL VALLEY (agents) ──  (avoid THE PLATFORM arena ~5390-5640)
  {x:4150, name:'FIRECRAWL',  tagline:'now hiring: 3 AI agents, $1M',       bg:'#0a0a0a', fg:'#ff6b35', partner:false},
  {x:4650, name:'BROWSER USE',tagline:'your agent, now with a browser',     bg:'#111', fg:'#7cffa5', partner:false},
  {x:5100, name:'MANUFACT',   tagline:'USB-C for AI (it just works)',       bg:'#0f0f17', fg:'#41f2ff', partner:false},
  // ── SAND HILL ROAD (GTM + money) ──  (avoid CHAD arena)
  {x:5800, name:'CLEAN',      tagline:'warm outbound. no cold slop.',       bg:'#0a0a0a', fg:'#4ade80', partner:true},
  {x:6120, name:'GOJIBERRY',  tagline:'GTM agents that actually close',     bg:'#1a1a2e', fg:'#e94f8a', partner:false},
  {x:6350, name:'INSFORGE',   tagline:'the agent-native AWS',               bg:'#0d1117', fg:'#58a6ff', partner:false},
  // ── THE CLOUD (infra + agents) ──  (avoid SYNERGY.AI arena)
  {x:7300, name:'SUPERMEMORY',tagline:'your AI finally remembers you',      bg:'#141433', fg:'#c58bff', partner:false},
  {x:7620, name:'AGENTMAIL',  tagline:'an inbox your agent can’t ignore',   bg:'#0a0a0a', fg:'#ffd94a', partner:false},
  {x:7940, name:'KINECT',     tagline:'the AI-native commerce stack',       bg:'#0f0f17', fg:'#00e0c6', partner:false},
  {x:8220, name:'DEEL',       tagline:'hire anyone, anywhere, instantly',   bg:'#1b1b3a', fg:'#7c6bff', partner:false},
  // ── CONFIRMED (were placeholders, now locked) ──
  {x:300,  name:'SUPERSET',   tagline:'run 100 coding agents in parallel',  bg:'#0d1117', fg:'#20a7c9', partner:false}, // YC P26, IDE for the agents era — devtools/SOMA
  {x:7150, name:'HYPERSPELL', tagline:'memory layer for your agents',       bg:'#141433', fg:'#a78bfa', partner:false}, // YC F25, agent memory across work apps — Cloud
  {x:6380, name:'CALLIX',     tagline:'GTM agents that dial for you',       bg:'#0a0a0a', fg:'#4ade80', partner:false}, // GTM agents — Sand Hill money row
];
// NOTE: Superset moved to SOMA (devtools), Hyperspell to Cloud (near Supermemory — two
// memory cos is fine, they're rivals), Callix to Sand Hill (GTM row w/ Clean+Gojiberry).
// Re-check spacing ≥900px + arena avoidance after the move; nudge x as needed.
```

## STATUS TRACKER (goes in PARTNERS.md — flip as yeses land)
| Board | Company | Your relationship | Real or parody now | Status |
|---|---|---|---|---|
| CLEAN | tryclean.ai | you know them | REAL (partner) | ✅ seed |
| MANUFACT | mcp-use, YC S25 | your network (Warp tab) | REAL | ping for verbal yes |
| INSFORGE | insforge.dev, YC P26 | your network (Warp tab) | REAL | ping for verbal yes |
| HYPERSPELL | YC F25 (agent memory) | reachable | REAL | DM founder |
| CALLIX | callix.io (GTM agents) | your network? | REAL | ping for verbal yes |
| GOJIBERRY | YC P26 | reachable | REAL | DM founder |
| AGENTMAIL | YC | reachable | REAL | DM founder |
| FIRECRAWL | firecrawl.dev | meme-fluent | REAL | DM @firecrawl_dev |
| BROWSER USE | YC W25 | reachable | REAL | DM |
| SUPERMEMORY | supermemory.ai | 19yo founder, reachable | REAL | DM Dhravya |
| KINECT | YC | reachable | REAL | DM |
| EXA | exa.ai | reachable | REAL | DM |
| RESEND | resend.com | dev-darling | REAL | DM |
| SUPERSET | YC P26 (agent IDE) | reachable | REAL | DM founder |
| SUPABASE / VERCEL / WARP / REPLIT / DEEL | big | aspirational | ship parody-safe, upgrade on yes | approach w/ proof |

## ALL 19 CONFIRMED — lineup is locked. ✅

## NOTE ON THE BIG NAMES
Vercel, Supabase, Warp, Replit, Deel are household names but *big* — their taglines above are written to be affectionate and true, so they read fine even before a formal yes (you're describing them accurately, not claiming endorsement). Still, keep them off the badge/obituary and flip `partner:true` only once someone actually confirms.

## IMPLEMENTATION
Same `drawBillboard()` from BILLBOARDS.md. This array replaces the roster placeholders. Ship on branch `billboards`, screenshot each zone's boards into qa/overnight/, validate every x sits in open sky outside the three boss arenas, tests green. The "SPOTTED: {name} (a real startup, unlike yours)" popup fires only for `partner:true` boards so it doesn't over-trigger.
