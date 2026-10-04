# TEAM 404 — PROJECT KNOWLEDGE

## PROJECT

TEAM 404 is a six-person hackathon team.

This website is a fun experimental project and should feel like an interactive digital experience rather than a conventional team portfolio.

The website itself is part of the team's identity.

The goal is to create something that feels highly intentional, visually sophisticated, memorable and technically impressive.

---

# CORE DESIGN PRINCIPLE

DO NOT MAKE A GENERIC AI WEBSITE.

Avoid the visual language of generic AI-generated landing pages.

Do not automatically use:

- Purple/blue gradient backgrounds
- Generic glassmorphism
- Floating gradient blobs
- Excessive rounded cards
- Generic SaaS layouts
- Standard hero → features → pricing → testimonials structure
- Six identical profile cards
- Random particle backgrounds
- Excessive neon cyberpunk styling
- Meaningless 3D objects
- Excessive animations
- Random gradients
- Decorative effects without purpose

The website should feel art-directed.

---

# MOTION AND DESIGN DIRECTION — APPROVED

The following direction is approved and binding for all UI work. It was extracted as principles from reference websites (never copied from them). The existing CORE DESIGN PRINCIPLE (avoid generic AI website patterns) remains fully in force.

## CONCEIT

- TEAM 404 is a system that should not exist, and the 404 error is the entrance into that system.
- The site presents itself as what you find behind a 404: a team that officially is not there. The 404 error page is the front door — a deliberately plain error state that misbehaves and reveals the team.
- The metadata layer speaks system language: STATUS, REF, NODE, ERR counters, coordinates.
- The recurring visual motif is the missing element: gaps in words, empty grid slots, members "not found" until interaction. Absence is the accent.
- One accent color with one meaning: reserved for system events (resolve, found, live, locate). Never decorative. It may appear at full strength only once, at the finale.

## CONTINUOUS COMPOSITION

- The website must feel like one continuous interactive composition, not a normal website with animations added to it.
- Sections are states of one continuous plane, never separate stacked blocks. No visual section boundaries: sections overlap or wipe into each other.
- One global coordinate/grid system: same grid, margins, gutters and axis alignment in every chapter. Asymmetry comes from grid placement, never arbitrary positioning. Elements hand over between chapters at the same grid positions.
- The page is one narrative arc: loader, 404 threshold, chapters, finale. The last thing on screen is a signature, not a footer.

## SCROLL AND MOTION GRAMMAR

- Treat scrolling as the primary interaction: scroll drives the whole experience.
- One timeline master: scroll drives everything. Time-driven animation only responds to user acts (enter, hover, click).
- Use GSAP/ScrollTrigger for major scroll choreography. Smooth scrolling with deliberate inertia (lerp about 0.085 to 0.1). Scroll stays locked until the threshold act completes.
- Use pinned chapters for major scenes, each with an internal timed scene (entry, development, hand-off wipe). About 3 to 5 pinned chapters. Never two adjacent pins of equal loudness.
- Exactly one meaningful horizontal-scroll passage (e.g. the team index), justified by content. Horizontal movement is never the site structure.
- Easing law, exactly three: power4.out/expo.out for entrances; power3.in for exits; one cubic-bezier (about 0.2, 0.7, 0.1, 1) for hover/cursor/UI micro-interactions. Everything scroll-scrubbed uses linear easing (the smooth scroller already provides the ease).
- Scrub values 0.5 to 1 so motion has mass. True scrub 1 only for progress readouts. No bounce, no elastic, anywhere.
- Small, consistent vocabulary of transitions — only these devices: rule/wipe line scaling across the frame; clip-path inset or circle reveals from meaningful points; full tone inversion between chapters; negative-margin overlap hand-offs. Fades only for exits of 0.5s or less.
- Pacing: alternate loud, highly animated chapters with quiet breathing passages. Loudness contrast is what makes both readable.
- Typography is a physical visual object, not ordinary text: fit-to-viewport display words, masked line/char reveals, scroll-driven text transforms (scale, slide, fill/outline states). One showpiece moment where a word has physical mass (the team assembles from scattered glyphs: found, not missing).
- Imagery is treated, never raw: grayscale, contrast, duotone via blend modes into the chapter tone, optional halftone, scrubbed scale and parallax. No floating, rotation, or endless loops.
- Persistent technical HUD/state layer that never scrolls: brand, progress/state readouts, mono metadata in the corners. The HUD replaces the scrollbar as the progress indicator. Cursor position feeds the metadata layer.
- Desktop custom cursor as part of the system: small dot (idle scale about 0.14), lerped follow, expands with a verb label (OPEN, READ, RESOLVE, DRAG), inverts per tone. Standard pointer on touch. Never annoying or unusable.
- Micro-interactions are state changes, not effects: invert or translate one grid unit, redraw rules, slide index rows.
- Personality layer: idle response after about 20s, one easter egg tied to the conceit, returning-visitor copy, one element that plays with you before complying.
- Texture: one paper-grain layer and 1px rules as structural drawing. Grain is what makes flat UI feel like material.

## PALETTE AND TYPE TOKENS

- Palette: warm bone/dusty paper, near-black ink, 2 to 3 functional grays, one signal accent. Every chapter uses paper/ink plus at most one additional tone. Chapters may invert (ink ground, paper type); inversion is a section transition.
- Type: three voices with strict roles — one ultra-heavy grotesque for display (uppercase, line-height about 0.8, tight tracking, fit-to-viewport); one serif/humanist for sentences in quiet passages; one mono for metadata (10 to 11px, uppercase, 0.1 to 0.12em tracking). This is the strong reason that overrides the general two-family preference. No fourth family.

## EXPERIENCE SHAPE

1. Loader (about 2.5s): paper ground, oversized wordmark, mono corner metadata, progress expressed in the conceit, gated on real font load, skippable after first visit.
2. 404 threshold: a deliberately static, boring error state that misbehaves and reveals the experience. The scroll lock releases here. Include a mono interaction hint and an enter/skip affordance. Returning visitors get different copy.
3. Chapters: each member or facet is a chapter with its own tone state, pinned scene and metadata plaque (REF, name, role as system fields). One loud horizontal index mid-way.
4. Finale: all six identities resolve in one composition; the accent fires fully here, the only time it is allowed mass. Deliberate exit state, not a footer.

## ENGINEERING CONSTRAINTS

- Transform and opacity only; no layout-animating properties.
- Every GSAP/ScrollTrigger instance cleaned up on unmount.
- prefers-reduced-motion: grain stops, scrubs become states, pins collapse to normal flow, threshold can be skipped. Content and hierarchy must survive with zero animation.
- Mobile is re-composed, not scaled: at most 2 pinned scenes, no custom cursor, fit-to-viewport type is kept, the horizontal passage may become a native swipe track.
- Optional/synthesized audio default-off (and off on mobile by default). Sound is material feedback, not soundtrack.

# EXPLICIT BANS

- No generic card animations (including six identical profile cards).
- No fade-only section transitions.
- No bounce or elastic easing, anywhere.
- No decorative particle fields.
- No blobs.
- No generic gradients.
- No glassmorphism.
- No raw untreated photographs.
- No unnecessary scroll-jacking beyond pinned chapters.
- No animation without a conceptual reason: every animation must be explainable in the conceit's vocabulary, or it is cut.
- Never copy the reference websites directly: no borrowed layouts, content, branding, type choices, palettes, or assets. Principles only.

# VISUAL STYLE

Target feeling:

Experimental creative technology studio.

References in spirit:

- Awwwards-level creative websites
- Digital agencies
- Experimental design studios
- Editorial websites
- Creative developer portfolios
- Technology laboratories

Do not copy existing websites.

Extract principles from them:

- typography
- composition
- spacing
- motion
- pacing
- visual hierarchy
- interaction design

---

# TYPOGRAPHY

Typography is one of the primary visual elements.

Prefer:

- Large editorial headlines
- Very large display typography
- Small technical metadata
- Strong contrast between large and small text
- Monospaced text for technical labels

Use no more than two primary font families unless there is a strong reason.

Typography should often be treated as a visual object rather than ordinary text.

---

# COLOR

Keep the base palette restrained.

Prefer:

- near-black
- off-white
- neutral grays
- one carefully chosen accent color

Do not introduce many colors.

The accent color should have meaning.

---

# LAYOUT

Prefer:

- asymmetric layouts
- large negative space
- full-width compositions
- oversized typography
- overlapping elements
- editorial layouts
- strong visual rhythm
- carefully controlled grids

Do not force everything into cards.

---

# ANIMATION

Animation is a major part of the experience.

Use animation to communicate structure and progression.

Do not animate everything.

Major animation moments should have contrast with quieter sections.

Preferred animation techniques:

- scroll-driven animation
- pinned sections
- typography reveals
- text splitting
- image scaling
- image masking
- clip-path transitions
- parallax
- horizontal scrolling controlled by vertical scrolling
- layered transitions
- subtle rotation
- scale transformations
- smooth easing
- cursor interactions
- hover transformations

Animations should feel deliberate and physical.

Avoid:

- constant bouncing
- excessive floating
- random rotations
- excessive blur
- excessive particle effects
- animations that distract from content

---

# ANIMATION TECHNOLOGY

Use GSAP as the primary animation system.

Prefer:

- GSAP
- ScrollTrigger
- SplitText when appropriate
- Flip when appropriate
- Observer when appropriate

Use Motion/Framer Motion only when it is genuinely better suited to a small UI interaction.

Do not introduce multiple animation systems unnecessarily.

Use CSS transitions for simple interactions.

---

# SMOOTH SCROLLING

Use Lenis or an equivalent lightweight smooth-scroll solution if appropriate.

Scrolling should feel smooth without making the website sluggish.

---

# 3D

3D is allowed but must be used carefully.

If React Three Fiber / Three.js is used, it should serve a specific visual purpose.

Do not turn the entire website into a Three.js demo.

Prefer one or two memorable 3D moments over constant WebGL decoration.

---

# CURSOR

Desktop may use a custom cursor.

The cursor should be subtle and functional.

Possible states:

DEFAULT
VIEW
DRAG
OPEN

Do not make the cursor annoying or unusable.

---

# PERFORMANCE

Performance matters.

Prefer transform and opacity animations.

Avoid unnecessary layout-triggering animations.

Optimize images.

Lazy-load large media where appropriate.

Avoid huge videos unless necessary.

Clean up GSAP/ScrollTrigger instances correctly.

Respect prefers-reduced-motion.

The website must remain usable on weaker devices.

---

# RESPONSIVENESS

Desktop can contain the most ambitious visual experience.

Mobile should NOT simply be a shrunk desktop version.

Create appropriate mobile layouts and simplify expensive animations where necessary.

Touch interactions must remain usable.

---

# CODE QUALITY

Use clean, maintainable architecture.

Prefer:

- reusable components
- reusable animation utilities
- centralized project data
- separated animation logic
- predictable component structure
- TypeScript
- clear naming

Do not create one enormous page component.

Do not duplicate large blocks of code.

Do not add dependencies unless they provide real value.

---

# AI BEHAVIOR

When modifying the project:

1. Understand the existing architecture before changing it.
2. Reuse existing components when possible.
3. Do not rewrite unrelated code.
4. Do not replace the visual direction without being asked.
5. Do not introduce a new library when an existing dependency can solve the problem.
6. Preserve working functionality.
7. Check the result after significant changes.
8. Fix errors instead of hiding them.
9. Prefer small controlled changes over unnecessary rewrites.
10. If a design decision is ambiguous, choose the more refined and restrained option.

---

# EXPLICIT BANS (QUICK REFERENCE)

The full list lives in the MOTION AND DESIGN DIRECTION section above. Short form: no generic card animations; no fade-only section transitions; no bounce/elastic easing; no decorative particle fields; no blobs; no generic gradients; no glassmorphism; no raw untreated photographs; no unnecessary scroll-jacking; no animation without a conceptual reason; never copy the reference websites directly.

# IMPORTANT

The goal is NOT:

"make a website with lots of animations."

The goal is:

"create a sophisticated visual experience where animation, typography, layout and interaction all work together."

Quality > quantity.

Art direction > decoration.

Intentionality > effects.

Performance > unnecessary complexity.

# DEVELOPMENT BEHAVIOR

Before making significant changes:

1. Inspect the existing project.
2. Understand the relevant files.
3. Think through the implementation.
4. Make the smallest coherent set of changes.
5. Run the application/checks.
6. Inspect the rendered result when possible.
7. Fix obvious problems before reporting completion.

Do not declare a task complete simply because the code compiles.

For visual work, judge the actual rendered interface.

When something looks generic, improve the design rather than adding random effects.

When an animation is broken, debug the animation instead of removing it unless removal is genuinely the correct solution.

Do not rewrite working sections unnecessarily.