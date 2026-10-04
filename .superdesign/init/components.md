# components.md — TEAM 404 shared UI primitives

Framework: React 19 · Next.js 15.5 (App Router) · no component library (fully custom) · vanilla CSS with custom properties (two global stylesheets: `src/app/globals.css`, `src/app/chapters.css`). Animation: GSAP 3.13 + ScrollTrigger, Lenis 1.3.

This project deliberately has almost no generic primitives. The shared "components" are the persistent overlay layers (HUD, rail, cursor) and small runtime libraries. Scene components (Threshold, chapters) are page-specific and listed in `pages.md`.

---

## Cursor
- Source: `src/components/Cursor.tsx`
- Custom ink-dot cursor with contextual verb label (`data-cursor` attributes). Hidden on coarse pointers. Dispatches `t404:coords` custom events that the HUD consumes for the coordinate readout.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      root.style.display = "none";
      return;
    }

    document.documentElement.classList.add("no-native-cursor");

    const xTo = gsap.quickTo(root, "x", { duration: 0.38, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.38, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      window.dispatchEvent(
        new CustomEvent("t404:coords", { detail: { x: e.clientX, y: e.clientY } })
      );
    };

    const over = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      const verb = t?.getAttribute("data-cursor");
      if (verb) {
        if (labelRef.current) labelRef.current.textContent = verb;
        root.classList.add("is-active");
      } else {
        root.classList.remove("is-active");
      }
      const dark = (e.target as HTMLElement)?.closest?.("[data-tone='dark']");
      root.classList.toggle("is-dark", !!dark);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("no-native-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden>
      <div className="cursor__dot">
        <span className="cursor__label" ref={labelRef} />
      </div>
    </div>
  );
}
```

---

## Hud (persistent state layer + rail navigation)
- Source: `src/components/Hud.tsx`
- Fixed overlay: brand top-left, status top-right, pointer coordinates bottom-left, dynamic metadata pairs bottom-right (fed by `pushHudPair`), and a full-width bottom progress rail whose ticks double as chapter navigation (smooth-scrolls via Lenis). Tone flips handled globally via `html.tone-dark`.

```tsx
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
```

---

## Loader (boot sequence scene, fixed overlay)
- Source: `src/components/Loader.tsx`
- Giant fitted "404" wordmark, typewritten boot lines (`RESOLVING... / QUERY FAILED / PAGE NOT FOUND`), corner metadata, SKIP button. Auto-completes when fonts settle (hard-capped at 1.6s).

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE, prefersReducedMotion, fitWordmark } from "@/lib/gsap";
import { typewrite, makeSignal, cancelAllTyping } from "@/lib/typewriter";

const LINES = ["RESOLVING...", "QUERY FAILED", "PAGE NOT FOUND"];

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    cancelAllTyping();
    completeRef.current();
  };

  useEffect(() => {
    const root = rootRef.current;
    const display = displayRef.current;
    const slot = slotRef.current;
    const rule = ruleRef.current;
    const status = statusRef.current;
    if (!root || !display || !slot || !rule || !status) return;

    fitWordmark(fitRef.current, display);
    const onResize = () => {
      if (!doneRef.current) fitWordmark(fitRef.current, display);
    };
    window.addEventListener("resize", onResize);

    const reduced = prefersReducedMotion();
    const signal = makeSignal();
    let timer: number | undefined;

    const ctx = gsap.context(() => {
      if (reduced) {
        status.querySelectorAll<HTMLParagraphElement>(".boot-line").forEach((p, i) => {
          p.textContent = LINES[i];
          p.classList.add("is-live");
        });
        timer = window.setTimeout(finish, 350);
        return;
      }

      gsap.set(slot, { opacity: 0 });
      gsap.set(rule, { scaleX: 0 });
      gsap
        .timeline({ defaults: { ease: EASE.settle } })
        .to(slot, { opacity: 1, duration: 0.7 }, 0.15)
        .to(rule, { scaleX: 1, duration: 0.9, ease: "power2.out" }, 0.55);
    }, root);

    const boot = async () => {
      try {
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1600))]);
      } catch {
        /* font API unavailable */
      }
      if (signal.cancelled || doneRef.current) return;
      const els = status.querySelectorAll<HTMLParagraphElement>(".boot-line");
      for (let i = 0; i < els.length; i++) {
        await typewrite(els[i], LINES[i], { signal, speed: 30, hold: 120 });
        if (signal.cancelled) return;
        els[i].classList.add("is-live");
      }
      timer = window.setTimeout(finish, 420);
    };
    boot();

    return () => {
      signal.cancelled = true;
      cancelAllTyping();
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Loading TEAM 404">
      <div className="loader__corner loader__corner--l mono">
        <span>REF: T-404</span>
        <span>STATUS: SEARCHING</span>
      </div>
      <div className="loader__corner loader__corner--r mono">
        <span>NODE 00 / 06</span>
        <span>SIGNAL 00.00</span>
      </div>

      <div className="loader__wm" ref={fitRef}>
        <div className="wm__fit">
          <div className="wm__display" ref={displayRef}>
            <span className="g">4</span>
            <span className="g g--slot" ref={slotRef}>
              <span className="g__hollow">0</span>
            </span>
            <span className="g">4</span>
          </div>
          <div className="slot-rule" ref={ruleRef} />
        </div>
      </div>

      <div className="loader__status mono" ref={statusRef}>
        {LINES.map((l) => (
          <p className="boot-line" key={l}>
            {""}
          </p>
        ))}
      </div>

      <button type="button" className="loader__skip mono" data-cursor="SKIP" onClick={finish}>
        SKIP ↵
      </button>
    </div>
  );
}
```

---

## Supporting runtime libraries (not components, required by all scenes)

### `src/lib/gsap.ts` (excerpt of exports)
- Single GSAP + ScrollTrigger registration (`initGsap`), one Lenis instance (`startLenis`, `getLenis`), `lockScroll/unlockScroll`, `settleAndRefresh` (font-gated deterministic ScrollTrigger.refresh), env helpers (`prefersReducedMotion`, `isTouch`), easing vocabulary (`EASE.enter/exit/settle/ui`), `splitChars`, `fitWordmark`, `REVEAL` constants `{ scale: 0.42, xPercent: 20, teamWidthVW: 42 }`.

### `src/lib/typewriter.ts`
- Promise-based char-by-char typewriter with jitter, punctuation pause, global cancellation via `window.dispatchEvent(new Event("t404:cancel"))`.

### `src/lib/useHud.ts`
- Module-level store + `setHud(patch)` (emits fresh snapshot), `pushHudPair(pos, frames)` registry for HUD bottom corners, `useHud()` subscription hook.

### `src/lib/tone.ts`
- `registerDarkSection(trigger, ST, end?)` — a ScrollTrigger toggling `html.tone-dark` (chrome-only tone inversion).
