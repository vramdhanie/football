"use client";

import EmptyState from "@/components/EmptyState";
import StandingsTable from "@/components/StandingsTable";
import { LEAGUE_CODES, LEAGUES, type LeagueCode } from "@/config/teams";
import { useJson } from "@/lib/data";
import type { StandingsFile } from "@/lib/types";

function LeagueStandings({ code }: { code: LeagueCode }) {
  const { data, loading } = useJson<StandingsFile>(`/data/standings-${code}.json`);
  const table = data?.standings.find((s) => s.type === "TOTAL")?.table;
  const notStarted = !!table && table.length > 0 && table.every((r) => r.playedGames === 0);

  return (
    <section>
      <h2 className="mb-3 flex items-baseline gap-2 text-lg font-semibold">
        {LEAGUES[code].name}
        <span className="text-xs font-normal text-neutral-500">{LEAGUES[code].country}</span>
      </h2>
      {!table ? (
        <EmptyState loading={loading} />
      ) : (
        <>
          {notStarted && (
            <p className="mb-3 text-sm text-neutral-500">
              The season hasn&apos;t started yet
              {data?.season?.startDate
                ? ` — first matchday around ${new Date(data.season.startDate).toLocaleDateString(undefined, { day: "numeric", month: "long" })}`
                : ""}
              . Showing the {table.length} participating clubs.
            </p>
          )}
          <StandingsTable table={table} />
        </>
      )}
    </section>
  );
}

export default function StandingsPage() {
  return (
    <div className="space-y-10">
      <h1 className="text-xl font-semibold">Standings</h1>
      {LEAGUE_CODES.map((code) => (
        <LeagueStandings key={code} code={code} />
      ))}
    </div>
  );
}
