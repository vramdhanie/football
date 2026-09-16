/**
 * US streaming rights per competition (keyed by football-data.org
 * competition code, as it appears on each match).
 *
 * Rights change hands between seasons — update this map when they do.
 * As of the 2026-27 season:
 *   PL  → Peacock/NBC through 2027-28
 *   CL  → Paramount+ through 2029-30
 *   PD  → ESPN+ through 2029
 *   SA  → Paramount+ (CBS long-term deal)
 *   BL1 → ESPN+ (2026-27 coverage confirmed; new cycle was in negotiation)
 *   FL1 → beIN Sports (incumbent; 2026-27 renewal pending)
 */

export interface Broadcaster {
  name: string;
  short: string;
  color: string;
  url: string;
}

/** Streaming services I actually subscribe to (matched on `short`).
 * Drives the My Schedule page and the highlighted broadcast badges. */
export const MY_SERVICES = new Set(["Peacock", "P+"]);

export function isOnMyServices(competitionCode: string): boolean {
  const b = US_BROADCASTERS[competitionCode];
  return b !== undefined && MY_SERVICES.has(b.short);
}

/** Distinct full names of subscribed services, for display. */
export function myServiceNames(): string[] {
  const names = new Set<string>();
  for (const b of Object.values(US_BROADCASTERS)) {
    if (MY_SERVICES.has(b.short)) names.add(b.name);
  }
  return [...names];
}

export const US_BROADCASTERS: Record<string, Broadcaster> = {
  PL: {
    name: "Peacock / NBC",
    short: "Peacock",
    color: "#FACC15",
    url: "https://www.peacocktv.com/sports/premier-league",
  },
  BL1: {
    name: "ESPN+",
    short: "ESPN+",
    color: "#D50A0A",
    url: "https://plus.espn.com/",
  },
  PD: {
    name: "ESPN+",
    short: "ESPN+",
    color: "#D50A0A",
    url: "https://plus.espn.com/",
  },
  SA: {
    name: "Paramount+ / CBS",
    short: "P+",
    color: "#2864F0",
    url: "https://www.paramountplus.com/collections/serie-a/",
  },
  FL1: {
    name: "beIN Sports",
    short: "beIN",
    color: "#8B5CF6",
    url: "https://www.beinsports.com/us-en/",
  },
  CL: {
    name: "Paramount+ / CBS",
    short: "P+",
    color: "#2864F0",
    url: "https://www.paramountplus.com/shows/uefa-champions-league/",
  },
  COM: {
    name: "ESPN+",
    short: "ESPN+",
    color: "#D50A0A",
    url: "https://plus.espn.com/",
  },
};
