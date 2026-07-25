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

## Commits
- Keep commit messages **short and direct** (one line, imperative mood, no body unless asked). Examples: `fix: show hero cat on mobile`, `chore: bump deps`. No emojis, no trailers.

## Layout
- Entry HTML: `index.html` (root, references `/src/main.jsx`).
- React entry: `src/main.jsx` mounts `<App />` into `#root` with `StrictMode`.
- Composition root: `src/App.jsx` — flat list, no business logic. Current order: `<Shell><AsciiCursor /><Nav /><main><Hero/><Projects/><BandDivider/><About/><BandDivider/><Contact/></main><Footer/></Shell>`. Two `BandDivider`s separate the three content bands.
- Styles: `src/index.css` (`@import "tailwindcss";` + aggregates `src/styles/tokens.css` + `src/styles/fonts.css` + `src/styles/base.css`), per-component CSS modules co-located next to the component.
- Static assets served from `public/` (`favicon.svg`, `band-divider-mask.svg`); `public/icons.svg` is unreferenced (leftover from the Vite template — safe to delete). Bundled source under `src/assets/` (`react.svg`, `vite.svg`, `hero.png`) is also unused by any component.

## Gotchas
- **React Compiler is intentionally disabled** (per README) for dev/build perf. Don't add `babel-plugin-react-compiler` without discussion.
- **Linter is oxlint, not ESLint.** No autofix configured; rules enforced are only `react/rules-of-hooks` (error) and `react/only-export-components` (warn, with `allowConstantExport: true`).
- **No test runner.** Adding tests requires choosing and installing one (e.g. vitest); none is set up.
- **All canvas effects short-circuit on `prefers-reduced-motion`** (return early in `useEffect`). The CSS caret blink and the `AsciiCursor` transition are killed by their own media queries / by the global rule in `base.css`. The static visual still renders — motion is what's removed, not content.
- **Three animation systems coexist** — keep them separate:
  1. `useEffect`-driven canvas effects (`useMatrixRain`, `useAsciiConstellation`) — DPR + `ResizeObserver`, hard-bail on reduced-motion.
  2. CSS `@keyframes` caret blink on `Caret.module.css` (1ch block, `step-end`, 1.06s) + CSS transitions on `AsciiCursor.module.css`.
  3. The custom `AsciiCursor` — a `position: fixed; pointer-events: none; z-index: 9999` glyph that follows the pointer. It only mounts when `(pointer: fine) && !prefers-reduced-motion`; while active it sets `data-ascii-cursor` on `<html>` and `base.css` does `cursor: none !important` for everything under it. Use `data-ascii-cursor-ignore` on a wrapper to opt back in (used by the constellation layer and any region that should keep the native cursor).
- **Canvas effects attach mouse / touch listeners to the enclosing `<section>`** (via `findSection(canvas)` in `useAsciiConstellation`), not the canvas itself, so the hit area covers the whole band even when the canvas is `pointer-events: none`. Don't change to `canvas.addEventListener` without re-checking the bounds.
- **`AsciiFrameAnimator` re-renders the `<pre>` with a `key={renderFrame}`** so each frame remounts (cheap, no diffing). Trigger modes: `hover` (focusable), `inView` (uses `useInView`), `always` (loops forever), `click` (focusable, latches on, exposes `aria-label` / `aria-pressed`, supports Enter/Space). Optional `idleFrame` shows a static frame when not playing; optional `speechBubble` + `speechBubbleWhen` (`'idle'` default / `'playing'` / `'always'` / `'never'`) renders an ASCII bubble above the frame. `speechBubble` is a string used in both states, or an object `{ idle, playing }` for different text per state (keeps the wrapper height stable across `speechBubbleWhen` modes). Frames are passed as already-joined strings.
- **There is no `Button` component.** Inline `>` links go through `Link` (Tailwind utilities, polymorphic `<a>`), bracketed links go through `Keycap` (`[label]`, variants `primary` bold lime / `secondary` slate muted, polymorphic `<a>`/`<button>`). New variants belong in the file's own `STYLES`/`VARIANTS` const, not as a CSS-module class.
- **Project data lives in `data/projects.js`** (per the rule "data/*.js is plain JS, no JSX"). The older `sections/Projects/projects.data.js` path in some architecture diagrams is stale — the canonical location is `data/projects.js`.
- **Decorative stickman frames live in `data/stickmans.js`** — individual `STICKMAN_*` exports (T-pose, dash, walk, jump, strike, etc.) plus a `STICKMANS` array of all of them. Use as raw ASCII in `<AsciiBlock tone="ink-soft">` (see Hero / Projects / About / Contact). Not used by any animator. Unused exports (`STICKMAN_CURL_LEFT`, `STICKMAN_CHEER`, `STICKMAN_KICK`, `STICKMAN_DASH`, `STICKMAN_JUMP`, `STICKMAN_STRIKE`) are still imported by some files — safe to prune if you confirm.
- **`PULSE_FRAMES` in `data/animations.js` is currently unused** — defined and exported, no consumer yet. Safe to consume or delete.
- **Custom scrollbar is in `base.css`** — lime thumb on dark surface, hard-edged (`border-radius: 0`) with a 1px hairline, 16px wide. Both `::-webkit-scrollbar` and the `scrollbar-color` / `scrollbar-width` Firefox properties are set. The reduced-motion media query does NOT touch it.
- **Anchored scroll offset has two pieces.** `html { scroll-padding-top: var(--nav-height); }` in `base.css` (in-page anchor jumps) plus `Section` adds `scroll-mt-[var(--nav-height)]` (so any margin-collapsing layout still clears the sticky nav). Don't remove either.

---

## Project: Portfolio (Matrix Terminal Aesthetic)

### Purpose
Personal portfolio to showcase projects. Single page, scroll-based, organized as editorial bands. Optimized for desktop, graceful on mobile.

### Visual Concept
Ghost design system (see `ghost.design.md`) inverted to a **dark theme** and reframed as a **terminal / Matrix experience**:
- **No raster images in the UI.** Every visual is ASCII art, monospaced text, or canvas geometry. Project previews are ASCII mockups (not screenshots).
- **Terminal chrome.** Headlines feel like `cat`-ed logs, eyebrows look like shell prompts (`$> …`), bracketed links look like `[keycap]`s, sections look like `--section` flags.
- **Hero background = ASCII constellation** — mouse-reactive canvas of `'0'`/`'1'` glyphs linked by faint lines, twinkle bursts, mouse-radius attractor. The crosshair `@` marker now lives in a separate `AsciiCursor` overlay, not drawn into the canvas.
- **Matrix rain reappears as masked band dividers** between Projects↔About and About↔Contact (`<BandDivider intensity="subtle" label="-- section --break" />`).
- **Blinking caret** on the active headline, at the end of the terminal panel in `About`, and on every interactive element on focus.
- **Typewriter reveal** on hero copy and section headings (scroll-triggered via `useInView`, fires **once** per heading — latched, doesn't re-run if the user scrolls back).
- **Animated ASCII critters** via `AsciiFrameAnimator`:
  - sleeping bear in `About` (`BEAR_SLEEPING_FRAMES`, `trigger="inView"`)
  - blinking cat in `Hero` (`CAT_HERO_FRAMES`, `trigger="inView"`)
  - click-to-anger bunny in `Contact` (`BUNNY_IDLE` + `BUNNY_ANGRY_FRAMES`, `trigger="click"`, speech bubble on both states via `speechBubbleWhen="always"`)
  - always-animating cat drinking coffee in the `Footer` signoff (`CAT_COFFEE_FRAMES`, `trigger="always"`).

### Design Tokens (dark theme, derived from `ghost.design.md`)

| Role | Token | Hex | Notes |
|---|---|---|---|
| Canvas (page floor) | `--color-canvas` | `#0a0a0a` | inverted from `#ffffff` |
| Surface (between bands) | `--color-surface-soft` | `#0d0d0d` | used by Projects + Contact tones |
| Surface (cards) | `--color-surface` | `#111111` | was `ink-base` band, now everywhere |
| Surface raised | `--color-surface-raised` | `#1a1a1a` | new tier, for hovered/focused cards |
| Border hairline | `--color-hairline` | `#1f2937` | was `hairline-dark` |
| Border soft | `--color-hairline-soft` | `#374151` | between dark and light tiers |
| Ink primary (text) | `--color-ink` | `#d1ff19` | **the lime** — repurposed as primary text on dark |
| Ink secondary | `--color-ink-soft` | `#a3e635` | lime-400 step |
| Ink muted | `--color-ink-mute` | `#84cc16` | lime-500 step |
| Text on dark | `--color-text` | `#e5e7eb` | slate-200 |
| Text muted on dark | `--color-text-mute` | `#9ca3af` | slate-400 |
| CTA fill (keycap primary) | `--color-cta-bg` | `#d1ff19` | lime, used on keycap primary only |
| CTA text | `--color-cta-text` | `#0a0a0a` | canvas black |
| Danger / accent | `--color-accent` | `#f87171` | red-400, reserved for destructive or "live" indicators |

**Rationale for the inversion:** Ghost puts lime in the eyebrow and near-black in the CTA. On a dark canvas, that collapses — near-black on near-black is invisible. So the lime moves to the primary text tier (headings, terminal prompt) and the CTA inverts to lime-on-black. Eyebrow tier becomes a dimmer lime-soft `#a3e635` so the hierarchy still reads.

### Typography
- **Mono everywhere.** One family: `JetBrains Mono` (self-hosted via `@fontsource/jetbrains-mono` — 400 + 700), with `ui-monospace, Menlo, monospace` as fallback. No FOUT.
- **Size scale (defined as CSS custom properties, referenced by name):**
  - `--text-display-xl` 72px / 700 / -2px (hero)
  - `--text-display-lg` 36px / 700 / -1px (section headings)
  - `--text-display-md` 24px / 700 / -0.5px (project titles)
  - `--text-body-lg` 18px / 400 (lede)
  - `--text-body-md` 15px / 400
  - `--text-caption` 13px / 400
  - `--text-eyebrow` 11px / 700 / 1.2px / uppercase (shell-prompt style: `$> projects`)
- **Hierarchy via color, not size:** since mono metrics are uniform, distinguish tiers by lime vs. slate vs. dim-lime rather than by huge size jumps.

### Effects

| Effect | Where | How |
|---|---|---|
| Ascii constellation | Hero background, behind headline | `<canvas>` driven by `useAsciiConstellation`. Binary glyph set (`'0'`/`'1'`), per-node drift + twinkle bursts, link lines between nearby nodes, mouse-radius attractor with soft halo. Pauses on `prefers-reduced-motion`. Wrapper has `data-ascii-cursor-ignore` so the `AsciiCursor` doesn't hide on top of it. |
| Ascii cursor | Top-level overlay | `useAsciiCursor` listens on `window` and renders a single fixed `<span>` glyph that swaps `@` (default) / `◆` (interactive) / `┃` (text input) and grows on `pointerdown`. Sets `data-ascii-cursor` on `<html>` so the native cursor is hidden. |
| Matrix rain | Band dividers between sections | `<canvas>` driven by `useMatrixRain` with the `subtle` profile (`headAlpha: 0.1`, `speed: 0.3`, `density: 0.5`), masked by `/band-divider-mask.svg` so the rain fades at the edges. Includes rare multi-char strings (e.g. `( ͡° ͜ʖ ͡°)`, `¯\_(ツ)_/¯`, `TOGU ESTUVO AQUI`). |
| Blinking caret | Hero headline, About terminal tail, focus rings | CSS `@keyframes caret-blink` on `Caret.module.css` (1ch wide block, `step-end`, 1.06s). `prefers-reduced-motion` → static opaque caret. The `done` prop on `Caret` adds a `.done` class that sets `visibility: hidden` and `animation: none`. |
| Typewriter | Hero h1, section h2s | `<Typewriter>` self-cables `useInView` on its own `<span>` and latches an `armed` flag, then passes it to `useTypewriter(text, { speed, startDelay, start })`. Renders progressively, appends a caret that stops blinking when done. Honors reduced motion by jumping to final state (still waits for inView). Threshold/rootMargin overridable via props. |
| ASCII art (static) | Project cards, About terminal body, decorative stickmans | `AsciiBlock` renders a `<pre>` with `ink` / `ink-soft` / `ink-mute` tones. |
| ASCII art (animated) | About bear, Hero cat, Contact bunny, Footer cat | `AsciiFrameAnimator` with `trigger="inView"` / `"hover"` / `"click"` / `"always"`. Frame set is `frames` (array of pre-joined strings), `fps` controls cadence. |
| Bracketed keycaps | Inline project + contact + hero CTA links | `Keycap` renders `[label]`. `primary` bold lime, `secondary` muted slate. Polymorphic: `<a>` if `href` else `<button>`. |

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
    base.css                              # reset + body + reduced-motion override + scrollbar + ascii-cursor cursor: none
  components/
    layout/
      Shell.jsx                           # outermost wrapper, sets bg + column flex
      Nav.jsx + Nav.module.css            # sticky top nav (brand + section anchors)
      Footer.jsx + Footer.module.css      # colophon + social links + cat signoff
      Section.jsx                         # editorial band wrapper; props: id, tone ('dark'|'soft'|'surface'), wide, ...rest
      BandDivider.jsx + BandDivider.module.css  # masked matrix-rain band, optional label
    effects/
      AsciiCursor/                        # global cursor overlay (mounts once at top of <App />)
        AsciiCursor.jsx
        useAsciiCursor.js                 # window pointer listeners, matchMedia guards, mode detection
        AsciiCursor.module.css
      MatrixRain/                         # canvas rain, props for intensity profile
        MatrixRain.jsx
        useMatrixRain.js                  # animation loop, DPR + ResizeObserver
        chars.js                          # KATAKANA + LATIN + DIGITS + SYMBOLS + rare strings
        MatrixRain.module.css
      AsciiConstellation/                 # hero background, mouse-reactive
        AsciiConstellation.jsx            # layer with data-ascii-cursor-ignore
        useAsciiConstellation.js          # nodes, links, mouse attractor
        AsciiConstellation.module.css
      AsciiFrameAnimator/                 # frame-based ASCII animator
        AsciiFrameAnimator.jsx            # trigger: 'hover' | 'inView' | 'always' | 'click'
        useFrameAnimator.js               # setInterval driver, reduced-motion safe
        AsciiFrameAnimator.module.css
      AsciiBlock.jsx + AsciiBlock.module.css    # static <pre> with tone
      Caret.jsx + Caret.module.css        # blinking block caret (accepts `done` prop)
      Typewriter/
        Typewriter.jsx
        useTypewriter.js
    sections/
      Hero/Hero.jsx + Hero.module.css             # constellation + typewriter h1 + CTA keycap + blinking cat
      Projects/Projects.jsx + Projects.module.css
        ProjectCard.jsx + ProjectCard.module.css
      About/About.jsx + About.module.css
        AboutTerminal.jsx + AboutTerminal.module.css  # macOS-style frame + bear + caret
      Contact/Contact.jsx                          # mailto + github/linkedin keycaps; clickable bunny top-right
    ui/
      Eyebrow.jsx                         # shell-prompt label ($> …)
      Heading.jsx                         # h1/h2/h3 with optional typewriter
      Link.jsx                            # inline > link (Tailwind utilities, polymorphic <a>)
      Tag.jsx                             # tech-stack chip
      Keycap.jsx + Keycap.module.css      # [label] bracketed link/button
      CommandList.jsx + CommandList.module.css  # flex row with leading > prompt
  data/
    projects.js                           # project list (id, title, description, stack, url, repo, status)
    ascii.js                              # PROJECT_ASCII, ABOUT_OUTPUT
    animals.js                            # ts-animal (MIT) frames: bear/bunny/cat + BUNNY_IDLE/SPEECH + CAT_HERO_FRAMES
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
- All section components accept an `id` prop and render a `<Section id={id} tone="...">` wrapper so the layout/rhythm is centralized. `Section` also forwards `...rest` onto the underlying `<section>` (useful for `data-*` attributes, `aria-*`, etc.).
- Components that should keep the native cursor on top of the `AsciiCursor` (e.g. the constellation) get `data-ascii-cursor-ignore=""` on a wrapper.

### Band Rhythm (mirrors Ghost's editorial spread pattern)

| # | Section | Tone | Background | Notes |
|---|---|---|---|---|
| 1 | Hero | dark | canvas | `<AsciiConstellation>` behind, typewriter h1, eyebrow `$> portfolio --init`, blinking cat top-right, `Keycap` CTA "view-projects" |
| 2 | Projects | soft | surface-soft | 1/2-col grid, every card uses `AsciiBlock` (static `PROJECT_ASCII`); decorative `STICKMAN_CLASH` next to the eyebrow |
| — | BandDivider | canvas | canvas | Masked MatrixRain, label `-- section --break` |
| 3 | About | dark | canvas | Eyebrow `cat about.txt`, terminal panel with bear + blinking caret, decorative `STICKMAN_LEAN` |
| — | BandDivider | canvas | canvas | Masked MatrixRain, label `-- section --break` |
| 4 | Contact | soft | surface-soft | Mailto + GitHub/LinkedIn as `Keycap` inside `CommandList`; clickable angry bunny top-right; decorative `STICKMAN_CURL_RIGHT` |
| Footer | colophon | canvas | canvas | Build line, deploy date, ts-animal attribution, cat-coffee signoff |

Each band is flush-edged (no gradients between them). The hero has a `::after` linear-gradient fade to `--color-surface-soft` so the constellation no longer leaks into the Projects band; the canvas itself is also `mask-image`-clipped to fade at 75% height.

### Content Model (`src/data/projects.js`)

```js
{
  id: 'string',
  title: 'string',
  stack: ['react', 'vite'], // for <Tag> chips
  description: 'string',    // 1-2 sentence lede
  url: 'https://...',       // optional live link → renders a primary <Keycap>tour</Keycap>
  repo: 'https://...',      // optional repo link → renders a secondary <Keycap>source</Keycap>
  status: 'live' | 'wip' | 'archived'   // drives the badge tone/label only; all cards render the static PROJECT_ASCII block
}
```
There is no per-project `ascii` field; the shared `PROJECT_ASCII` from `data/ascii.js` is used everywhere.

### Accessibility & Motion
- Respect `prefers-reduced-motion: reduce`: kill constellation, kill matrix rain, kill frame animator (render first frame statically), kill typewriter (jump to final state), kill caret blink (static caret), kill `AsciiCursor` (no overlay mounted, native cursor stays). Global `scroll-behavior` also goes to `auto`.
- All interactive elements are real `<a>`/`<button>`. Decorative ASCII wrapped in `aria-hidden="true"`.
- Color contrast: lime `#d1ff19` on canvas `#0a0a0a` ≈ 15.8:1 (AAA). Slate-200 on canvas ≈ 14:1.
- Focus rings: 2px solid lime, `outline-offset: 2px` (global in `base.css`). The `AsciiFrameAnimator` `hover` and `click` triggers expose a `focus-visible` outline so keyboard users get the same affordance.
- `AsciiConstellation` is `pointer-events: none` on the canvas layer so it never blocks clicks on the hero content.
- The `AsciiCursor` is itself a no-mouse affordance (it replaces the cursor glyph) and is opt-out via `data-ascii-cursor-ignore` — keyboard / `prefers-reduced-motion` users never see it.

### Out of Scope (for v1)
- No routing (single page).
- No CMS / data fetching (projects are static in `data/`).
- No i18n.
- No analytics.
- No blog, no contact form backend (mailto: only).
- No tests (per stack gotcha).
- No light theme (the dark/terminal aesthetic is the point).
- No raster imagery (the canvas effects are the only "graphics"; the leftover PNGs/SVGs in `src/assets/` and `public/icons.svg` are not referenced by any component and can be deleted).
