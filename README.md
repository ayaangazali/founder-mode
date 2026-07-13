<div align="center">

# 🦄 FOUNDER MODE

**The SF startup platformer.** Stomp churn. Dodge VCs. Survive the accelerator interview. Ring the IPO bell.

### [▶ &nbsp;PLAY NOW — foundermode.vercel.app](https://foundermode.vercel.app)

*One HTML file. No signup, no install, no loading screen. Arrow keys / WASD, Space to jump.*

<img src="og.png" width="640" alt="FOUNDER MODE">

*made by [ayaan gazali](https://www.linkedin.com/in/ayaangazali)*

</div>

---

## What is this

A Mario-style pixel platformer satirizing SF startup culture, built to be shared on LinkedIn. You are a hoodie-wearing founder sprinting from a SOMA garage to the IPO bell across five zones of the Bay Area. The satire lives in the mechanics, not the labels:

- Money is **RAISED**. Health is **RUNWAY**. Death is **OUT OF RUNWAY**.
- Coins are funding. Unless you picked the **CMO cofounder**, in which case they're *impressions* and pay $0 REAL DOLLARS.
- The final ranking metric is **VALUATION** — RAISED times a stack of multipliers (speed, discipline, corgi, pedigree), because raising money and being worth money are famously different things.
- Choosing **NEPO FOUNDER** pedigree multiplies your valuation ×50 and makes the game *easier*. That's the joke. It's also the leaderboard meta. That's also the joke.

## The run

**Five zones:** SOMA → The Mission → Sand Hill Road → Cerebral Valley → The Cloud. **Three bosses:** the Platform Shift, the VC (throws term sheets — sign one mid-air and see what happens), and the AI that was supposed to be your moat. Checkpoints between them.

**Along the way:** coffee-chat trivia tables, the ACCELERATOR interview (7 questions, 10 seconds each, a batch stamp for your badge if you 7/7 it), an intern fair with dwell-to-hire booths, 16 real-startup billboards on the 101, six parody tech celebrities muttering about whether code is dead, three easter eggs, a corgi, and — if you go broke with a mom cofounder or good luck — **the mom round** ($2K and two hearts, she believes in you).

**The end:** reach the bell, MASH R, confetti over the Golden Gate. Or die and get your startup's obituary as the front page of *HYPERGROWTH DAILY*, with your name in the headline, ready to save and post.

**Every day is a new market.** A daily seed sets the conditions — bull runs, DOWN ROUND SEASON, AI hype cycles — and the leaderboard resets with it. Post your run under 14 characters of name; top 100 visible from the 🏆 chip on the title screen.

## Can I play it inside GitHub?

No — and that's a GitHub rule, not ours. GitHub strips every `<script>`, `<iframe>`, and `<canvas>` from README markdown for security, so no playable game can be embedded in any README, including profile READMEs. The links above are the closest legal thing: a big play button over the share card.

If you want it on a GitHub **profile** (the `ayaangazali/ayaangazali` repo), the winning move is the same pattern — copy the block below into that repo's README. GIFs *are* allowed in READMEs, so a looping gameplay GIF as the click target is the strongest version of this.

```markdown
### 🦄 I made a game about being an SF founder
**[▶ PLAY FOUNDER MODE](https://foundermode.vercel.app)** — stomp churn, dodge VCs,
ring the IPO bell. One file, no signup, new market every day.
```

## Run it locally

```bash
git clone <this repo> && cd founder-mode-kit
open index.html        # that's it — the game is one file
```

The leaderboard and share cards need the serverless functions, so for the full experience use `vercel dev` or just play the live URL.

## Architecture (or: the absence of one)

| Thing | Choice |
|---|---|
| The game | `index.html` — ~3,900 lines of vanilla JS. No framework, no bundler, no image assets. Every sprite is `fillRect` on a 480×270 canvas; text stays crisp via a devicePixelRatio overlay canvas. |
| The engine | Fixed-timestep 60Hz accumulator with a simulated `playMs` clock — physics are a speedrun contract, identical on every machine. |
| Determinism | One daily seed (mulberry32) drives market conditions; per-run rolls decide mini-game layouts. |
| Server | Three functions in `api/` — `leaderboard.mjs` (Supabase, plausibility-gated POST, profanity filter), `og.mjs` (per-run share card via satori), `r.mjs` (result URL whose unfurl is *that run's* card). |
| Tests | `test/` gates (smoke / full playthrough / death loop) + 11 `qa/` probes + a sense-act bot (`test/fullrun.js`) that plays the whole game and files a report. All asserting. |

Design history, the audit, and the full build breakdown live in [`docs/`](docs/) — start with [`docs/WHATS-BUILT.md`](docs/WHATS-BUILT.md).

---

<div align="center">

*99.99% uptime\** &nbsp;·&nbsp; *\*during business hours* &nbsp;·&nbsp; **[PLAY](https://foundermode.vercel.app)**

</div>
