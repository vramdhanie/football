"use client";

import { US_BROADCASTERS } from "@/config/broadcast";

/** Small pill showing which US streaming service carries this competition. */
export default function BroadcastBadge({ competitionCode }: { competitionCode: string }) {
  const broadcaster = US_BROADCASTERS[competitionCode];
  if (!broadcaster) return null;

  return (
    <a
      href={broadcaster.url}
      target="_blank"
      rel="noreferrer"
      title={`Watch in the US on ${broadcaster.name}`}
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-px align-middle text-[9px] font-medium uppercase tracking-wide text-neutral-400 transition hover:border-white/30 hover:text-neutral-200"
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: broadcaster.color }}
      />
      {broadcaster.short}
    </a>
  );
}
