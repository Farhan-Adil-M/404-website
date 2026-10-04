"use client";

import { useEffect, useState } from "react";

export type HudStatus =
  | "IDLE"
  | "NOT FOUND"
  | "ANOMALY"
  | "SYSTEM"
  | "IDENTIFIED"
  | "INVESTIGATING"
  | "RESOLVED";

export interface HudState {
  status: HudStatus;
  anomalies: number;
  /** pointer coordinates (viewport px) */
  x: number;
  y: number;
  visible: boolean;
}

let state: HudState = {
  status: "IDLE",
  anomalies: 0,
  x: 0,
  y: 0,
  visible: false,
};

const listeners = new Set<(s: HudState) => void>();

function emit() {
  /* pass a fresh snapshot: the same reference would bail out React's
     setState and the HUD would never re-render */
  const snapshot = { ...state };
  listeners.forEach((l) => l(snapshot));
}

export function setHud(patch: Partial<HudState>) {
  let changed = false;
  for (const k of Object.keys(patch) as (keyof HudState)[]) {
    if (state[k] !== patch[k]) {
      (state as unknown as Record<string, unknown>)[k] = patch[k];
      changed = true;
    }
  }
  if (changed) emit();
}

export function getHud() {
  return state;
}

/** Subscribes a component to the HUD store (render-level fields only). */
export function useHud(): HudState {
  const [snap, setSnap] = useState(state);
  useEffect(() => {
    listeners.add(setSnap);
    return () => {
      listeners.delete(setSnap);
    };
  }, []);
  return snap;
}

/**
 * Registers mono metadata pairs for the HUD bottom corners.
 * Pairs are rendered by <Hud/> from this registry (not component state),
 * so orchestration code can update them without React re-renders.
 */
export function pushHudPair(
  pos: "bl" | "br",
  frames: Array<{ label: string; ref?: string }>
) {
  pairRegistry[pos] = frames;
  pairVersion += 1;
  emit();
}

const pairRegistry: Record<"bl" | "br", Array<{ label: string; ref?: string }>> =
  {
    bl: [],
    br: [],
  };
let pairVersion = 0;

export function getPairs() {
  return pairRegistry;
}

export function getPairVersion() {
  return pairVersion;
}
