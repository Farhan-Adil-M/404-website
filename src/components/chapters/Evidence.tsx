"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from "@/lib/gsap";
import { setHud } from "@/lib/useHud";
import { registerDarkSection } from "@/lib/tone";
import { PROJECTS } from "@/lib/content";

export default function Evidence() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const cleanups: Array<() => void> = [];
    /* the dark chrome must stay light-on-dark for the whole pinned passage:
       the tone window covers the horizontal travel plus the exit tail */
    cleanups.push(
      registerDarkSection(root, ScrollTrigger, () => {
        const isDesktop = window.matchMedia("(min-width: 761px)").matches;
        if (!isDesktop) return "bottom 45%";
        const m =
          parseFloat(getComputedStyle(root).getPropertyValue("--margin")) || 24;
        const travel =
          Math.max(0, track.scrollWidth - window.innerWidth + m) * 1.05 * 1.18;
        /* flip back once the archive paper covers roughly half the chrome */
        return "bottom " + (45 - (travel / window.innerHeight) * 100) + "%";
      })
    );

    if (prefersReducedMotion()) {
      return () => cleanups.forEach((fn) => fn());
    }

    /* HUD status follows scroll position, not mount time */
    const hudSt = ScrollTrigger.create({
      trigger: root,
      start: "top 55%",
      onEnter: () => setHud({ status: "INVESTIGATING" }),
      onEnterBack: () => setHud({ status: "INVESTIGATING" }),
      onLeaveBack: () => setHud({ status: "ANOMALY" }),
    });
    cleanups.push(() => hudSt.kill());

    const margin = () =>
      parseFloat(getComputedStyle(root).getPropertyValue("--margin")) || 24;

    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 761px)", mobile: "(max-width: 760px)" },
      (c) => {
        const desktop = !!c.conditions?.desktop;
        if (!desktop) return; // mobile: vertical stack, no horizontal scroll

        const ctx = gsap.context(() => {
          const dist = () =>
            Math.max(0, track.scrollWidth - window.innerWidth + margin());
          /* exit-tail length in timeline units (rate-preserving: the
             existing passage keeps its exact scroll mapping) */
          const E_TAIL = 0.18;

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${Math.round(dist() * 1.05 * (1 + E_TAIL))}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const scan = root.querySelector<HTMLElement>(".ce-scan");
          if (scan) {
            tl.fromTo(
              scan,
              { x: -24, opacity: 0 },
              {
                x: () => window.innerWidth + 24,
                opacity: 0.34,
                duration: 1,
              },
              0
            );
          }

          tl.to(track, { x: () => -dist(), duration: 1 }, 0);

          // each evidence scan drifts against its slab (inner parallax)
          root
            .querySelectorAll<HTMLElement>(".ce-visual")
            .forEach((v) => {
              tl.fromTo(
                v,
                { xPercent: -5 },
                { xPercent: 5, duration: 1 },
                0
              );
            });

          // endcap hint slides in at the very end
          tl.fromTo(
            root.querySelector<HTMLElement>(".ce-endcap span"),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.12 },
            0.88
          );

          /* ---------- arrival — the record establishes itself ----------
             Runs while the dark field enters, ending exactly when the
             horizontal pin engages. The first slab is wiped in left-to-right
             (the direction the track will travel), its ref numeral registers
             in the node-numeral language, and the record metadata rises.
             Horizontal choreography itself is untouched. */
          const header = root.querySelector<HTMLElement>(".ch-label");
          const slab0 = track.querySelector<HTMLElement>(".ce-slab");
          const ref0 = slab0?.querySelector<HTMLElement>(".ce-ref");
          const stamp0 = slab0?.querySelector<HTMLElement>(".ce-stamp");
          const body0 = slab0
            ? Array.from(slab0.querySelectorAll<HTMLElement>(".ce-body > *"))
            : [];
          if (slab0 && ref0 && stamp0 && header) {
            /* explicit pre-arrival states (deterministic in both directions;
               lazy immediateRender proved asymmetric in verification) */
            gsap.set(header, { opacity: 0, y: 18 });
            gsap.set(slab0, { clipPath: "inset(0% 100% 0% 0%)" });
            gsap.set(ref0, { x: () => window.innerWidth * 0.06, opacity: 0.15 });
            gsap.set(stamp0, { opacity: 0, y: 12 });
            gsap.set(body0, { opacity: 0, y: 24 });
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
                header,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.25 },
                0
              )
              .fromTo(
                slab0,
                { clipPath: "inset(0% 100% 0% 0%)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45 },
                0.18
              )
              .fromTo(
                ref0,
                { x: () => window.innerWidth * 0.06, opacity: 0.15 },
                { x: 0, opacity: 1, duration: 0.35 },
                0.35
              )
              .fromTo(
                stamp0,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.2 },
                0.55
              )
              .fromTo(
                body0,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
                0.5
              );
          }

          /* ---------- exit tail — the record is filed ----------
             Deliberately quiet: after the horizontal passage completes and
             a brief rest, the track settles one last step into its terminal
             position and the endcap points down toward the archive. */
          const endcapSpan = root.querySelector<HTMLElement>(
            ".ce-endcap span"
          );
          tl.to({}, { duration: 0.06 }); // visual rest after the passage
          tl.to(track, { x: () => -dist() - 40, duration: 0.06 }, 1.06)
            .to(endcapSpan, { y: 14, duration: 0.08 }, 1.06);
        }, root);
        return () => ctx.revert();
      }
    );

    return () => {
      cleanups.forEach((fn) => fn());
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-tone="dark"
      data-ch="evidence"
      className="ch ch-evidence"
      aria-label="Project evidence"
    >
      <div className="ce-pin">
        <div className="docframe ch-evidence__frame" aria-hidden />
        <div className="ce-scan" aria-hidden />
        <header className="ch-label mono ch-label--dark">
          CH.04 / EVIDENCE — {PROJECTS.length} BUILDS ON FILE
        </header>

        <div className="ce-track" ref={trackRef}>
          {PROJECTS.map((p, i) => (
            <article
              className={`ce-slab${i % 2 ? " ce-slab--alt" : ""}`}
              key={p.ref}
            >
              <div className="ce-visual" aria-hidden>
                <span className="ce-ref display">{p.ref}</span>
                <span className="ce-stamp mono">EVIDENCE {p.id} / 0{PROJECTS.length}</span>
              </div>
              <div className="ce-body">
                <div className="ce-kicker mono">
                  PROJECT {p.ref} · NODE {p.node}
                </div>
                <h3 className="ce-title display">{p.title}</h3>
                <p className="ce-desc serif">{p.desc}</p>
                <ul className="ce-stack mono">
                  {p.stack.map((s, j) => (
                    <li key={j}>{s}</li>
                  ))}
                </ul>
                <div className="ce-meta mono">
                  STATUS / {p.status} · BUILT AT A HACKATHON
                </div>
              </div>
            </article>
          ))}
          <div className="ce-endcap mono">
            <span>END OF EVIDENCE — THE LOG CONTINUES ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
