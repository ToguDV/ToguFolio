# AGENTS.md

## Stack
- Vite 8 + React 19, ESM (`"type": "module"`).
- React plugin: `@vitejs/plugin-react` (Oxc-based, not SWC).
- Linter: `oxlint` with `react` + `oxc` plugins (`.oxlintrc.json`).
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
- Single component: `src/App.jsx` (default export).
- Styles: `src/index.css` (global entry — starts with `@import "tailwindcss";` and will aggregate `src/styles/tokens.css` + `src/styles/fonts.css` + `src/styles/base.css` per the project spec below), `src/App.css`.
- Tailwind v4 is wired: `@tailwindcss/vite` registered in `vite.config.js`, `@import "tailwindcss";` at the top of `src/index.css`. Use Tailwind utilities for layout/sizing/spacing. **Don't** use Tailwind color utilities — every color must reference the CSS custom properties in `src/styles/tokens.css` (e.g. `text-[var(--color-ink)]`, `bg-[var(--color-canvas)]`) so the dark theme stays single-sourced.
- Static assets served from `public/` (`favicon.svg`, `icons.svg`); bundled images in `src/assets/`.
- App.jsx references SVG icons via `<use href="/icons.svg#id">` — IDs (`documentation-icon`, `social-icon`, `github-icon`, `discord-icon`, `x-icon`, `bluesky-icon`) must exist in `public/icons.svg`.

## Gotchas
- **React Compiler is intentionally disabled** (per README) for dev/build perf. Don't add `babel-plugin-react-compiler` without discussion.
- **Linter is oxlint, not ESLint.** No autofix configured; rules enforced are only `react/rules-of-hooks` (error) and `react/only-export-components` (warn, with `allowConstantExport: true`).
- **No test runner.** Adding tests requires choosing and installing one (e.g. vitest); none is set up.

---

## Project: Portfolio (Matrix Terminal Aesthetic)

### Purpose
Personal portfolio to showcase projects. Single page, scroll-based, organized as editorial bands. Optimized for desktop, graceful on mobile.

### Visual Concept
Ghost design system (see `ghost.design.md`) inverted to a **dark theme** and reframed as a **terminal / Matrix experience**:
- **No raster images.** Every visual is ASCII art, monospaced text, or CSS geometry. Project previews are rendered as ASCII mockups, not screenshots.
- **Terminal chrome.** Headlines feel like `cat`-ed logs, eyebrows look like shell prompts, buttons look like `> RUN` commands, sections look like `--section` flags.
- **Matrix rain** in the background of selected bands (Hero, Hero CTA area). Subtle, low opacity, slow — not the 1999 screensaver. Optional fade with scroll.
- **Blinking caret** on the active headline and on every interactive element on focus.
- **Typewriter reveal** on hero copy and section headings (one-shot on mount, not loop).

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
| CTA fill (primary button) | `--color-cta-bg` | `#d1ff19` | lime, used on CTA only — inverts Ghost convention since dark canvas already uses lime as text |
| CTA text | `--color-cta-text` | `#0a0a0a` | canvas black |
| Danger / accent | `--color-accent` | `#f87171` | red-400, reserved for destructive or "live" indicators |

**Rationale for the inversion:** Ghost puts lime in the eyebrow and near-black in the CTA. On a dark canvas, that collapses — near-black on near-black is invisible. So the lime moves to the primary text tier (headings, terminal prompt) and the CTA inverts to lime-on-black. Eyebrow tier becomes a dimmer lime-soft `#a3e635` so the hierarchy still reads.

### Typography
- **Mono everywhere.** Drop the InterDisplay/InterVariable split. One family: `JetBrains Mono` (or `Fira Code`) as primary, `ui-monospace, Menlo, monospace` as fallback. Self-hosted via `@fontsource/jetbrains-mono` to avoid the FOUT.
- **Size scale (kept from Ghost, retuned for mono):**
  - `display-xl` 72px / 700 / -2px (hero — reduced from 96px because mono is wider)
  - `display-lg` 36px / 700 / -1px (section headings)
  - `display-md` 24px / 700 / -0.5px
  - `body-lg` 18px / 400 (lede)
  - `body-md` 15px / 400
  - `caption` 13px / 400
  - `eyebrow` 11px / 700 / 1.2px / uppercase (shell-prompt style: `$> projects`)
- **Hierarchy via color, not size:** since mono metrics are uniform, distinguish tiers by lime vs. slate vs. dim-lime rather than by huge size jumps.

### Effects

| Effect | Where | How |
|---|---|---|
| Matrix rain | Hero background, behind headline | `<canvas>` driven by a `useMatrixRain` hook. Renders columns of falling chars (Katakana half-width + Latin + digits) at ~30fps, opacity 0.15, head character bright lime, tail fading to canvas color. Pauses on `prefers-reduced-motion`. |
| Blinking caret | Hero headline, focus rings on links/buttons | CSS `@keyframes blink` on a `::after` pseudo-element (1ch wide block). Step-end timing, 1.06s period. |
| Typewriter | Hero h1, section h2s | `useTypewriter(text, { speed: 35, startDelay: 200 })` hook. Renders progressively, appends a caret that stops blinking when done. |
| ASCII art | Hero, project cards | Static `<pre>` blocks with monospaced string art. No images, no SVGs. Bundled as TS string literals in `src/data/ascii.js`. |
| Glitch-on-hover | Section h2s on hover | 1-frame CSS `transform: translateX(2px)` + color jitter. Cheap, no animation lib. |
| Scanline overlay | Optional global layer | Repeating linear gradient, `mix-blend-mode: overlay`, opacity 0.03. Toggleable via `data-effect="scanlines"` on `<body>`. |

### Component Architecture (single-responsibility, one file per component)

```
src/
  main.jsx                          # entry, mounts <App />
  App.jsx                           # composition root, no markup
  styles/
    tokens.css                      # CSS custom properties (colors, spacing, radii)
    fonts.css                       # @font-face declarations
    base.css                        # reset + body defaults
  components/
    layout/
      Shell.jsx                      # outermost wrapper, sets bg + scanlines
      Nav.jsx                        # top nav (logo + section links)
      Footer.jsx                     # colophon + social links
      Section.jsx                    # editorial band wrapper, props: id, tone
    effects/
      MatrixRain/
        MatrixRain.jsx               # <canvas> background
        useMatrixRain.js             # animation loop hook
        chars.js                     # char set + helpers
      Typewriter/
        Typewriter.jsx               # renders text char-by-char
        useTypewriter.js             # timing hook
      Caret.jsx                     # blinking block caret
      AsciiBlock.jsx                # renders <pre> with optional color
      Scanlines.jsx                 # global overlay
    sections/
      Hero/
        Hero.jsx                     # composes headline + lede + ascii + rain
        HeroAscii.jsx                # the big ASCII art piece
      Projects/
        Projects.jsx                 # section header + grid
        ProjectCard.jsx              # one project (ascii preview + meta)
        projects.data.js             # array of project objects
      About/
        About.jsx
        AboutTerminal.jsx            # faux-interactive cat/uname output
      Contact/
        Contact.jsx
    ui/
      Eyebrow.jsx                   # shell-prompt label
      Heading.jsx                   # h1/h2 with lime + caret
      Button.jsx                    # primary CTA (lime fill, monospace)
      Link.jsx                      # inline `> link` style
      Tag.jsx                       # tech-stack tag chip
  data/
    projects.js                     # project list (id, title, ascii, stack, url, repo)
    ascii.js                        # ascii art strings (hero, dividers, logos)
  hooks/
    usePrefersReducedMotion.js      # shared
    useInView.js                    # IntersectionObserver wrapper
  index.css                         # @tailwind (when wired) + global imports
```

**Rules:**
- No file exports more than one React component. Co-locate the component's own CSS module (`Hero.module.css`) next to it.
- `data/*.js` is plain JS, no JSX. Components import data; data never imports components.
- Hooks live next to the component that owns them, OR in `src/hooks/` if shared by 2+.
- `App.jsx` is a flat composition list of sections — no business logic.
- All section components accept an `id` prop and render a `<Section id={id} tone="...">` wrapper so the layout/rhythm is centralized.

### Band Rhythm (mirrors Ghost's editorial spread pattern)

| # | Section | Tone | Background |
|---|---|---|---|
| 1 | Hero | dark + rain | canvas |
| 2 | Projects | surface | surface |
| 3 | About | dark + scanlines | canvas |
| 4 | Contact | surface | surface |
| Footer | colophon | dark | canvas |

Each band is flush-edged (no gradients between them). `Section` component handles the `padding: 72px 24px` per Ghost spec, retuned to mono-friendly 64px.

### Content Model (projects.data.js shape)

```js
{
  id: 'string',
  title: 'string',
  ascii: 'string',          // multi-line ASCII art
  stack: ['react', 'vite'], // for <Tag> chips
  description: 'string',    // 1-2 sentence lede
  url: 'https://...',       // optional live link
  repo: 'https://...',      // optional repo link
  status: 'live' | 'wip' | 'archived'
}
```

### Accessibility & Motion
- Respect `prefers-reduced-motion: reduce`: kill rain, kill typewriter (render final state immediately), kill caret blink (static caret).
- All interactive elements are real `<a>`/`<button>`. ASCII art is decorative — wrapped in `aria-hidden="true"` when adjacent to semantic text.
- Color contrast: lime `#d1ff19` on canvas `#0a0a0a` ≈ 15.8:1 (AAA). Slate-200 on canvas ≈ 14:1. Safe.
- Focus rings: 2px solid lime, `outline-offset: 2px`. Never remove outline.

### Out of Scope (for v1)
- No routing (single page).
- No CMS / data fetching (projects are static in `data/`).
- No i18n.
- No analytics.
- No blog, no contact form backend (mailto: only).
- No tests (per stack gotcha).

### Implementation Order (when we start coding)
1. ~~Wire Tailwind v4 in `vite.config.js` + `src/index.css` (decided: wire it, not remove).~~ ✅
2. ~~Add `@fontsource/jetbrains-mono` (decided).~~ ✅
3. ~~`styles/tokens.css` + `styles/base.css`.~~ ✅
4. ~~`components/effects/Caret.jsx` + `Typewriter.jsx` (simplest, sets the visual language).~~ ✅
5. ~~`components/layout/Section.jsx` + `Shell.jsx`.~~ ✅
6. `components/sections/Hero/` with ASCII art + MatrixRain.
7. Remaining sections.
8. Wire `Nav.jsx` smooth-scroll to section ids.
9. Verify with `npm run lint` and `npm run build`.

### Progress

**Done (steps 1-5):**

- ✅ Step 1: Tailwind v4 wired in `vite.config.js` + `src/index.css` (was already wired in the Vite template).
- ✅ Step 2: Added `@fontsource/jetbrains-mono` — only weights 400 + 700 are imported (the only ones the size scale uses).
- ✅ Step 3: `src/styles/tokens.css` (all custom properties from the design tokens table) + `src/styles/base.css` (reset, body defaults, focus rings, global `prefers-reduced-motion` reset). Plus `src/styles/fonts.css` as a thin wrapper that imports the two fontsource weights.
- ✅ Step 4: `src/components/effects/Caret.jsx` + `src/components/effects/Typewriter/Typewriter.jsx` + co-located `useTypewriter.js`.
- ✅ Step 5: `src/components/layout/Section.jsx` + `src/components/layout/Shell.jsx`.

**Files added/changed in this batch (step 5):**

- `src/components/layout/Section.jsx` — editorial band wrapper. Props: `id`, `tone` (`'dark'` | `'surface'`, default `'dark'`), `children`, `className`. Renders `<section>` with tone-mapped background + `py-[var(--section-padding-y)]`, and an inner `<div>` with `mx-auto max-w-3xl px-[var(--section-padding-x)]` so the column is centralized.
- `src/components/layout/Shell.jsx` — outermost wrapper. Renders a `<div className="flex min-h-screen flex-col bg-[var(--color-canvas)] text-[var(--color-text)]">`. Accepts `className` for escape hatches. Scanlines effect deliberately omitted (lives in `components/effects/Scanlines.jsx`, future step).
- `src/App.jsx` — composition is now `<Shell><Section id="hero" tone="dark">…</Section><Section id="band" tone="surface">…</Section></Shell>`. The dark band keeps the prior typewriter demo; the surface band is a one-line proof of the band-rhythm flush-edge.

**Deviations / decisions:**

- `Section`'s inner column width is `max-w-3xl` (768px) to match the existing demo column. Wider bands can override via `className="max-w-5xl"` etc. — not tokenized because no other band asks for a different width yet.
- `TONES` lives as a module-level const inside `Section.jsx`. Allowed under `react/only-export-components` since `allowConstantExport: true` is set in `.oxlintrc.json`.
- `Shell`'s `flex min-h-screen flex-col` is forward-looking for `Nav` / `Footer` siblings (steps 8+) — `Nav` will sit at the top and `Footer` at the bottom of the column with the page bands in between.
- The class-join idiom `[…].filter(Boolean).join(' ')` is used in both components for predictable `className` overrides (user-supplied class always wins via source order).
- `npm run lint` and `npm run build` both pass clean at this point.

**Not yet done:** steps 6-9 (Hero with ASCII + MatrixRain, remaining sections, Nav wiring, final verify).
