# extractable-components.md — TEAM 404 reusable patterns

This is a single-route, chapter-based composition. The extractable entities are the persistent overlays and the repeating document-language patterns used across chapters.

## Hud (persistent state layer)
- Source: `src/components/Hud.tsx`
- Category: layout
- Description: fixed overlay with brand (TL), status (TR), pointer coords (BL), dynamic metadata pairs + anomalies (BR), and bottom progress rail
- Extractable props: `visible` (boolean), `status` (HudStatus enum), `anomalies` (number 0–6), bottom-right pair frames (via pushHudPair registry)
- Hardcoded: TICKS chapter map (404/IDENTITY/NODES/EVIDENCE/ARCHIVE/QUIET/RESOLVE), STATUS_LABEL copy, all CSS

## RailTick
- Source: rendered inside `src/components/Hud.tsx` (`.rail__tick` with `data-label`)
- Category: basic
- Description: chapter index tick on the bottom rail; is-active state driven by scroll position; click = Lenis smooth-scroll to chapter
- Extractable props: `label` (string), `target` (selector), `active` (boolean)
- Hardcoded: 18×26 hit area, 1px tick glyph, ::after label styling

## Cursor
- Source: `src/components/Cursor.tsx`
- Category: basic
- Description: custom ink-dot cursor with contextual verb from `data-cursor` attributes
- Extractable props: none (self-contained; reads DOM)
- Hardcoded: 44px dot, label typography, quickTo durations

## ChapterLabel
- Source: pattern used in every chapter (`.ch-label mono` — e.g. `src/components/chapters/Nodes.tsx`)
- Category: basic
- Description: top-left classification label `CH.0x / NAME — DETAIL`
- Extractable props: `chapter` (string), `name` (string), `suffix` (string), `dark` (boolean → `.ch-label--dark`)
- Hardcoded: mono 11px, muted color, +44px desktop lane offset

## NodeRow (threshold registry row)
- Source: `src/components/Threshold.tsx` (`.node-row`)
- Category: basic
- Description: right-aligned mono row `NODE 0x · STATE · G.xx`
- Extractable props: `id`, `state` (MISSING/LOCALIZED), `gridRef`
- Hardcoded: 2.2em column gap, muted state color

## MemberNode (investigation record)
- Source: `src/components/chapters/Nodes.tsx` (`.cn-node`)
- Category: basic
- Description: split layout — giant outlined numeral + name/fields/serif note
- Extractable props: `member` (Member from content.ts)
- Hardcoded: grid 1fr/1fr, padding offsets, stroke numeral styling

## EvidenceSlab
- Source: `src/components/chapters/Evidence.tsx` (`.ce-slab`)
- Category: basic
- Description: paper evidence sheet — visual half (ref numeral + stamp + halftone) + body half (kicker/title/desc/stack/meta)
- Extractable props: `project` (Project from content.ts), `alt` (boolean)
- Hardcoded: 74/60/66vw widths, halftone ::after, slab grid

## ArchiveEntry
- Source: `src/components/chapters/Archive.tsx` (`.ca-entry`)
- Category: basic
- Description: two-column catalog entry with giant outlined numeral and masked reveals
- Extractable props: `event` (EventEntry), `side` (left/right)
- Hardcoded: mask/reveal classes, spine alignment

## EnterButton / AgainButton
- Source: `src/components/Threshold.tsx` (`.enter`), `src/components/chapters/Finale.tsx` (`.cf-again`)
- Category: basic
- Description: bordered mono action button with ink fill hover and cursor verb
- Extractable props: `label`, `meta`, `onClick`, `cursorVerb`
- Hardcoded: 1px ink border, 15px 42px padding, fill transition
