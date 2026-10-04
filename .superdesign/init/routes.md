# routes.md — TEAM 404 route map

Next.js App Router, file-based routing.

## Routes

| URL | File | Layout | Renders |
|---|---|---|---|
| `/` | `src/app/page.tsx` | `src/app/layout.tsx` | `<Experience />` — the entire one-page scroll experience |
| *any other path* | Next default `/_not-found` | `src/app/layout.tsx` | Next default 404 page |

## `/` (Home — the whole site)

`src/app/page.tsx` renders only `<Experience />` (client component). No router config file exists (single-route app). Internal "navigation" is scroll-based:

- Phase machine inside Experience: `loader` → `threshold` → `misbehavior` (chapters mount at `threshold`, stay mounted).
- Chapter order is positional, not routed: Threshold → Identity → Nodes → Evidence → Archive → Quiet (Breathing) → Finale.
- Rail ticks in `Hud.tsx` jump between chapters with `lenis.scrollTo(el, { duration: 1.6 })` targeting `[data-ch='…']` selectors.
