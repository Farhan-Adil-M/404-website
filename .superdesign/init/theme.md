# theme.md — TEAM 404 design tokens

## Part 1 — Compact token summary

### Palette (light "paper" world; dark world inverts chrome only)
| Token | Value | Use |
|---|---|---|
| `--paper` | `#eae4d8` | page background (bone paper) |
| `--paper-2` | `#e0d9c9` | secondary paper |
| `--paper-hi` | `#f0ece3` | highlight paper / text on ink |
| `--ink` | `#17150f` | primary text, fills |
| `--ink-soft` | `#4b4638` | secondary text |
| `--mute` | `#928b7a` | tertiary/labels |
| `--line` | `rgba(23,21,15,0.32)` | structural rules |
| `--line-soft` | `rgba(23,21,15,0.14)` | hairlines |
| `--accent` | `#e8481f` | ONE signal red — system events only (strike-through, dot, climax rule). Never decoration |

Dark-tone chrome overrides (on `html.tone-dark`): paper-on-ink values, e.g. HUD dim `rgba(234,228,216,0.5)`, rail fill `rgba(234,228,216,0.9)`, cursor dot `#eae4d8`.

### Type voices (3 voices only)
| Voice | Stack | Notes |
|---|---|---|
| `.display` | `"Archivo Black", "Arial Black", "Segoe UI Black", sans-serif` | wordmarks/numerals; uppercase; line-height 0.8; letter-spacing −0.035em; nowrap |
| `.serif` | `Georgia, "Times New Roman", serif` | italic narrative serif |
| `.mono` | `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace` | 11px; letter-spacing 0.12em; uppercase; line-height 1.5 |

Type scale: giant wordmark `--wm-fs: 44vw` (mobile 52vw); chapter numerals `clamp(110px,17vw,280px)` / `clamp(180px,30vw,470px)`; display titles `clamp(26px…76px)`, `clamp(44px,6.4vw,116px)`, `clamp(34px,5.4vw,96px)`; serif narrative `clamp(15px…36px)`; mono 11px / HUD 9.5px / rail labels 8px.

### Spacing system
| Token | Value |
|---|---|
| `--margin` | `clamp(18px, 3.4vw, 56px)` — the one page inset; every corner block keys off it |
| `--g` | `clamp(10px, 1.2vw, 20px)` |

Chrome lanes (approved vertical rhythm, desktop): HUD top strip at `--margin*0.5`; scene metadata at `+44px` below that; HUD bottom corners at `--margin*0.55 + 22px`; scene bottom metadata `+44px` / `+88px` lanes above that; rail at `--margin*0.55`.

### Motion
- `--ease-ui: cubic-bezier(0.2, 0.7, 0.1, 1)` (CSS micro-interactions)
- JS easing vocabulary: enter `power4.out`, exit `power3.in`, settle `expo.out`, ui `power2.out`
- Scrubs: `0.5–0.8` typical, `0.7` for pins
- Lenis: `lerp 0.095`, `wheelMultiplier 0.9`, `touchMultiplier 1.2` (reduce → native)

### Breakpoints
- `760px` — desktop/mobile composition switch (`min-width: 761px` = desktop JS branches; `max-width: 760px` = static stacks)
- `1100px` — rail tick labels become persistently visible

### Signature motifs
- Hollow "0" slot glyph (`-webkit-text-stroke`, `--slot-stroke`), ghost stroke numerals, `slot-rule` hairline, cross rules (v/h), registered-node rows (`NODE 0x · MISSING · G.xx`), classification mono labels (`CH.0x / NAME`, `REF:`, `ERR_`, `ARCHIVE 08`), grain overlay.

## Part 2 — Raw source dumps

### `src/app/globals.css`
```css
/* (full file, 728 lines) */
:root {
  --paper: #eae4d8;
  --paper-2: #e0d9c9;
  --paper-hi: #f0ece3;
  --ink: #17150f;
  --ink-soft: #4b4638;
  --mute: #928b7a;
  --line: rgba(23, 21, 15, 0.32);
  --line-soft: rgba(23, 21, 15, 0.14);
  --accent: #e8481f;
  --margin: clamp(18px, 3.4vw, 56px);
  --g: clamp(10px, 1.2vw, 20px);
  --font-display: "Archivo Black", "Arial Black", "Segoe UI Black", sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace;
  --ease-ui: cubic-bezier(0.2, 0.7, 0.1, 1);
  --wm-fs: 44vw;
  --reveal-scale: 0.42;
  --reveal-x: 20;
}
/* base: box-sizing reset; html paper bg, hidden scrollbar; html.locked{overflow:hidden}; body mono 12px overflow-x hidden; selection ink-on-paper; button reset; .no-native-cursor cursor:none; .sr-only clip */
/* .display/.mono/.serif type voices as in summary */
/* .grain: fixed inset -60%, z-40, opacity .14, multiply, SVG feTurbulence data-uri, grain-shift 0.9s steps(4) */
/* .hud: fixed inset 0 z-60 pointer-events none, opacity transition .6s; .hud--hidden{opacity:0} */
/* corners: tl/tr top margin*0.5 (grid gap 3px, justify start/end); bl/br bottom margin*0.55+22px */
/* hud text: mono 9.5px ls .14em lh 1.4; __dim mute; __brand 10px ink; __anomaly ink-soft */
/* .rail: absolute l/r margin, bottom margin*0.55, height 14px */
/* .cursor: fixed z-100 44px circle margin -22; dot scale .14 → is-active scale 1, bg ink, transition .45s ease-ui; label 8px paper opacity 0→1 */
/* .wm__fit block relative font-size var(--wm-fs); .wm__display flex center baseline display font lh .8 ls -.04em nowrap */
/* .wm__ghost: absolute inset 0 flex center, transparent + stroke 1px line, opacity 0 */
/* .g inline-block will-change transform; .g--slot .g__hollow transparent stroke .016em var(--slot-stroke, ink) */
/* .slot-rule absolute l/r 0 bottom -.06em h 1px bg line scaleX(0) origin left */
/* .loader: fixed inset 0 z-90 paper overflow hidden; __wm abs 50%/46% translate(-50%,-50%) min(86vw,1400px); __status abs 50%/bottom 20vh gap 4 min-h 5.4em ink-soft; .is-live ink; __corner abs top margin*.55 grid gap 2 ink-soft (l/r); __skip abs right margin bottom margin*.55 mute */
/* .caret: inline-block .52em x 1em bg currentColor blink 1s steps(2) */
/* .threshold: relative h 100vh overflow hidden; __pin relative h 100vh */
/* .threshold__head: abs top margin*.55+44px l/r margin flex space-between gap 1em ink-soft */
/* .threshold__wm: abs 50%/42% translate(-50%,-50%) min(72vw,1200px) */
/* .threshold__titles: abs l/r margin top 65vh center; .t-title flex center gap .4em display clamp(26px,4.6vw,76px) lh .9; .t-word inline-block relative; .t-strike abs l/r -2% top 54% h clamp(2px,.28vw,4px) bg accent scaleX(0); ghost word transparent stroke 1.5px ink; .t-serif mt 2.4vh min-h 3.4em clamp(17px,1.6vw,24px) lh 1.35 max-w 52ch centered */
/* .threshold__ident: abs left margin top 12vh ink-soft pre */
/* .threshold__meta: abs left margin bottom margin*.55+44px grid gap 3 ink-soft; .meta-row overflow hidden; span inline-block translateY(130%) 9.5px ls .14em */
/* .cross: absolute bg line; --v left 50% top 9vh w 1px h 30vh scaleY(0) origin top; --h left 24vw top 62vh w 22vw h 1px scaleX(0) */
/* .found-dot: 10px circle accent margin 16px auto 0 scale(0) */
/* .node-reg: abs right margin bottom margin*.55+88px grid gap 3 right ink-soft 9.5px ls .14em; .node-row flex gap 2.2em justify-end; __state mute */
/* .enter: abs 50%/bottom 7vh translateX(-50%) border 1px ink pad 15px 42px 13px overflow hidden z-5; __fill abs inset ink scaleX(0) origin left .5s; __txt 12px ls .22em; __meta 8px mute mt 3px; hover/is-on fill scaleX(1) txt paper meta 55% */
/* .team: abs left margin top 47% translateY(-50%) w 42vw flex space-between baseline; display calc(var(--wm-fs)*.33) lh .8 ls -.03em; .g opacity 0 */
/* .threshold.is-revealed: display translateX(var(--reveal-x)%) scale(var(--reveal-scale)); team glyphs visible, team left 4vw size wm*reveal-scale; meta spans transform none */
/* @media 760px: wm-fs 52vw, reveal .5/12; head span3 hidden; wm 84vw top 38%; cross--h 52vh; titles 55vh; node-reg none; meta left/right margin bottom 13vh center; enter bottom 4vh; hud__bl none; hud__br bottom margin*.55+18px */
/* @media reduced: grain/caret animation none; cursor/enter transitions none */
```

### `src/app/chapters.css`
```css
/* (full file, 818 lines) */
/* .ch relative; .ch-label abs top margin*.5 left margin mute z-5; --dark rgba(234,228,216,.5); @media min 761px top margin*.5+44px */
/* .ch-identity margin-top -16vh padding 26vh margin 22vh overflow hidden; .ci-ghost abs right margin*.4 top 4vh clamp(160px,26vw,420px) stroke 1.5px line-soft opacity .5; .ci-registry grid gap 6 max-w 420 mb 16vh ink-soft; .ci-row overflow hidden; span inline-block; .ci-display grid gap 1.5vh; .ci-big clamp(72px,14vw,230px); .ci-outline transparent stroke 2px ink; .ci-serif mt 7vh clamp(18px,1.9vw,28px) lh 1.45 max-w 46ch; .ci-meta mt 8vh mute */
/* .ch-nodes padding 10vh 0 0; .cn-stage relative min-h 100vh overflow hidden; .cn-index abs left margin top 50% translateY(-50%) grid gap 16 z-5; .cn-idx inline-flex gap .9em 10px mute, i 16x1 line bg; .is-active ink + i accent 26px; .cn-focus relative min-h 100vh; .cn-node abs inset grid 1fr 1fr center gap 4vw padding 0 (margin+10vw) 0 (margin+14vw); .cn-num clamp(180px,30vw,470px) stroke 2px ink; .cn-data grid gap 3vh; .cn-name clamp(34px,5.4vw,96px); .cn-fields grid gap 9; .cnf flex gap 2em hidden; .cnf-k mute min-w 6ch; .cnf-v ink; .cn-note clamp(15px,1.3vw,20px) ink-soft max-w 40ch; .cn-hint abs 50% bottom margin*.55 nowrap mute */
/* mobile nodes: stage min-h 0; index static flow column pad 6vh/4vh; focus grid gap 10vh pad 0 margin 16vh; node static 1col gap 3vh; num 34vw stroke 1.5; hint static center */
/* .ch-evidence bg ink color paper-hi; .ce-pin relative h 100vh overflow hidden; .ce-track flex center h 100% max-content gap 9vw pad 0 margin will-change; .ce-slab grid 1.05fr 1fr gap 4.5vw center w 74vw (2nd 60vw, 3rd 66vw) */
/* .ce-visual relative h 56vh bg paper overflow hidden; alt transparent + border rgba(234,228,216,.35); .ce-ref abs 50%/50% clamp(56px,7.4vw,130px) stroke 2px ink; alt stroke rgba(234,228,216,.8); .ce-stamp abs 18px/14px ink-soft (alt 55%); ::after radial halftone 6px opacity .35 (alt .12) */
/* .ce-kicker rgba(234,228,216,.55) mb 2.2vh; .ce-title clamp(44px,6.4vw,116px) lh .85 white-space normal (wraps titles); .ce-desc mt 3.4vh clamp(16px,1.4vw,22px) lh 1.5 rgba(234,228,216,.78) max-w 42ch; .ce-stack flex wrap gap 1.4em mt 3.6vh rgba(234,228,216,.6); .ce-meta mt 2.6vh rgba(234,228,216,.5); .ce-endcap w 44vw center; span 55% */
/* mobile evidence: pin auto pad 14vh/12vh; track column stretch gap 14vh; slabs 100% 1col gap 4vh; visual 38vh; endcap 100% pad 6vh */
/* .ch-archive padding 26vh margin 24vh overflow hidden; .ca-spine abs 50% top/bottom 8vh w 1px bg line; .ca-list grid gap 20vh pad 12vh 0 6vh; .ca-entry grid 1fr 1fr gap 5vw center; --right num order 2 right / body order 1 end right; .ca-num clamp(110px,17vw,280px) stroke 1.5px; .ca-body grid gap 1.6vh; .ca-mask block hidden; .ca-reveal inline-block; .ca-ref mute; .ca-event clamp(30px,4.4vw,76px) lh .95; .ca-meta ink-soft; .ca-note clamp(15px,1.3vw,19px) max-w 38ch */
/* mobile archive: entry 1col gap 3vh; num 30vw order 0; body start left; spine left margin*.5 */
/* .ch-quiet min-h 175vh bg ink color paper-hi grid center; .cq-inner center pad 0 8vw; .cq-label rgba(234,228,216,.4) mb 6vh; .cq-line clamp(26px,3.2vw,52px) lh 1.35; .cq-rule 1px x 12vh mt 8vh rgba(234,228,216,.4) scaleY(0) origin top */
/* .ch-finale bg paper; .cf-stage relative min-h 100vh grid center gap 5vh pad 22vh margin 18vh overflow hidden; .cf-ladder flex wrap gap 2.6em ink-soft; .cf-step hidden; .cf-step-in inline-block; .cf-crew flex wrap gap 3.2em mute; .cf-mark flex baseline gap 1.6vw clamp(76px,15.5vw,320px) lh .8; .cf-c hidden; .cf-c-in inline-block; .cf-gap 2.4vw; .cf-d inline-block; .cf-slot relative; .cf-hollow stroke; .cf-solid abs inset ink; .cf-rule min(62vw,900px) h 3px bg accent scaleX(0) center; .cf-thesis clamp(20px,2.3vw,36px) lh 1.4 center; .cf-sig flex wrap gap 3em mt 6vh mute; .cf-again 10px ls .2em border ink pad 13px 30px 11px, hover ink bg paper text */
/* mobile finale: stage pad-top 18vh gap 4vh; mark 17vw wrap center; gap 4vw */
/* .ch-finale.is-static: step/c-in transform none; solid opacity 1; rule scaleX(1); thesis/sig opacity 1 transform none; crew visible */
/* html.tone-dark: hud__dim rgba(234,228,216,.5); brand .9; anomaly .7; rail line .22 fill .9; tick i .4 active/hover .9; cursor dot #eae4d8; label ink; grain screen .09; selection invert */
/* .rail__line abs l/r 0 bottom 0 h 1px line-soft; .rail__fill abs inset ink scaleX(0) origin left; .rail__tick abs bottom -7px translateX(-50%) 18x26 pointer auto; i 1x6 margin 12 auto 0 bg line transition .3s; first/last h 10 mt 8; ::after attr(data-label) abs bottom 10px left 50% translateX(-50%) 8px ls .14em mute nowrap opacity 0 (active/hover opacity 1 ink); @media min 1100px ::after opacity .55 + tone-dark variants */
```

> Note: the CSS blocks above are compact annotated restatements for budget; the authoritative full files live in the repo at `src/app/globals.css` and `src/app/chapters.css` — pass them as `--context-file` when full fidelity is needed.
