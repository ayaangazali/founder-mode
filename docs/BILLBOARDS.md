# BILLBOARD SYSTEM — the "featured startup" feature
### Real SF billboards, in-game, as both a joke and an outreach hook.

The insight: SF startups spend real money on 101 billboards nobody can decode ("Own Your Models", "Intelligent AF", "Agents Don't Work Without Evals"). Putting parody billboards in FOUNDER MODE is free satire. Putting a REAL startup's billboard in — with their blessing — turns the game into earned media *for them*, which is your outreach hook: "your billboard is in the game 200k founders are playing, want the real logo instead of the parody?"

So this is a **two-tier system**, one code path:

- **PARODY TIER** (ships by default, no permission needed): recognizable-but-fictional billboards as background gags. Canon-safe, same archetype rule as everything else.
- **PARTNER TIER** (opt-in, per company): a real startup that says yes gets their real wordmark + tagline. This is consensual promotion — legally the opposite of the celeb problem; they *want* to be there. Flip per-billboard with a `partner:true` field.

---

## 1. HOW BILLBOARDS RENDER (fits the engine, zero new assets)

Billboards are elevated roadside structures in the mid-ground parallax layer (~0.5, behind gameplay, in front of skyline). Each is a `fillRect` panel on two posts — the pixelated-billboard look is actually on-brand. A wordmark is drawn as chunky pixel text (reuse the crisp-text overlay for the tagline, keep the logo chunky).

```js
// BILLBOARDS — {x, name, tagline, fg, bg, tier}  (world x; drawn at billboard height ~y 70-120)
const BILLBOARDS = [
  // PARTNER TIER (real, opt-in — only add a company here AFTER they say yes)
  {x:1350, name:'CLEAN',   tagline:'warm outbound. no cold slop.', bg:'#0a0a0a', fg:'#4ade80', partner:true},
  // PARODY TIER (ship freely — fictional wordmarks in the house style)
  {x:2450, name:'RHOMBUS', tagline:'the corporate card that judges you', bg:'#1a1a2e', fg:'#ffd94a'},
  {x:3550, name:'BASETENT',tagline:'if you know, you know (we won’t explain)', bg:'#111', fg:'#41f2ff'},
  {x:5250, name:'CLUELESS',tagline:'cheat on everything*', bg:'#d64550', fg:'#fff'},
  {x:6550, name:'WERK.AI', tagline:'agents don’t work without evals', bg:'#0a0a0a', fg:'#7cffa5'},
];
function drawBillboard(b, camX){
  const x = b.x - camX*0.5, y = 74;              // parallax .5, mid-ground
  if (x < -180 || x > W+40) return;
  px(x+22, y+34, 6, 60, '#3a3a44'); px(x+150, y+34, 6, 60, '#3a3a44'); // posts
  px(x, y, 180, 40, b.bg); px(x, y, 180, 3, b.fg);                     // panel
  // wordmark: chunky, game canvas. tagline: crisp overlay. (occlude() under it.)
  cx.fillStyle=b.fg; cx.font='bold 16px monospace'; cx.fillText(b.name, x+10, y+22);
  cx.fillStyle='#cbd5e1'; cx.font='7px monospace'; cx.fillText(b.tagline, x+10, y+34);
  if (b.partner){ px(x+150, y+4, 26, 8, '#111'); cx.fillStyle=b.fg; cx.font='6px monospace'; cx.fillText('REAL', x+153, y+10); }
}
```

Placement rule: billboards go in zones' open sky, never over a boss arena, spaced ≥900px. Positions above are validated against the current `segs` open-sky bands — Claude Code should confirm against the live world.

**Optional clip moment (cheap, high value):** when the player walks under a PARTNER billboard, a one-time popup: `SPOTTED: {name} (a real startup, unlike yours)` +$5K. Makes the partner mention feel earned in-fiction and gives the partner a reason to share the clip.

---

## 2. OUTREACH TARGETS — ranked by fit + reachability

These are real companies known for SF billboards. Ranked by: does the game's theme flatter them, and can you actually reach a human. **★ = start here.**

| ★ | Company | What they do | Why it fits FOUNDER MODE | Contact |
|---|---|---|---|---|
| ★★★ | **Clean** (tryclean.ai) | AI GTM / warm B2B SaaS outbound | Literally the game's theme (B2B SaaS outbound). You already know them. The "no cold slop" line writes itself against the game's SLOP enemy. | hello@tryclean.ai · X @cleanailabs · LinkedIn |
| ★★★ | **Whop** (whop.com) | Marketplace for digital products / creators | Young, meme-fluent, marketing-forward team that lives for exactly this kind of viral crossover. High "yes" probability. | X @whop · biz contact via site |
| ★★ | **Baseten** | AI inference infrastructure | Their own billboards are explicitly "if you know, you know, we sell to engineers" — same insider humor as the game. | Mike Bilodeau (head of marketing), public on X/LinkedIn |
| ★★ | **Rho** | Fintech corporate cards (Brex/Ramp rival) | The VC/finance satire zone (Sand Hill) is their exact buyer. A "corporate card" billboard on the money level is perfect. | Marketing team via rho.co; active on LinkedIn |
| ★★ | **Campfire** (campfire.ai) | AI agents for accounting | YC 2023, still small enough to say yes fast; "close the books" gag fits the RAISED/RUNWAY economy. | YC network; hello@ via site |
| ★★ | **Juicebox** (juicebox.ai) | AI recruiting | Their real billboard ("What, like it's hard?") is already a meme; they clearly get it. Fits the "hire a 10x engineer" sign. | via juicebox.ai; founder active on LinkedIn |
| ★ | **Sigma** | Analytics / "AI Country" | Bigger (~$1.5B) so slower, but marketing-heavy and billboard-proud. | marketing@ via sigmacomputing.com |
| ★ | **Fireworks AI** | AI inference ($4B) | Big but developer-beloved; "behind every magical AI" is a fun billboard. | via fireworks.ai; team on X |
| ★ | **GRU.Space** | Lunar-hotel deposits (YC 2026) | Absurd by nature — a "book your hotel on the moon" billboard in The Cloud zone is chef's kiss. 22-yo founder, will 100% say yes. | Skyler Chan, very reachable on X |
| — | **Brex / Vercel / Turing** | fintech / devtools / LLM training | The famous ones. Bigger orgs, slower to yes, but the aspirational logos. Approach after you have 2-3 smaller yeses as proof. | brand/partnerships teams |

**Strategy:** lock 2-3 easy yeses first (Clean, Whop, GRU.Space, Campfire), screenshot their billboard in the live game, *then* use those as social proof to land the bigger names. Each yes is also a distribution node — they'll share "we're in FOUNDER MODE" to their own audience, which is the whole point.

---

## 3. PARODY FALLBACKS (ship these now, swap to real as yeses land)

House-style fictional wordmarks so the billboard row is full and funny on day one, no permission needed. Each is a recognizable *type*, never a real mark:
`RHOMBUS` (the card that judges your spend) · `BASETENT` (if you know, you know) · `CLUELESS` (cheat on everything*) · `WERK.AI` (agents don't work without evals) · `SLASH/` (banking for people who use one keyboard shortcut) · `PERCEL` (deploys before you finish the sentence) · `CLAYMORE` (enrich your enemies) · `CURSED` (the IDE that finishes your thoughts, wrongly) · `GLEAN.EXE` (search for the search) · `RAMPANT` (spend controls, ironically).

---

## 4. THE OUTREACH EMAIL (paste-ready, edit the brackets)

> **Subject: your billboard is in a game (the good kind of problem)**
>
> Hi [name] — I built FOUNDER MODE, a little pixel game about surviving SF startup life. It's live at founder-mode-kit.vercel.app and [it's had X players / I'm launching it on HN+LinkedIn next week].
>
> There's a stretch where you run past SF startup billboards. [Company] is one of them right now — as a (loving) parody. I'd rather feature the *real* [Company] billboard with your actual tagline, because the whole joke lands better when it's real, and every player who clips that moment is tagging you.
>
> No cost, no catch — I just need a yes and your one-liner. Takes me five minutes to swap in. Want in?
>
> [you]

---

## 5. IMPLEMENTATION (Claude Code, one branch `billboards`)
1. Add the `BILLBOARDS` array + `drawBillboard()`; call it in the background pass (after skyline, before gameplay entities), parallax .5. Ship parody tier + Clean as the seed partner.
2. Add the "SPOTTED" proximity popup for `partner:true` billboards (once per run, +$5K, in-fiction line).
3. `PARTNERS.md` in the repo: a table mapping billboard → status (parody / contacted / confirmed) so swapping a parody to a real partner is a one-line data edit + a status flip.
4. Guardrails: partner logos only added after written yes (note it in PARTNERS.md); parody names grep-gated against a real-brand denylist so a real trademark never sneaks into the *parody* tier; billboards never overlap boss arenas; tests green.
5. Screenshot each billboard into qa/overnight/ and add one line to CLIP-REPORT.md.

*Do NOT put partner billboards on the loss-screen obituary or badges — keep paid/partner placement out of the user-generated share image unless the partner explicitly agrees; that's a different consent than "appear in the world."*
