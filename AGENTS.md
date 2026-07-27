# AGENTS.md

## Stack
- Vite 8 + React 19, ESM (`"type": "module"`).
- `@vitejs/plugin-react` (Oxc-based, not SWC).
- Linter is `oxlint` (`.oxlintrc.json`): only `react/rules-of-hooks` (error) + `react/only-export-components` (warn, `allowConstantExport: true`). No autofix.
- Tailwind v4 via `@tailwindcss/vite`; `@import 'tailwindcss';` at the top of `src/index.css`.
- No tests, no formatter, no typecheck, no CI, no pre-commit hooks.

## Commands
- `npm run dev` / `build` / `lint` / `preview` — standard Vite + `oxlint`.
- `npm install` is the only setup step. Lockfile is `package-lock.json` — use `npm`, not pnpm/yarn.

## Commits
- One line, imperative mood, no body unless asked. No emojis, no trailers. Examples: `fix: show hero cat on mobile`, `chore: bump deps`.

## Layout (where to look)
- Entry: `index.html` → `/src/main.jsx` mounts `<App />` into `#root` with `StrictMode`.
- Composition root: `src/App.jsx` — flat list, no business logic. Order: `<Shell><Nav/><main><Hero/><Projects/><BandDivider/><About/><BandDivider/><Contact/></main><Footer/></Shell>`.
- Section bands render through `components/layout/Section.jsx` (`tone="dark"|"soft"|"surface"`, `wide`, `...rest`); always pass an `id`.
- Band dividers render through `components/layout/BandDivider.jsx` (`tone="light"|"dark"`, `label`, `intensity`). They have a gradient overlay for smooth transitions: `light` uses `--color-surface-soft` (darker at top, fading down), `dark` uses `--color-surface-soft` (darker at bottom, fading up).
- Styles: `src/index.css` aggregates `@tailwindcss` + `styles/tokens.css` + `styles/fonts.css` + `styles/base.css`. Per-component CSS modules are co-located next to the component.
- Design tokens: see `design.md` for the full color palette (Catppuccin Mocha), typography, spacing, and component specs.

## Conventions
- One React component per file, with its own CSS module next to it. `data/*.js` is plain JS (no JSX).
- Project list lives in `data/projects.js` (the older `sections/Projects/projects.data.js` path is stale).
- Inline `>` links → `Link` (Tailwind utilities, polymorphic `<a>`). Bracketed links → `Keycap` (`[label]`, variants `primary` mauve / `secondary` slate, polymorphic `<a>`/`<button>`). There is no `Button` component — new variants go in the file's own `STYLES`/`VARIANTS` const, not a CSS-module class.
- Tailwind utilities are fine for layout/sizing/spacing, but **never** for colors. Every color references the CSS custom properties in `src/styles/tokens.css` (e.g. `text-[var(--color-ink)]`, `bg-[var(--color-canvas)]`) so the dark theme stays single-sourced.
- Decorative ASCII (stickmen, art) goes through `<AsciiBlock tone="ink|ink-soft|ink-mute">` with `aria-hidden="true"`.

## Gotchas
- **React Compiler is intentionally disabled** (per `README.md`) for dev/build perf. Do not add `babel-plugin-react-compiler` without discussion.
- **Reduced motion is non-negotiable.** All canvas/JS effects (`useMatrixRain`, `useAsciiConstellation`, `useFrameAnimator`) hard-bail on `(prefers-reduced-motion: reduce)`. The global override in `styles/base.css` kills CSS animations + transitions. The static visual still renders; only motion is removed.
- **Three animation systems coexist — keep them separate:**
  1. `useEffect`-driven canvas effects (DPR + `ResizeObserver`, reduced-motion bail).
  2. CSS `@keyframes` caret blink in `Caret.module.css` (1ch block, `step-end`, 1.06s). `Caret` accepts a `done` prop that hides it and kills the animation.
  3. CSS transitions in `AsciiFrameAnimator.module.css` (wrapper height swap, bubble fade).
- **Canvas effects attach mouse / touch listeners to the enclosing `<section>`** (via `findSection(canvas)` in `useAsciiConstellation`), not the canvas itself, so the hit area covers the whole band even when the canvas is `pointer-events: none`. Don't change to `canvas.addEventListener` without re-checking the bounds.
- **`AsciiFrameAnimator` re-renders the `<pre>` with a `key={renderFrame}`** so each frame remounts (cheap, no diffing). Trigger modes: `hover` (focusable), `inView` (uses `useInView`), `always` (loops forever), `click` (focusable, latches on, exposes `aria-label` / `aria-pressed`, supports Enter/Space, fires `onClick` after latching). Optional `idleFrame` shows a static frame when not playing; `speechBubble` + `speechBubbleWhen` (`'idle'` default / `'playing'` / `'always'` / `'never'`) renders an ASCII bubble above the frame. `speechBubble` is a string used in both states, or an object `{ idle, playing }` for different text per state (keeps wrapper height stable across modes). Frames are passed as already-joined strings.
- **Anchored scroll offset has two pieces.** `html { scroll-padding-top: var(--nav-height); }` in `base.css` (in-page anchor jumps) plus `Section` adds `scroll-mt-[var(--nav-height)]` (so any margin-collapsing layout still clears the sticky nav). Don't remove either.
- **Custom scrollbar is in `base.css`** — mauve thumb on dark surface, hard-edged (`border-radius: 0`) with a 1px hairline, 16px wide. Both `::-webkit-scrollbar` and `scrollbar-color` / `scrollbar-width` Firefox properties are set. The reduced-motion media query does not touch it.
- **Dead exports** (safe to prune if you confirm): `PULSE_FRAMES` in `data/animations.js`; `STICKMAN_CHEER`, `STICKMAN_KICK`, `STICKMAN_DASH`, `STICKMAN_JUMP`, `STICKMAN_STRIKE` in `data/stickmans.js`; `STICKMAN_CURL_LEFT` and `STICKMAN_WALK` are imported by `Contact.jsx` but not used in its JSX.
- **Static leftover assets** (`public/icons.svg`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`) are not referenced by any component — safe to delete.
- **Audio lives in `src/assets/sounds/`** and is imported as a module (`import meow from '../../../assets/sounds/meow.mp3'`). There are two coexisting patterns — pick by lifetime: a module-level `const audio = new Audio(src)` for sounds that survive across remounts (see `Contact.jsx` bunny click), or `useRef` populated inside `useEffect` with cleanup when the owning component can unmount (see `AboutTerminal.jsx`). Always `.play().catch(() => {})` to swallow autoplay rejections.
- **Section vs BandDivider:** These are two different components with different purposes. `Section` wraps content bands (Hero, Projects, About, Contact). `BandDivider` is the decorative separator between sections with MatrixRain and gradient overlays. The BandDivider was incorrectly edited instead of Section when adding gradient transitions — a reminder to verify the correct file before editing.

## Accessibility
- All interactive elements are real `<a>` / `<button>`. Focus rings: 2px solid mauve, `outline-offset: 2px` (global in `base.css`). `AsciiFrameAnimator` `hover` and `click` triggers expose a `focus-visible` outline so keyboard users get the same affordance.
- `AsciiConstellation` is `pointer-events: none` on the canvas layer so it never blocks clicks on the hero content.
