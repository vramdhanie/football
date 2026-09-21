"use client";

import { useMemo } from "react";

import EmptyState from "@/components/EmptyState";
import MatchCard from "@/components/MatchCard";
import { isFinished, isUpcoming, useWeekFixtures } from "@/lib/data";
import { dayKey, formatDateHeading } from "@/lib/format";
import type { ApiMatch } from "@/lib/types";

function groupByDay(matches: ApiMatch[]): ApiMatch[][] {
  const byDay = new Map<string, ApiMatch[]>();
  for (const m of matches) {
    const key = dayKey(m.utcDate);
    const list = byDay.get(key) ?? [];
    list.push(m);
    byDay.set(key, list);
  }
  return [...byDay.values()];
}

/** The viewing schedule: last week\'s matches (scores always hidden — they
 * may not have been watched yet) and every upcoming match for the next
 * seven days, across all competitions we pull. */
export default function WeekPage() {
  const { data: matches, loading } = useWeekFixtures();

  const { lastWeek, thisWeek, breakUntil } = useMemo(() => {
    const now = new Date().toISOString();
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
    const weekEnd = new Date(Date.now() + 7 * 864e5).toISOString();
    const all = matches ?? [];

    const played = all.filter((m) => isFinished(m) && m.utcDate >= weekAgo);
    const upcoming = all.filter((m) => isUpcoming(m) && m.utcDate >= now);
    const inWindow = upcoming.filter((m) => m.utcDate <= weekEnd);
    // International break: nothing for seven days — show the next matchday
    // cluster instead so the page always answers "when is the next game?".
    const pool = inWindow.length > 0 ? inWindow : upcoming.slice(0, 40);

    return {
      lastWeek: groupByDay(played),
      thisWeek: groupByDay(pool),
      breakUntil: inWindow.length === 0 && upcoming.length > 0 ? upcoming[0].utcDate : null,
    };
  }, [matches]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">This Week</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Your viewing schedule: last week&apos;s matches with scores hidden until
          you reveal them, then everything coming up — across all the leagues.
        </p>
      </div>

      {matches === null ? (
        <EmptyState loading={loading} />
      ) : (
        <>
          {lastWeek.length > 0 && (
            <section className="space-y-6">
              <h2 className="border-b border-white/10 pb-2 text-sm font-semibold uppercase tracking-widest text-neutral-500">
                Last week — still to watch
              </h2>
              {lastWeek.map((dayMatches) => (
                <section key={dayKey(dayMatches[0].utcDate)}>
                  <h3 className="mb-2 text-sm font-medium text-neutral-400">
                    {formatDateHeading(dayMatches[0].utcDate)}
                    <span className="ml-2 text-xs text-neutral-600">
                      {dayMatches.length} match{dayMatches.length === 1 ? "" : "es"}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {dayMatches.map((m) => (
                      <MatchCard key={m.id} match={m} forceHideScore />
                    ))}
                  </div>
                </section>
              ))}
            </section>
          )}

          <section className="space-y-6">
            <h2 className="border-b border-white/10 pb-2 text-sm font-semibold uppercase tracking-widest text-neutral-500">
              Coming up
            </h2>
            {breakUntil && (
              <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-sm text-amber-200/90">
                International break — no club matches in the next seven days.
                Next fixtures shown below.
              </p>
            )}
            {thisWeek.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No fixtures in the window yet — the data refresh runs twice a day.
              </p>
            ) : (
              thisWeek.map((dayMatches) => (
                <section key={dayKey(dayMatches[0].utcDate)}>
                  <h3 className="mb-2 text-sm font-medium text-neutral-400">
                    {formatDateHeading(dayMatches[0].utcDate)}
                    <span className="ml-2 text-xs text-neutral-600">
                      {dayMatches.length} match{dayMatches.length === 1 ? "" : "es"}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {dayMatches.map((m) => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
