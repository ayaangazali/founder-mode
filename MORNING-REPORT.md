# MORNING REPORT — part 6, 2026-07-21 (04:40–05:20 PDT): the night pack (owner went to bed)

**Asks:** zoom out (character was leaving the screen), a hint toward the fire button on deck pickup, two new powerups (bike + one of my choosing). All live on sfspeedrun.com.

- **Dynamic portrait window** — the crop follows the player (~32% from the visible left edge, eased per frame, presentation-only). Spawn/walk-back can't hide the founder anymore; zoom relaxed 1.45x → 1.33x.
- **PITCH ▼ hint** — deck pickup on touch pulses the B button for 4s with a floating tag; copy says 'hit B'.
- **OMNICORP CAMPUS BIKE** — owner's Gemini-bike idea, archetyped per canon (no real brands): +speed, a mob hit dismounts instead of costing RUNWAY (verified: hearts 3→3 through a gremlin), pits still kill, 10s.
- **LOST EARBUDS** — flow state, coins ×2 for 10s, both collection paths.
- Earlier in the session (also all live): DMG-accurate OMNICORP GAME BRO™ deck with a working B=pitch button, frictionless install flow (native one-tap on Android/Chrome, per-browser cards elsewhere, permanent button with ✕-only forever-dismiss), vintage shell, burn-rate warnings, SF SPEEDRUN rebrand.
- **Gate:** all hard gates green · mobile ✓ · paths ✓ · clean bot PASS · casual bot PASS 3:27, 4 recoveries (budget 12).
- **Open:** pedigree leaderboard column (Supabase migration), PostHog vs first-party (owner calls), og.png refresh, key rotation, PARTNERS outreach.

---
---

# MORNING REPORT — part 5, 2026-07-21 (02:55–03:15 PDT): the phone is a Game Boy

**Owner asks:** make mobile feel like a handheld console, make it feel like an app not a website, GamePigeon-style iMessage play if possible.

- **Game Boy shell shipped**: hardware-styled d-pad + big crimson A + START/SOUND pills (SOUND = new in-game touch mute). Portrait = GB classic (bezeled screen, deck below, power-LED brand line); landscape = GBA (d-pad mid-left, A mid-right at thumb height). Screenshots: `qa/persona/gb-*.png`.
- **App feel shipped**: share-sheet → Add to Home Screen now installs SF SPEEDRUN as a fullscreen standalone app with its own icon (founder sprite, generated from the game's draw code) and offline play via a service worker that never touches /api/. All new files optional — the game is still one file.
- **iMessage: not possible from a web repo** — GamePigeon is a native iMessage App Extension (Xcode, Apple dev account, App Store review). Nearest shipped equivalent: paste the link in iMessage → per-run card unfurls → recipient taps into the installable app.
- **Gate**: all hard gates green + overnight-paths + overnight-mobile (zero expectation changes needed for the shell).

---
---

# MORNING REPORT — part 4, 2026-07-21 (02:30–02:55 PDT): SF SPEEDRUN

**Owner asks, live:** rename to SF SPEEDRUN with 'how fast can your startup IPO?' under it · female founder styles · remove the clouds · make backgrounds unmistakably SF · add small gags. All shipped, full gate green (ci-sweep + paths + mobile, clean bot PASS 3 recoveries).

- **Rename** everywhere player-facing: wordmark, tab/og/twitter, badge footer, share texts, /api/r + og card. Kept: konami FOUNDER-MODE mood payoff (a mode, not a brand), HYPERGROWTH DAILY.
- **LONG + BUN** hair styles join the picker (screenshot-verified: `qa/persona/hair-*.png`).
- **Clouds gone** — ambient Karl bands deleted; fog only remains as the FOG THICK TODAY daily modifier.
- **Skyline**: twin-peaks horizon hills, Coit Tower, painted-ladies row in the Mission (Salesforce/Transamerica/Sutro/bridge were already there).
- **Gags**: NO LEFT TURN (EVER) · FOR RENT $4,600 cozy* (*no windows) · 2HR PARKING (towed anyway) · rideshare scooter graveyard · STEALTH HQ porta-potty.
- Nothing deployed; prod still serves the pre-rename build until the owner ships.

---
---

# MORNING REPORT — overnight run part 3, 2026-07-21 (01:45–02:20 PDT): the title redesign

**Mission (owner, live):** the start screen is too crowded, copy reads dev-facing, customization should be a tab. Five design critics (visual hierarchy, deadpan copy, first-time player, mobile, Rams-minimalist) analyzed the shipped title from screenshots + source; a judge merged them into one spec (`qa/persona/title-redesign-spec-2026-07-21.json`); shipped in two commits with Playwright screenshot verification at every step (`qa/persona/title-v2-*.png` vs `title-baseline-*.png`).

**What changed:** 11 title text elements → 6, seven hues → three, fixation order forced to wordmark → CTA → founder. 'the SF startup platformer' cut everywhere including the LinkedIn unfurl title (now the pitch itself). The five-chip picker rainbow became one [C] CUSTOMIZE FOUNDER entry opening a DOM overlay panel — 44px arrows, live preview still visible, ESC/DONE/tap-outside close, SPACE still ships it. D-pad no longer covers the title in landscape. Picker keys and both typing eggs work exactly as before — the paths probe's picker leg passed with zero edits; two probe expectations were updated consciously (mobile d-pad-on-title inverted with the drivability guard retained; reverse-pitch sample band follows the bubble). Detail: `qa/CHANGELOG.md` → `[TITLE REDESIGN]`.

**Gate:** all hard gates green post-change (ci-sweep + paths + mobile + minigames + casual bot). Nothing deployed — local only; play at http://localhost:8080.

---
---

# MORNING REPORT — overnight run part 2, 2026-07-21 (00:30–01:50 PDT): the persona sweep

**Mission:** 10 subagents played the game as 10 SF archetypes (staff eng, VC associate, non-technical marketer, retro-gamer, Gen-Z mobile, a11y designer, HN graybeard, seed founder, SF newcomer, game-UX designer); a synthesis judge deduped 10 structured reports into a 15-item canon-vetted backlog; all 15 were implemented or consciously partialed, one commit each, three tests green per commit. Full raw report + ranked plan: `qa/persona/persona-report-2026-07-21.json`. Itemized detail: `qa/CHANGELOG.md` → `[PERSONA SWEEP]`.

## What the game gained tonight
- **Sound identity**: a death sting (the obituary no longer arrives in silence — 9/10 personas flagged it), per-zone chiptune music (pure WebAudio sequencer on the sim clock, zero files, zero setTimeout), audible boss-damage confirm, audible whiffs, unmute blip.
- **First-run experience**: checkpoints are visible (term-sheet pennants) and announced; the first-pit death no longer resets to x=20; boss-1 retries cost ~700px like the other bosses; DECK is taught when the first deck scrolls into view, not 2000px early; Space retries the death screen (with a visible caption).
- **Mario feel**: 5 frames of coyote time (contract-safe, additive-only — asymmetric gravity/accel curves/bounce changes all REJECTED per the do_not_do list), boss hitstop+shake, strobes retired for steady signals, prefers-reduced-motion honored draw-side.
- **Share loop**: SHARE can no longer fail silently (webview fallback), /api/r unfurls describe the actual run, the unicorn gate holds on every headline (sub-$1B = CERTIFIED HORSE), PIVOT retries rename the company and the obituary mourns the current pivot.
- **Trust/privacy**: analytics honors DNT + GPC; mute is visible, touch-reachable, persistent.

## Gate (all green, seed #202)
ci-sweep hard gates ✅ (canon grep, secret scan, clamps, 3 tests, 9 probes) · overnight-paths ✅ · overnight-mobile ✅ (caught one real regression mid-sweep — end-card reorder shoved buttons off landscape phones — fixed and re-run) · clean bot PASS 2:34, 4 recoveries (budget 6) · casual bot PASS 3:08, **2 recoveries (was 9 pre-change on yesterday's seed — the churn-loop checkpoints are doing their job)**.

## Owner decisions parked
- Pedigree column on the leaderboard (needs a live Supabase migration).
- Replacing PostHog with a first-party counter (it's your wired analytics stack).
- Everything from part 1's list below (key rotation, PARTNERS outreach, launch day, og.png, bak purge).

---
---

# MORNING REPORT — overnight run, 2026-07-20 (23:04–23:35 PDT)

**Mission (ARGUMENTS):** decide the game engine → optimize for it → make sure the app runs smoothly → test thoroughly → verify production. **All five done. Zero changes to `index.html` — the honest finding is that the game needed evidence, not surgery.**

## Verdicts

| # | Ask | Verdict |
|---|---|---|
| 1 | Decide the engine | **DECIDED: vanilla JS + canvas 2D — the current build IS the engine.** Recorded as a dated ledger ruling in `docs/PROJECT-CONTEXT.md` (`525e859`). Phaser/PixiJS: 100KB+ runtime + build step for features the game doesn't use (the whole scene is `fillRect` on 480×270). Godot/Unity WebGL: multi-megabyte multi-file exports that break "one file, loads instantly, no build." The fixed-timestep accumulator + `playMs` clock already solve determinism, pause, and tab-throttle — the hard engine problems. This also just restates CLAUDE.md canon ("no framework, ever"), now with the rationale on the record. |
| 2 | Optimize for it | **MEASURED FIRST; NO OPTIMIZATION JUSTIFIED.** New `qa/perf-bench.js` (`b392b0e`, advisory — never gates CI): worst-phase p95 step+draw = **0.70ms of the 16.67ms frame budget** — 24× headroom on a *software* rasterizer; real GPUs do better. Zero over-budget frames in any biome or boss arena. |
| 3 | Runs smoothly | **PROVEN.** 90s continuous-play soak: heap flat at 9.5MB (no leak → no GC hitches), entity arrays bounded (popups capped, shots/crates culled). Touching a 0.3ms draw path on a load-bearing loop for zero payoff was ruled out on purpose — that's churn risk, not optimization. |
| 4 | Tested thoroughly | **ALL GATES GREEN** at `b392b0e`, seed #201 — full table below. |
| 5 | Works in production | **VERIFIED LIVE, ZERO DRIFT.** The deployed game is **byte-identical to main HEAD**. Live play session on sfspeedrun.com: 930ms load, playable, zero console errors. All four API surfaces healthy. Read-only throughout — no deploys, no writes. |

## Test / probe status (tonight, seed #201)

| Suite | Result |
|---|---|
| Canon greps + secret scan + npm audit + clamp gate | clean / clean / 0 vulns / intact |
| `test/smoketest.js` · `playtest.js` · `deathtest.js` | PASS · PASS · PASS |
| All 8 `qa/*-probe.js` + `qa/verify-daily-seed.js` | 9/9 PASS |
| `qa/overnight-paths.js` | ALL PASS |
| `qa/overnight-mobile.js` | ALL PASS |
| `test/fullrun.js` (clean) | PASS — badge 02:45, 4 recoveries (budget 6) |
| `test/fullrun.js --casual` | PASS — badge 04:39, 9 recoveries (budget 12), haircut exact |
| `qa/perf-bench.js` (new, advisory) | worst p95 step+draw 0.70ms / 16.67ms, zero page errors |

Note for the 07-11 report's open run-length question below: with Cerebral Valley live (world 9200), the casual bot now lands **4:39** — inside the 3–6 min band that was flagged PARTIAL back then. That question can be considered closed by content, not levers.

## Production evidence (read-only, 2026-07-20 ~23:15 PDT)

- `sfspeedrun.com`, `www.sfspeedrun.com`, `foundermode.vercel.app`: all HTTP 200, all serving the same 236,309-byte page, **diff vs local `index.html` = empty**.
- Live headless play: load 930ms, PLAY state reached, player moves, seed #201 computed correctly, zero page/console errors. Screenshot: `qa/overnight/prod-live-2026-07-20.png`.
- `GET /api/leaderboard?seed=201` → `{"ok":true,"top":[]}` (nobody played today yet — correct for a daily board). `?all=1` → all-time board live, AYAAN $1.107B 🦄 on top.
- `GET /api/r?...` → 200, per-run og tags correct; the `og:image` it emits (`/api/og?...`) renders a 1200×630 PNG (43KB, `image/png`). Static `og.png` also 200.

## What shipped (commits tonight)

- `525e859` — Ledger: engine ruling (docs only).
- `b392b0e` — QA: `qa/perf-bench.js` advisory benchmark + baseline numbers.
- This report + CHANGELOG entry `[OVERNIGHT VERIFY]` + prod screenshot (final commit).

## Skipped / not attempted, and why

- **GOAL.md phases 0–5 as written**: already shipped by earlier runs (tags `v0.2-rc1`, `playable-rc1`; daily seed, api/, OG tags, sanitized CAMEOS all verified present tonight). Re-executing them would have re-litigated finished work; tonight re-ran their *verification* instead.
- **Any perf code change**: measured 24× headroom; see verdict 2/3.
- **Deploy-anything**: forbidden by GOAL — and unnecessary, prod already matches HEAD exactly.

## Human-decision list (unchanged from CLAUDE.md TODOs)

- (a) Rotate the Anthropic API key that leaked into chat history.
- (b) PARTNERS.md outreach: collect written billboard yeses (unlocks SPOTTED).
- (c) Pick the launch day and run `docs/LAUNCH-PLAYBOOK.md` (incl. LinkedIn Post Inspector + iOS Safari badge-save check).
- (d) Refresh static `og.png` to current badge art, or lean on `/api/r` per-run cards.
- (e) Before repo-public: purge/exclude `index.v0.1.bak.html` brand strings; re-check docs/qa.

*Everything tonight was file-level, local, and read-only against prod. No deploys, no signups, no purchases, no posts.*

---
---

# MORNING REPORT — overnight run, 2026-07-11 (05:24–06:30)

## PLAYABILITY VERDICT

| # | Gate item | Verdict |
|---|---|---|
| 1 | Full playthrough proof (human-input bot, title → bell → CERTIFIED UNICORN, ×3 consecutive, zero page/console errors) | **PASS** — 3/3 clean-profile passes (badge TIME 1:19 / ~1:20 / 1:35), zero errors every run. Caveat, stated plainly: each run averaged ~1 mid-run death, recovered through the real PIVOT button in the same run (checkpoints are the design's own recovery loop; the badge was reached every time). |
| 2 | Run-length in the 3–6 min band; fast clean run ≥ ~2:30, else lengthen via levers | **PARTIAL — flagged, not fudged.** Fast competent floor ≈ **1:19**; tourist-profile bot (sign stops, coin detours, hesitation, 3 deaths) = **2:31**. Below the requested band. I did **not** pull levers, deliberately — see "The run-length call" below. This is the one item that needs a human decision. |
| 3 | Every path tested | **PASS** — 23/23 in `qa/overnight-paths.js` + 8/8 in `qa/verify-daily-seed.js`: death badge → PIVOT respawn at checkpoint with exact −25% haircut · R-from-DEAD (checkpoint) vs R-from-WIN (fresh run) · ZERO CHURN + T2D3 + no-flair control · REVERSE PITCH appears at idleT>3600 and cancels on input · C/H/V cycling, localStorage persistence across reload, chosen look pixel-verified on the badge · SAVE downloads a real 160KB PNG · COPY lands on the clipboard AND survives `navigator.clipboard === undefined` |
| 4 | Mobile pass (667×375 + 390×664) | **PASS** — 15/15: d-pad drives the player, end-screen buttons hittable via elementFromPoint after badge decode, d-pad hidden behind the end screen, portrait shows the dismissible rotate prompt, game playable in portrait |
| 5 | Final sweep: 3 tests + probes + canon greps + file:// & http loads | **PASS** — smoketest/playtest/deathtest green, all probes green, canon greps empty, clean load from file:// and localhost http. Tagged **`playable-rc1`** (= `b1a0805`). |

**Bottom line: the game is proven playable end-to-end by real simulated input, on desktop and mobile, with every badge path exercised. The only open question is run LENGTH, not run correctness.**

### The run-length call (item 2 — read this one)
- The floor is arithmetic: 7,500px world ÷ 1.7px/frame ÷ 60fps = **73.5s of pure walking**. Boss fights add ~5–20s. A frame-precise bot lands ~1:19; my most honest tourist simulation (16 sign-reading stops, 7 coin-platform detours, arena hesitation, 3 deaths with walkbacks) lands 2:31. A real first-timer — no route knowledge, learning boss arcs, replaying hop sections — plausibly lands in §2.1's 3–6 band, but I can't simulate ignorance honestly, only slowness.
- Why I didn't lengthen: every permitted lever is blocked or useless. Boss i-frames: FINAL-REVIEW **ruling 2.4** (a §2 ruling — GOAL forbids re-litigating) tuned hitT DOWN to 30 and requires re-measuring casual win rate before ANY escalation; yield would be ~2s anyway. Boss HP: fixed as canon in MASTER-PLAN §1.4 (3/5) and part of the speedrun contract. Enemy density: threatens the §2.1 hard invariant ">80% of first-timers reach a badge" for seconds of yield on a competent run. Coin routing: zero effect on time.
- The design itself expects fast runs: T2D3 flair = win under 3:00 (§1.6, item 41); Bible §10's Any% target is sub-3:00. §2.1's only hard time invariant is "finishable in **≤6 min**" — an upper bound, which passes.
- **The sanctioned lengthener already exists**: M5's Cerebral Valley inserts ~1,700px + a mid-boss (+~30–60s per run) — but it is traction-gated by MASTER-PLAN §4.3. Decide in the morning: accept current length for launch (my recommendation — completion drives shares) or pull M5 forward.

---

## What shipped, per phase (all on `main`; tags: `v0.2-rc1`, `playable-rc1`)

### Phase 0 — Baseline (`a53284c`, `e52af3d`)
- `git init`, everything committed as *war-room build baseline*.
- **CRITICAL FIND: the repo's `index.html` was NOT the war-room build.** It was byte-identical to `index.v0.1.bak.html` (md5 `9a0933ea…`) — the kit-copy step clobbered it. Baseline canon greps FAILED (WEWORK / YC ACCEPTED / YC MODE / Patagonia — all v0.1 strings). I located the real QA-hardened build at `~/Downloads/founder-mode-kit/index.html` (65,312 bytes; fixed-timestep loop, playMs clock, checkpoints, customization, biomes, cameos, eggs; canon-clean), verified markers + all three tests + screenshots, and restored it as `e52af3d`. The `v0.2-rc1` tag points at the restore (GOAL said tag the baseline; tagging the clobbered v0.1 seemed contrary to intent — noted per the smaller-diff rule).
- Environment: playwright was not installed anywhere — `npm install playwright` + chromium headless shell (~93MB, local cache). `package.json`/`package-lock.json` now exist for the test env (game still one file).
- `index.html`, `index.v0.1.bak.html`, `README.md`, `qa/CHANGELOG.md` were chmod 444; I unlocked only the two I had to write (`index.html`, `qa/CHANGELOG.md` — append-only per GOAL).

### Phase 1 — Sanitize for public (`209aead`)
- `design/CAMEOS.md` TIER 2 stripped, replaced with *"Thin-veil variants were evaluated and rejected; see private notes."* Smaller-diff notes: the header's "two tiers" subtitle and the Recommendation paragraph (which references R1/R3/R4 by id, no names) were left as-is; nothing right-of-publicity-adjacent remains in the file.

### Phase 2 — v0.2 copy deck (`2033e2a`, `36b0329`, `372e682`, `6c6e34d`) — commit per item, tests + screenshots per item
- **Seven §1.6 signs** landed. Deviations (all screenshot-proven): HIRING 1150→**1080**, CAFÉ SEMICOLON 2320→**2200** — crate platforms at [1180,182]/[2290,184] sat on the 3-line text band at every ±40 offset (the ±40 rule contemplated sign/cameo occupants, not platforms), so both took the nearest clean ground; MIND THE GAPS moved 6000→**5880** so NOW ENTERING THE CLOUD could keep its §1.6-verified 6000 (item-32's acceptance — renders on seg [5504,6300] — still holds).
- **Fund district** (BIBLE §8): A17Z 3760 · SEQUOIADENDRON 4020 · FOUNDERS ETC. 4320 · HF-0 MONASTERY 4460. ≥120px apart, on segs, all before the arena trigger.
- **Quips + buzzwords**: Chad +4 §1.4 quips + `I'M ALSO IN A17Z'S NEW FUND` (BIBLE §8 tie-in); SYNERGY.AI +5; buzzword pool → 10. Probe-proven: drawn pill = max(26, text+6) ≥ the unchanged 26×9 AABB for every word (item 31 behavior).
- **Badge quote pools** rotate per run via `quoteRoll` (rolled once per fresh run; stable across respawns/re-renders); the war-room zone-aware `DIED IN {zone}` line is untouched — zone stays, quote rotates. All 8 quotes fit the shrink guard ≥32px.
- Not done (out of copy-only scope, mechanics absent from build): `+1 OPINION` / `QUICK QUESTION—` popups (board members don't exist yet).

### Phase 3 — Daily seed + market conditions (`a0a9ad6`)
- `SEED_N` from the calendar date (#1 = 2026-01-01; today = **#192**) + mulberry32 → one of the ten §1.6 modifiers (exact strings) on the title ticker + `daily seed #N` line. All ten wired to real levers (boss HP, COIN_VALUE ±20% with matching popups, extra scooters, quip rate, visual fog, meeting despawn, term-sheet runway, starting hearts, burn tick).
- **Deviation, documented:** the burn-rate mechanic (AUDIT WEEK's lever) was missing from the war-room build — I added it from ROADMAP §3's own 4-line spec (+ smoke warning at 3s). It's a canon loss source (Bible §5) and the only wall-clock read in the game remains the calendar date; all timers read playMs. Test bots never idle >1.5s so all suites stay green.
- Enemy-placement *jitter* from ROADMAP §7 was skipped (GOAL item 9 asked for modifiers/ticker/seed-line only; jitter would complicate same-date layout determinism for no comedic gain).
- `qa/verify-daily-seed.js`: 8/8 — same faked date twice → same seed/modifier/spawn layout; different dates → different seeds + visibly different modifiers; RATES day moves the coin value; zero page errors.

### Phase 4 — Deploy scaffolding, files only (`8aad727`)
- `api/og.jsx` — ROADMAP §8 verbatim. `@vercel/og` added to `package.json` (playwright → devDependencies). The game does not reference it; still one file.
- OG meta tags (BUILD-GUIDE Step 4) added to `<head>`, pointing at `og.png` (verified 1200×630) on the `foundermode.lol` placeholder root.
- **No `vercel.json`** — judged not needed: Vercel zero-config serves the static root and auto-detects `api/` (runtime declared in-file). Nothing was deployed, no accounts touched.

### Phase 5 + Acceptance gate (`b1a0805`, tag `playable-rc1`)
- `test/fullrun.js` (clean + `--casual` tourist profiles), `qa/overnight-paths.js`, `qa/overnight-mobile.js`, 24 screenshots in `qa/overnight/`.
- Probe inversions (FINAL-REVIEW item 33): **none required** — the war-room's verify-* suite lives in the fixer environment and never shipped in this kit; the only pre-existing kit probe was created tonight (`verify-daily-seed.js`). The three shipped game tests needed no expectation changes.

### Phase 6 — this report + CHANGELOG append (`5574f04` + this file's commit)

---

## Test / probe status

| Suite | Result |
|---|---|
| `test/smoketest.js` | PASS (state 1, zero errors) — every commit |
| `test/playtest.js` | PASS (win path, death path, zero errors) — every commit |
| `test/deathtest.js` | PASS (death → R → fresh state) — every commit |
| `test/fullrun.js` (clean ×3) | PASS ×3 — 1:19 / ~1:20 / 1:35, zero errors |
| `test/fullrun.js --casual` (tourist) | PASS — 2:31, deliberate Chad death: checkpoint 4700, haircut 106→79 exact |
| `qa/verify-daily-seed.js` | 8/8 PASS |
| `qa/overnight-paths.js` | 23/23 PASS |
| `qa/overnight-mobile.js` | 15/15 PASS |
| Canon greps (`yc accepted\|yc mode\|patagonia\|wework\|y combinator`) | empty in `index.html` (failed at baseline; clean from `e52af3d` on) |
| Load: `file://` + `http://localhost` | both clean, zero page errors |

## Screenshot index (`qa/overnight/`)
- `clean-title` · `clean-zone-{soma,themission,sandhillroad,thecloud}` · `clean-boss-{vc,ai}` · `clean-win-badge` — the 3×-passed clean run
- `casual-*` (same set) + `casual-death-badge` — tourist run incl. the deliberate death
- `mobile-667x375-{play,endscreen}` · `mobile-390x664-portrait`
- `paths-badge-bothflairs` (ZERO CHURN + T2D3 rail) · `paths-badge-customlook` (GRAPE hoodie on the loss badge) · `paths-reversepitch` (title deck bubble) · `paths-saved-badge.png` (the actual SAVE-BADGE download)

## Skipped / not attempted, and why
- **M5 v1.0 content** (Cerebral Valley, bestiary): traction gate closed (MASTER-PLAN §4.3), per GOAL.
- **Supabase leaderboard / analytics** (ROADMAP §9–10): needs accounts — out of overnight scope.
- **Run lengthening** (gate item 2): deliberately not done — see verdict. The honest options are "accept & launch" or "pull M5 forward"; both are morning decisions.
- **v0.2 board-member/`+1 OPINION` mechanics**: not in the war-room build; Phase 2 was copy-only.
- CHANGELOG note: entry appended (never rewrote history); the file was chmod 444 and had to be unlocked for the append.

## Human-decision list (in order)
- **(a) Domain**: choose/buy (`foundermode.lol` is still a placeholder) and replace `GAME_URL` in `index.html` (one const, line ~1220) + the `og:image` meta URL.
- **(b) Vercel**: create the project and deploy — BUILD-GUIDE Step 2 (repo is deploy-shaped: static root + `api/og.jsx` + `@vercel/og` pinned; no vercel.json needed).
- **(c) Supabase**: create the project for the daily leaderboard (ROADMAP §9) if wanted for launch — the daily seed (Phase 3) is already live client-side.
- **(d) Launch day**: pick Tue/Wed/Thu and run `docs/LAUNCH-PLAYBOOK.md`.
- **(e) NEW — run length**: rule on the item-2 PARTIAL above (accept ~1:19-floor/2:31-tourist runs, or gate-jump M5).
- **(f) NEW — Downloads copy**: `~/Downloads/founder-mode-kit/` still holds the war-room original that saved tonight's run + a stale nested v0.1 copy; archive the former, delete the latter, so the next copy-step accident can't happen.

*Everything above was file-level and local. No deploys, no signups, no purchases, no posts.*
