"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { registerDarkSection } from "@/lib/tone";

export default function Breathing() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];
    cleanups.push(registerDarkSection(root, ScrollTrigger));

    if (prefersReducedMotion()) {
      return () => cleanups.forEach((fn) => fn());
    }

    const line = root.querySelector<HTMLElement>(".cq-line");
    const rule = root.querySelector<HTMLElement>(".cq-rule");
    const label = root.querySelector<HTMLElement>(".cq-label");

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top 65%",
            end: "center 40%",
            scrub: 0.8,
          },
        })
        .fromTo(
          label,
          { opacity: 0 },
          { opacity: 0.5, duration: 0.2 },
          0
        )
        .fromTo(
          line,
          { opacity: 0, y: 46 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.15
        )
        .fromTo(
          rule,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.3 },
          0.45
        );
    }, root);

    /* ---------- exit — the signal descends ----------
       Deliberately almost nothing. After the composition has settled (the
       scrub parks at "center 40%"), the small rule continues growing
       downward on the same axis — a single line reaching toward the
       resolution. No accent, no second movement. */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", () => {
      const qctx = gsap.context(() => {
        gsap.fromTo(
          rule,
          { scaleY: 1, transformOrigin: "top center" },
          {
            scaleY: 2.6,
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "center 38%",
              end: "bottom 60%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      }, root);
      return () => qctx.revert();
    });

    return () => {
      cleanups.forEach((fn) => fn());
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-tone="dark"
      data-ch="quiet"
      className="ch ch-quiet"
      aria-label="Intermission"
    >
      <div className="cq-ghost display" aria-hidden>404</div>
      <div className="cq-inner">
        <div className="cq-label mono">CH.06 / INTERMISSION</div>
        <p className="cq-line serif">
          Between deadlines, the unit goes quiet.
          <br />
          The work keeps running.
        </p>
        <div className="cq-rule" aria-hidden />
        <div className="cq-status mono">SYSTEM / IDLE · SIGNAL / STANDBY</div>
      </div>
    </section>
  );
}
