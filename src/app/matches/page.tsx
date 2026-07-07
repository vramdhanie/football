"use client";

import { useMemo, useState } from "react";

import EmptyState from "@/components/EmptyState";
import MatchCard from "@/components/MatchCard";
import { TEAMS } from "@/config/teams";
import { isFinished, isUpcoming, useAllMatches } from "@/lib/data";
import { dayKey, formatDateHeading } from "@/lib/format";
import type { ApiMatch } from "@/lib/types";

type Tab = "upcoming" | "results";

export default function MatchesPage() {
  const { data: matches, loading } = useAllMatches();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [teamId, setTeamId] = useState<number | "all">("all");
  const [competition, setCompetition] = useState<string>("all");

  const competitions = useMemo(() => {
    const byCode = new Map<string, string>();
    for (const m of matches ?? []) byCode.set(m.competition.code, m.competition.name);
    return [...byCode.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [matches]);

  const filtered = useMemo(() => {
    const now = new Date().toISOString();
    let list = (matches ?? []).filter((m) =>
      tab === "upcoming" ? isUpcoming(m) && m.utcDate >= now : isFinished(m),
    );
    if (teamId !== "all") {
      list = list.filter((m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId);
    }
    if (competition !== "all") {
      list = list.filter((m) => m.competition.code === competition);
    }
    if (tab === "results") list = [...list].reverse();
    return list;
  }, [matches, tab, teamId, competition]);

  const groups = useMemo(() => {
    const byDay = new Map<string, ApiMatch[]>();
    for (const m of filtered) {
      const key = dayKey(m.utcDate);
      const list = byDay.get(key) ?? [];
      list.push(m);
      byDay.set(key, list);
    }
    return [...byDay.values()];
  }, [filtered]);

  const selectClass =
    "rounded-md border border-white/15 bg-[#131926] px-2.5 py-1.5 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-white/40";

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Matches</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-md border border-white/15 p-0.5">
          {(["upcoming", "results"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded px-3 py-1 text-sm capitalize transition ${
                tab === t ? "bg-white/15 font-medium text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <select
          value={teamId === "all" ? "all" : String(teamId)}
          onChange={(e) => setTeamId(e.target.value === "all" ? "all" : Number(e.target.value))}
          className={selectClass}
          aria-label="Filter by team"
        >
          <option value="all">All teams</option>
          {TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.shortName}
            </option>
          ))}
        </select>

        <select
          value={competition}
          onChange={(e) => setCompetition(e.target.value)}
          className={selectClass}
          aria-label="Filter by competition"
        >
          <option value="all">All competitions</option>
          {competitions.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {matches === null ? (
        <EmptyState loading={loading} />
      ) : groups.length === 0 ? (
        <p className="text-sm text-neutral-500">No matches for this filter.</p>
      ) : (
        <div className="space-y-6">
          {groups.map((dayMatches) => (
            <section key={dayKey(dayMatches[0].utcDate)}>
              <h2 className="mb-2 text-sm font-medium text-neutral-400">
                {formatDateHeading(dayMatches[0].utcDate)}
              </h2>
              <div className="space-y-2">
                {dayMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
