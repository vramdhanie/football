"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/matches/", label: "Matches" },
  { href: "/standings/", label: "Standings" },
  { href: "/teams/", label: "Teams" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0e14]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center gap-1 px-4 py-3 sm:gap-2">
        <Link href="/" className="mr-3 flex items-center gap-2 font-semibold tracking-tight">
          <span aria-hidden>⚽</span>
          <span className="hidden sm:inline">My Football</span>
        </Link>
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive(pathname, href)
                ? "bg-white/10 font-medium text-white"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
