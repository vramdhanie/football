/**
 * US streaming rights per competition (keyed by football-data.org
 * competition code, as it appears on each match).
 *
 * Rights change hands between seasons — update this map when they do.
 * As of the 2026-27 season:
 *   PL  → Peacock/NBC through 2027-28
 *   CL  → Paramount+ through 2029-30
 *   PD  → ESPN+ through 2029
 *   BL1 → ESPN+ (2026-27 coverage confirmed; new cycle was in negotiation)
 *   FL1 → beIN Sports (incumbent; 2026-27 renewal pending)
 */

export interface Broadcaster {
  name: string;
  short: string;
  color: string;
  url: string;
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
