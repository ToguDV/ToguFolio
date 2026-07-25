# AGENTS.md

## Stack
- Vite 8 + React 19, ESM (`"type": "module"`).
- React plugin: `@vitejs/plugin-react` (Oxc-based, not SWC).
- Linter: `oxlint` with `react` + `oxc` plugins (`.oxlintrc.json`).
- Tailwind v4 wired via `@tailwindcss/vite`; `@import "tailwindcss";` at the top of `src/index.css`. Use Tailwind utilities for layout/sizing/spacing. **Don't** use Tailwind color utilities — every color must reference the CSS custom properties in `src/styles/tokens.css` (e.g. `text-[var(--color-ink)]`, `bg-[var(--color-canvas)]`) so the dark theme stays single-sourced.
- No tests, no formatter, no typecheck, no CI, no pre-commit hooks.

## Commands
- `npm run dev` — Vite dev server with HMR.
- `npm run build` — production build to `dist/`.
- `npm run lint` — runs `oxlint` (no args; lints whole repo).
- `npm run preview` — serve the built `dist/`.
- `npm install` — only setup step; lockfile is `package-lock.json` (use `npm`, not pnpm/yarn).

## Layout
- Entry HTML: `index.html` (root, references `/src/main.jsx`).
- React entry: `src/main.jsx` mounts `<App />` into `#root` with `StrictMode`.
- Single composition root: `src/App.jsx` (`<Shell><Nav/><main>…sections…</main><Footer/></Shell>`).
- Styles: `src/index.css` (`@import "tailwindcss";` + aggregates `src/styles/tokens.css` + `src/styles/fonts.css` + `src/styles/base.css`), per-component CSS modules co-located next to the component.
- Static assets served from `public/` (`favicon.svg`, `icons.svg`, `band-divider-mask.svg`); bundled source under `src/assets/` (currently leftover Vite/React/hero PNGs — unused by components, safe to delete).

## Gotchas
- **React Compiler is intentionally disabled** (per README) for dev/build perf. Don't add `babel-plugin-react-compiler` without discussion.
- **Linter is oxlint, not ESLint.** No autofix configured; rules enforced are only `react/rules-of-hooks` (error) and `react/only-export-components` (warn, with `allowConstantExport: true`).
- **No test runner.** Adding tests requires choosing and installing one (e.g. vitest); none is set up.
- **All canvas effects short-circuit on `prefers-reduced-motion`** (return early in `useEffect`). Caret and CSS animations are killed via the global rule in `base.css`. The static visual still renders — motion is what's removed, not content.
- **Two animation systems coexist:** `useEffect`-driven canvas effects (`useMatrixRain`, `useAsciiConstellation`) and a CSS `@keyframes` blinking caret (`Caret.module.css`). Both respect reduced-motion; don't add new motion without a `prefers-reduced-motion` branch.
- **Mouse / touch listeners on canvas effects are attached to the enclosing `<section>`** (via `findSection(canvas)` in `useAsciiConstellation`), not the canvas itself, so the hit area covers the whole band even when the canvas is `pointer-events: none`. Don't change to `canvas.addEventListener` without re-checking the bounds.
- **`AsciiFrameAnimator` re-renders the `<pre>` with a `key={renderFrame}`** so each frame remounts (cheap, no diffing). Trigger modes: `hover` (focusable), `inView` (uses `useInView`), `always` (loops forever), `click` (focusable, latches on, exposes `aria-label` / `aria-pressed`, supports Enter/Space). Optional `idleFrame` shows a static frame when not playing; optional `speechBubble` + `speechBubbleWhen` (`'idle'` default / `'playing'` / `'always'` / `'never'`) renders an ASCII bubble above the frame. Frames are passed as already-joined strings.
- **`Button` uses inline Tailwind utility classes** (`STYLES` const in the file), not a CSS module. New variants should be added there, not as a module class. It stays polymorphic (`<a>` if `href` else `<button>`) and prepends a `> ` arrow.
- **`Keycap` is the bracketed `[label]`-style** for inline project links (`tour`, `source`) and contact socials. `primary` is bold lime, `secondary` is muted slate. Replaces the old plain `<a>` text links in `ProjectCard` and `Contact`.
- **Project data lives in `data/projects.js`** (per the rule "data/*.js is plain JS, no JSX"). The older `sections/Projects/projects.data.js` path in some architecture diagrams is stale — the canonical location is `data/projects.js`.
- **Decorative stickman frames live in `data/stickmans.js`** — individual `STICKMAN_*` exports (T-pose, dash, walk, jump, strike, etc.) plus a `STICKMANS` array of all of them. Use as raw ASCII in `<AsciiBlock>` (see Hero / Projects). Not used by any animator.
- **Custom scrollbar is in `base.css`** — lime thumb on dark surface, hard-edged (`border-radius: 0`) with a 1px hairline. Both `::-webkit-scrollbar` and the `scrollbar-color` / `scrollbar-width` Firefox properties are set. The reduced-motion media query does NOT touch it.
- **`PULSE_FRAMES` in `data/animations.js` is currently unused** — defined and exported, no consumer yet. Safe to consume or delete.

---

## Project: Portfolio (Matrix Terminal Aesthetic)

### Purpose
Personal portfolio to showcase projects. Single page, scroll-based, organized as editorial bands. Optimized for desktop, graceful on mobile.

### Visual Concept
Ghost design system (see `ghost.design.md`) inverted to a **dark theme** and reframed as a **terminal / Matrix experience**:
- **No raster images in the UI.** Every visual is ASCII art, monospaced text, or canvas geometry. Project previews are ASCII mockups (animated for `wip` cards), not screenshots.
- **Terminal chrome.** Headlines feel like `cat`-ed logs, eyebrows look like shell prompts (`$> …`), buttons look like `> RUN` commands, sections look like `--section` flags.
- **Hero background = ASCII constellation** (mouse-reactive canvas of geometric glyphs linked by faint lines). Replaces the earlier Matrix-rain hero.
- **Matrix rain reappears as a masked band divider** between Projects and About (`<BandDivider>` with `intensity="subtle"`).
- **Blinking caret** on the active headline, at the end of the terminal panel in `About`, and on every interactive element on focus.
- **Typewriter reveal** on hero copy and section headings (scroll-triggered via `useInView`, fires **once** per heading — latched, doesn't re-run if the user scrolls back).
- **Animated ASCII critters** (bear sleeping in About, clickable angry bunny in Contact, cat drinking coffee in the Footer signoff) via `AsciiFrameAnimator`.

### Design Tokens (dark theme, derived from `ghost.design.md`)

| Role | Token | Hex | Ghost origin |
|---|---|---|---|
| Canvas (page floor) | `--color-canvas` | `#0a0a0a` | inverted from `#ffffff` |
| Surface (cards) | `--color-surface` | `#111111` | was `ink-base` band, now everywhere |
| Surface raised | `--color-surface-raised` | `#1a1a1a` | new tier, for hovered/focused cards |
| Border hairline | `--color-hairline` | `#1f2937` | was `hairline-dark` |
| Border soft | `--color-hairline-soft` | `#374151` | between dark and light tiers |
| Ink primary (text) | `--color-ink` | `#d1ff19` | **the lime** — repurposed as primary text on dark |
| Ink secondary | `--color-ink-soft` | `#a3e635` | lime-400 step |
| Ink muted | `--color-ink-mute` | `#84cc16` | lime-500 step |
| Text on dark | `--color-text` | `#e5e7eb` | slate-200 |
| Text muted on dark | `--color-text-mute` | `#9ca3af` | slate-400 |
| CTA fill (primary button) | `--color-cta-bg` | `#d1ff19` | lime, used on CTA only |
| CTA text | `--color-cta-text` | `#0a0a0a` | canvas black |
| Danger / accent | `--color-accent` | `#f87171` | red-400, reserved for destructive or "live" indicators |

**Rationale for the inversion:** Ghost puts lime in the eyebrow and near-black in the CTA. On a dark canvas, that collapses — near-black on near-black is invisible. So the lime moves to the primary text tier (headings, terminal prompt) and the CTA inverts to lime-on-black. Eyebrow tier becomes a dimmer lime-soft `#a3e635` so the hierarchy still reads.

### Typography
- **Mono everywhere.** One family: `JetBrains Mono` (self-hosted via `@fontsource/jetbrains-mono` — 400 + 700), with `ui-monospace, Menlo, monospace` as fallback. No FOUT.
- **Size scale:**
  - `display-xl` 72px / 700 / -2px (hero)
  - `display-lg` 36px / 700 / -1px (section headings)
  - `display-md` 24px / 700 / -0.5px (project titles)
  - `body-lg` 18px / 400 (lede)
  - `body-md` 15px / 400
  - `caption` 13px / 400
  - `eyebrow` 11px / 700 / 1.2px / uppercase (shell-prompt style: `$> projects`)
- **Hierarchy via color, not size:** since mono metrics are uniform, distinguish tiers by lime vs. slate vs. dim-lime rather than by huge size jumps.

### Effects

| Effect | Where | How |
|---|---|---|
| Ascii constellation | Hero background, behind headline | `<canvas>` driven by `useAsciiConstellation`. Tiered glyph set (◆/◇/*/·), per-node drift, link lines between nearby nodes, mouse radius attractor with soft halo + crosshair. Pauses on `prefers-reduced-motion`. |
| Matrix rain | Band divider between Projects and About | `<canvas>` driven by `useMatrixRain` with the `subtle` profile (`headAlpha: 0.1`, `speed: 0.3`, `density: 0.5`), masked by `/band-divider-mask.svg` so the rain fades at the edges. Includes rare multi-char strings (e.g. `( ͡° ͜ʖ ͡°)`, `¯\_(ツ)_/¯`, `TOGU ESTUVO AQUI`). |
| Blinking caret | Hero headline, About terminal tail, focus rings | CSS `@keyframes caret-blink` on `Caret.module.css` (1ch wide block, `step-end`, 1.06s). `prefers-reduced-motion` → static opaque caret. |
| Typewriter | Hero h1, section h2s | `<Typewriter>` self-cables `useInView` on its own `<span>` and latches an `armed` flag, then passes it to `useTypewriter(text, { speed, startDelay, start })`. Renders progressively, appends a caret that stops blinking when done. Honors reduced motion by jumping to final state (still waits for inView). Threshold/rootMargin overridable via props. |
| ASCII art (static) | Project cards, About terminal body | `AsciiBlock` renders a `<pre>` with `ink` / `ink-soft` / `ink-mute` tones. |
| ASCII art (animated) | About terminal (bear), `wip` project cards (bunny), Footer signoff (cat) | `AsciiFrameAnimator` with `trigger="inView"` / `trigger="always"`. Frame set is `frames` (array of pre-joined strings), `fps` controls cadence. |
| Bracketed keycaps | Inline project + contact links | `Keycap` renders `[label]`. `primary` lime bold, `secondary` slate muted. |

### Component Architecture (one file per component, CSS module co-located)

```
src/
  main.jsx                                # entry, mounts <App />
  App.jsx                                 # composition root, no markup
  App.css                                 # minimal, imported by App.jsx
  index.css                               # @tailwind + global imports
  styles/
    tokens.css                            # CSS custom properties (colors, spacing, radii, type scale)
    fonts.css                             # @import jetbrains-mono 400/700
    base.css                              # reset + body + reduced-motion override
  components/
    layout/
      Shell.jsx                           # outermost wrapper, sets bg + column flex
      Nav.jsx + Nav.module.css            # sticky top nav (brand + section anchors)
      Footer.jsx + Footer.module.css      # colophon + social links + cat signoff
      Section.jsx                         # editorial band wrapper, props: id, tone
      BandDivider.jsx + BandDivider.module.css  # masked matrix-rain band, optional label
    effects/
      MatrixRain/                         # canvas rain, props for intensity profile
        MatrixRain.jsx
        useMatrixRain.js                  # animation loop, DPR + ResizeObserver
        chars.js                          # KATAKANA + LATIN + DIGITS + SYMBOLS + rare strings
        MatrixRain.module.css
      AsciiConstellation/                 # hero background, mouse-reactive
        AsciiConstellation.jsx
        useAsciiConstellation.js          # nodes, links, mouse attractor, crosshair
        AsciiConstellation.module.css
      AsciiFrameAnimator/                 # frame-based ASCII animator
        AsciiFrameAnimator.jsx            # trigger: 'hover' | 'inView' | 'always'
        useFrameAnimator.js               # setInterval driver, reduced-motion safe
        AsciiFrameAnimator.module.css
      AsciiBlock.jsx + AsciiBlock.module.css    # static <pre> with tone
      Caret.jsx + Caret.module.css        # blinking block caret
      Typewriter/
        Typewriter.jsx
        useTypewriter.js
    sections/
      Hero/
        Hero.jsx + Hero.module.css        # composes eyebrow + headline + lede + constellation
      Projects/
        Projects.jsx + Projects.module.css
        ProjectCard.jsx + ProjectCard.module.css
      About/
        About.jsx + About.module.css
        AboutTerminal.jsx + AboutTerminal.module.css  # macOS-style frame + bear
      Contact/
        Contact.jsx
    ui/
      Eyebrow.jsx                         # shell-prompt label ($> …)
      Heading.jsx                         # h1/h2/h3 with optional typewriter
      Button.jsx                          # primary/ghost; polymorphic <a>/<button>; > prefix
      Link.jsx                            # inline > link
      Tag.jsx                             # tech-stack chip
      Keycap.jsx + Keycap.module.css      # [label] bracketed link/button
      CommandList.jsx + CommandList.module.css  # flex row with leading > prompt
  data/
    projects.js                           # project list (id, title, ascii, stack, url, repo, status)
    ascii.js                              # PROJECT_ASCII, ABOUT_OUTPUT
    animals.js                            # ts-animal (MIT) frames: bear/bunny/cat + BUNNY_IDLE/SPEECH
    stickmans.js                          # STICKMAN_* poses (T-pose, dash, walk, jump, …) + STICKMANS array
    animations.js                         # PULSE_FRAMES (currently unused)
  hooks/
    useInView.js                          # IntersectionObserver wrapper, returns [ref, boolean]
  assets/                                 # bundled source (currently leftover react.svg, vite.svg, hero.png — unused)
```

**Rules:**
- No file exports more than one React component. Co-locate the component's own CSS module next to it.
- `data/*.js` is plain JS, no JSX. Components import data; data never imports components.
- Hooks live next to the component that owns them, OR in `src/hooks/` if shared by 2+.
- `App.jsx` is a flat composition list of sections — no business logic.
- All section components accept an `id` prop and render a `<Section id={id} tone="...">` wrapper so the layout/rhythm is centralized.

### Band Rhythm (mirrors Ghost's editorial spread pattern)

| # | Section | Tone | Background | Notes |
|---|---|---|---|---|
| 1 | Hero | dark | canvas | `<AsciiConstellation>` behind, typewriter h1, eyebrow `$> portfolio --init` |
| 2 | Projects | surface | surface | 1/2-col grid, every card uses `AsciiBlock`; decorative `STICKMAN_DASH` top-right |
| — | BandDivider | canvas | canvas | Masked MatrixRain, label `-- section --break` |
| 3 | About | dark | canvas | Eyebrow `cat about.txt`, terminal panel with bear + blinking caret |
| 4 | Contact | surface | surface | Mailto + GitHub/LinkedIn as `Keycap` inside `CommandList`; clickable angry bunny top-right |
| Footer | colophon | canvas | canvas | Build line, deploy date, ts-animal attribution, cat-coffee signoff |

Each band is flush-edged (no gradients between them). `Section` handles the `padding: 64px` (token `--section-padding-y`) per band, and `scroll-mt-[var(--nav-height)]` so anchored sections clear the sticky Nav.

### Content Model (`src/data/projects.js`)

```js
{
  id: 'string',
  title: 'string',
  ascii: 'string',          // optional inline ASCII art (not currently rendered — cards use shared PROJECT_ASCII)
  stack: ['react', 'vite'], // for <Tag> chips
  description: 'string',    // 1-2 sentence lede
  url: 'https://...',       // optional live link → renders a primary <Keycap>tour</Keycap>
  repo: 'https://...',      // optional repo link → renders a secondary <Keycap>source</Keycap>
  status: 'live' | 'wip' | 'archived'   // all cards render the static PROJECT_ASCII block; status only changes the badge tone/label
}
```

### Accessibility & Motion
- Respect `prefers-reduced-motion: reduce`: kill constellation, kill matrix rain, kill frame animator (render first frame statically), kill typewriter (jump to final state), kill caret blink (static caret). Global `scroll-behavior` also goes to `auto`.
- All interactive elements are real `<a>`/`<button>`. Decorative ASCII wrapped in `aria-hidden="true"`.
- Color contrast: lime `#d1ff19` on canvas `#0a0a0a` ≈ 15.8:1 (AAA). Slate-200 on canvas ≈ 14:1.
- Focus rings: 2px solid lime, `outline-offset: 2px` (global in `base.css`). The `AsciiFrameAnimator` `hover` and `click` triggers expose a `focus-visible` outline so keyboard users get the same affordance.
- `AsciiConstellation` is `pointer-events: none` on the canvas layer so it never blocks clicks on the hero content.

### Out of Scope (for v1)
- No routing (single page).
- No CMS / data fetching (projects are static in `data/`).
- No i18n.
- No analytics.
- No blog, no contact form backend (mailto: only).
- No tests (per stack gotcha).
- No light theme (the dark/terminal aesthetic is the point).
- No raster imagery (the canvas effects are the only "graphics"; the leftover PNGs/SVGs in `src/assets/` and `public/icons.svg` are not referenced by any component and can be deleted).

### Implementation Status

**All planned steps complete.** `npm run lint` (oxlint, no warnings) and `npm run build` (~216 kB JS / ~45 kB CSS gzip 68/20 kB) both pass clean.

History (chronological, condensed from git log):

1. ✅ Init + Tailwind v4 + JetBrains Mono + tokens/base styles.
2. ✅ `Caret` + `Typewriter` + `AsciiBlock` (visual language).
3. ✅ `Section` + `Shell` (band rhythm + outer column).
4. ✅ `Hero` with full-screen `<MatrixRain>` + ASCII headline.
5. ✅ `ui/` primitives (`Eyebrow`, `Heading`, `Button`, `Link`, `Tag`).
6. ✅ `Projects` + `ProjectCard` + `data/projects.js` + `data/ascii.js`.
7. ✅ `About` + `AboutTerminal` + `Contact`.
8. ✅ `Nav` (sticky) + `Footer` + `scroll-behavior` / `scroll-mt` plumbing.
9. ✅ `npm run lint` + `npm run build` green at v1.
10. ✅ **Replaced hero MatrixRain with `AsciiConstellation`** (mouse-reactive glyph network) — `useAsciiConstellation` + `AsciiConstellation.jsx` + `AsciiConstellation.module.css`. Hero now feels like a calm node graph instead of a rain storm; per-node tier (◆/◇/*/·), faint link lines, mouse halo + crosshair.
11. ✅ **`AsciiFrameAnimator` + `useFrameAnimator`** — frame-based ASCII animator with `hover` / `inView` / `always` triggers, `prefers-reduced-motion` safe. Reused for the sleeping bear (`AboutTerminal`), the raging bunny on `wip` project cards, and the cat-coffee Footer signoff.
12. ✅ **`BandDivider`** — masked MatrixRain band between Projects and About, with optional `-- section --break` label. New public asset `band-divider-mask.svg`. `useMatrixRain` gained a `subtle` profile (lower alpha, density, speed).
13. ✅ **`Keycap` + `CommandList`** — `[label]` bracketed link/button (`primary` / `secondary`) and a flex row with a leading `> ` prompt. `ProjectCard` and `Contact` now use them for inline `tour` / `source` and GitHub/LinkedIn.
14. ✅ **`Button.jsx` rewritten with Tailwind utility classes** (no CSS module). `primary` and `ghost` variants; still polymorphic and still prepends `> `. Class-join uses the same `[…].filter(Boolean).join(' ')` pattern.
15. ✅ **`data/animals.js`** — frames ported from [ts-animal](https://github.com/ts-animal/ts-animal) (MIT): `BEAR_SLEEPING_FRAMES`, `BUNNY_ANGRY_FRAMES`, `CAT_COFFEE_FRAMES`. Footer credits the source.
16. ✅ **`data/animations.js`** — `PULSE_FRAMES` defined, currently unused (left as a hook for future sections).
17. ✅ **`hooks/useInView.js`** — shared `IntersectionObserver` wrapper, used by `AsciiFrameAnimator` for the `inView` trigger.
18. ✅ **MatrixRain char set extended** with rare multi-char strings `( ͡° ͜ʖ ͡°)`, `¯\_(ツ)_/¯`, `TOGU ESTUVO AQUI` at 0.5% probability. Multi-char glyphs are measured and "claimed" across multiple cells so neighbouring columns don't overdraw them.
19. ✅ **Footer signoff** swaps the static `>` for an always-animating `CAT_COFFEE_FRAMES` `AsciiFrameAnimator`.
20. ✅ **Decorative stickman ASCII in Hero / Projects** — `data/stickmans.js` holds individual `STICKMAN_*` frames + a `STICKMANS` array. Hero uses `STICKMAN_TPOSE` (top-right, `pointer-events: none`, hidden < 640px); Projects uses `STICKMAN_DASH` in the same role. Rendered via `<AsciiBlock tone="ink-soft">`, not the animator.
21. ✅ **`AsciiFrameAnimator` gained `click` trigger + `idleFrame` + `speechBubble` props** — used by the clickable angry bunny in the Contact section (top-right, idle until clicked, says "dont touch me"). New CSS classes: `trigger_hover` / `trigger_click` (cursors) and `hasBubble` (flex column for bubble above frame).
22. ✅ **Hero has a bottom fade-to-surface gradient** (`::after` on `.hero`) so the constellation no longer leaks into the Projects band; the canvas itself is also `mask-image`-clipped to fade at 75% height.
23. ✅ **WIP-project bunny removed from `ProjectCard`** — the bunny now lives only in Contact. All project cards render the static `PROJECT_ASCII` block.
24. ✅ **Custom lime scrollbar** in `base.css` — 16px wide, hard-edged, lime thumb on dark surface. Both WebKit and Firefox (`scrollbar-color` / `scrollbar-width`) covered. Reduced-motion media query intentionally leaves it alone.

**Likely next ideas (not in scope unless asked):**
- Wire `PULSE_FRAMES` somewhere (e.g. a `loading` state in Contact, or a stand-alone "extras" section).
- Delete unused `src/assets/{react,vite,hero}.{svg,png}` and `public/icons.svg` (no consumer).
- Add an `aria-live="polite"` announcement when the typewriter finishes, for screen readers.
- Add an `IntersectionObserver` to defer the `AsciiConstellation` mount until the hero is in view (currently mounts immediately on `useEffect`).
- Use the remaining stickman frames (`STICKMAN_WALK`, `STICKMAN_JUMP`, `STICKMAN_CHEER`, `STICKMANS` array) in more sections.
