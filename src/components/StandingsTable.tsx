"use client";

import { TEAM_IDS } from "@/config/teams";
import type { ApiStandingRow } from "@/lib/types";
import TeamCrest from "./TeamCrest";

interface Props {
  table: ApiStandingRow[];
  /** When set, only show a window of rows around this team. */
  focusTeamId?: number;
  windowSize?: number;
}

export default function StandingsTable({ table, focusTeamId, windowSize = 2 }: Props) {
  let rows = table;
  if (focusTeamId !== undefined) {
    const idx = table.findIndex((r) => r.team.id === focusTeamId);
    if (idx >= 0) {
      rows = table.slice(Math.max(0, idx - windowSize), idx + windowSize + 1);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-neutral-500">
            <th className="px-3 py-2 font-medium">#</th>
            <th className="px-3 py-2 font-medium">Team</th>
            <th className="px-2 py-2 text-center font-medium">P</th>
            <th className="px-2 py-2 text-center font-medium">W</th>
            <th className="px-2 py-2 text-center font-medium">D</th>
            <th className="px-2 py-2 text-center font-medium">L</th>
            <th className="px-2 py-2 text-center font-medium">GD</th>
            <th className="px-2 py-2 text-center font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const tracked = TEAM_IDS.has(row.team.id);
            return (
              <tr
                key={row.team.id}
                className={`border-b border-white/5 last:border-0 ${
                  tracked ? "bg-amber-400/10 font-medium text-white" : "text-neutral-300"
                }`}
              >
                <td className="px-3 py-2 tabular-nums text-neutral-500">{row.position}</td>
                <td className="px-3 py-2">
                  <span className="flex items-center gap-2">
                    <TeamCrest src={row.team.crest} name={row.team.name} size={18} />
                    <span className="truncate">{row.team.shortName ?? row.team.name}</span>
                  </span>
                </td>
                <td className="px-2 py-2 text-center tabular-nums">{row.playedGames}</td>
                <td className="px-2 py-2 text-center tabular-nums">{row.won}</td>
                <td className="px-2 py-2 text-center tabular-nums">{row.draw}</td>
                <td className="px-2 py-2 text-center tabular-nums">{row.lost}</td>
                <td className="px-2 py-2 text-center tabular-nums">
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="px-2 py-2 text-center font-semibold tabular-nums">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
