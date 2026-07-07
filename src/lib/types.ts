// Trimmed-down types for the football-data.org v4 payloads we store in
// public/data/*.json. Only the fields the UI reads are declared.

export interface ApiTeamRef {
  id: number;
  name: string;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
}

export interface ApiCompetitionRef {
  id: number;
  code: string;
  name: string;
  emblem: string | null;
  type?: string;
}

export type MatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "SUSPENDED"
  | "POSTPONED"
  | "CANCELLED"
  | "AWARDED";

export interface ApiScore {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  fullTime: { home: number | null; away: number | null };
  halfTime?: { home: number | null; away: number | null };
}

export interface ApiMatch {
  id: number;
  utcDate: string;
  status: MatchStatus;
  matchday: number | null;
  stage: string | null;
  group?: string | null;
  competition: ApiCompetitionRef;
  homeTeam: ApiTeamRef;
  awayTeam: ApiTeamRef;
  score: ApiScore;
}

export interface MatchesFile {
  matches: ApiMatch[];
}

export interface ApiStandingRow {
  position: number;
  team: ApiTeamRef;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string | null;
}

export interface ApiStandingGroup {
  type: "TOTAL" | "HOME" | "AWAY";
  table: ApiStandingRow[];
}

export interface StandingsFile {
  competition?: ApiCompetitionRef;
  season?: { startDate: string; endDate: string; currentMatchday: number | null };
  standings: ApiStandingGroup[];
}

export interface ApiSquadMember {
  id: number;
  name: string;
  position: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
}

export interface TeamFile {
  id: number;
  name: string;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
  address?: string;
  founded?: number | null;
  clubColors?: string | null;
  venue?: string | null;
  coach?: { name: string | null; nationality: string | null } | null;
  squad: ApiSquadMember[];
  runningCompetitions?: ApiCompetitionRef[];
}

export interface MetaFile {
  lastUpdated: string;
  season?: string;
  teamIds: number[];
}
