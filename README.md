# My Football

A fully static football tracker for my favourite European teams — fixtures, results,
standings, and squads, built with Next.js (static export), TypeScript, and Tailwind.

Live at [football.vincentramdhanie.com](https://football.vincentramdhanie.com).

## How it works

There is no server and no database. A GitHub Actions workflow runs every 6 hours,
pulls data from the [football-data.org](https://www.football-data.org/) v4 API
(free tier, throttled to respect the 10 calls/minute limit), writes it to
`public/data/*.json`, builds the static site, and deploys it to GitHub Pages.
The browser only ever reads those static JSON files — the API token never
leaves the build environment.

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
npm run fetch-data           # ~2.5 min (throttled API calls) -> public/data/
npm run dev
```

Get a free API key at <https://www.football-data.org/client/register>.

## Deployment (one-time setup)

1. Create a GitHub repo and push this project to `main`.
2. Repo **Settings → Secrets and variables → Actions**: add secret
   `FOOTBALL_DATA_TOKEN` with your API key.
3. Repo **Settings → Pages**: set *Source* to **GitHub Actions**, and set
   *Custom domain* to `football.vincentramdhanie.com` (enforce HTTPS once the
   certificate is issued).
4. At your DNS provider, add a CNAME record:
   `football` → `<your-github-username>.github.io`
5. Push (or run the workflow manually from the Actions tab). Thereafter it
   redeploys on every push and every 6 hours on schedule.

> Note: on public repos GitHub disables scheduled workflows after 60 days
> without repository activity — it emails a warning first, and one click (or
> any commit) re-enables it.

## Free-tier constraints

- ~21 API calls per refresh (4 league standings + 9 team profiles/squads +
  9 team match lists), throttled to 1 call per 6.5 s.
- Scores are delayed (no live scores on the free tier) — by design; the site
  refreshes every 6 hours.
- No lineups or per-player stats on the free tier; "players" = squad lists.
