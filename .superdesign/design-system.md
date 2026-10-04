# TEAM 404 — Design System

## Product context
One-page immersive scroll portfolio for "TEAM 404", a six-person hackathon unit. The fiction: the visitor has requested a page that does not exist (404), and instead of an error they fall into the team's classified archive — an investigative document system that gradually reveals who TEAM 404 is, what they build, and resolves the error into the team itself ("The page you were looking for does not exist. The team behind it does.").

Key "pages" are chapters of one continuous object:
1. **Threshold** — the broken 404 boundary; a document being inspected, misbehaving, resolving into TEAM 404.
2. **Identity** — classified personnel record; SIX PEOPLE.
3. **Nodes** — investigation map of the six members (N.01–N.06).
4. **Evidence** — horizontal table of evidence sheets (PRJ-001…003) on an ink field.
5. **Archive** — the operation log; paper returns, catalogued entries on a spine.
6. **Quiet** — dark intermission; almost still.
7. **Finale** — the payoff: status ladder resolves, TEAM 404 assembles, accent fires.

## Job to be done
Make the visitor *feel like an investigator manipulating a recovered document*, not a user browsing a portfolio. Scrolling = handling the document. The site should reward slow scrubbing and close looking.

## Branding & styling
- **Palette (hard constraint):** bone paper `#eae4d8` / `#e0d9c9` / `#f0ece3`; ink `#17150f`; soft ink `#4b4638`; muted `#928b7a`; hairlines `rgba(23,21,15,.32)/.14`. ONE accent `#e8481f` reserved for system events only (negation strike, found-dot, climax rule). Monochrome world; the accent appears ~3 times on the entire site.
- **Type voices (hard constraint, exactly 3):**
  - Display: Archivo Black (uppercase, line-height 0.8, tracking −0.035em) — wordmarks & giant numerals only.
  - Serif: Georgia italic — narrative lines only.
  - Mono: system monospace 11px/9.5px/8px, letter-spacing 0.12–0.14em, uppercase — all metadata, labels, HUD.
- **Spacing:** `--margin clamp(18px,3.4vw,56px)` is the single page inset; approved vertical chrome lanes (+22px / +44px / +88px offsets from margins).
- **Texture:** one grain layer (SVG turbulence, multiply blend) site-wide. Halftone dot patterns inside evidence sheets. No gradients, no glassmorphism, no shadows except paper-flat document separation.
- **Dark tone:** chrome-only inversion (`html.tone-dark`) during Evidence + Quiet; backgrounds stay explicit per section.

## Motion / animation patterns (architecture is locked)
- GSAP 3.13 + ScrollTrigger (single registration), one Lenis instance driven by `gsap.ticker`; scrub values 0.5–0.8; function-based pin ends (`+=` in px/vh/%).
- Scroll position is the single source of truth. Every timeline must reconstruct cleanly on reverse.
- Motion vocabulary: masked character/line reveals (translateY inside `overflow:hidden`), scaleX/scaleY rule growth from edges, clip-path wipes, ghost misregistration strokes, staggered opacity, counter-motion drift, pure-progress state machines in `onUpdate` (deterministic in both directions).
- Hierarchy: PRIMARY = giant typography/numerals; SECONDARY = geometry, records, registry rows; TERTIARY = micro metadata. Tertiary never competes.
- Mobile (≤760px): static stacks, content fully visible, no pins; reduced-motion: fully static revealed states.

## Visual language (the "forensic document" system)
Registration crosses, crop marks, coordinate readouts (`X 0000 · Y 0000`), classification labels (`CH.02 / IDENTITY`, `ARCHIVE 08 — SEALED`), node registry rows (`NODE 01 · MISSING · G.02`), evidence stamps (`EVIDENCE 01 / 03`), serial refs (`REF: T-404`, `PRJ-001`, `LOG-001`), hollow "0" slot glyph, ghost stroke numerals, slot-rules, spine lines. Neutral system language allowed for new decorative metadata: CASE / 404, RECORD / 001, TRACE / ACTIVE, CLASS / INTERNAL, DOCUMENT / UNVERIFIED. No invented factual claims about the team.

## Specific project requirements
- Tech: Next.js 15 App Router, React 19, vanilla CSS custom properties (two stylesheets), no component library.
- All real content from `src/lib/content.ts`; bracketed `[PLACEHOLDER]` fields remain deliberately unresolved ("the system's language for missing data") — do not fabricate facts to fill them.
- Accessibility: reduced-motion static path must keep working; ENTER must remain the unlock interaction; rail remains keyboard navigable.
- Performance: transform/opacity/clip-path only; no canvas/WebGL; no layout-triggering animation properties.
