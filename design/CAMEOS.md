# CAMEOS — background legends of the Bay
### Two tiers: SHIP (composite archetypes) and YOUR-CALL (thin-veil parodies, risk-labeled)

Cameos are **non-interactive background NPCs + one sign line each** — pure flavor, found not advertised. Sprites are 12–16px fillRect specs in the game's idiom. Placement avoids boss arenas and pits (validated against the world map).

**The legal line in one sentence (from the kit's own research §8, and it's not legal advice):** trademarks are about *brands*, but cameos are about *people* — the right of publicity — and courts have sided with celebrities against games even when names were changed, if the person stays identifiable. Composite archetypes are the established safe pattern; thin-veils are a bet. If the game blows up, an hour with a lawyer costs less than a takedown.

**Middle-path rule if you ship any thin-veil:** appearance-only easter eggs (low spawn chance), never on badges, never in marketing screenshots, never named in the share text. Exposure scales with distribution — keep them out of the distribution surfaces.

---

## TIER 1 — SHIP: the composite archetypes (6)

Recognizable as a *species*, not a person. Everyone in tech knows all six; none of them is any single human.

### 1. THE CONTRARIAN — Sand Hill Road, x≈6350 (post-shift)
The philosopher-VC. Believes everything popular is wrong, including this game.
- **Sprite (12×16):** charcoal suit `#2b2d42`, no tie, pale skin option from FOUNDER_LOOK palette, one raised eyebrow (1px offset eye), tiny chess pawn ♟ beside him (3×5px, `#e8ecf5`).
- **Sign line:** `THE CONTRARIAN` / `"consensus is a bug"` / `(funds only monopolies)`
- **Idle animation:** none. He does not move. Moving is consensus.

### 2. THE ACCELERATOR DAD — Cerebral Valley, x≈4470 (by the HACKER HOUSE sign)
The accelerator CEO who replies to every founder at 2am with unstoppable optimism.
- **Sprite (12×16):** gold blazer `#e8b83a` over tee, phone perma-out (reuses Thought Leader's phone pixels), huge 2px smile.
- **Sign line:** `THE ACCELERATOR DAD` / `"just ship it."` / `"also: ship it"`
- **Idle:** waves at the player every 90f (arm = 3×2px swap). The only NPC who acknowledges you.

### 3. THE E/ACC REPLY GUY — The Mission, x≈2900
Thermodynamic destiny, but as a personality.
- **Sprite (12×16):** black shades band (4×2px `#111`), flame-gradient shirt (`#ff8c37` over `#d64550`), leaning 2px off vertical.
- **Sign line:** `E/ACC REPLY GUY` / `"decel detected"` / `(he means you, slow down)`

### 4. THE STEALTH LEGEND — SOMA, x≈1700
Nine years in stealth. The company is the mystery. The mystery is the company.
- **Sprite:** literally a cardboard box `#8a5a2b` (14×12) with two eye holes (2×2 `#111`) and a coffee cup on top. The box breathes (±1px height every 40f).
- **Sign line:** `STEALTH STARTUP` / `est. 2017` / `"almost ready"`

### 5. THE PODCAST SAGE — The Cloud, x≈7600 (post-shift)
Interviews founders about interviewing founders. Three hours minimum.
- **Sprite (12×16):** headphones arc (1px `#c58bff`), vintage mic on a 6px stand, gazes middle-distance (eyes 1px higher than normal).
- **Sign line:** `THE PODCAST SAGE` / `"so... childhood?"` / `ep. 4,721`

### 6. THE ANGEL WHO WAS EARLY — Sand Hill Road, x≈6600 (post-shift)
Was employee #4 somewhere enormous. Passed on everything you've heard of since.
- **Sprite (12×16):** fleece `#6e7787`, halo ring recycled from Thought Leader but gray (`#8d99ae`) — a *lapsed* halo.
- **Sign line:** `ANGEL, WAS EARLY` / `"I passed on 12 unicorns"` / `(says it like a credential)`

---

## TIER 2 — YOUR CALL: thin-veil parodies (DO NOT SHIP BY DEFAULT)

Fully designed so the decision is yours, not blocked on design. Each carries an **identifiability risk note** — the more identifiable, the more real the right-of-publicity exposure. None appear on badges or in share text even if enabled. Enable via a single flag: `const RISKY_CAMEOS = false`.

### R1. "PETER TEAL" — the monopoly philosopher
- **Concept:** stands at the END of Sand Hill Road, past Chad's arena — above even the VCs. Offers the game's most subversive easter egg: the **TEAL FELLOWSHIP** — walk into his glowing door and your run ENDS immediately with a special badge: `DROPPED OUT — "the fellowship was real" — raised $100K, kept your soul?`. Mechanically it's a third mid-game ending. It's also the funniest possible LinkedIn badge.
- **Sprite (12×18):** navy blazer, no smile pixels at all, standing beside a doorway of pure white.
- **Risk note:** name is a one-letter color-swap of a living public figure + a signature program reference = **highly identifiable. Real right-of-publicity exposure.** The *mechanic* (a drop-out fellowship door) could ship safely renamed: `THE FELLOWSHIP — quit now, keep the story` with the composite CONTRARIAN beside it. **Recommended: ship the mechanic, skip the name.**

### R2. "BARRY GAN" — the demo-day hype uncle
- **Concept:** at the Cerebral Valley DEMO DAY sign, cheering every founder who runs past. Speech bubble cycles: `YOU CAN JUST BUILD` · `LFG` · `SF IS BACK` (paraphrased vibes, not verbatim quotes).
- **Sprite (12×16):** crisp tee, baseball cap, double thumbs-up (2×2px fists raised).
- **Risk note:** rhyme-name of a living accelerator CEO = identifiable; the catchphrase-adjacent lines increase it. The composite ACCELERATOR DAD (#2 above) delivers ~90% of this joke at ~0% of the risk. **Recommended: composite instead.**

### R3. "MELON TUSK" — the rocket guy
- **Concept:** background only — a tiny rocket launches from behind the Sand Hill skyline every ~45s (6px flame streak, parallax layer). A sign: `ROCKET GUY'S LAUNCHPAD` / `"acquiring the fog next"`.
- **Sprite:** none (he's never seen — only the rocket). This is the safest thin-veil because the *person never appears*.
- **Risk note:** "Melon Tusk" is an internet-established parody name and no likeness is depicted — **lowest risk of the tier**, but the name still points at one person. A no-name rocket gag is 100% safe and 95% as funny.

### R4. "SAM WALTMAN" — the AGI whisperer
- **Concept:** stands outside the SYNERGY.AI campus holding a tiny sign: `it knows me` — implying he's either SYNERGY.AI's creator or its first believer. Gray tee (the research's own example of the safe archetype was "an unnamed AI CEO in a gray tee" — naming him un-safes it).
- **Sprite (12×16):** gray tee `#8d99ae`, backpack, mild expression.
- **Risk note:** the research report *specifically* used this person as the example of what NOT to do with a name. Unnamed gray-tee believer NPC = fine and already canon-adjacent to SYNERGY.AI's lore. **Recommended: ship him unnamed** — the joke ("it knows me") works better anonymous anyway.

---

## Recommendation (opinionated, since you asked for the best possible game)
Ship all 6 composites + the **renamed Fellowship door mechanic** from R1 + the **no-name rocket** from R3 + the **unnamed gray-tee believer** from R4. You keep every laugh, gain a third ending, and the only thing you lose is four names that a lawyer would bill you about. Insiders will still know exactly who everything is — that's what makes composites work: *the audience does the identifying, not the game.*
