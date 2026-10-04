"use client";

import { useEffect, useRef } from "react";
import { useHud, getPairs, getPairVersion, type HudState } from "@/lib/useHud";
import { getLenis } from "@/lib/gsap";

export const TICKS: Array<{ pct: number; label: string; target: string }> = [
  { pct: 0, label: "404", target: "@top" },
  { pct: 16.67, label: "IDENTITY", target: "[data-ch='identity']" },
  { pct: 33.33, label: "NODES", target: "[data-ch='nodes']" },
  { pct: 50, label: "EVIDENCE", target: "[data-ch='evidence']" },
  { pct: 66.67, label: "ARCHIVE", target: "[data-ch='archive']" },
  { pct: 83.33, label: "QUIET", target: "[data-ch='quiet']" },
  { pct: 100, label: "RESOLVE", target: "[data-ch='finale']" },
];

const STATUS_LABEL: Record<HudState["status"], string> = {
  IDLE: "STATUS / ---",
  "NOT FOUND": "STATUS / NOT FOUND",
  ANOMALY: "STATUS / ANOMALY DETECTED",
  SYSTEM: "STATUS / SYSTEM FOUND",
  IDENTIFIED: "STATUS / IDENTITY CONFIRMED",
  INVESTIGATING: "STATUS / INVESTIGATING",
  RESOLVED: "STATUS / RESOLVED",
};

export default function Hud() {
  const hud = useHud();
  const coordsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const on = (e: Event) => {
      const detail = (e as CustomEvent<{ x: number; y: number }>).detail;
      if (coordsRef.current && detail) {
        coordsRef.current.textContent = `X ${String(
          Math.round(detail.x)
        ).padStart(4, "0")} · Y ${String(Math.round(detail.y)).padStart(4, "0")}`;
      }
    };
    window.addEventListener("t404:coords", on);
    return () => window.removeEventListener("t404:coords", on);
  }, []);

  getPairVersion();

  // Active chapter tracking: direct DOM class toggle, rAF-throttled,
  // re-queries section elements lazily (chapters mount later than Hud).
  useEffect(() => {
    let raf = 0;
    const secs: Array<HTMLElement | null> = [];
    const check = () => {
      raf = 0;
      for (let i = 0; i < TICKS.length; i++) {
        if (TICKS[i].target === "@top") continue;
        if (!secs[i])
          secs[i] = document.querySelector(TICKS[i].target) as HTMLElement | null;
      }
      const mid = window.innerHeight * 0.5;
      let active = 0;
      for (let i = 1; i < TICKS.length; i++) {
        const el = secs[i];
        if (!el) continue;
        if (el.getBoundingClientRect().top <= mid) active = i;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY >= max - 4) active = TICKS.length - 1;
      const ticks = document.querySelectorAll<HTMLElement>(".rail__tick");
      ticks.forEach((t, i) => t.classList.toggle("is-active", i === active));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (target: string) => {
    const lenis = getLenis();
    if (target === "@top") {
      if (lenis) lenis.scrollTo(0, { duration: 1.6 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.6 });
    else (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`hud ${hud.visible ? "" : "hud--hidden"}`} aria-hidden>
      <div className="hud__tl">
        <span className="hud__brand">TEAM 404</span>
        <span className="mono hud__dim">REF: T-404</span>
      </div>

      <div className="hud__tr">
        <span className="mono hud__dim">{STATUS_LABEL[hud.status]}</span>
      </div>

      <div className="hud__bl">
        <span className="mono hud__dim" ref={coordsRef}>
          X 0000 · Y 0000
        </span>
      </div>

      <div className="hud__br">
        {getPairs().br.map((f: { label: string; ref?: string }) => (
          <span className="mono hud__dim" key={f.label}>
            {f.label}
            {f.ref ? ` / ${f.ref}` : ""}
          </span>
        ))}
        {hud.anomalies > 0 && (
          <span className="mono hud__anomaly">
            ANOMALIES / {String(hud.anomalies).padStart(2, "0")}
          </span>
        )}
      </div>

      {/* system navigation — the rail doubles as the chapter index */}
      <nav className="rail" aria-label="Chapters">
        <div className="rail__line">
          <div className="rail__fill" data-rail-fill />
        </div>
        {TICKS.map((t) => (
          <button
            key={t.label}
            type="button"
            className="rail__tick"
            data-label={t.label}
            aria-label={`Go to chapter ${t.label}`}
            onClick={() => go(t.target)}
          >
            <i />
          </button>
        ))}
      </nav>
    </div>
  );
}
