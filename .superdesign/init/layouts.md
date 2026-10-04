# layouts.md — TEAM 404 shell & persistent layers

There is one route and one shell. "Layout" here = root document + the conductor component that mounts every scene + two fixed overlay layers (HUD, cursor) + grain texture.

---

## Root layout
- Source: `src/app/layout.tsx`
- HTML starts `className="locked"` (scroll hard-locked until ENTER). Loads Archivo Black from Google Fonts. Includes a `<noscript>` static 404 fallback overlay.

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./chapters.css";

export const metadata: Metadata = {
  title: "404 — PAGE NOT FOUND",
  description:
    "The page you were looking for does not exist. The team behind it does.",
};

export const viewport: Viewport = {
  themeColor: "#eae4d8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="locked">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <noscript>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "var(--paper)",
              color: "var(--ink)",
              display: "grid",
              placeContent: "center",
              textAlign: "center",
              fontFamily: "Georgia, serif",
              padding: "0 8vw",
            }}
          >
            <p style={{ fontFamily: "\"Archivo Black\", \"Arial Black\", sans-serif", fontSize: "28vw", lineHeight: 0.8 }}>
              404
            </p>
            <p style={{ marginTop: "4vh", fontSize: "18px" }}>
              The page you were looking for does not exist. The team behind it does.
            </p>
            <p
              style={{
                marginTop: "4vh",
                fontFamily: "ui-monospace, monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              ERR_NOT_FOUND — THIS ARCHIVE REQUIRES JAVASCRIPT
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
```

---

## Experience (conductor / app shell)
- Source: `src/components/Experience.tsx`
- Phase machine: `loader` → `threshold` → `misbehavior`. On ENTER: unlock scroll, show HUD, mount ALL chapters (they stay mounted for the rest of the session; ScrollTrigger drives everything by scroll position). Owns rail-fill updater, deterministic refresh after mount, visibility-lock guard.

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "@/components/Loader";
import Threshold from "@/components/Threshold";
import Hud from "@/components/Hud";
import Cursor from "@/components/Cursor";
import Identity from "@/components/chapters/Identity";
import Nodes from "@/components/chapters/Nodes";
import Evidence from "@/components/chapters/Evidence";
import Archive from "@/components/chapters/Archive";
import Breathing from "@/components/chapters/Breathing";
import Finale from "@/components/chapters/Finale";
import {
  initGsap,
  lockScroll,
  unlockScroll,
  prefersReducedMotion,
  getLenis,
  startLenis,
  settleAndRefresh,
} from "@/lib/gsap";
import { setHud } from "@/lib/useHud";

type Phase = "loader" | "threshold" | "misbehavior";

export default function Experience() {
  const [phase, setPhase] = useState<Phase>("loader");
  const [, setTick] = useState(0);
  const phaseRef = useRef<Phase>("loader");
  const reduced = prefersReducedMotion();

  const goto = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
    setTick((t) => t + 1);
  }, []);

  /* initial lock (SSR also renders html.locked; this guards hot paths) */
  useEffect(() => {
    initGsap();
    startLenis();
    lockScroll();
    setHud({ visible: false, status: "IDLE", anomalies: 0 });
    if (prefersReducedMotion()) {
      window.setTimeout(() => goto("threshold"), 350);
    }
  }, []);

  /* enter = authorize access: release the lock, hand over to the system */
  const handleEnter = useCallback(() => {
    unlockScroll();
    setHud({ status: "NOT FOUND", visible: true });
    goto("misbehavior");
  }, [goto]);

  const handleLoaderDone = useCallback(() => {
    if (phaseRef.current !== "loader") return;
    goto("threshold");
    setHud({ status: "NOT FOUND", visible: true });
  }, [goto]);

  /* rail progress follows real scroll (scrub: 1 readout) */
  useEffect(() => {
    if (phase === "loader" || phase === "threshold") return;
    const fill = document.querySelector<HTMLElement>("[data-rail-fill]");
    if (!fill) return;
    const doc = document.documentElement;
    const onScroll = () => {
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      fill.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [phase]);

  /* one deterministic refresh after chapters mount + fonts settle */
  useEffect(() => {
    if (phase === "loader") return;
    settleAndRefresh();
  }, [phase]);

  /* leaving/entering the tab must not break the lock */
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && phaseRef.current !== "misbehavior") {
        lockScroll();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    return () => {
      getLenis()?.destroy();
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden />
      <Cursor />
      <Hud />
      {phase === "loader" && <Loader onComplete={handleLoaderDone} />}
      {(phase === "threshold" || phase === "misbehavior") && (
        <>
          <Threshold key="threshold" onEnter={handleEnter} />
          <Identity />
          <Nodes />
          <Evidence />
          <Archive />
          <Breathing />
          <Finale />
        </>
      )}
    </>
  );
}
```

---

## Page
- Source: `src/app/page.tsx`

```tsx
import Experience from "@/components/Experience";

export default function Home() {
  return <Experience />;
}
```

---

## Fixed overlay layers (rendered by Experience, positioned in globals.css)

- `.grain` — full-viewport SVG turbulence texture, `mix-blend-mode: multiply`, `steps(4)` shift animation (kill in reduced motion).
- `.hud` — see `components.md` (four corners + rail). Top strip owned by HUD; scene metadata offsets below it via approved +44px lane.
- `.cursor` — see `components.md`.
