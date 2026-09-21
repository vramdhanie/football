"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Spoiler-free mode: when on, finished matches hide their scores until
 * individually revealed. Persisted per browser; synced across components
 * (and tabs) via events.
 */
const KEY = "football.hideScores";
const EVENT = "football:hideScores";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function useHideScores(): [boolean, () => void] {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Initial sync deferred a frame: localStorage isn't available during
    // prerender, and the lint rightly dislikes synchronous setState here.
    const raf = requestAnimationFrame(() => setHidden(read()));
    const sync = () => setHidden(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback(() => {
    try {
      localStorage.setItem(KEY, read() ? "0" : "1");
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [hidden, toggle];
}
