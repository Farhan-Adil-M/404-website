"use client";

import { useEffect, useState } from "react";

const query = "(prefers-reduced-motion: reduce)";

/**
 * Reactive reduced-motion flag so components can render static states
 * without waiting for GSAP logic to branch.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return reduced;
}
