import type { Metadata } from "next";

import { LEAGUES, TEAMS, teamBySlug } from "@/config/teams";
import TeamPage from "./TeamPage";

export function generateStaticParams() {
  return TEAMS.map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = teamBySlug(slug);
  if (!team) return {};
  return {
    title: team.shortName,
    description: `${team.name} fixtures, results, league position, and squad — ${LEAGUES[team.league].name}.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TeamPage slug={slug} />;
}
