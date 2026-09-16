"use client";

import { useMemo } from "react";

import EmptyState from "@/components/EmptyState";
import MatchCard from "@/components/MatchCard";
import { isOnMyServices, myServiceNames } from "@/config/broadcast";
import { isUpcoming, useAllMatches } from "@/lib/data";
import { dayKey, formatDateHeading } from "@/lib/format";
import type { ApiMatch } from "@/lib/types";

/** Upcoming matches carried by the streaming services I subscribe to. */
export default function MySchedulePage() {
  const { data: matches, loading } = useAllMatches();

  const filtered = useMemo(() => {
    const now = new Date().toISOString();
    return (matches ?? []).filter(
      (m) => isUpcoming(m) && m.utcDate >= now && isOnMyServices(m.competition.code),
    );
  }, [matches]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">My Schedule</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Upcoming matches you can watch on {myServiceNames().join(" and ")}.
        </p>
      </div>

      {matches === null ? (
        <EmptyState loading={loading} />
      ) : groups.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Nothing scheduled on your services right now.
        </p>
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
