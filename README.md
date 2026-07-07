# My Football

A fully static football tracker for my favourite European teams — fixtures, results,
standings, and squads, built with Next.js (static export), TypeScript, and Tailwind.

Live at [football.vincentramdhanie.com](https://football.vincentramdhanie.com).

## How it works

There is no server and no database. A GitHub Actions workflow
pulls data from the [football-data.org](https://www.football-data.org/) v4 API
(free tier, throttled to respect the 10 calls/minute limit), writes it to
`public/data/*.json`, builds the static site, and deploys it to GitHub Pages.
It runs on every push and on demand; the 12-hourly scheduled refresh is
commented out in `.github/workflows/deploy.yml` until the 2026-27 season
starts (~15 Aug 2026) — uncomment the `schedule:` block then.
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
   redeploys on every push — and every 12 hours once the `schedule:` block
   in the workflow is uncommented (do this when the season starts).

> Note: on public repos GitHub disables scheduled workflows after 60 days
> without repository activity — it emails a warning first, and one click (or
> any commit) re-enables it.

## Free-tier constraints

- ~26 API calls per refresh (4 league standings + 4 top-scorer lists, up to 8
  during the off-season fallback + 9 team profiles + 9 team match lists),
  throttled to 1 call per 6.5 s.
- Scores are delayed (no live scores on the free tier) — by design; the site
  refreshes on deploy (and every 12 hours once the schedule is enabled).
- Squads, lineups, and deep player stats are a paid add-on — the free tier
  returns empty squads, so the "players" feature is the per-league top
  scorers list (falls back to last season until the new one starts).
