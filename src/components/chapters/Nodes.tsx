"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setHud, pushHudPair } from "@/lib/useHud";
import { MEMBERS } from "@/lib/content";

export default function Nodes() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) {
      setHud({ status: "IDENTIFIED", anomalies: 0 });
      return;
    }

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(".cn-node")
    );
    const idx = Array.from(root.querySelectorAll<HTMLElement>(".cn-idx"));
    const schematicTicks = Array.from(
      root.querySelectorAll<HTMLElement>(".cn-schematic i")
    );
    const scan = root.querySelector<HTMLElement>(".cn-scan");

    const mm = gsap.matchMedia();
    /* HUD status follows scroll position so backward scrolling restores state */
    const hudSt = ScrollTrigger.create({
      trigger: root,
      start: "top 55%",
      onEnter: () => setHud({ status: "INVESTIGATING" }),
      onEnterBack: () => setHud({ status: "INVESTIGATING" }),
      onLeaveBack: () => setHud({ status: "IDENTIFIED" }),
    });

    mm.add(
      { desktop: "(min-width: 761px)", mobile: "(max-width: 760px)" },
      (c) => {
        const desktop = !!c.conditions?.desktop;
        if (!desktop) {
          // mobile: static stack, content fully visible — no pin
          return;
        }

        /* exit-tail length in timeline units (see the pin end below) */
        const N_TAIL = 0.35;

        const ctx = gsap.context(() => {
          gsap.set(nodes, { autoAlpha: 0, y: 70 });
          gsap.set(nodes[0], { autoAlpha: 1, y: 0 });
          idx.forEach((el, i) => el.classList.toggle("is-active", i === 0));
          nodes.forEach((el, i) => el.classList.toggle("is-scanned", i === 0));
          schematicTicks.forEach((el, i) => el.classList.toggle("is-active", i === 0));

          /* arrival — the investigation frame constructs while the stage
             enters, ending exactly when the pin engages and N01 is scanned
             in by the existing beats below. Existing furniture only. */
          const stage = root.querySelector<HTMLElement>(".cn-stage");
          const stageLabel = stage?.querySelector<HTMLElement>(".ch-label");
          const idxLines = Array.from(
            root.querySelectorAll<HTMLElement>(".cn-idx i")
          );
          const idxLabels = Array.from(
            root.querySelectorAll<HTMLElement>(".cn-idx")
          );
          const hint = stage?.querySelector<HTMLElement>(".cn-hint");
          if (stage && stageLabel && hint) {
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: stage,
                  start: "top bottom",
                  end: "top 10%",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo(
                stageLabel,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.3 },
                0
              )
              .fromTo(
                idxLabels,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.04 },
                0.12
              )
              .fromTo(
                idxLines,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 1, duration: 0.35, stagger: 0.04 },
                0.16
              )
              .fromTo(
                hint,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.25 },
                0.72
              );
          }

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              /* rate-preserved tail: the extra pin travel after the closing
                 hold keeps every existing beat at its original scroll
                 position (6.1 = current timeline total) */
              end: () =>
                `+=${Math.round(
                  window.innerHeight * 4.2 * ((6.1 + N_TAIL) / 6.1)
                )}`,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self: { progress: number }) => {
                const p = self.progress;
                const active = Math.min(
                  MEMBERS.length - 1,
                  Math.floor(p * MEMBERS.length)
                );
                idx.forEach((el, i) =>
                  el.classList.toggle("is-active", i === active)
                );
                nodes.forEach((el, i) =>
                  el.classList.toggle("is-scanned", i === active)
                );
                schematicTicks.forEach((el, i) =>
                  el.classList.toggle("is-active", i === active)
                );
                setHud({
                  status: "INVESTIGATING",
                  anomalies: Math.max(0, 6 - Math.floor(p * 6.15)),
                });
              },
            },
          });

          if (scan) {
            tl.fromTo(
              scan,
              { x: -24, opacity: 0 },
              {
                x: () => window.innerWidth + 24,
                opacity: 0.42,
                duration: 5.8,
              },
              0
            );
          }

          MEMBERS.forEach((m, i) => {
            const n = nodes[i];
            const at = i * 1 + 0.55;
            if (i > 0) {
              tl.to(
                nodes[i - 1],
                { autoAlpha: 0, y: -60, duration: 0.3 },
                at - 0.45
              );
              tl.fromTo(
                n,
                { autoAlpha: 0, y: 80 },
                { autoAlpha: 1, y: 0, duration: 0.35 },
                at - 0.4
              );
            }
            const num = n.querySelector<HTMLElement>(".cn-num");
            tl.fromTo(
              num,
              { xPercent: i % 2 ? 26 : -26, opacity: 0.15 },
              { xPercent: 0, opacity: 1, duration: 0.5 },
              at - 0.5
            );
            const fields = Array.from(
              n.querySelectorAll<HTMLElement>(".cnf > span")
            );
            tl.fromTo(
              fields,
              { yPercent: 130 },
              { yPercent: 0, duration: 0.25, stagger: 0.015 },
              at - 0.35
            );
            const note = n.querySelector<HTMLElement>(".cn-note");
            tl.fromTo(
              note,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.2 },
              at - 0.15
            );
            tl.call(
              () => {
                pushHudPair("br", [
                  { label: "NODE", ref: `${m.id} / 06` },
                  { label: "ARCHIVE", ref: "08 — OPEN" },
                ]);
              },
              undefined,
              at - 0.35
            );
          });

          // closing beat — the registry holds before the evidence arrives
          tl.to({}, { duration: 0.5 });

          /* ---------- exit tail — the frame yields to the evidence ----------
             The investigation furniture retracts (reverse of the arrival
             construction), the final node's data masks out upward while its
             numeral stays — the numeric identity hands off to the evidence
             refs. Rate-preserved: no existing beat moves. */
          const stageEl = root.querySelector<HTMLElement>(".cn-stage");
          const stageLabelEl = stageEl?.querySelector<HTMLElement>(".ch-label");
          const hintEl = stageEl?.querySelector<HTMLElement>(".cn-hint");
          const lastFields = Array.from(
            nodes[nodes.length - 1].querySelectorAll<HTMLElement>(".cnf > span")
          );
          const lastNote = nodes[nodes.length - 1].querySelector<HTMLElement>(
            ".cn-note"
          );
          if (stageEl && stageLabelEl && hintEl) {
            tl.to({}, { duration: 0.1 }); // stillness after the closing hold
            tl.to(
              idxLines,
              {
                scaleX: 0,
                transformOrigin: "left center",
                duration: 0.22,
                stagger: 0.02,
              },
              6.2
            )
              .to(
                idxLabels,
                { x: -14, opacity: 0, duration: 0.22, stagger: 0.02 },
                6.2
              )
              .to(hintEl, { opacity: 0, y: -14, duration: 0.18 }, 6.2)
              .to(stageLabelEl, { opacity: 0, y: -14, duration: 0.18 }, 6.2)
              .to(
                lastFields,
                { yPercent: -130, duration: 0.22, stagger: 0.015 },
                6.28
              )
              .to(lastNote, { opacity: 0, y: -16, duration: 0.18 }, 6.34);
          }
        }, root);
        return () => ctx.revert();
      }
    );

    return () => {
      hudSt.kill();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-tone="light"
      data-ch="nodes"
      className="ch ch-nodes"
      aria-label="The six nodes"
    >
      <div className="cn-stage">
        <div className="docframe" aria-hidden />
        <div className="cn-schematic" aria-hidden>
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="cn-scan" aria-hidden />
        <header className="ch-label mono">CH.03 / NODES — 06 DETECTED</header>

        <aside className="cn-index mono" aria-hidden>
          {MEMBERS.map((m) => (
            <span className="cn-idx" key={m.id}>
              <i />N.{m.id}
            </span>
          ))}
        </aside>

        <div className="cn-focus">
          {MEMBERS.map((m) => (
            <article
              className="cn-node"
              key={m.id}
              aria-label={`${m.name}, ${m.role}`}
            >
              <div className="cn-num display" aria-hidden>
                {m.id}
              </div>
              <div className="cn-data">
                <h3 className="cn-name display">{m.name}</h3>
                <div className="cn-fields mono">
                  <div className="cnf">
                    <span className="cnf-k">NAME</span>
                    <span className="cnf-v">{m.name}</span>
                  </div>
                  <div className="cnf">
                    <span className="cnf-k">ROLE</span>
                    <span className="cnf-v">{m.role}</span>
                  </div>
                  <div className="cnf">
                    <span className="cnf-k">FOCUS</span>
                    <span className="cnf-v">{m.focus}</span>
                  </div>
                  <div className="cnf">
                    <span className="cnf-k">GRID</span>
                    <span className="cnf-v">{m.grid}</span>
                  </div>
                </div>
                <p className="cn-note serif">{m.note}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="cn-hint mono">RECORDS INCOMPLETE — IDENTITY DATA PENDING</p>
      </div>
    </section>
  );
}
