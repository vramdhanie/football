"use client";

import Link from "next/link";

import { TEAM_IDS, teamById } from "@/config/teams";
import { isFinished } from "@/lib/data";
import { formatMatchDate, formatMatchTime, scoreLine } from "@/lib/format";
import type { ApiMatch, ApiTeamRef } from "@/lib/types";
import TeamCrest from "./TeamCrest";

function TeamName({ team, won }: { team: ApiTeamRef; won: boolean }) {
  const tracked = teamById(team.id);
  const label = team.shortName ?? team.name;
  const inner = (
    <span
      className={`flex min-w-0 items-center gap-2 ${
        tracked ? "text-white" : "text-neutral-300"
      } ${won ? "font-semibold" : ""}`}
    >
      <TeamCrest src={team.crest} name={team.name} size={20} />
      <span className="truncate">{label}</span>
    </span>
  );
  if (!tracked) return inner;
  return (
    <Link href={`/teams/${tracked.slug}/`} className="min-w-0 hover:underline">
      {inner}
    </Link>
  );
}

export default function MatchCard({ match }: { match: ApiMatch }) {
  const finished = isFinished(match);
  const bothTracked = TEAM_IDS.has(match.homeTeam.id) && TEAM_IDS.has(match.awayTeam.id);
  const postponed = match.status === "POSTPONED" || match.status === "CANCELLED";

  return (
    <div
      className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-lg border px-3 py-2.5 ${
        bothTracked ? "border-amber-400/30 bg-amber-400/5" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex justify-end text-right text-sm">
        <TeamName team={match.homeTeam} won={match.score.winner === "HOME_TEAM"} />
      </div>

      <div className="flex w-24 flex-col items-center text-center">
        {finished ? (
          <span className="text-base font-semibold tabular-nums">{scoreLine(match)}</span>
        ) : (
          <span className="text-sm font-medium tabular-nums">
            {postponed ? "PPD" : formatMatchTime(match.utcDate)}
          </span>
        )}
        <span className="text-[10px] uppercase tracking-wide text-neutral-500">
          {formatMatchDate(match.utcDate)}
        </span>
      </div>

      <div className="flex justify-start text-sm">
        <TeamName team={match.awayTeam} won={match.score.winner === "AWAY_TEAM"} />
      </div>

      <div className="col-span-3 -mt-1 text-center text-[10px] text-neutral-500">
        {match.competition.name}
        {match.matchday ? ` · MD ${match.matchday}` : match.stage ? ` · ${match.stage.replaceAll("_", " ").toLowerCase()}` : ""}
      </div>
    </div>
  );
}
