# QUESTS-PLAN — helpers, quest NPCs, and mid-run allies
### Design plan (owner-requested, 2026-07-11). Nothing here is built yet except where marked SHIPPED.

## The rule that shapes everything
Canon rule 1: the satire lives in the mechanics. So "people who help you" must help
the way SF actually helps — conditionally, transactionally, and with a joke attached.
All characters are composite archetypes (canon rule 3 — never real people, any tier).
One file, no assets, no accounts; every NPC is fillRect + a proximity bubble, same
pattern as the shipped cameos/funders.

## Already shipped tonight (main branch)
- GOOD PRESS (shield), PITCH DECK (timed attack), ANGEL CHECK (runway refill) —
  the "make it easier" trio, as power-ups.
- Testing branch has the four FUNDER NPCs (walk up → they wire a check). These are
  the prototype for quest-giver NPCs below.

## Tier 1 — helpers (small builds, ship in any order)
1. **THE ANGEL WHO WAS EARLY** (funding NPC, main-game port of the testing funders)
   - Stands on Sand Hill. Walk up → one-time +$150K. "I passed on 12 unicorns.
     Not this time." The testing branch already proves the mechanic; porting = ~20 lines.
2. **THE ADVISOR** (escort buff — spec exists as the held ADVISOR MODE egg)
   - A translucent mentor ghost near each zone sign. Stand next to them 2s → they
     follow for 30s and slow-blink useless advice ("have you tried enterprise?") —
     while following, coins are worth +$1K (advice is technically worth something).
3. **THE RECRUITER** (conditional ally)
   - Mission NPC: "bring me proof of traction." Stomp 5 enemies while she watches
     (same-screen) → she joins as a hire: one extra hit absorbed (a GOOD PRESS
     charge, reskinned as "the new hire takes the meeting for you").

## Tier 2 — quests (fetch/do loops, one flag each)
4. **THE GPU QUEST** (Cerebral Valley)
   - The GPU FOR SALE sign gains a seller NPC. Quest: carry the GPU (pickup slows
     you ×0.9 — it's heavy) from 5062 to the HACKER HOUSE at 4450 — BACKWARD through
     the phantom corridor. Reward: +$250K and the house lights turn GPU-green brighter.
     Satire: the errand is worth more than the product.
5. **THE INTRO CHAIN** (Sand Hill)
   - THE PARTNER: "talk to THE ELDER GP first." THE ELDER GP: "who sent you?" Walk
     back. Three hops across the fund row → the warm intro pays +$300K total.
     Satire in mechanics: the money literally requires walking in circles.
6. **THE PIVOT QUEST** (any zone, once per run)
   - A founder NPC begs you to try their app. Idle next to them 3s (burn-rate risk
     is the cost!) → +$50K "pilot customer" and their sign changes to 'ACQUIRED (by us)'.

## Tier 3 — bigger swings (gate behind launch traction, like M5 was)
7. **CO-FOUNDER RUN** — pick a co-founder archetype on the title screen (hacker /
   hustler / designer); they trail you and grant one passive (hacker: +1 deck throw
   window; hustler: funders pay +25%; designer: badge gets a custom frame). This is
   the "people help you" fantasy at full size — and a second picker row.
8. **BOARD MEETING EVENTS** — every 90s, a BOARD MEMBER spawns with a yes/no bubble
   ("pivot to AI?"). Jump = yes, duck = no; small buff/debuff either way. Ships the
   long-specced board-member entity as content instead of pure hazard.

## Constraints checklist for any of the above
- [ ] Named in-universe, archetype only (no real people — FINAL-REVIEW §4.4 is absolute)
- [ ] Pure fillRect sprite + bubble; no collision changes; quest state = one top-level flag
- [ ] Tests green; a probe per quest (the funder probe is the template)
- [ ] Helps the >80%-reach-a-badge invariant, never fights it
- [ ] Rewards in RAISED, costs in RUNWAY/time — the game's two currencies only
