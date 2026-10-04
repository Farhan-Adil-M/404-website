"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  fitWordmark,
  REVEAL,
} from "@/lib/gsap";
import { typewrite, makeSignal, cancelAllTyping } from "@/lib/typewriter";
import { setHud, pushHudPair } from "@/lib/useHud";
import { useHasHydrated } from "@/lib/useHasHydrated";

const IDENT_LINE = "REQUEST ID — 0x404 / TRACE ROUTE — UNKNOWN ORIGIN";
const THESIS_A = "The page you were looking for does not exist.";
const THESIS_B = "The team behind it does.";
const META_LINES = ["ERR_NOT_FOUND", "REQ 0.042s", "NO FURTHER INFORMATION"];
const NODE_ROWS: Array<[string, string, string]> = [
  ["NODE 01", "MISSING", "G.02"],
  ["NODE 02", "MISSING", "G.05"],
  ["NODE 03", "MISSING", "G.07"],
  ["NODE 04", "MISSING", "G.11"],
  ["NODE 05", "MISSING", "G.13"],
  ["NODE 06", "MISSING", "G.17"],
];
const RETURN_NOTE = "SECOND VISIT — THE PAGE STILL DOES NOT EXIST.";

export default function Threshold({ onEnter }: { onEnter: () => void }) {
  const hydrated = useHasHydrated();
  const returning =
    hydrated &&
    typeof window !== "undefined" &&
    (() => {
      try {
        return !!window.sessionStorage.getItem("t404.seen");
      } catch {
        return false;
      }
    })();

  const rootRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const ghostARef = useRef<HTMLSpanElement>(null);
  const ghostBRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const hollowRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const serifRef = useRef<HTMLParagraphElement>(null);
  const metaRowsRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const crossVRef = useRef<HTMLDivElement>(null);
  const crossHRef = useRef<HTMLDivElement>(null);
  const nodeRowsRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const notFoundRef = useRef<HTMLSpanElement>(null);
  const strikeRef = useRef<HTMLSpanElement>(null);
  const systemRef = useRef<HTMLSpanElement>(null);
  const foundWordRef = useRef<HTMLSpanElement>(null);
  const dotAccentRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(false);
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  /* ---------------- ENTER ---------------- */

  const handleEnter = () => {
    const root = rootRef.current;
    const enter = enterRef.current;
    if (!root || doneRef.current) return;
    doneRef.current = true;
    enter?.classList.add("is-on");
    try {
      window.sessionStorage.setItem("t404.seen", "1");
    } catch {
      /* storage unavailable */
    }
    onEnterRef.current();
  };

  /* ---------------- effects ---------------- */

  useEffect(() => {
    const root = rootRef.current;
    const display = displayRef.current;
    const fit = fitRef.current;
    const slot = slotRef.current;
    const hollow = hollowRef.current;
    const rule = ruleRef.current;
    const titles = titlesRef.current;
    const serif = serifRef.current;
    const metaRows = metaRowsRef.current;
    const enter = enterRef.current;
    const crossV = crossVRef.current;
    const crossH = crossHRef.current;
    const nodeRows = nodeRowsRef.current;
    const team = teamRef.current;
    const notFound = notFoundRef.current;
    const strike = strikeRef.current;
    const system = systemRef.current;
    const foundWord = foundWordRef.current;
    const dotAccent = dotAccentRef.current;
    if (
      !root ||
      !display ||
      !fit ||
      !slot ||
      !hollow ||
      !rule ||
      !titles ||
      !serif ||
      !metaRows ||
      !enter ||
      !crossV ||
      !crossH ||
      !nodeRows ||
      !team ||
      !notFound ||
      !strike ||
      !system ||
      !foundWord ||
      !dotAccent
    )
      return;

    const reduced = prefersReducedMotion();
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    /* handoff tail — desktop only. Extra pin travel after the resolve beat
       where the settled act glides up the plane and Identity emerges from
       beneath it. Timeline units: the original act ends at 1.03; the tail
       preserves the original beats-per-scroll rate exactly. */
    const TAIL = mobile ? 0 : 0.14;
    const HOLD = 1.09; // existing beats end ≈1.03 + stillness beat
    const ACT_END = 1.03;
    const totalScroll = () =>
      window.innerHeight *
      2.2 *
      ((mobile ? ACT_END : HOLD + TAIL) / ACT_END);
    const reveal = mobile
      ? { scale: 0.5, xPercent: 12 }
      : { scale: REVEAL.scale, xPercent: REVEAL.xPercent };
    const signal = makeSignal();
    const glyphs = Array.from(display.querySelectorAll<HTMLElement>(".g"));
    const tWords = Array.from(titles.querySelectorAll<HTMLElement>(".t-word"));
    const titleH1 = titles.querySelector<HTMLElement>(".t-title");
    const metaSpans = Array.from(metaRows.querySelectorAll<HTMLElement>("span"));
    const nodeEls = Array.from(nodeRows.children) as HTMLElement[];
    const nodeStateEls = Array.from(
      nodeRows.querySelectorAll<HTMLElement>(".node-row__state")
    );
    const coordReadout = root.querySelector<HTMLElement>("[data-th-coords]");
    const scanLine = root.querySelector<HTMLElement>(".threshold__scan");
    const teamGlyphs = Array.from(team.querySelectorAll<HTMLElement>(".g"));
    let lastContradiction: boolean | null = null;
    let lastLocalized = false;

    /* ---------- fit & resize ---------- */

    const doFit = () => fitWordmark(fit, display);
    doFit();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(doFit);
    };
    window.addEventListener("resize", onResize);

    /* ---------- reduced motion: static composition ---------- */

    if (reduced) {
      root.classList.add("is-revealed");
      if (serif) serif.textContent = THESIS_A;
      setHud({ status: "SYSTEM", anomalies: 0, visible: true });
      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
      };
    }

    /* ---------- initial states (act I is almost still) ---------- */

    const ctx = gsap.context(() => {
      gsap.set(slot, { opacity: 1 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(tWords, { yPercent: 0, opacity: 1 });
      gsap.set(ghostARef.current, { opacity: 0, x: -6, y: -3 });
      gsap.set(ghostBRef.current, { opacity: 0, x: 6, y: 3 });
      gsap.set(crossV, { scaleY: 0 });
      gsap.set(crossH, { scaleX: 0 });
      gsap.set(nodeEls, { opacity: 0 });
      gsap.set(dotAccent, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(strike, { scaleX: 0 });
      /* TEAM emerges from the compacted 404: glyphs start stacked at the
         cluster's resting position and fan out into their own row */
      gsap.set(teamGlyphs, {
        opacity: 0,
        x: () => window.innerWidth * 0.12,
        y: 0,
        scale: 1.4,
        transformOrigin: "50% 50%",
      });
      gsap.set(system, { opacity: 0 });
      gsap.set(foundWord, { opacity: 0 });
      pushHudPair("br", [
        { label: "ARCHIVE", ref: "08 — PENDING" },
        { label: "NODES", ref: "06 MISSING" },
      ]);
    }, root);

    /* ---------- threshold act (time-driven, skippable) ---------- */

    /* entrance settle — the act arrives once, then holds still */
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .fromTo(
        tWords,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.09 },
        0.15
      )
      .fromTo(
        crossV,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.7, ease: "power2.out" },
        0.5
      );

    gsap.set(enter, { opacity: 0, pointerEvents: "none" });
    gsap.to(enter, {
      opacity: 1,
      duration: 0.5,
      delay: 1.5,
      ease: "power2.out",
      onStart: () => gsap.set(enter, { pointerEvents: "auto" }),
    });

    const runIntro = async () => {
      await typewrite(serif, THESIS_A, { signal, speed: 46 });
    };
    runIntro();

    /* ---------- pinned misbehavior + reveal ---------- */

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${Math.round(totalScroll())}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self: { progress: number }) => {
          // HUD anomalies + contradiction remain keyed to the original beat
          // timeline, so progress is renormalized into the 0–1 act range
          const p = self.progress * (totalScroll() / (window.innerHeight * 2.2));
          const n = Math.min(6, Math.floor(p * 10));
          setHud({
            anomalies: n,
            status: p > 0.62 ? "SYSTEM" : "ANOMALY",
          });
          if (coordReadout) {
            const actProgress = Math.max(0, Math.min(1, p / ACT_END));
            const x = String(Math.round(actProgress * 404)).padStart(4, "0");
            const y = String(Math.round(actProgress * 232)).padStart(4, "0");
            coordReadout.textContent = `TRACE / X ${x} · Y ${y}`;
          }
          // the metadata contradicts itself mid-misbehavior (deterministic,
          // so scrolling backward un-contradicts it)
          const contradiction = p > 0.34 && p < 0.5;
          if (contradiction !== lastContradiction && metaSpans[0]) {
            metaSpans[0].textContent = contradiction
              ? "ERR_FOUND"
              : "ERR_NOT_FOUND";
            lastContradiction = contradiction;
          }
          // node registry states are a pure function of progress, so the
          // registry un-resolves deterministically when scrolling backward
          const localized = p >= 0.9 / ACT_END;
          if (localized !== lastLocalized) {
            lastLocalized = localized;
            nodeStateEls.forEach((el) => {
              el.textContent = localized ? "LOCALIZED" : "MISSING";
            });
          }
        },
      },
      defaults: { ease: "none" },
    });

    /* beat 0 — the technical block masks in as the act settles */
    tl.to(metaSpans, { y: "0%", duration: 0.06, stagger: 0.012 }, 0.03);

    /* rest — the act holds, almost still */

    /* beat 1 — compression: the display fails physically */
    tl.to(
      display,
      { scaleY: 0.55, transformOrigin: "50% 100%", duration: 0.09 },
      0.1
    )
      .to(rule, { scaleX: 1, duration: 0.08 }, 0.13)
      .to(display, { scaleY: 1, duration: 0.08 }, 0.24);

    /* rest 0.32 → 0.30 */

    /* beat 2 — split & misregister: the wordmark comes apart along the grid */
    tl.to(glyphs[0], { xPercent: -8, duration: 0.1 }, 0.3)
      .to(glyphs[2], { xPercent: 8, duration: 0.1 }, 0.3)
      .to(
        ghostARef.current,
        { opacity: 0.8, x: -10, y: -5, duration: 0.08 },
        0.34
      )
      .to(
        ghostBRef.current,
        { opacity: 0.8, x: 10, y: 5, duration: 0.08 },
        0.34
      )
      .to(glyphs[1], { yPercent: 3, duration: 0.08 }, 0.38)
      .to(glyphs[0], { xPercent: -3, duration: 0.08 }, 0.44)
      .to(glyphs[2], { xPercent: 3, duration: 0.08 }, 0.44)
      .to(
        [ghostARef.current, ghostBRef.current],
        { opacity: 0, duration: 0.06 },
        0.48
      );

    /* beat 3 — the system's instruments surface; the slot is emphasized */
    tl.to(
      hollow,
      { scale: 1.12, transformOrigin: "50% 55%", duration: 0.08 },
      0.52
    )
      .to(crossH, { scaleX: 1, duration: 0.08 }, 0.54)
      .to(nodeEls, { opacity: 1, stagger: 0.015, duration: 0.08 }, 0.56)
      .to(hollow, { scale: 1, duration: 0.08 }, 0.6);

    /* a single registration scan crosses the document during the system
       takeover; it shares the existing scrub and adds no scroll range */
    if (scanLine) {
      tl.fromTo(
        scanLine,
        { yPercent: -100, opacity: 0 },
        { yPercent: 100, opacity: 0.62, duration: 0.24 },
        0.62
      );
    }

    /* beat 4 — negation struck; the system surfaces; metadata dims back */
    tl.to(strike, { scaleX: 1, duration: 0.06 }, 0.64)
      .to(system, { opacity: 1, duration: 0.08 }, 0.66)
      .to(metaRows, { opacity: 0.35, duration: 0.06 }, 0.7)
      .to(
        titleH1,
        { opacity: 0, y: -16, duration: 0.08, ease: "power3.in" },
        0.74
      );

    /* beat 5 — the 404 compacts and steps aside; its glyphs settle one by one */
    tl.to(
      display,
      {
        scale: reveal.scale,
        xPercent: reveal.xPercent,
        transformOrigin: "50% 50%",
        duration: 0.14,
      },
      0.78
    )
      .to(rule, { scaleX: 0, duration: 0.06 }, 0.78)
      .to(glyphs[1], { yPercent: 0, duration: 0.06 }, 0.84)
      .to(
        [glyphs[0], glyphs[2]],
        { xPercent: 0, duration: 0.08, stagger: 0.02 },
        0.84
      );

    /* beat 6 — TEAM emerges from the compacted 404 and fans into its row */
    tl.to(
      teamGlyphs,
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.14,
        stagger: 0.025,
      },
      0.84
    );

    /* beat 7 — thesis act B completes; registry localizes; accent confirms */
    const thesisB = { i: 0 };
    tl.to(
      thesisB,
      {
        i: THESIS_B.length,
        duration: 0.06,
        onUpdate: () => {
          if (serif)
            serif.textContent =
              THESIS_A + " " + THESIS_B.slice(0, Math.round(thesisB.i));
        },
      },
      0.88
    );
    tl.to(foundWord, { opacity: 1, duration: 0.06 }, 0.88)
      .to(dotAccent, { scale: 1, duration: 0.05, ease: "power2.out" }, 0.92)
      .to(dotAccent, { scale: 0.55, duration: 0.06 }, 0.97);

    /* ---------- handoff tail — the same act continues the plane ----------
       After the resolve the composition holds still for a beat, then the
       corner chrome (node registry, metadata, ENTER) exits — its data has
       been handed to Identity's registry — and the whole settled act glides
       up by exactly the strip Identity occupies as the pin releases.
       Physical translation, no fades on the primary composition. */
    if (!mobile) {
      tl.to({}, { duration: 0.06 }); // deliberate stillness after the resolve
      tl.to(nodeRows, { opacity: 0, y: -14, duration: 0.05 }, HOLD)
        .to(metaRows, { opacity: 0, y: -14, duration: 0.05 }, HOLD)
        // NOTE: .enter is not faded here — its CSS opacity transition would
        // fight the scrub; the plane drift exits it physically instead.
        .to(
          pinRef.current,
          { yPercent: -16, ease: "none", duration: TAIL },
          HOLD
        );
    }

    return () => {
      signal.cancelled = true;
      cancelAllTyping();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      tl.scrollTrigger?.kill();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- render ---------------- */

  return (
    <section
      ref={rootRef}
      className="threshold"
      data-tone="paper"
      aria-label="404 — page not found"
    >
      <div className="threshold__pin" ref={pinRef}>
        <header className="threshold__head mono">
          <span>404 — DOCUMENT</span>
          <span>{returning ? RETURN_NOTE : IDENT_LINE}</span>
          <span>ARCHIVE 08 — SEALED</span>
        </header>

        {/* standing ident line — only complements the head when the head
            note differs, so the request-id string never renders twice */}
        {returning && (
          <div className="threshold__ident mono" aria-hidden>
            {IDENT_LINE}
          </div>
        )}

        <div className="threshold__wm" ref={fitRef}>
          <div className="wm__fit">
            <span className="wm__ghost" ref={ghostARef} aria-hidden>
              404
            </span>
            <span className="wm__ghost" ref={ghostBRef} aria-hidden>
              404
            </span>
            <div className="wm__display" ref={displayRef}>
              <span className="g">4</span>
              <span className="g g--slot" ref={slotRef}>
                <span className="g__hollow" ref={hollowRef}>
                  0
                </span>
              </span>
              <span className="g">4</span>
            </div>
            <div className="slot-rule" ref={ruleRef} />
          </div>
        </div>

        {/* ghost TEAM glyphs — the reveal assembles them */}
        <div className="team" ref={teamRef} aria-hidden>
          {"TEAM".split("").map((c, i) => (
            <span className="g" key={i}>
              {c}
            </span>
          ))}
        </div>

        <div className="cross cross--v" ref={crossVRef} aria-hidden />
        <div className="cross cross--h" ref={crossHRef} aria-hidden />
        <div className="threshold__scan" aria-hidden />

        {/* forensic registration chrome — static document layer */}
        <div className="docframe" aria-hidden />
        <div
          className="doc-tag"
          style={{ right: "calc(var(--margin) * 1.2)", top: "15vh" }}
        >
          DOCUMENT / UNVERIFIED
        </div>
        <div
          className="doc-note"
          style={{ left: "46.5vw", top: "61.3vh" }}
        >
          REF / GRID 24–46 · Y 062
        </div>
        <div
          className="doc-note threshold__coords"
          style={{ right: "calc(var(--margin) * 1.2)", top: "10.5vh" }}
          data-th-coords
          aria-hidden
        >
          TRACE / X 0000 · Y 0000
        </div>

        {/* system node registry — surfaces during misbehavior */}
        <div className="node-reg mono" ref={nodeRowsRef} aria-hidden>
          {NODE_ROWS.map(([id, state, ref_]) => (
            <div className="node-row" key={id}>
              <span>{id}</span>
              <span className="node-row__state">{state}</span>
              <span>{ref_}</span>
            </div>
          ))}
        </div>

        <div className="threshold__titles" ref={titlesRef}>
          <h1 className="t-title">
            <span className="t-word" ref={notFoundRef}>
              NOT FOUND
              <span className="t-strike" ref={strikeRef} aria-hidden />
            </span>
            <span className="t-word t-word--ghost" ref={systemRef}>
              SYSTEM
            </span>
            <span className="t-word" ref={foundWordRef}>
              FOUND
            </span>
          </h1>
          <p className="t-serif serif" ref={serifRef} />
          <span className="found-dot" ref={dotAccentRef} aria-hidden />
        </div>

        <div className="threshold__meta" ref={metaRowsRef}>
          {META_LINES.map((l) => (
            <div className="meta-row" key={l}>
              <span>{l}</span>
            </div>
          ))}
        </div>

        <button
          ref={enterRef}
          type="button"
          className="enter"
          data-cursor="ENTER"
          onClick={handleEnter}
        >
          <span className="enter__fill" aria-hidden />
          <span className="enter__txt">ENTER</span>
          <span className="enter__meta mono">
            {returning ? "AUTH 2 — RE-ENTRY" : "AUTH 1 — GRANT ACCESS"}
          </span>
        </button>
      </div>
    </section>
  );
}
