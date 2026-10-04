"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, getLenis } from "@/lib/gsap";
import { setHud, pushHudPair } from "@/lib/useHud";
import { MEMBERS, STATUSES } from "@/lib/content";

export default function Finale() {
  const rootRef = useRef<HTMLElement>(null);

  const handleAgain = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finishStatic = () => {
      root.classList.add("is-static");
      setHud({ status: "RESOLVED", anomalies: 0 });
      pushHudPair("br", [
        { label: "ARCHIVE", ref: "08 — RESOLVED" },
        { label: "NODES", ref: "06 / 06" },
      ]);
    };

    if (prefersReducedMotion()) {
      finishStatic();
      return;
    }

    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".cn-node"));
    const steps = Array.from(
      root.querySelectorAll<HTMLElement>(".cf-step-in")
    );
    const crew = Array.from(root.querySelectorAll<HTMLElement>(".cf-node"));
    const teamChars = Array.from(
      root.querySelectorAll<HTMLElement>(".cf-c-in")
    );
    const digits = Array.from(root.querySelectorAll<HTMLElement>(".cf-d"));
    const solid = root.querySelector<HTMLElement>(".cf-solid");
    const accent = root.querySelector<HTMLElement>(".cf-rule");
    const thesis = root.querySelector<HTMLElement>(".cf-thesis");
    const sig = root.querySelector<HTMLElement>(".cf-sig");
    const frame = root.querySelector<HTMLElement>(".docframe");

    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 761px)", mobile: "(max-width: 760px)" },
      (c) => {
        const desktop = !!c.conditions?.desktop;
        if (!desktop) {
          finishStatic();
          return;
        }

        /* reverse scrolling past the climax must re-arm the resolution beat */
        let resolved = false;

        const ctx = gsap.context(() => {
          gsap.set(steps, { yPercent: 130 });
          gsap.set(crew, { opacity: 0, x: (i: number) => (i - 2.5) * window.innerWidth * 0.07, y: 40 });
          gsap.set(teamChars, { yPercent: 130 });
          gsap.set(digits, { opacity: 0, scale: 1.6 });
          if (solid) gsap.set(solid, { opacity: 0 });
          if (accent) gsap.set(accent, { scaleX: 0 });
          gsap.set(thesis, { opacity: 0, y: 30 });
          gsap.set(sig, { opacity: 0, y: 20 });
          if (nodes.length) gsap.set(nodes, { autoAlpha: 0 });
          if (frame) gsap.set(frame, { scale: 1.015, transformOrigin: "50% 50%" });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "+=260%",
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self: { progress: number }) => {
                if (self.progress > 0.92 && !resolved) {
                  resolved = true;
                  setHud({ status: "RESOLVED", anomalies: 0 });
                  pushHudPair("br", [
                    { label: "ARCHIVE", ref: "08 — RESOLVED" },
                    { label: "NODES", ref: "06 / 06" },
                  ]);
                } else if (self.progress <= 0.92 && resolved) {
                  /* scrolling back through the climax re-arms the beat */
                  resolved = false;
                  setHud({ status: "INVESTIGATING", anomalies: 6 });
                  pushHudPair("br", [
                    { label: "ARCHIVE", ref: "08 — OPEN" },
                    { label: "NODES", ref: "06 / 06" },
                  ]);
                }
              },
            },
          });

          /* the status ladder resolves: MISSING → … → RESOLVED */
          steps.forEach((_, i) => {
            tl.to(steps[i], { yPercent: 0, duration: 0.045 }, 0.04 + i * 0.05);
            if (i > 0) {
              tl.to(steps[i - 1], { opacity: 0.3, duration: 0.03 }, 0.05 + i * 0.05);
            }
          });

          /* the six nodes converge into one row */
          tl.to(
            crew,
            { opacity: 1, x: 0, y: 0, duration: 0.12, stagger: 0.015 },
            0.3
          );

          /* the wordmark assembles along the grid */
          tl.to(
            teamChars,
            { yPercent: 0, duration: 0.08, stagger: 0.015 },
            0.42
          );
          tl.to(
            digits,
            { opacity: 1, scale: 1, duration: 0.1, stagger: 0.02 },
            0.48
          );
          if (frame) tl.to(frame, { scale: 1, duration: 0.14 }, 0.48);

          /* climax: the missing 0 closes — the accent fires at full strength */
          tl.to(solid, { opacity: 1, duration: 0.035 }, 0.62);
          tl.to(accent, { scaleX: 1, duration: 0.07 }, 0.62);

          /* resolution: thesis + signature */
          tl.to(thesis, { opacity: 1, y: 0, duration: 0.07 }, 0.72);
          tl.to(sig, { opacity: 1, y: 0, duration: 0.06 }, 0.82);
          tl.to({}, { duration: 0.12 }); // closing stillness

          /* ---------- arrival — the system wakes ----------
             While the dark quiet exits, the resolution header registers as
             a system event. The pin then engages and the existing ladder →
             crew → mark choreography answers it. No accent here — the
             climax keeps its monopoly on full-strength color. */
          const stageLabel = root.querySelector<HTMLElement>(".ch-label");
          if (stageLabel) {
            gsap.set(stageLabel, { opacity: 0, y: 18 });
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: root,
                  start: "top bottom",
                  end: "top top",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo(
                stageLabel,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.3 },
                0
              );
          }
        }, root);
        return () => ctx.revert();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-tone="light"
      data-ch="finale"
      className="ch ch-finale"
      aria-label="Resolution"
    >
      <div className="cf-stage">
        <div className="docframe" aria-hidden />
        <header className="ch-label mono">CH.07 / RESOLUTION</header>

        <div className="cf-ladder mono" aria-label="System status progression">
          {STATUSES.map((s) => (
            <span className="cf-step" key={s}>
              <i className="cf-step-in">{s}</i>
            </span>
          ))}
        </div>

        <div className="cf-crew mono" aria-hidden>
          {MEMBERS.map((m) => (
            <span className="cf-node" key={m.id}>
              {m.ref}
            </span>
          ))}
        </div>

        <div className="cf-mark display" aria-label="TEAM 404">
          {"TEAM".split("").map((c, i) => (
            <span className="cf-c" key={`t${i}`}>
              <i className="cf-c-in">{c}</i>
            </span>
          ))}
          <span className="cf-gap" aria-hidden />
          <span className="cf-d">4</span>
          <span className="cf-slot">
            <span className="cf-hollow">0</span>
            <span className="cf-solid">0</span>
          </span>
          <span className="cf-d">4</span>
        </div>
        <div className="cf-rule" aria-hidden />

        <p className="cf-thesis serif">
          The page you were looking for does not exist.
          <br />
          The team behind it does.
        </p>

        <div className="cf-sig mono">
          <span>REF: T-404</span>
          <span>ERR 000</span>
          <span>END OF FILE</span>
          <button
            type="button"
            className="cf-again"
            data-cursor="RESOLVE"
            onClick={handleAgain}
          >
            RESOLVE AGAIN ↺
          </button>
        </div>
      </div>
    </section>
  );
}
