"use client";

import { useMemo } from "react";

import EmptyState from "@/components/EmptyState";
import MatchCard from "@/components/MatchCard";
import { isUpcoming, useWeekFixtures } from "@/lib/data";
import { dayKey, formatDateHeading } from "@/lib/format";
import type { ApiMatch } from "@/lib/types";

/** Every European match for the coming week, across all competitions we
 * pull — upcoming only, so there is nothing here that can spoil a result. */
export default function WeekPage() {
  const { data: matches, loading } = useWeekFixtures();

  const { groups, breakUntil } = useMemo(() => {
    const now = new Date().toISOString();
    const weekEnd = new Date(Date.now() + 7 * 864e5).toISOString();
    const upcoming = (matches ?? []).filter((m) => isUpcoming(m) && m.utcDate >= now);
    const thisWeek = upcoming.filter((m) => m.utcDate <= weekEnd);
    // International break: nothing for seven days — show the next matchday
    // cluster instead so the page always answers "when is the next game?".
    const pool = thisWeek.length > 0 ? thisWeek : upcoming.slice(0, 40);
    const byDay = new Map<string, ApiMatch[]>();
    for (const m of pool) {
      const key = dayKey(m.utcDate);
      const list = byDay.get(key) ?? [];
      list.push(m);
      byDay.set(key, list);
    }
    return {
      groups: [...byDay.values()],
      breakUntil: thisWeek.length === 0 && upcoming.length > 0 ? upcoming[0].utcDate : null,
    };
  }, [matches]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">This Week</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Every match across the leagues for the next seven days — fixtures only,
          no results, no spoilers.
        </p>
      </div>

      {breakUntil && (
        <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-sm text-amber-200/90">
          International break — no club matches in the next seven days. Next
          fixtures shown below.
        </p>
      )}

      {matches === null ? (
        <EmptyState loading={loading} />
      ) : groups.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No fixtures in the window yet — the data refresh runs twice a day.
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map((dayMatches) => (
            <section key={dayKey(dayMatches[0].utcDate)}>
              <h2 className="mb-2 text-sm font-medium text-neutral-400">
                {formatDateHeading(dayMatches[0].utcDate)}
                <span className="ml-2 text-xs text-neutral-600">
                  {dayMatches.length} match{dayMatches.length === 1 ? "" : "es"}
                </span>
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
