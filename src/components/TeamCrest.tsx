/* eslint-disable @next/next/no-img-element */
"use client";

interface Props {
  src: string | null | undefined;
  name: string;
  size?: number;
  className?: string;
}

export default function TeamCrest({ src, name, size = 24, className = "" }: Props) {
  if (!src) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-white/10 text-[10px] ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        ⚽
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={`${name} crest`}
      width={size}
      height={size}
      loading="lazy"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
