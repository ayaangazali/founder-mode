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
| 5 | MEETLY.AI recap | meetly-drone.png, meetly-recap.png, meetly-actionitems.png | The notetaker drone watched your boss fight. All 47 action items: assigned to YOU. Then the paperwork physically chases you. |
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

## Not merged, not deployed
This branch is `humor-patch`, 11 commits ahead of main, awaiting owner review.
`git checkout humor-patch` to play it; `git diff main..humor-patch -- index.html` for the full diff.
