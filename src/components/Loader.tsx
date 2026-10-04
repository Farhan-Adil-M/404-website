"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE, prefersReducedMotion, fitWordmark } from "@/lib/gsap";
import { typewrite, makeSignal, cancelAllTyping, type Signal } from "@/lib/typewriter";

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
        status
          .querySelectorAll<HTMLParagraphElement>(".boot-line")
          .forEach((p, i) => {
            p.textContent = LINES[i];
            p.classList.add("is-live");
          });
        timer = window.setTimeout(finish, 350);
        return;
      }

      // the 0 slots in as an official empty counter; rule underlines it
      gsap.set(slot, { opacity: 0 });
      gsap.set(rule, { scaleX: 0 });
      gsap
        .timeline({ defaults: { ease: EASE.settle } })
        .to(slot, { opacity: 1, duration: 0.7 }, 0.15)
        .to(rule, { scaleX: 1, duration: 0.9, ease: "power2.out" }, 0.55);
    }, root);

    // boot sequence, gated on real font load (with a hard cap)
    const boot = async () => {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 1600)),
        ]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="loader"
      role="status"
      aria-label="Loading TEAM 404"
    >
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

      <button
        type="button"
        className="loader__skip mono"
        data-cursor="SKIP"
        onClick={finish}
      >
        SKIP ↵
      </button>
    </div>
  );
}
