"use client";

import { useJson } from "@/lib/data";
import { formatLastUpdated } from "@/lib/format";
import type { MetaFile } from "@/lib/types";

export default function Footer() {
  const { data: meta } = useJson<MetaFile>("/data/meta.json");

  return (
    <footer className="mt-12 border-t border-white/10 py-6 text-center text-xs text-neutral-500">
      {meta && <p>Data updated {formatLastUpdated(meta.lastUpdated)}</p>}
      <p className="mt-1">
        Football data provided by{" "}
        <a
          href="https://www.football-data.org/"
          className="underline hover:text-neutral-300"
          target="_blank"
          rel="noreferrer"
        >
          football-data.org
        </a>
      </p>
    </footer>
  );
}
