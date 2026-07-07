"use client";

import EmptyState from "@/components/EmptyState";
import TeamCrest from "@/components/TeamCrest";
import { LEAGUE_CODES, LEAGUES, TEAM_IDS, type LeagueCode } from "@/config/teams";
import { useJson } from "@/lib/data";
import type { ScorersFile } from "@/lib/types";

function seasonLabel(file: ScorersFile): string {
  if (!file.season) return "";
  const start = file.season.startDate.slice(0, 4);
  const end = file.season.endDate.slice(2, 4);
  return `${start}–${end}`;
}

function LeagueScorers({ code }: { code: LeagueCode }) {
  const { data, loading } = useJson<ScorersFile>(`/data/scorers-${code}.json`);

  return (
    <section>
      <h2 className="mb-3 flex items-baseline gap-2 text-lg font-semibold">
        {LEAGUES[code].name}
        {data && (
          <span className="text-xs font-normal text-neutral-500">
            {seasonLabel(data)} season
          </span>
        )}
      </h2>
      {!data ? (
        <EmptyState loading={loading} />
      ) : data.scorers.length === 0 ? (
        <p className="text-sm text-neutral-500">No scorer data for this season yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Player</th>
                <th className="px-3 py-2 font-medium">Team</th>
                <th className="px-2 py-2 text-center font-medium">Apps</th>
                <th className="px-2 py-2 text-center font-medium">Goals</th>
                <th className="px-2 py-2 text-center font-medium">Assists</th>
                <th className="px-2 py-2 text-center font-medium">Pens</th>
              </tr>
            </thead>
            <tbody>
              {data.scorers.map((s, i) => {
                const tracked = TEAM_IDS.has(s.team.id);
                return (
                  <tr
                    key={s.player.id}
                    className={`border-b border-white/5 last:border-0 ${
                      tracked ? "bg-amber-400/10 font-medium text-white" : "text-neutral-300"
                    }`}
                  >
                    <td className="px-3 py-2 tabular-nums text-neutral-500">{i + 1}</td>
                    <td className="px-3 py-2">
                      {s.player.name}
                      {s.player.nationality && (
                        <span className="ml-2 text-xs text-neutral-500">
                          {s.player.nationality}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-2">
                        <TeamCrest src={s.team.crest} name={s.team.name} size={18} />
                        <span className="truncate">{s.team.shortName ?? s.team.name}</span>
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center tabular-nums">{s.playedMatches}</td>
                    <td className="px-2 py-2 text-center font-semibold tabular-nums">{s.goals}</td>
                    <td className="px-2 py-2 text-center tabular-nums">{s.assists ?? 0}</td>
                    <td className="px-2 py-2 text-center tabular-nums">{s.penalties ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function ScorersPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Top scorers</h1>
      {LEAGUE_CODES.map((code) => (
        <LeagueScorers key={code} code={code} />
      ))}
    </div>
  );
}
