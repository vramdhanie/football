# My Football

[![Deploy](https://img.shields.io/github/actions/workflow/status/vramdhanie/football/deploy.yml?branch=main&label=deploy&logo=github)](https://github.com/vramdhanie/football/actions/workflows/deploy.yml)
[![Fetch data](https://img.shields.io/github/actions/workflow/status/vramdhanie/football/fetch-data.yml?branch=main&label=data&logo=github)](https://github.com/vramdhanie/football/actions/workflows/fetch-data.yml)
[![License: MIT](https://img.shields.io/github/license/vramdhanie/football?color=green)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Data: football-data.org](https://img.shields.io/badge/data-football--data.org-6f42c1)](https://www.football-data.org)

A fully static football tracker for my favourite European teams — fixtures, results,
standings, and top scorers, built with Next.js (static export), TypeScript, and Tailwind.

Live at [football.vincentramdhanie.com](https://football.vincentramdhanie.com).

## How it works

There is no server and no database. Two GitHub Actions workflows share the
work:

- **Fetch data** (`fetch-data.yml`) pulls from the
  [football-data.org](https://www.football-data.org/) v4 API (free tier,
  throttled to respect the 10 calls/minute limit) and
  [api-football.com](https://www.api-football.com/) (squads), and commits the
  result to `public/data/*.json`. Runs on demand; the 12-hourly schedule is
  commented out until the 2026-27 season starts (~15 Aug 2026) — uncomment
  the `schedule:` block then.
- **Deploy** (`deploy.yml`) builds the static site from the committed data
  and publishes it to GitHub Pages. Runs on every push, on demand, and
  automatically after each successful data refresh.

The browser only ever reads static JSON files — the API tokens never leave
the fetch workflow. Splitting fetch from deploy keeps code deploys fast
(~1.5 min, no API calls) and makes every data refresh a reviewable commit.

## Tracked teams

Defined in [`src/config/teams.json`](src/config/teams.json). To add, remove, or
swap a team: edit that file (team IDs are football-data.org team IDs — find them
via `https://api.football-data.org/v4/competitions/{LEAGUE}/teams`) and push.
If the team plays in a league not already listed, add the league code to the
`leagues` map in the same file.

## Local development

```bash
npm install
cp .env.example .env.local   # put your free API key in it
npm run fetch-data           # ~4 min (throttled API calls) -> public/data/
npm run dev
```

Get a free API key at <https://www.football-data.org/client/register>
(and optionally <https://dashboard.api-football.com/register> for squads).
`public/data/` is committed, so a local fetch produces a diff you can either
commit (it deploys on push) or discard.

## Deployment (one-time setup)

1. Create a GitHub repo and push this project to `main`.
2. Repo **Settings → Secrets and variables → Actions**: add secrets
   `FOOTBALL_DATA_TOKEN` and (optionally, for squads) `API_FOOTBALL_KEY`.
3. Repo **Settings → Pages**: set *Source* to **GitHub Actions**, and set
   *Custom domain* to `football.vincentramdhanie.com` (enforce HTTPS once the
   certificate is issued).
4. At your DNS provider, add a CNAME record:
   `football` → `<your-github-username>.github.io`
5. Push (or run the Deploy workflow manually from the Actions tab). Code
   pushes redeploy the site from committed data; run the **Fetch data**
   workflow to refresh the data (it commits the new JSON and triggers a
   deploy). Uncomment the `schedule:` block in `fetch-data.yml` when the
   season starts for automatic 12-hourly refreshes.

> Note: on public repos GitHub disables scheduled workflows after 60 days
> without repository activity — it emails a warning first, and one click (or
> any commit) re-enables it.

## Free-tier constraints

- ~50 API calls per refresh (5 league standings + top-scorer lists (up to 10
  during the off-season fallback) + 12 team profiles + 12 squads + 12 team
  match lists), throttled to 1 call per 6.5 s.
- Scores are delayed (no live scores on the free tier) — by design; the site
  shows data as of the last refresh (every 12 hours once the schedule is
  enabled).
- Squads, lineups, and deep player stats are a paid add-on — the free tier
  returns empty squads, so the "players" feature is the per-league top
  scorers list (falls back to last season until the new one starts).

## US broadcast badges

Each match card shows which US streaming service carries that competition
(Peacock, ESPN+, Paramount+, beIN). The mapping is hard-coded in
[`src/config/broadcast.ts`](src/config/broadcast.ts) keyed by competition
code — rights change between seasons, so update that file when a deal moves
(Bundesliga and Ligue 1 were pending confirmation for 2026-27).

## Optional second source: api-football.com

Squad data can be filled from [api-football.com](https://www.api-football.com/)
(free plan: 100 requests/day, all endpoints, `players/squads` returns current
squads). Register at their dashboard, then set `API_FOOTBALL_KEY` in
`.env.local` (locally) and as a repository secret (for the workflow). When the
key is present the fetch script pulls each team's current squad (one extra
call per team, still throttled); without it the team pages simply link to the top
scorers page instead. Each team's api-football id lives alongside its
football-data id in `src/config/teams.json`.
