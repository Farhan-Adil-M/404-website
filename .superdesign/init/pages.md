# pages.md — TEAM 404 page dependency tree

## / (Home — the entire one-page experience)
Entry: `src/app/page.tsx`
Dependencies:
- `src/components/Experience.tsx`
  - `src/components/Loader.tsx`
    - `src/lib/gsap.ts` (gsap, EASE, prefersReducedMotion, fitWordmark)
    - `src/lib/typewriter.ts` (typewrite, makeSignal, cancelAllTyping)
  - `src/components/Threshold.tsx`
    - `src/lib/gsap.ts` (gsap, prefersReducedMotion, fitWordmark, REVEAL)
    - `src/lib/typewriter.ts` (typewrite, makeSignal, cancelAllTyping)
    - `src/lib/useHud.ts` (setHud, pushHudPair)
    - `src/lib/useHasHydrated.ts`
  - `src/components/Hud.tsx`
    - `src/lib/useHud.ts` (useHud, getPairs, getPairVersion, HudState)
    - `src/lib/gsap.ts` (getLenis)
  - `src/components/Cursor.tsx`
    - `src/lib/gsap.ts` (gsap)
  - `src/components/chapters/Identity.tsx`
    - `src/lib/gsap.ts` (gsap, ScrollTrigger, prefersReducedMotion)
    - `src/lib/useHud.ts` (setHud)
    - `src/lib/content.ts` (TEAM)
  - `src/components/chapters/Nodes.tsx`
    - `src/lib/gsap.ts` (gsap, ScrollTrigger, prefersReducedMotion)
    - `src/lib/useHud.ts` (setHud, pushHudPair)
    - `src/lib/content.ts` (MEMBERS)
  - `src/components/chapters/Evidence.tsx`
    - `src/lib/gsap.ts` (gsap, ScrollTrigger, prefersReducedMotion)
    - `src/lib/useHud.ts` (setHud)
    - `src/lib/tone.ts` (registerDarkSection)
    - `src/lib/content.ts` (PROJECTS)
  - `src/components/chapters/Archive.tsx`
    - `src/lib/gsap.ts` (gsap, prefersReducedMotion)
    - `src/lib/useHud.ts` (setHud)
    - `src/lib/content.ts` (EVENTS)
  - `src/components/chapters/Breathing.tsx`
    - `src/lib/gsap.ts` (gsap, ScrollTrigger, prefersReducedMotion)
    - `src/lib/tone.ts` (registerDarkSection)
  - `src/components/chapters/Finale.tsx`
    - `src/lib/gsap.ts` (gsap, prefersReducedMotion, getLenis)
    - `src/lib/useHud.ts` (setHud, pushHudPair)
    - `src/lib/content.ts` (MEMBERS, STATUSES)
- `src/app/layout.tsx` (root shell, fonts, noscript fallback)
- `src/app/globals.css` + `src/app/chapters.css` (all styling; no CSS modules, no Tailwind)

## Page content summary
One scroll-driven continuous composition: Loader (fixed overlay) → pinned Threshold act with misbehavior/reveal beats → Identity record → pinned 6-member Nodes investigation → pinned horizontal Evidence passage → Archive log → dark Quiet intermission → pinned Finale resolution. Chapters are plain `<section data-ch="…">` blocks animated by scroll-linked GSAP timelines (scrub) created in each component's mount effect.
