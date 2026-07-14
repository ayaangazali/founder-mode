# LAUNCH RUNBOOK — FOUNDER MODE
### First launch ever → aim: six figures of plays by Startup School (July 25–26, SF)

Real talk first, then the plan. **100k plays in 10 days is a top-percentile outcome** — 2048 and Wordle did it, and a thousand good games didn't. What you control is shots on goal and the compounding loop. Goalposts that keep you sane: **10k plays = real launch · 30k = strong · 100k = lightning caught.** Every layer below stacks the odds. And plays are what analytics counts — your funnel events are the receipts (nobody at Startup School is auditing the difference between plays and users, but you'll *have* the real number, which beats larping).

Your unfair advantages going in: the loss screen people *want* to share (the obituary), per-run unfurl URLs, a daily leaderboard that resets (reason to return), 16 real-startup billboards = 16 companies with audiences who might amplify you, and a launch story no one else has: **first-time founder ships a game satirizing SF, a week before walking into YC Startup School.** That's the LinkedIn post. That's the HN comment. Use it everywhere.

---

## THE CALENDAR (today = Mon Jul 14 · LAUNCH = TUE JUL 21 · Startup School Jul 25–26)

One week of prep, launch Tuesday, four days of compounding, then the in-person wave. (Why not this Thursday: domain, the patch round, and partner yeses aren't done, and a rushed launch wastes your one first impression. Why not later: you need ≥3 days of leaderboard history and fixes before SS.)

**MON–TUE (Jul 14–15) — lock the machine**
- 🔑 Rotate the Anthropic API key. Today. It's been open a week.
- Buy **sfspeedrun.com**, attach in Vercel, merge the `board-and-domain` branch, run the DEPLOY-CHECKLIST (incl. LinkedIn Post Inspector on an /api/r URL — the unfurl IS your ad unit).
- Send the billboard DMs (below). You want **3–5 written yeses by Sunday** — every yes is a company that shares your launch.

**WED–THU (Jul 16–17) — dress rehearsal**
- Full pre-flight: fresh phone + laptop, incognito → play to a badge → SAVE + COPY + native share all work. iOS Safari badge long-press. Kill anything broken; add nothing new. **Feature freeze Thursday night** — launch week is for fixes only.
- Record the 25–40s gameplay clip (money shots: obituary reveal, a boss + quips, bell MASH → confetti). Phone-vertical cut AND landscape cut.
- Beat your own game; save YOUR badge + YOUR obituary PNGs. You need both for posts.
- Draft all posts (templates below), have a friend read them cold.

**FRI–SUN (Jul 18–20) — seed quietly**
- Friends/beta group: "launching Tuesday — play a run Monday night so the leaderboard isn't empty, and if you post your badge Tuesday I owe you a coffee chat (in-game)." 10 friendly badges on feeds beats any ad.
- Run qa/seed-board.js Monday night so day-one players see a live board with NEPOBABYCEO 🐴 to dethrone.
- Confirm partner yeses; tell each one launch is Tuesday and you'll tag them.

**TUE JUL 21 — LAUNCH DAY (be free 7am–2pm PT, laptop, coffee)**
- **7:30–8:30am PT — Show HN.** Title: `Show HN: I made a Mario-style game about surviving SF startup culture`. URL = the game. Immediately add ONE first comment: built by a first-time founder, one HTML file, no frameworks, the funniest bug you hit, what you'd add next. Then **live in the thread all morning** — answer everything, be technical and self-deprecating. Do not ask anyone to upvote (HN detects rings and kills it).
- **~9am — X/Twitter.** The gameplay clip + "I got tired of writing AI B2B SaaS decks so I made a game where you fight one. The final boss is called SYNERGY.AI." Link in first reply. Tag @cluely-tier meme accounts only if organic.
- **11am–1pm — LinkedIn (your main stage).** Founder-story post, YOUR obituary or badge as native image, **game link in first comment + baked into the image**: 
  > I've never launched anything in my life. In 11 days I'm walking into YC Startup School. So last month I built a game about everything I'm walking into: FOUNDER MODE — a tiny Mario-style browser game about surviving SF. You stomp churn, dodge term sheets, adopt a corgi (multiplies your valuation, obviously), and the final boss is an AI B2B SaaS company. When you die, the game prints your obituary in a startup newspaper. Mine says it was a market timing issue. It takes 4 minutes. Beat my valuation and I'll repost your badge. Link in comments.
- **All day:** repost EVERY badge/obituary anyone shares (that promise is the engine — honor it fast). DM each billboard partner their in-game board screenshot: "you're live, feel free to flex."
- **Do not** argue with anyone who calls it dumb. "that's the point 🫡" and move on.

**WED–FRI (Jul 22–24) — compound**
- Wed: Product Hunt (tagline: "The startup simulator where the final boss is an AI B2B SaaS company"). Low stakes, free surface.
- Post the leaderboard drama as content: "day 2: someone named NEPOBABYCEO is #1 and refuses to die." Screenshot beat-my-time chains. Clip the funniest death.
- Pitch 2–3 newsletters (TLDR, Ben's Bites, The Neuron — AI-fatigue satire is squarely their beat) with your day-1 numbers: "X plays in 24h, here's the game." Numbers make the pitch.
- Fix what breaks. Watch the funnel: start → first_boss → badge_screen. If badge_screen <60% of starts, ease difficulty via levers Thursday night.

**SAT–SUN JUL 25–26 — STARTUP SCHOOL (the second wave, in person)**
- Your icebreaker is a phone: "I made a game about being us — 4 minutes, there's a daily leaderboard, today's seed is LAYOFFS SZN." Hand them the phone. The game IS the business card.
- Push the day's leaderboard as the social object: "today's board resets at midnight — SS attendees, come dethrone me." If you can, post in the event Slack/WhatsApp with the day's top-exit screenshot.
- Collect every founder you demo to → they post badges → their networks are founders too. This audience is 100% ICP; conversion here beats any channel.
- Sunday night: post the week-one numbers transparently on LinkedIn ("X plays, Y obituaries printed, Z unicorns 🦄, one 🐴 dynasty") — the retro post often outperforms the launch post.

---

## PARTNER DM (send Mon/Tue — this is your paid-media budget, except free)
> hey — I built FOUNDER MODE, a pixel game about surviving SF startup life (sfspeedrun.com). there's a stretch of 101-style billboards in it and [COMPANY] is on one. launching Tue July 21 + demoing at YC Startup School that weekend. cool if I keep you up? if you repost your board when we launch, even better — screenshot attached. (say the word and I'll swap the tagline to whatever you want.)

## CONTINGENCIES
- **HN post dies (<10 pts by 10am):** don't repost same-day. LinkedIn becomes the main channel; resubmit HN in ~2 weeks with a different angle ("Show HN: my game prints your startup's obituary"). One flop ≠ launch over.
- **Something breaks under load:** the no-build stack is your superpower — fix → push → live in 60s. Announce the fix in-thread; HN loves watching repairs.
- **Leaderboard griefing:** the profanity gate holds; a troll top-scorer is content, screenshot it.
- **Numbers small by SS:** the in-person demo doesn't care. 40 founders playing it in the hallway IS the win condition for week one — they're the seed of wave two, and "launched last Tuesday" is still true.

## THE ONE RULE
You get exactly one week where "I just launched my first thing ever" is true. Spend it *in the replies* — every comment answered, every badge reposted, every bug fixed same-day. Distribution is a full-time job for exactly seven days. The game is finished; launch week, YOU are the product.
