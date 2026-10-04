"use client";

/**
 * Tone controller — the approved "tone inversion" transition device.
 * Dark chapters register themselves via onToggle; the html class flips
 * the chrome (HUD, rail, cursor, grain) while section backgrounds stay
 * explicit in each component's CSS.
 */

let active = 0;

function apply() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("tone-dark", active > 0);
}

export function toneEnter() {
  active += 1;
  apply();
}

export function toneLeave() {
  active = Math.max(0, active - 1);
  apply();
}

export function resetTone() {
  active = 0;
  apply();
}

/** Wires a dark section: call inside the chapter effect, return cleanup.
 *  `end` may be overridden for pinned sections whose visual presence
 *  extends beyond their natural flow height. */
export function registerDarkSection(
  trigger: HTMLElement,
  ScrollTriggerCtor: typeof import("gsap/ScrollTrigger").ScrollTrigger,
  end: string | (() => string) = "bottom 45%"
): () => void {
  let wasActive = false;
  const st = ScrollTriggerCtor.create({
    trigger,
    start: "top 55%",
    end,
    onToggle: (self) => {
      if (self.isActive !== wasActive) {
        wasActive = self.isActive;
        if (self.isActive) toneEnter();
        else toneLeave();
      }
    },
  });
  return () => {
    if (wasActive) toneLeave();
    wasActive = false;
    st.kill();
  };
}
