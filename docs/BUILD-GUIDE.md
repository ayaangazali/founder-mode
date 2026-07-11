# Build & Deploy Guide — step by step

The game is one HTML file with zero dependencies, so "building" is really just running and deploying. Total time to a public URL: ~15 minutes.

---

## Step 1 — Run it locally (0 minutes)

Double-click `index.html`. It runs from the filesystem — no server needed.

If you prefer a local server (needed only if you later add fetch calls):

```bash
# any of these, from the kit folder:
npx serve .
python3 -m http.server 8000
```

Then open http://localhost:8000

---

## Step 2 — Put it on a public URL (10–15 minutes)

A file attachment can't go viral; a link can. Three free options — pick ONE.

### Option A: Vercel (recommended — you'll want it for v0.3's dynamic badges anyway)

1. Make a GitHub repo and push the kit folder (or just `index.html`):
   ```bash
   git init
   git add index.html
   git commit -m "FOUNDER MODE v0.1"
   git branch -M main
   # create a repo on github.com, then:
   git remote add origin https://github.com/YOURNAME/founder-mode.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New Project** → import the repo
3. Framework preset: **Other**. No build command, no output directory changes. Deploy.
4. You get `founder-mode-yourname.vercel.app`, live in ~30 seconds. Every `git push` auto-redeploys.

### Option B: Netlify (fastest possible)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `index.html` file onto the page. Done. You have a URL.

### Option C: GitHub Pages (what 2048 used to reach 23M players)

1. Push to GitHub as in Option A
2. Repo → Settings → Pages → Source: `main` branch, root folder → Save
3. Live at `yourname.github.io/founder-mode` in a minute or two

---

## Step 3 — Custom domain (optional but worth it, ~$10)

A joke domain is part of the joke and makes the LinkedIn post look intentional.
Ideas in the spirit of the game: `foundermode.lol`, `outofrunway.com`, `stompchurn.com`, `synergyai.wtf`

1. Buy on Cloudflare Registrar / Namecheap / Porkbun
2. In Vercel/Netlify: Project → Domains → add the domain → follow the DNS instructions (one CNAME record)
3. HTTPS is automatic on all three hosts

---

## Step 4 — Make link previews look right (5 minutes, do before sharing anywhere)

`index.html` already has `og:title` and `og:description` meta tags. Add a static preview image so the link unfurls with a picture:

1. Take a screenshot of the title screen (or use `screenshots/title.png`, ideally re-cropped to 1200×630)
2. Put it next to index.html as `og.png` and add inside `<head>`:
   ```html
   <meta property="og:image" content="https://YOUR-DOMAIN/og.png">
   <meta property="og:image:width" content="1200">
   <meta property="og:image:height" content="630">
   <meta name="twitter:card" content="summary_large_image">
   ```
3. Test with [opengraph.xyz](https://www.opengraph.xyz) or LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/)

(Per-player dynamic badges in link previews are a v0.3 upgrade — see ROADMAP.md §2.)

---

## Step 5 — Verify before you share

Manual checklist (2 minutes):

- [ ] Loads on desktop Chrome + Safari, starts with SPACE
- [ ] Loads on your phone, touch buttons appear, playable
- [ ] Die on purpose → OUT OF RUNWAY badge appears → SAVE BADGE downloads a PNG → COPY LINKEDIN POST puts text on clipboard
- [ ] Beat the game (git gud) → CERTIFIED UNICORN badge → same two buttons work
- [ ] M mutes/unmutes sound

Automated (optional): from the kit root with Node installed:

```bash
npm install playwright   # once; downloads its own browser
node test/smoketest.js   # loads + starts the game, checks for JS errors
node test/playtest.js    # full run: bosses, win screen, screenshots
node test/deathtest.js   # death + R-restart flow
```

---

## How to edit the game

Everything is in `index.html`, organized in labeled sections (`LEVEL DATA`, `PHYSICS / UPDATE`, `SPRITES`, `END SCREENS + BADGE`...).
`docs/GAME-DESIGN.md` maps every tweak you'll want (jokes, difficulty, enemies, badge text) to the exact place in the file. No build step — edit, save, refresh.
