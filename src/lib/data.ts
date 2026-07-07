"use client";

import { useEffect, useState } from "react";

import { TEAMS } from "@/config/teams";
import type { ApiMatch, MatchesFile } from "./types";

/**
 * All app data is pre-fetched into public/data/*.json by scripts/fetch-data.mjs
 * (locally or in the GitHub Actions deploy workflow). The client only ever
 * reads those static files — no API calls, no token in the browser.
 */
export async function loadJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface Loadable<T> {
  data: T | null;
  loading: boolean;
}

export function useJson<T>(path: string): Loadable<T> {
  const [state, setState] = useState<Loadable<T>>({ data: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    loadJson<T>(path).then((data) => {
      if (!cancelled) setState({ data, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}

/** Load every tracked team's matches file, deduplicated by match id
 * (a match between two tracked teams appears in both files). */
export function useAllMatches(): Loadable<ApiMatch[]> {
  const [state, setState] = useState<Loadable<ApiMatch[]>>({
    data: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      TEAMS.map((t) => loadJson<MatchesFile>(`/data/matches-${t.id}.json`)),
    ).then((files) => {
      if (cancelled) return;
      const byId = new Map<number, ApiMatch>();
      for (const file of files) {
        for (const match of file?.matches ?? []) {
          byId.set(match.id, match);
        }
      }
      const merged = [...byId.values()].sort(
        (a, b) => a.utcDate.localeCompare(b.utcDate),
      );
      setState({ data: files.every((f) => f === null) ? null : merged, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function isUpcoming(m: ApiMatch): boolean {
  return (
    m.status === "SCHEDULED" || m.status === "TIMED" || m.status === "POSTPONED"
  );
}

export function isFinished(m: ApiMatch): boolean {
  return m.status === "FINISHED" || m.status === "AWARDED";
}
