"use client";

import Link from "next/link";

import TeamCrest from "@/components/TeamCrest";
import { crestUrl, LEAGUES, TEAMS } from "@/config/teams";

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My teams</h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEAMS.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.slug}/`}
            className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/30 hover:bg-white/10"
            style={{ borderLeftColor: team.color, borderLeftWidth: 3 }}
          >
            <TeamCrest src={crestUrl(team.id)} name={team.name} size={40} />
            <span>
              <span className="block font-medium">{team.shortName}</span>
              <span className="block text-xs text-neutral-500">
                {LEAGUES[team.league].name}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <p className="text-xs text-neutral-500">
        To add or change teams, edit <code className="rounded bg-white/10 px-1 py-0.5">src/config/teams.json</code>{" "}
        and push — the next deploy picks it up.
      </p>
    </div>
  );
}
