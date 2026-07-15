<div align="center">

# 🦄 FOUNDER MODE

### The SF startup platformer.

**Stomp churn. Dodge VCs. Survive the accelerator. Ring the IPO bell.**

<br>

<a href="https://sfspeedrun.com"><img src="https://img.shields.io/badge/▶_PLAY_NOW-sfspeedrun.com-ffd94a?style=for-the-badge&labelColor=141433" alt="Play now"></a>

<br><br>

![one file](https://img.shields.io/badge/one_file-index.html-7ce0ff?style=flat-square&labelColor=141433)
![no build step](https://img.shields.io/badge/build_step-none-7cffa5?style=flat-square&labelColor=141433)
![no assets](https://img.shields.io/badge/image_assets-zero-7cffa5?style=flat-square&labelColor=141433)
![vanilla js](https://img.shields.io/badge/stack-vanilla_JS_%2B_canvas-c58bff?style=flat-square&labelColor=141433)
![~4k lines](https://img.shields.io/badge/~4%2C000-lines-8d99ae?style=flat-square&labelColor=141433)

<br>

<img src="og.png" width="640" alt="FOUNDER MODE">

<br>

*Arrow keys / WASD to move · Space to jump · one file, no signup, no loading screen.*
<br>
*made by [ayaan gazali](https://www.linkedin.com/in/ayaangazali)*

</div>

---

## The pitch

You're a hoodie founder sprinting from a SOMA garage to the IPO bell across five
zones of the Bay Area. The satire lives in the **mechanics**, not the labels:

- 💰 Money is **RAISED**. ❤️ Health is **RUNWAY**. ☠️ Death is **OUT OF RUNWAY**.
- 🪙 Coins are funding — unless you picked the **CMO cofounder**, in which case
  they're *impressions* and pay $0 REAL DOLLARS.
- 🏆 You're ranked on **VALUATION** (RAISED × a stack of multipliers), because
  raising money and being worth money are famously different things.
- 👶 **NEPO FOUNDER** pedigree multiplies your valuation ×50 *and* makes the game
  easier. That's the joke. It's also the leaderboard meta. That's also the joke.
- 🦄 The unicorn is earned: 🦄 only at a $1B valuation — below that you're a 🐴.

## The run

**Five zones** — SOMA → The Mission → Sand Hill Road → Cerebral Valley → The
Cloud. **Three bosses, and they're your funding rounds:** PRE-SEED (the Platform
Shift), SEED (the VC — sign a term sheet mid-air and find out), and SERIES A
(the AI that was supposed to be your moat). Beat Series A and, technically, you
can IPO.

**Along the way:** coffee-chat trivia, the ACCELERATOR interview (7 questions,
15 seconds *total*, a batch stamp if you ace it), an intern fair, 16 real
startups on billboards, six parody tech celebs arguing about whether code is
dead, a corgi, three easter eggs, and — if you go broke — **the mom round**
($2K and two hearts, she believes in you).

**Every day is a new market.** A daily seed sets the conditions — bull run, DOWN
ROUND SEASON, AI hype cycle — and the leaderboard resets with it. Post your run,
chase the top 100.

**Win:** mash R, confetti over the Golden Gate. **Lose:** your startup's
obituary runs as the front page of *HYPERGROWTH DAILY*, your name in the
headline, ready to post.

## Play it

| | |
|---|---|
| **Online** | **[sfspeedrun.com](https://sfspeedrun.com)** — the full experience (leaderboard, share cards) |
| **Locally** | `git clone` this repo, then `open index.html` — that's the whole install |

> **Can I embed it in a GitHub README?** No — GitHub strips `<script>`/`<iframe>`/
> `<canvas>` from all markdown, so no playable game embeds anywhere on GitHub,
> profile READMEs included. A big play button over the card is the closest legal
> thing. For a profile repo (`ayaangazali/ayaangazali`), drop this in:
> ```markdown
> ### 🦄 I made a game about being an SF founder
> **[▶ PLAY FOUNDER MODE](https://sfspeedrun.com)** — stomp churn, dodge VCs, ring the IPO bell.
> ```

## How it's built (or: the absence of a stack)

| | |
|---|---|
| **The game** | `index.html` — ~4,000 lines of vanilla JS. Every sprite is a `fillRect` on a 480×270 canvas; text stays crisp via a devicePixelRatio overlay canvas. No framework, no bundler, no image files. |
| **The engine** | Fixed-timestep 60 Hz accumulator + a simulated `playMs` clock — physics are identical on every machine, a speedrun contract. |
| **The server** | Three tiny functions in `api/` — `leaderboard.mjs` (Supabase, plausibility-gated + profanity-filtered POST), `og.mjs` (per-run share card via satori), `r.mjs` (result URL whose unfurl *is* that run's card). |
| **Determinism** | One date-seeded mulberry32 PRNG drives the day's market; per-run rolls decide mini-game layouts. |
| **Tests** | Asserting gates (`test/`) + 11 `qa/` probes + a sense-act bot that plays the whole game under a death budget. All green-or-it-fails. |

## Automation

The repo runs its own QA in the cloud, 24/7, independent of any laptop:

- **research-sweep** (GitHub Action, every 4 h + on push) — security sweeps
  (canon greps, secret scan, `npm audit`) + the full test battery, reports to
  the `research` branch, auto-files an issue if a gate breaks.
- **claude-research** / **claude** (dormant, opt-in) — LLM code review that
  opens issues and PRs once an API key is set.

Clone-and-go on a new machine: `bash scripts/bootstrap.sh`. Full map:
[`docs/AUTOMATION.md`](docs/AUTOMATION.md).

## For contributors & future sessions

```bash
bash scripts/bootstrap.sh                                   # deps + Chromium + auth check
node test/smoketest.js && node test/playtest.js && node test/deathtest.js   # the gate
bash qa/ci-sweep.sh && cat /tmp/ci-report.md                # the exact CI battery, locally
```

Start here: **[`CLAUDE.md`](CLAUDE.md)** (the rules) → **[`docs/PROJECT-CONTEXT.md`](docs/PROJECT-CONTEXT.md)**
(every decision + why) → **[`docs/WHATS-BUILT.md`](docs/WHATS-BUILT.md)** (the
full breakdown). Change history lives in [`qa/CHANGELOG.md`](qa/CHANGELOG.md).

---

<div align="center">

**[▶ PLAY FOUNDER MODE](https://sfspeedrun.com)**

*99.99% uptime\** · *\*during business hours*

</div>
