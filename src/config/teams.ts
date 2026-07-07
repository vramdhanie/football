import config from "./teams.json";

export type LeagueCode = "PL" | "BL1" | "PD" | "FL1";

export interface TrackedTeam {
  id: number;
  /** Team id on api-football.com (differs from the football-data.org id). */
  apiFootballId: number;
  slug: string;
  name: string;
  shortName: string;
  tla: string;
  league: LeagueCode;
  color: string;
}

export interface LeagueInfo {
  name: string;
  country: string;
}

export const TEAMS: TrackedTeam[] = config.teams as TrackedTeam[];

export const LEAGUES: Record<LeagueCode, LeagueInfo> = config.leagues as Record<
  LeagueCode,
  LeagueInfo
>;

export const LEAGUE_CODES = Object.keys(LEAGUES) as LeagueCode[];

export const TEAM_IDS = new Set(TEAMS.map((t) => t.id));

export function teamBySlug(slug: string): TrackedTeam | undefined {
  return TEAMS.find((t) => t.slug === slug);
}

export function teamById(id: number): TrackedTeam | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function crestUrl(teamId: number): string {
  return `https://crests.football-data.org/${teamId}.png`;
}
