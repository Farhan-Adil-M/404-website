"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setHud } from "@/lib/useHud";
import { MEMBERS, TEAM } from "@/lib/content";

const REGISTRY = [
  `STATUS: LOCALIZED`,
  `NODES: ${TEAM.nodes}`,
  `ORIGIN: ${TEAM.origin}`,
  `TYPE: ${TEAM.type}`,
  `STATE: ${TEAM.state}`,
];

export default function Identity() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      setHud({ status: "IDENTIFIED" });
      return;
    }

    const rows = Array.from(
      root.querySelectorAll<HTMLElement>(".ci-row > span")
    );
    const bigs = Array.from(root.querySelectorAll<HTMLElement>(".ci-big"));
    const serif = root.querySelector<HTMLElement>(".ci-serif");
    const ghost = root.querySelector<HTMLElement>(".ci-ghost");
    const meta = root.querySelector<HTMLElement>(".ci-meta");
    const label = root.querySelector<HTMLElement>(".ch-label");

    const ctx = gsap.context(() => {
      gsap.set(rows, { yPercent: 130 });
      gsap.set(bigs[0], { xPercent: -40 });
      gsap.set(bigs[1], { xPercent: 30 });
      gsap.set(serif, { opacity: 0, y: 40 });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            /* begins while the Threshold act is still releasing its pin, so
               the masked typography is already in motion as it enters — the
               camera never stops between the two compositions */
            start: "top 85%",
            end: "center 45%",
            scrub: 0.6,
          },
        })
        .to(rows, { yPercent: 0, stagger: 0.025, duration: 0.12 }, 0)
        .to(bigs[0], { xPercent: 0, duration: 0.2 }, 0.04)
        .to(bigs[1], { xPercent: 0, duration: 0.2 }, 0.1)
        .to(serif, { opacity: 1, y: 0, duration: 0.16 }, 0.18)
        .to(ghost, { yPercent: -26, duration: 0.5 }, 0);

      ScrollTrigger.create({
        trigger: root,
        start: "top 55%",
        /* end where the Nodes investigation takes over the status line, so
           the HUD is deterministic in both scroll directions */
        end: "bottom 55%",
        onEnter: () => setHud({ status: "IDENTIFIED" }),
        onEnterBack: () => setHud({ status: "IDENTIFIED" }),
        /* scrolling back up into the Threshold act restores its end state */
        onLeaveBack: () => setHud({ status: "SYSTEM" }),
      });
    }, root);

    /* ---------- departure — identity yields the field to the nodes ----------
       Desktop only. Runs after the reveal has parked ("center 45%"), over
       the last stretch before the Nodes stage pins. The composition holds
       still, then the "06" grows into the node-numeral presence while the
       display typography leaves along the grid and the metadata masks back
       out. Every tween starts from the reveal's parked end-state, so
       backward scrolling reconstructs the chapter exactly. */
    const mm = gsap.matchMedia();
    mm.add("(min-width: 761px)", () => {
      const dctx = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "bottom 85%",
              end: "bottom 30%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          /* deliberate stillness — the resolved identity breathes */
          .to({}, { duration: 0.2 })
          /* PRIMARY — the numeral takes the field; typography departs */
          .fromTo(
            ghost,
            { yPercent: -26, xPercent: 0, scale: 1 },
            { yPercent: -34, xPercent: 5, scale: 1.22, duration: 0.5 },
            0.2
          )
          .fromTo(
            bigs[0],
            { xPercent: 0 },
            { xPercent: -36, duration: 0.45 },
            0.24
          )
          .fromTo(
            bigs[1],
            { xPercent: 0 },
            { xPercent: 30, duration: 0.45 },
            0.24
          )
          /* SECONDARY — registry masks back out, serif lifts away */
          .fromTo(
            rows,
            { yPercent: 0 },
            { yPercent: -130, duration: 0.28, stagger: 0.02 },
            0.3
          )
          .fromTo(
            serif,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -36, duration: 0.3 },
            0.36
          )
          /* MICRO — metadata and chapter label resolve out */
          .fromTo(
            meta,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -20, duration: 0.25 },
            0.42
          )
          .fromTo(
            label,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -14, duration: 0.2 },
            0.42
          );
      }, root);
      return () => dctx.revert();
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
      data-ch="identity"
      className="ch ch-identity"
      aria-label="Team 404 identity"
    >
      <span className="ch-label mono">CH.02 / IDENTITY</span>
      <div className="docframe" aria-hidden />
      <div className="doc-scale" aria-hidden />
      <div
        className="doc-tag"
        style={{ right: "calc(var(--margin) * 1.6)", top: "22vh" }}
      >
        CLASS / INTERNAL
      </div>
      <div className="six-points" aria-hidden>
        <span className="six-points__label mono">MEMBER INDEX / 06</span>
        <div className="six-points__row">
          {MEMBERS.map((member) => (
            <i key={member.id}>
              <b>N.{member.id}</b>
            </i>
          ))}
        </div>
      </div>
      <div className="ci-ghost display" aria-hidden>
        06
      </div>

      <div className="ci-registry mono">
        {REGISTRY.map((r) => (
          <div className="ci-row" key={r}>
            <span>{r}</span>
          </div>
        ))}
      </div>

      <h2 className="ci-display">
        <span className="ci-line">
          <span className="ci-big display">SIX</span>
        </span>
        <span className="ci-line">
          <span className="ci-big ci-outline display">PEOPLE</span>
        </span>
      </h2>

      <p className="ci-serif serif">
        Team 404 is a hackathon unit — six people who build under a name that
        officially doesn&apos;t exist. The name started as an error and stayed.
        This site is built the way the team works: fast, deliberate, and
        slightly unfinished on purpose.
      </p>

      <div className="ci-meta mono">
        UNIT: HACKATHON · RECORDS ON FILE: 00 · SITE: EXPERIMENTAL BUILD
      </div>
    </section>
  );
}
