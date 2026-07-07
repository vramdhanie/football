import { TEAMS } from "@/config/teams";
import TeamPage from "./TeamPage";

export function generateStaticParams() {
  return TEAMS.map((team) => ({ slug: team.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TeamPage slug={slug} />;
}
