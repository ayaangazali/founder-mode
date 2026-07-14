# CLIP REPORT — HUMOR PATCH v1.1, branch `humor-patch`
### Every implemented moment, its screenshot, and why someone screen-records it.
Regression at head: skilled bot PASS 02:46 · tourist bot PASS 04:21 (3–6 band holds) ·
all 8 probe suites green (obituary 12, mood 8, moments 7, celebs 9, corgi 9, paths 24,
seed 8, mobile 15) · three game tests green after every one of the 11 commits · canon
greps clean · celeb grep-gate enforced as a test.

| # | Moment | Screenshot (qa/overnight/) | Why someone clips this |
|---|--------|---------------------------|------------------------|
| 1 | THE OBITUARY — HYPERGROWTH DAILY front page, generated from your run | obit-gremlin/-meeting/-scooter/-phantom/-VCterms/-buzzword/-pit.png, obit-300px.png | Your death just made the morning paper, with your stats in the article body. People will die on purpose to collect headlines. |
| 2 | Mood meter reads IT'S SO OVER on the death frame | mood-death-frame.png | The meter narrates your emotional whiplash all run, then gets the last word on your obituary screenshot. |
| 3a | First bell pull SNAPS THE ROPE | moment-ropesnap.png | You beat everything, reach the bell — INFRA WASN'T READY TO SCALE. One beat of pure panic, every winner, guaranteed once. |
| 3b | CHAD CAPITAL IS NOW CHAD.AI | moment-chadai.png | The boss you killed pivoted posthumously. The sign glows AI-blue. |
| 3c | THE FAILURE COACH | moment-failurecoach.png | Die 3× in one spot and a guy in athleisure materializes there clapping: "fail faster! this is great for you!" |
| 4a | PETER TEAL (RISKY_CAMEOS) | celeb-teal.png | "COMPETITION IS FOR PEOPLE." All black. Chess pawn. Does not move. |
| 4b | BARRY GAN watches you die | celeb-barry-sawit.png | His cycle is pure hype until you die in front of him: "...OK MAYBE NOT LIKE THAT" |
| 4c | The rocket (and the 1-in-10 landing) | celeb-rocket.png | A rocket launches behind Sand Hill every 45s. Stand perfectly still through one (burn risk!) → WITNESSED HISTORY +$0K. |
| 4d | SAM WALTMAN's sign | celeb-waltman-knew.png | "it knows me" → beat the boss → "it knew me". Two rects. Devastating. |
| 5 | MEETLY.AI recap | meetly-drone.png, meetly-recap.png, meetly-actionitems.png | ~~The notetaker drone watched your boss fight…~~ **CUT 2026-07-14 (owner): the post-fight recap email + chasing paperwork confused playtesters and killed the win moment. The notetaker drone in the arena stays (draw-only flavor).** |
| 6 | THE CORGI | corgi-adopted.png, corgi-cafe.png | Acqui-hire a corgi. Burn pauses (morale: high). You get hit, it sits and waits. It cannot die — that's a tested invariant. |
| 7 | SLOP PHASE | slop-phase.png | The final boss starts generating wrong copies of itself (IA, A1, ΛI). The one drawn CORRECTLY is the real threat. Spot the slop. |
| 8 | HACKATHON HOUSE | hackathon-inside.png | A 12-real-second interior: frozen founders, HOUR 46 OF 48, DEMO IN 10s. Win: "1ST PLACE: a Notion template". |
| 9 | THE VIBES CMO frame | vibescmo-frame.png | Pass her ring light and a vertical-video UI crops the world around YOU: "day in my life as an obstacle · 2.1M views". |
| 9b | Run-club laggard | runclub-laggard.png | Forever behind the group, on his phone: "wait up. wait. guys." |
| 10 | Eggs | egg-title-corgi.png, egg-slopstyle.png, egg-konami.png | Type CORGI → it's waiting at your desk. Type SLOP → the whole run renders wrong. Cheat code → permanent gray zip-up + meter locked to FOUNDER MODE. |

## Spec deviations (smaller-diff rule, as instructed)
1. **PETER TEAL has no Fellowship door.** The spec calls the door "already shipped" — it never was (it's a held easter egg from FINAL-REVIEW). Teal ships doorless; the DROPPED OUT ending + its TEAL FELLOWSHIP headline defer with the door.
2. **ROCKET GUY'S PAD sign omitted.** No clean sign slot exists on Sand Hill's crate-checked layout; the rocket itself (and the WITNESSED HISTORY egg) carry the bit.
3. **Loss-screen button order:** PIVOT (RETRY) stays FIRST, ahead of SAVE FRONT PAGE — FINAL-REVIEW §2's amendment ("losers are the comedy's best distributors; PIVOT first") outranks the spec's button list.
4. **MEETLY recap timing:** the boss reward popups fire immediately and the email overlays them (drawn topmost) rather than strictly *before* the reward — avoids re-sequencing the boss-death block. Reads identically in play.
5. **Run-club wave & tokenmaxxer:** both are unbuilt v1.0 bestiary the spec assumed existed. Shipped the laggard as a standalone NPC (he IS the joke); tokenmaxxer WAGMI/NGMI defers with the entity; the rug-token wrong-glint "tell" already shipped in the power-up patch.
6. **GPU WAITLIST sign skipped** — duplicate of the shipped GPU FOR SALE "(waitlist: 14mo)" joke.
7. **Barry's memory radius** centers on Barry (4306) not the demo-day sign — the spec says "within 60px of HIM".
8. **Konami is tracked during play**, not the title — ↑ on the title starts the game (it's a jump key), so the sequence physically can't be typed there.

## Status (corrected 2026-07-13)
Everything in this report is MERGED TO MAIN and LIVE at foundermode.vercel.app.
The branch names below (`humor-patch`, `billboards`, `build-v1.2`, `pedigree`) are
kept as aliases of main after each review round — the "awaiting review" framing
was true when each section was written and is preserved for history only.

## Billboards (branch `billboards`, 2026-07-12)
| Moment | Screenshot | Why someone clips this |
|---|---|---|
| The 101-billboard skyline — 19 real-startup boards at parallax .5, two stacked heights, every zone | qa/overnight/billboards-*.png | founders screenshot THEIR OWN company's board in the game and post it; that's the outreach hook working in reverse |
| "SPOTTED: CLEAN (a real startup, unlike yours) +$5K" under the one partner board | qa/overnight/billboards-sandhill.png | the game dunks on you while paying you to notice the sponsor — partner gets a clip that flatters them at the player's expense |

Spec deviations for this batch are recorded in PARTNERS.md (anchored-parallax formula; height-stagger instead of the impossible >=900px spacing; CALLIX moved out of CHAD's arena).

## BUILD v1.2 (branch `build-v1.2`, 2026-07-13)
| Moment | Screenshot | Why someone clips this |
|---|---|---|
| The mom round: 0 runway → the world freezes → 📞 INCOMING: MOM → +2 RUNWAY, "I believe in you, sweetie" | qa/overnight/mom-round.png | the single most repostable beat in the game — everyone tags their mom |
| SEED LED BY: MOM (undisclosed) on the win badge + "'he's always been very driven' — the founder's mother" on the front page | qa/overnight/win-frontpage.png | the badge itself becomes the joke; LinkedIn eats it |
| INTERN FAIR: hire THE UNPAID INTERN, watch him take your coins "for exposure," then the LABOR BOARD phantom arrives | qa/overnight/intern-fair.png | mechanical karma; the compliance phantom finally has a cause |
| THE 10X INTERN tanks one hit, demands equity + a title + to lead eng, quits | (in-run) | the exact arc of every 10x hire, in four seconds |
| AI cofounder: "I have deleted the database." → "I have restored the database." | qa/overnight/cof-mom-follow.png | the two-bubble arc IS the meme |
| Accelerator 2.0: answer "my mom is backing us." while mom-backed — "...respect." | qa/overnight/interview-v2.png | the crossover payoff between two features |
| CMO frame: view counter ticks live, hearts float off you, coins pay +0 REAL DOLLARS (impressions) | qa/overnight/cmo-frame-live.png | vanity metrics made literal |

### Spec conflicts (smaller-diff rule invoked)
- **Part A billboards**: the spec's list predates the owner's live cuts (GOJIBERRY/REPLIT/SUPABASE stay cut) and the v2 renderer. Net-new delta only: IMAGINE AI added (spec x8500 sat inside SYNERGY.AI's arena → x8150). See PARTNERS.md.
- **B2 booths**: spec x1400 sat 20px off a pit lip → x1330; CV booth at x4380. Hiring is dwell-gated (~0.5s standing) so the sense-act bots can't staff up at sprint speed — spec's "walk into" reads as instant, dwell is the bot-safe smaller diff.
- **B3 pull quote**: the mom quote is too long for the 30px pull-quote line; split across quote + attribution, full sentence intact. The 1-in-6 rescue also requires playMs > 20s so die-on-purpose QA probes stay deterministic (MOM-cofounder rescues are always guaranteed).
- **B4 questions**: spec's 4-option cards trimmed to the engine's two-option ←/→ mechanic; funniest wrong answer kept per question. "Where in ten years?" dropped to hold the 7-question format.
- **B1 TECHNICAL +8% speed**: an opt-in run modifier — flagged here for the speedrun contract; default NONE keeps the baseline untouched.

### v1.2 final regression (item 7)
Sense-act bot: clean PASS 02:59, tourist PASS 04:33 — both in the 3–6 minute
band. First clean run exposed a bot bug (parked at x9080 mashing before the
ceremony arms at x9100 — fixed: bot walks in first). All 3 suites + 9 probe
files green; canon greps empty.

## BUILD v1.3 — THE PEDIGREE (branch `pedigree`, 2026-07-13)
| Moment | Screenshot | Why someone clips this |
|---|---|---|
| The end-card math with the résumé on it: RAISED × growth × discipline × corgi × **PEDIGREE ×100** — same run, $4.35M self-made vs $435M ex-SYNERGY.AI | qa/overnight/pedigree-card-none.png vs -exsyn.png | the side-by-side IS the discourse; performance barely moved the number |
| Chad Capital reads the résumé: "oh, you were at SYNERGY.AI? here's the check" (-1 HP before the fight) vs "and who are you?" | (arena door) | fund-the-pedigree made mechanical |
| NEPO FOUNDER's board member trailing you all run — gray suit, coffee, "your father says hi.", physically blocks you | qa/overnight/pedigree-boardmember.png | the warm intro has a body |
| Win with NO PEDIGREE: subhead "Nobody can explain how." + SELF-MADE (unfundable) flair | qa/overnight/pedigree-card-none.png | the hardest flex in the game |

### Spec notes
- Baggage all reuses existing systems per guardrail: −1 heart (reset), compliance
  phantom dispatch (LABOR BOARD pattern), deck pickup no-op, actionItems-style
  block-push follower, boss maxhp bump. No new physics.
- "×20+" investor shift keys off `ped().mult >= 20` (TEAL FELLOW, NEPO, ex-SYNERGY.AI).
- Server caps: plausibility widened ×100 (raised×390) + absolute $1.2B ceiling;
  theoretical max legit run ($3M raised, all multiples) = $1.155B, inside the ceiling.
- Final regression on `pedigree`: sense-act bot clean PASS 02:49, tourist PASS
  04:52 (band held with NO PEDIGREE default); 3 suites + 7 probe files + 8
  feature probes green; canon greps empty.
