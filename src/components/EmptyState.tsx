"use client";

export default function EmptyState({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-lg border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-neutral-500">
        Loading…
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-dashed border-white/15 p-8 text-center text-sm text-neutral-400">
      <p className="font-medium text-neutral-300">No data yet</p>
      <p className="mt-2">
        Run <code className="rounded bg-white/10 px-1.5 py-0.5">npm run fetch-data</code> with a{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">FOOTBALL_DATA_TOKEN</code> to populate{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">public/data/</code>.
      </p>
    </div>
  );
}
