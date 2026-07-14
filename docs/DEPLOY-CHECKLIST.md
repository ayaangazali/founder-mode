# DEPLOY CHECKLIST — sfspeedrun.com cutover (branch `board-and-domain`)

**This branch tip points every host reference at https://sfspeedrun.com.
Deploying it before the domain resolves breaks share links, og unfurls, and
the board client. Do these IN ORDER:**

1. [ ] **Buy the domain** — sfspeedrun.com (owner).
2. [ ] **Attach in Vercel** — project founder-mode-kit → Settings → Domains →
       add `sfspeedrun.com` + `www.sfspeedrun.com` (www → apex redirect).
3. [ ] **Verify DNS** — `curl -sI https://sfspeedrun.com` returns 200/308 from
       Vercel; certificate issued (no SSL warning in a browser).
4. [ ] **Merge** — `git checkout main && git merge board-and-domain`, branch
       aliases fast-forwarded, push all.
5. [ ] **Deploy** — `vercel deploy --prod --yes`; verify:
       - game loads at https://sfspeedrun.com
       - `/api/leaderboard?seed=<today>` answers
       - `/api/og?w=1&n=TEST&v=100&r=100&t=03:00&p=2` returns a PNG
       - `/api/r?w=1&n=TEST&v=100&r=100&t=03:00&p=2` carries sfspeedrun og tags
6. [ ] **LinkedIn Post Inspector** — paste an `/api/r` result URL, confirm the
       per-run card unfurls on the NEW host (inspector also busts LI's cache).
7. [ ] **Re-seed** — `node qa/seed-board.js` (its HOST already points at the
       new domain) if the day's board should look lived-in.
8. [ ] Old host keeps serving (foundermode.vercel.app stays attached in
       Vercel) — links already in the wild keep working; no redirect work needed.

Host references centralized this commit (all now sfspeedrun.com):
`GAME_URL` const + 3 og/twitter meta tags (index.html) · `HOST` const in
api/r.mjs (3 uses hoisted) · URL-parse bases in api/og.mjs + api/leaderboard.mjs
· qa/seed-board.js HOST · README.md (3 links) · docs/WHATS-BUILT.md.
Badge + obituary footers and shareText all derive from GAME_URL already.
