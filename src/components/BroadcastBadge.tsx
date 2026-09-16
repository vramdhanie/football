"use client";

import { MY_SERVICES, US_BROADCASTERS } from "@/config/broadcast";

/** Small pill showing which US streaming service carries this competition.
 * Services I subscribe to render brighter — those matches are watchable. */
export default function BroadcastBadge({ competitionCode }: { competitionCode: string }) {
  const broadcaster = US_BROADCASTERS[competitionCode];
  if (!broadcaster) return null;
  const mine = MY_SERVICES.has(broadcaster.short);

  return (
    <a
      href={broadcaster.url}
      target="_blank"
      rel="noreferrer"
      title={`Watch in the US on ${broadcaster.name}${mine ? " (you subscribe)" : ""}`}
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-px align-middle text-[9px] font-medium uppercase tracking-wide transition ${
        mine
          ? "border-emerald-300/40 bg-emerald-400/10 text-neutral-200 hover:border-emerald-300/70"
          : "border-white/10 bg-white/[0.04] text-neutral-400 hover:border-white/30 hover:text-neutral-200"
      }`}
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
