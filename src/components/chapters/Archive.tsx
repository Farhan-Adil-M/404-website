"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { setHud } from "@/lib/useHud";
import { EVENTS } from "@/lib/content";

export default function Archive() {
  const rootRef = useRef<HTMLElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const spine = spineRef.current;
    const ctx = gsap.context(() => {
      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 60%",
              end: "bottom 75%",
              scrub: 0.5,
            },
          }
        );
      }

      root.querySelectorAll<HTMLElement>(".ca-entry").forEach((el, i) => {
        const reveals = el.querySelectorAll<HTMLElement>(".ca-reveal");
        gsap.fromTo(
          reveals,
          { yPercent: 130 },
          {
            yPercent: 0,
            duration: 1,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 55%",
              scrub: 0.5,
            },
          }
        );
        const num = el.querySelector<HTMLElement>(".ca-num");
        gsap.fromTo(
          num,
          { xPercent: i % 2 ? 18 : -18, opacity: 0.12 },
          {
            xPercent: 0,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 50%",
              scrub: 0.5,
            },
          }
        );
      });
    }, root);

    /* ---------- arrival — the record system presents itself ----------
       Deliberately minimal: the chapter label resolves as the paper world
       returns. The spine's own trigger establishes it from the seam point
       and the entries reveal progressively — the archive is inevitable. */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", () => {
      const actx = gsap.context(() => {
        const label = root.querySelector<HTMLElement>(".ch-label");
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "top 55%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            label,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.3 },
            0
          );

        /* ---------- exit — the system stops searching ----------
           Deliberately minimal. After the last entry has settled and the
           spine has fully grown (its own trigger parks at "bottom 75%"),
           the line withdraws back into the record on the same axis it grew
           on, and the chapter label recedes slightly. The page itself does
           the breathing — Quiet's own composition takes over from there. */
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "bottom 70%",
              end: "bottom 45%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            spineRef.current,
            { scaleY: 1, transformOrigin: "top center" },
            { scaleY: 0, duration: 0.75 },
            0
          )
          .fromTo(
            label,
            { opacity: 1, y: 0 },
            { opacity: 0.35, y: -10, duration: 0.45 },
            0.1
          );
      }, root);
      return () => actx.revert();
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-tone="light"
      data-ch="archive"
      className="ch ch-archive"
      aria-label="Operation log"
    >
      <header className="ch-label mono">CH.05 / ARCHIVE — OPERATION LOG</header>
      <div className="docframe" aria-hidden />
      <div className="doc-scale" aria-hidden />
      <div className="doc-tag">CASE / 404 — SEALED</div>
      <div className="ca-spine" ref={spineRef} aria-hidden />

      <div className="ca-list">
        {EVENTS.map((e, i) => (
          <article
            className={`ca-entry${i % 2 ? " ca-entry--right" : ""}`}
            key={e.ref}
          >
            <div className="ca-num display" aria-hidden>
              {e.id}
            </div>
            <div className="ca-body">
              <div className="ca-mask">
                <div className="ca-reveal mono ca-ref">{e.ref}</div>
              </div>
              <h3 className="ca-mask">
                <span className="ca-reveal ca-event display">{e.event}</span>
              </h3>
              <div className="ca-mask">
                <div className="ca-reveal mono ca-meta">
                  DATE {e.date} · RESULT {e.result}
                </div>
              </div>
              <div className="ca-mask">
                <p className="ca-reveal ca-note serif">
                  [ENTRY NOTE — WHAT HAPPENED, WHAT SHIPPED, WHAT BROKE. TO BE
                  REPLACED.]
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
