# FOUNDER MODE — Deep Research Report
### Can a pixel-art SF-satire platformer actually go viral on LinkedIn?

**Short answer: yes, and the plan you described is almost exactly the pattern that has worked before.** Every claim below was adversarially fact-checked (3 independent verification votes per claim; 22 confirmed, 3 refuted and excluded). Sources at the end of each section.

---

## 1. The headline finding: scope discipline beats production value

Ultra-low-scope free browser games repeatedly reach millions of players with **zero marketing spend**:

| Game | Build effort | Reach | Time |
|---|---|---|---|
| **2048** | one weekend, hosted free on GitHub Pages | 23M+ players | ~2 months |
| **Wordle** | side project for a partner | 90 → 2M+ players (~20,000x) | ~10 weeks |
| **Universal Paperclips** | small team, browser incremental | ~450K in 11 days, 1–2M total | weeks |

The repeating pattern is not polish — it's: **instant load, no signup, one input, free, finishable.** Your "open the website, press space, run right" instinct is precisely correct. (Caveat: player counts are creator-reported via press, corroborated across outlets but not audited.)

*Sources: [Cirulli's 2048 postmortem](https://medium.com/@gabrielecirulli/2048-success-and-me-7dc664f7a9bd), [Wordle — Wikipedia](https://en.wikipedia.org/wiki/Wordle), [Smithsonian on Wordle](https://www.smithsonianmag.com/smart-news/heres-why-the-word-game-wordle-went-viral-180979439/), [Universal Paperclips — Wikipedia](https://en.wikipedia.org/wiki/Universal_Paperclips), [IF50 on Paperclips](https://if50.substack.com/p/2017-universal-paperclips)*

---

## 2. The #1 viral mechanism: a compact, spoiler-free share artifact

This is the single most consistent finding across every case study, and it's the highest-leverage part of your game.

- Wordle was flat at ~90 players for two months. The inflection point was the **emoji grid share** — invented by a player, then productized by Wardle with a one-tap copy button. After that: 1.2M grid tweets in 13 days and hypergrowth. The grid works because it compresses the whole run into one glanceable, **spoiler-free** image that provokes "I could do better."
- Toggl's Unicorn Startup Simulator ends with "Your high score:" + a one-click **Share it!** button — same pattern, same genre as your game.

**Design rules for your badge (already implemented in v0.1, worth refining):**
1. The badge must compress the run's whole arc into one glance: money raised, time, bosses defeated.
2. Keep it spoiler-free — tease SYNERGY.AI without showing the fight.
3. One click. Every extra step kills sharing.
4. The *failure* badge matters as much as the win badge — "OUT OF RUNWAY, raised $35K, 'it was a market timing issue'" is arguably more shareable on LinkedIn than winning, because self-deprecating founder humor performs there.

*Sources: [Wordle — Wikipedia](https://en.wikipedia.org/wiki/Wordle), [Slate interview with Wardle](https://slate.com/culture/2022/01/wordle-game-creator-wardle-twitter-scores-strategy-stats.html), [Toggl Startup Simulator](https://toggl.com/startup-simulator/)*

---

## 3. Direct genre precedent: this exact game concept has worked

- **Toggl's "Unicorn Startup Simulator"** (2017): a B2B SaaS company's marketing team built a free browser game satirizing fundraising culture — one absurd, legible win condition ("reach a $1B valuation in one year without your employees quitting") — and earned independent press coverage (SFist, Arcade Rage) plus organic spread. This validates your theme *and* your format.
- **"The Founder"** by Francis Tseng: Silicon Valley satire game covered by Fast Company, which parodied Google/Amazon/Apple as **"Kougle, Coralzon, and Carrot, Inc."** — the IP-safe stand-in pattern (more in §7).
- **Maybe Capital** (2017): VC-satire game that got TechCrunch coverage largely because Dick Costolo attached his name — proof the press loves this genre.

**Design implication:** one clear absurd win condition beats diffuse objectives. FOUNDER MODE's "defeat SYNERGY.AI and ring the IPO bell" is exactly this shape.

*Sources: [Toggl Startup Simulator](https://toggl.com/startup-simulator/), [SFist](https://sfist.com/2017/02/22/startup_simulator_unicorn_toggl/), [Fast Company on The Founder](https://www.fastcompany.com/3067405/the-founder-a-game-about-the-dark-side-of-silicon-valley), [TechCrunch on Maybe Capital](https://techcrunch.com/2017/02/21/dick-costolo-joins-maybe-capital-a-new-satirical-board-game-about-valley-vc/)*

---

## 4. Satire must live in the *mechanics*, not just the skin

Universal Paperclips is the canonical proof: its AI satire worked because **the player becomes the runaway optimizer** — the game loop itself is the joke. Critics (The Verge's top-15 of 2017, a Webby nomination) praised the thematic mechanics specifically. Also key: *most players finished it* — a strong, reachable ending drives mass completion, and **your badge only spreads if players actually reach the badge screen.**

**Concrete upgrades for FOUNDER MODE v0.2 (ranked):**
1. **Make fundraising mechanically double-edged** — e.g., grabbing a term sheet gives +1 runway but spawns a "board member" that follows you and occasionally blocks jumps. Raising money = gaining power + losing freedom. That's the satire in the mechanics.
2. **Burn rate as a design lever** — runway could tick down slowly over time (you literally cannot stand still), which is both a difficulty mechanism and the joke.
3. **The YC invincibility power-up is already mechanically satirical** (acceptance = temporary invincibility + everyone gets out of your way). Keep it.

*Source: [Universal Paperclips — Wikipedia](https://en.wikipedia.org/wiki/Universal_Paperclips)*

---

## 5. Session length, difficulty, and the shared-experience effect

- Wardle deliberately capped Wordle at **~3 minutes/day** — scarcity plus brevity meant casual players finish and share.
- Everyone solving the **same puzzle** created comparison and community ("how hard did you find today's?").

**For FOUNDER MODE:**
- Target a **3–6 minute full run**. The current level is about right; resist the urge to add levels before launch.
- First 30 seconds must be nearly unloseable (feed-clickers must reach at least one joke and one stomp before any real threat).
- Consider a **daily seed** ("Today's market conditions: AI hype +20%, rates high") so all players face the same run and times are comparable — this is what makes a leaderboard mean something.

(Note: no platformer-specific completion-rate data surfaced; the 3-minute figure is Wordle-derived and the transfer to platformers is design inference. Playtest it.)

*Sources: [Wordle — Wikipedia](https://en.wikipedia.org/wiki/Wordle), [CNBC on Wordle psychology](https://www.cnbc.com/2022/02/15/bite-sized-fun-the-psychology-behind-your-sudden-wordle-obsession.html)*

---

## 6. Distribution playbook: HN ignites, LinkedIn amplifies

The verified pattern for dev-audience games:

- **2048's virality started on Hacker News** — a *third party* posted it, it hit #1 (then the third most-upvoted post in HN history), and only then cascaded to Twitter, Facebook, and offline word of mouth.
- Universal Paperclips ignited from a single creator tweet into an AI-interested audience.

**Recommended launch sequence:**
1. **Ship to a real URL first** (Vercel/Netlify/GitHub Pages — free). A file attachment can't go viral; a link can.
2. **HN "Show HN" + Twitter/X on the same morning.** Title in the proven shape: *"Show HN: I made a Mario-style game about surviving SF startup culture."*
3. **LinkedIn post the same day**, but written as a founder story, not a launch announcement: "I got tired of writing another AI B2B SaaS deck, so I made a game where you fight one." Attach your own badge image.
4. **Optimize the LinkedIn share flow for image + copy-paste text, not URL unfurls.** LinkedIn is widely believed to downrank external links; the badge-download + "copy post" buttons (already in v0.1) are the right primitive. Put the game URL in the copied text or first comment.

**Honest caveat from verification:** no confirmed case study documented a game going viral *primarily via LinkedIn* — HN-first is the verified pattern; LinkedIn-as-amplifier is well-grounded inference. The closest precedent found is Tom Orbach's **Viral Post Generator** (a LinkedIn-satire browser toy that went viral on LinkedIn itself), which supports the thesis that LinkedIn rewards content satirizing its own culture.

*Sources: [Cirulli's postmortem](https://medium.com/@gabrielecirulli/2048-success-and-me-7dc664f7a9bd), [Universal Paperclips — Wikipedia](https://en.wikipedia.org/wiki/Universal_Paperclips), [HubSpot: Viral Post Generator story](https://blog.hubspot.com/marketing/viral-post-generator)*

---

## 7. Timing: launch while AI is the zeitgeist

Frank Lantz explicitly credited Universal Paperclips' virality to cultural timing: *"The meme weather was good for me... there was just enough public discussion of A.I. safety in the air."* An AI-B2B-SaaS-satire game launched now, while AI dominates tech discourse (and AI fatigue is itself a meme), replicates that timing advantage. (Medium confidence — single creator's post-hoc explanation, but directionally obvious.)

*Source: [Universal Paperclips — Wikipedia](https://en.wikipedia.org/wiki/Universal_Paperclips)*

---

## 8. IP safety: parody through archetypes, not trademarks

The demonstrated convention (The Founder's "Kougle / Coralzon / Carrot, Inc.") is to parody via **renamed fictional stand-ins**:

- ✅ VC in a Patagonia-style vest → archetype, invented fund name ("Chad Capital") — safe territory
- ✅ "SYNERGY.AI" → invented company — safe
- ✅ The Y-square power-up is the riskiest current element: keep it a generic orange "acceptance letter" vibe, don't use the actual YC logo/lockup or the words "Y Combinator" in the game
- ❌ Real logos, real trade dress, real fonts of real companies
- ❌ Named real individuals (a "Sam Altman boss" = right-of-publicity risk; an unnamed "AI CEO in a gray tee" archetype is the established safe pattern)
- Post-*Jack Daniel's v. VIP Products*, trademark parody is *least* protected when you use a mark as your own source identifier — another reason to keep every name invented.

This is a demonstrated design convention, not legal advice; if the game blows up, spend an hour with a lawyer.

**Also refuted in verification (so don't over-index on it):** the claim that tech satire must exaggerate only *real* perks/rituals rather than invented absurdities did NOT survive fact-checking — your jokes can freely mix real tropes (standing meetings, term sheets) with invented absurdity (buzzword projectiles).

*Sources: [Fast Company](https://www.fastcompany.com/3067405/the-founder-a-game-about-the-dark-side-of-silicon-valley), [Faegre Drinker on trademark parody](https://www.faegredrinker.com/en/insights/publications/2023/4/laugh-it-off-a-guide-to-parody-under-us-trademark-law), [Copyright Alliance: parody vs satire](https://copyrightalliance.org/faqs/parody-considered-fair-use-satire-isnt/), [Game Developer: right of publicity](https://www.gamedeveloper.com/business/right-of-publicity-in-video-games---how-you-can-legally-include-a-celebrity-in-your-game)*

---

## 9. Badge & share-image tech (when you deploy publicly)

Verified implementation path, current as of June 2026:

- **In-page badge (done in v0.1):** client-side canvas → PNG download at **1200×630** (the recommended OG size, correct for LinkedIn's ~1.91:1 card).
- **Link unfurls (v0.2, needs hosting):** use **@vercel/og** (Satori + Resvg) — define the badge in HTML/CSS/JSX, serve dynamic per-player images from one serverless endpoint with score/time as **URL query params** (`/api/og?raised=1510&time=94`). Each win gets a unique URL, so when someone pastes their link on LinkedIn, *their personal badge* is the preview image. Constraints: flexbox-subset CSS only (no grid/z-index/calc), ttf/otf/woff fonts, 500KB bundle cap.
- **Leaderboard:** v0.1 is local-only. For global, the zero-ops options are Supabase / Cloudflare Workers KV / Upstash. Reality check from the research's open questions: client-side scores are trivially forgeable, and for a humor game that's probably fine — a leaderboard whose top entry is "definitely-not-cheating.eth — $999M" is itself content. Add a daily-seed leaderboard rather than an all-time one so it resets and stays winnable.

*Source: [Vercel OG image docs](https://vercel.com/docs/og-image-generation)*

---

## 10. What the research could NOT verify (be honest with yourself about these)

- **LinkedIn-specific virality mechanics** (post formats, algorithm behavior, founder-audience psychology) — no verified case study; §6's LinkedIn advice is grounded inference.
- **Joke density / which SF jokes land** — three plausible-sounding claims about satire specificity were *refuted* in verification. Comedy needs playtesting, not research. Ship, watch what people screenshot, double down.
- **Platformer difficulty tuning for feed traffic** — no data surfaced; start easy, instrument later.
- Case studies are 2014–2022; X's and LinkedIn's algorithms have shifted since. HN remains the stable channel.

---

## 11. Recommended roadmap

**v0.1 (done):** playable single-file game — zones, enemies, power-ups, 2 bosses, win/lose badges, copy-post button, touch controls.

**v0.2 (before any public post):**
1. Deploy to a real URL (Vercel free tier) — a link, not a file
2. Burn-rate timer + double-edged term sheets (satire in mechanics, §4)
3. Sharper badge: bigger numbers, funnier one-liners, game URL baked into the PNG
4. First-30-seconds difficulty pass + one more mid-run joke beat
5. Rename anything YC-adjacent to an invented equivalent (§8)

**v0.3 (launch week):**
6. `/api/og` dynamic badge endpoint (per-run unique URLs)
7. Daily seed + daily leaderboard (Supabase, ~50 lines)
8. Launch: Show HN + X in the morning, LinkedIn founder-story post with your own badge same day, game URL in first comment

---

*Method note: research ran as a 104-agent pipeline — 5 search angles → 22 sources fetched → 108 claims extracted → top 25 adversarially verified with 3 independent votes each → 22 confirmed, 3 refuted (excluded above), 0 unverified. Confidence labels and caveats preserved from verification.*
