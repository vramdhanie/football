"use client";

import { useMemo } from "react";

import EmptyState from "@/components/EmptyState";
import MatchCard from "@/components/MatchCard";
import StandingsTable from "@/components/StandingsTable";
import TeamCrest from "@/components/TeamCrest";
import { crestUrl, LEAGUES, teamBySlug } from "@/config/teams";
import { isFinished, isUpcoming, useJson } from "@/lib/data";
import { POSITION_GROUP_ORDER, positionGroup } from "@/lib/format";
import type { MatchesFile, SquadFile, SquadPlayer, StandingsFile, TeamFile } from "@/lib/types";

const FIXTURE_LIMIT = 8;
const RESULT_LIMIT = 8;

export default function TeamPage({ slug }: { slug: string }) {
  const team = teamBySlug(slug);
  const teamId = team?.id ?? 0;

  const { data: profile } = useJson<TeamFile>(`/data/team-${teamId}.json`);
  const { data: matchesFile, loading: matchesLoading } = useJson<MatchesFile>(
    `/data/matches-${teamId}.json`,
  );
  const { data: standingsFile } = useJson<StandingsFile>(
    team ? `/data/standings-${team.league}.json` : "/data/none.json",
  );
  const { data: squadFile, loading: squadLoading } = useJson<SquadFile>(
    `/data/squad-${teamId}.json`,
  );

  const matches = useMemo(
    () =>
      [...(matchesFile?.matches ?? [])].sort((a, b) =>
        a.utcDate.localeCompare(b.utcDate),
      ),
    [matchesFile],
  );

  const squadGroups = useMemo(() => {
    const groups = new Map<string, SquadPlayer[]>();
    for (const player of squadFile?.players ?? []) {
      const group = positionGroup(player.position);
      const list = groups.get(group) ?? [];
      list.push(player);
      groups.set(group, list);
    }
    for (const list of groups.values()) {
      list.sort((a, b) => (a.number ?? 99) - (b.number ?? 99));
    }
    return POSITION_GROUP_ORDER.filter((g) => groups.has(g)).map(
      (g) => [g, groups.get(g)!] as const,
    );
  }, [squadFile]);

  if (!team) {
    return <p className="text-neutral-400">Unknown team.</p>;
  }

  const now = new Date().toISOString();
  const fixtures = matches
    .filter((m) => isUpcoming(m) && m.utcDate >= now)
    .slice(0, FIXTURE_LIMIT);
  const results = matches.filter(isFinished).slice(-RESULT_LIMIT).reverse();

  const fullLeagueTable = standingsFile?.standings.find((s) => s.type === "TOTAL")?.table;
  // Hide the preseason table (every club on zero played games) — position
  // and points are meaningless until the first matchday.
  const seasonStarted = !!fullLeagueTable && fullLeagueTable.some((r) => r.playedGames > 0);
  const leagueTable = seasonStarted ? fullLeagueTable : undefined;
  const leagueRow = leagueTable?.find((r) => r.team.id === team.id);

  return (
    <div className="space-y-8">
      <header
        className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5"
        style={{ borderLeftColor: team.color, borderLeftWidth: 4 }}
      >
        <TeamCrest src={profile?.crest ?? crestUrl(team.id)} name={team.name} size={64} />
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">{profile?.name ?? team.name}</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {LEAGUES[team.league].name}
            {leagueRow && (
              <>
                {" · "}
                <span className="text-neutral-200">
                  {leagueRow.position}
                  {ordinal(leagueRow.position)}
                </span>{" "}
                · {leagueRow.points} pts
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {[
              profile?.venue,
              profile?.coach?.name ? `Coach: ${profile.coach.name}` : null,
              profile?.founded ? `Founded ${profile.founded}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Fixtures</h2>
          {matchesFile === null ? (
            <EmptyState loading={matchesLoading} />
          ) : fixtures.length === 0 ? (
            <p className="text-sm text-neutral-500">No upcoming fixtures in the data window.</p>
          ) : (
            <div className="space-y-2">
              {fixtures.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Results</h2>
          {matchesFile === null ? (
            <EmptyState loading={matchesLoading} />
          ) : results.length === 0 ? (
            <p className="text-sm text-neutral-500">No results yet.</p>
          ) : (
            <div className="space-y-2">
              {results.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          )}
        </section>
      </div>

      {leagueTable && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">League position</h2>
          <StandingsTable table={leagueTable} focusTeamId={team.id} />
        </section>
      )}

      <section>
        <h2 className="mb-3 flex items-baseline gap-2 text-lg font-semibold">
          Squad
          {squadFile && squadGroups.length > 0 && (
            <span className="text-xs font-normal text-neutral-500">via {squadFile.source}</span>
          )}
        </h2>
        {squadFile === null || squadGroups.length === 0 ? (
          squadLoading ? (
            <EmptyState loading />
          ) : (
            <p className="text-sm text-neutral-500">
              Squad data isn&apos;t included in the football-data.org free tier
              (it&apos;s part of their paid data add-on). Configure an{" "}
              <code className="rounded bg-white/10 px-1 py-0.5">API_FOOTBALL_KEY</code> to
              pull squads from api-football.com, or see the{" "}
              <a href="/scorers/" className="underline hover:text-neutral-300">
                top scorers
              </a>{" "}
              page for player stats.
            </p>
          )
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {squadGroups.map(([group, players]) => (
              <div key={group}>
                <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500">
                  {group}
                </h3>
                <ul className="divide-y divide-white/5 rounded-lg border border-white/10">
                  {players.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        {p.photo && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.photo}
                            alt=""
                            width={24}
                            height={24}
                            loading="lazy"
                            className="h-6 w-6 shrink-0 rounded-full object-cover"
                          />
                        )}
                        {p.number !== null && (
                          <span className="w-6 shrink-0 text-right text-xs tabular-nums text-neutral-500">
                            {p.number}
                          </span>
                        )}
                        <span className="truncate">{p.name}</span>
                      </span>
                      <span className="shrink-0 text-xs text-neutral-500">
                        {[p.position, p.nationality, p.age !== null ? `${p.age}y` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ordinal(n: number): string {
  const rem10 = n % 10;
  const rem100 = n % 100;
  if (rem10 === 1 && rem100 !== 11) return "st";
  if (rem10 === 2 && rem100 !== 12) return "nd";
  if (rem10 === 3 && rem100 !== 13) return "rd";
  return "th";
}
