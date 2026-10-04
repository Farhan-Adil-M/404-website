"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      root.style.display = "none";
      return;
    }

    document.documentElement.classList.add("no-native-cursor");

    const xTo = gsap.quickTo(root, "x", { duration: 0.38, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.38, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      window.dispatchEvent(
        new CustomEvent("t404:coords", { detail: { x: e.clientX, y: e.clientY } })
      );
    };

    const over = (e: Event) => {
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      const verb = t?.getAttribute("data-cursor");
      if (verb) {
        if (labelRef.current) labelRef.current.textContent = verb;
        root.classList.add("is-active");
      } else {
        root.classList.remove("is-active");
      }
      const dark = (e.target as HTMLElement)?.closest?.("[data-tone='dark']");
      root.classList.toggle("is-dark", !!dark);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("no-native-cursor");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden>
      <div className="cursor__dot">
        <span className="cursor__label" ref={labelRef} />
      </div>
    </div>
  );
}
