# Design Kit — how to use these files

Everything visual for v0.2 and v1.0 was designed, coded, and screenshot-verified **before** any Claude Code session. Claude Code's job is integration, not invention.

## Files

| File | What it is |
|---|---|
| `gallery.html` | **Open this.** Self-contained animated design lab: every new entity animated in the game's rendering style, the Platform boss-fight pattern running live, the new signs, the v0.3 title-screen mock, and all six ending badges rendered at full 1200×630. Double-click it like the game. |
| `sprites.js` | **The source of truth.** Paste-ready draw functions in the game's exact idiom (fillRect on a virtual pixel grid, `s` scale param, palette constants). The gallery embeds a copy; if the two ever disagree, sprites.js wins. |
| `DESIGN-NOTES.md` | This file. |

## What's in sprites.js (and where each function goes in index.html)

| Function | Version | Target section in index.html |
|---|---|---|
| `drawDemoDayLetter` | v0.2 | powerup drawing block (replaces the `'yc'` case visuals) |
| `drawBoardMember` | v0.2 | SPRITES (new); spawned in the powerup pickup block; AI reuses the gremlin walker in the enemies update |
| `drawThoughtLeader` + `drawThreadBomb` | v1.0 | SPRITES (new); needs a small flyer branch in the enemy update (sine hover, no gravity) |
| `drawCompliancePhantom` | v1.0 | SPRITES (new); flyer branch too, but ignores terrain entirely |
| `drawRobotaxi` | v1.0 | drawn in the world layer; behaves as a *moving entry in `plats`* |
| `drawPlatformBoss` + `drawSDKCrate` | v1.0 | drawBoss gains an `id:'platform'` case; crates are shots that convert into temporary `plats` entries on landing |
| `drawFounder` | — | already in the game (copied here only so badges render standalone) |
| `makeBadgeV2(kind, stats)` | v0.2 (2 kinds) / v1.0 (4 kinds) | replaces `makeBadge(won)`; v0.2 ships `'unicorn'` + `'runway'` only |
| `drawSign` | — | already in the game (copied for previews); the new sign *content* is MASTER-PLAN §1.6 |

## Design decisions locked here (don't relitigate during build)

1. **DEMO DAY LETTER**: gold envelope + red rocket stamp, zero letter glyphs. This replaces the orange "Y" — the launch-blocking legal item.
2. **ROBOTAXI, not a brand name.** The master plan's "WAYMO" placeholder violated canon rule #3 (no real trademarks); the shipped name is the archetype ROBOTAXI. It is neutral and rideable — the Bay's one trustworthy citizen.
3. **BURN has no sprite.** Smoke particles from the founder's feet only. Nobody has ever seen it.
4. **The Platform's crates become platforms.** The trap is the ladder — you climb its own lock-in to stomp it. The fight demo in the gallery is the reference implementation of the pattern.
5. **Badge layout v2**: stat column at x=320, quote at y=488, `► PLAY: {url}` at y=556 in the border color, tagline bottom-right. All six variants share one factory (`makeBadgeV2`) — win/loss ship in v0.2, the other four are v1.0 endings.
6. **Palette**: new entities only add 14 colors (`PAL` in sprites.js); everything else reuses the game's existing palette so nothing looks pasted-in.

## The Claude Code handoff (when you're ready — not before)

The M1 prompt is now roughly: *"Read CLAUDE.md, docs/MASTER-PLAN.md §1.5–1.6, and design/sprites.js. Integrate the v0.2 items: swap the yc power-up visuals for drawDemoDayLetter, add the burn-rate mechanic, add board-member followers per the spec, replace makeBadge with makeBadgeV2 (unicorn/runway only), add the new signs and quips from the master plan. Run all three tests after each change."*

Verification stays the same: `node test/smoketest.js && node test/playtest.js && node test/deathtest.js`, plus your eyes on gallery.html vs. the in-game result.
