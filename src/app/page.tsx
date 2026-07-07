"use client";

import Link from "next/link";

import EmptyState from "@/components/EmptyState";
import MatchCard from "@/components/MatchCard";
import TeamCrest from "@/components/TeamCrest";
import { crestUrl, TEAMS } from "@/config/teams";
import { isFinished, isUpcoming, useAllMatches } from "@/lib/data";
import type { ApiMatch } from "@/lib/types";

const LIMIT = 10;

export default function Dashboard() {
  const { data: matches, loading } = useAllMatches();

  const now = new Date().toISOString();
  const upcoming: ApiMatch[] = (matches ?? [])
    .filter((m) => isUpcoming(m) && m.utcDate >= now)
    .slice(0, LIMIT);
  const recent: ApiMatch[] = (matches ?? [])
    .filter(isFinished)
    .slice(-LIMIT)
    .reverse();

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center gap-3">
        {TEAMS.map((team) => (
          <Link
            key={team.id}
            href={`/teams/${team.slug}/`}
            title={team.name}
            className="rounded-full border border-white/10 bg-white/[0.03] p-2 transition hover:border-white/30 hover:bg-white/10"
          >
            <TeamCrest src={crestUrl(team.id)} name={team.name} size={32} />
          </Link>
        ))}
      </section>

      {matches === null ? (
        <EmptyState loading={loading} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Upcoming fixtures</h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-neutral-500">No upcoming fixtures in the data window.</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Latest results</h2>
            {recent.length === 0 ? (
              <p className="text-sm text-neutral-500">No results yet.</p>
            ) : (
              <div className="space-y-2">
                {recent.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
