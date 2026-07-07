#!/usr/bin/env node
/**
 * Fetches all data for the tracked teams from api.football-data.org (v4)
 * and writes static JSON files into public/data/.
 *
 * Runs at build time (GitHub Actions) or locally — never in the browser,
 * so the API token stays private.
 *
 * Free tier: 10 calls/minute. We throttle to 1 call per 6.5s, so a full
 * run (~21 calls) takes ~2.5 minutes.
 *
 * Usage:  FOOTBALL_DATA_TOKEN=xxx node scripts/fetch-data.mjs
 * (also reads .env.local / .env in the project root)
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "public", "data");
const API_BASE = "https://api.football-data.org/v4";
const THROTTLE_MS = 6500;
// How far back/forward we ask for matches. 360 days total keeps us under
// the API's 366-day range cap while covering last season's tail and the
// upcoming season's fixtures as they are released.
const DAYS_BACK = 120;
const DAYS_FORWARD = 240;

async function loadToken() {
  if (process.env.FOOTBALL_DATA_TOKEN) return process.env.FOOTBALL_DATA_TOKEN;
  for (const name of [".env.local", ".env"]) {
    try {
      const text = await readFile(path.join(ROOT, name), "utf8");
      const match = text.match(/^FOOTBALL_DATA_TOKEN=(.+)$/m);
      if (match) return match[1].trim().replace(/^["']|["']$/g, "");
    } catch {
      // file doesn't exist — keep looking
    }
  }
  return null;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isoDate(daysFromNow) {
  const d = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

let callCount = 0;

async function apiGet(token, endpoint) {
  if (callCount > 0) await sleep(THROTTLE_MS);
  callCount++;
  const url = `${API_BASE}${endpoint}`;
  console.log(`[${callCount}] GET ${url}`);
  let res = await fetch(url, { headers: { "X-Auth-Token": token } });
  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("Retry-After") ?? 60);
    console.warn(`  rate limited, retrying in ${retryAfter + 1}s`);
    await sleep((retryAfter + 1) * 1000);
    res = await fetch(url, { headers: { "X-Auth-Token": token } });
  }
  if (!res.ok) {
    throw new Error(`GET ${endpoint} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function writeJson(filename, data) {
  const file = path.join(DATA_DIR, filename);
  await writeFile(file, JSON.stringify(data, null, 1));
  console.log(`  wrote ${path.relative(ROOT, file)}`);
}

async function main() {
  const token = await loadToken();
  if (!token) {
    console.error(
      "Missing FOOTBALL_DATA_TOKEN. Get a free key at https://www.football-data.org/client/register\n" +
        "then export it or put FOOTBALL_DATA_TOKEN=... in .env.local",
    );
    process.exit(1);
  }

  const config = JSON.parse(
    await readFile(path.join(ROOT, "src", "config", "teams.json"), "utf8"),
  );
  const teams = config.teams;
  const leagueCodes = Object.keys(config.leagues);

  await mkdir(DATA_DIR, { recursive: true });

  const errors = [];

  // 1. League standings (one call per league)
  for (const code of leagueCodes) {
    try {
      const data = await apiGet(token, `/competitions/${code}/standings`);
      await writeJson(`standings-${code}.json`, {
        competition: data.competition,
        season: data.season,
        standings: data.standings,
      });
    } catch (err) {
      errors.push(`standings ${code}: ${err.message}`);
      console.error(`  FAILED: ${err.message}`);
    }
  }

  // 2. Per team: profile + squad, then matches (two calls per team)
  const dateFrom = isoDate(-DAYS_BACK);
  const dateTo = isoDate(DAYS_FORWARD);
  for (const team of teams) {
    try {
      const profile = await apiGet(token, `/teams/${team.id}`);
      await writeJson(`team-${team.id}.json`, profile);
    } catch (err) {
      errors.push(`team ${team.slug}: ${err.message}`);
      console.error(`  FAILED: ${err.message}`);
    }
    try {
      const matches = await apiGet(
        token,
        `/teams/${team.id}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=200`,
      );
      await writeJson(`matches-${team.id}.json`, { matches: matches.matches });
    } catch (err) {
      errors.push(`matches ${team.slug}: ${err.message}`);
      console.error(`  FAILED: ${err.message}`);
    }
  }

  await writeJson("meta.json", {
    lastUpdated: new Date().toISOString(),
    teamIds: teams.map((t) => t.id),
  });

  if (errors.length > 0) {
    console.error(`\nCompleted with ${errors.length} error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    // Exit non-zero only if everything failed — partial data is still
    // worth deploying (stale files for the failed pieces remain in place).
    if (errors.length >= leagueCodes.length + teams.length * 2) process.exit(1);
  } else {
    console.log(`\nDone: ${callCount} API calls, all successful.`);
  }
}

main();
