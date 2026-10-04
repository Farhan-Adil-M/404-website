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
      // loader finishes near-instantly; threshold renders revealed state
      window.setTimeout(() => goto("threshold"), 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
