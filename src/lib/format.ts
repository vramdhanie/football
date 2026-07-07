import type { ApiMatch } from "./types";

export function formatMatchDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatMatchTime(utcDate: string): string {
  return new Date(utcDate).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateHeading(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Local-timezone day key used to group matches by date. */
export function dayKey(utcDate: string): string {
  const d = new Date(utcDate);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function formatLastUpdated(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scoreLine(m: ApiMatch): string {
  const { home, away } = m.score.fullTime;
  if (home === null || away === null) return "–";
  return `${home} – ${away}`;
}

export function ageFrom(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age--;
  return age;
}

const POSITION_GROUPS: [RegExp, string][] = [
  [/keeper/i, "Goalkeepers"],
  [/back|defen[cs]e|defender/i, "Defenders"],
  [/midfield/i, "Midfielders"],
  [/winger|forward|striker|offen[cs]e|attack/i, "Forwards"],
];

export function positionGroup(position: string | null): string {
  if (!position) return "Other";
  for (const [pattern, group] of POSITION_GROUPS) {
    if (pattern.test(position)) return group;
  }
  return "Other";
}

export const POSITION_GROUP_ORDER = [
  "Goalkeepers",
  "Defenders",
  "Midfielders",
  "Forwards",
  "Other",
];
