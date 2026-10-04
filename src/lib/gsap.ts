"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

let registered = false;

export function initGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/* ---------- Lenis: one instance for the whole site ---------- */

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export function startLenis() {
  if (typeof window === "undefined") return null;
  if (lenis) {
    lenis.start();
    return lenis;
  }
  const reduced = prefersReducedMotion();
  lenis = new Lenis({
    // approved: deliberate inertia
    lerp: reduced ? 1 : 0.095,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
    // reduced motion users get the native scroller
    smoothWheel: !reduced,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Hard lock used while loader/threshold acts hold the user. */
export function lockScroll() {
  if (typeof window === "undefined") return;
  document.documentElement.classList.add("locked");
  lenis?.stop();
  if (typeof window !== "undefined") window.scrollTo(0, 0);
}

export function unlockScroll() {
  if (typeof window === "undefined") return;
  document.documentElement.classList.remove("locked");
  lenis?.start();
}

/**
 * Deterministic ScrollTrigger refresh: waits for webfonts (capped) and a
 * frame so chapter layout has settled, then measures pins exactly once.
 */
export function settleAndRefresh() {
  if (typeof window === "undefined") return;
  const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } })
    .fonts;
  const settled = fonts
    ? Promise.race([
        fonts.ready,
        new Promise((r) => setTimeout(r, 1600)),
      ])
    : Promise.resolve();
  settled.then(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
}

export function scrollToTopImmediate() {
  if (typeof window === "undefined") return;
  lenis?.scrollTo(0, { immediate: true });
  window.scrollTo(0, 0);
}

/* ---------- environment ---------- */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isTouch(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/* ---------- shared easing / timing vocabulary ---------- */

export { gsap, ScrollTrigger };

export const EASE = {
  enter: "power4.out",
  exit: "power3.in",
  settle: "expo.out",
  // micro/UI transitions via CSS use --ease-ui; when set from JS:
  ui: "power2.out",
};

export const gsapSet = (target: gsap.TweenTarget, vars: gsap.TweenVars) =>
  gsap.set(target, vars);

/* ---------- type utilities ---------- */

/** Wrap every character of the direct text in a masked span pair. */
export function splitChars(el: HTMLElement, maskClass: string): HTMLElement[] {
  const text = el.textContent ?? "";
  el.textContent = "";
  const out: HTMLElement[] = [];
  for (const ch of text) {
    const mask = document.createElement("span");
    mask.className = maskClass;
    mask.style.display = "inline-block";
    mask.style.overflow = "hidden";
    mask.style.verticalAlign = "top";
    const inner = document.createElement("span");
    inner.className = "char";
    inner.style.display = "inline-block";
    inner.style.willChange = "transform";
    inner.textContent = ch === " " ? "\u00A0" : ch;
    mask.appendChild(inner);
    el.appendChild(mask);
    out.push(inner);
  }
  return out;
}

/**
 * Fit the .wm__display wordmark so it spans its container width exactly.
 * Adjusts font-size (no glyph distortion). Call on mount and on resize.
 */
export function fitWordmark(
  container: HTMLElement | null,
  display: HTMLElement | null
): number {
  if (!container || !display || typeof window === "undefined") return 1;
  const target = container.clientWidth;
  const natural = display.scrollWidth;
  if (!target || !natural) return 1;
  const current = parseFloat(getComputedStyle(display).fontSize);
  if (!Number.isFinite(current) || current <= 0) return 1;
  const next = current * (target / natural);
  display.style.fontSize = `${next}px`;
  return next;
}

/** Full reveal composition constants (keep in sync with globals.css). */
export const REVEAL = {
  scale: 0.42,
  xPercent: 20,
  teamWidthVW: 42,
};
