---
version: alpha
name: "Ghost"
website: "https://ghost.org"
description: >-
  An open-source publishing platform whose marketing site pairs a near-black ink hero on warm white with a 12px uppercase electric-lime eyebrow label — the only chromatic move above the fold. The hero h1 sits at 96px InterDisplay weight 700 with -2.4px tracking in a deep teal-ink that reads as black against the page, paired with a 24px InterDisplay body lede. Below the fold the page flips to a near-black dark surface that carries the product-dashboard screenshot, then returns to a white editorial band, then a dark olive section. The brand voltage is the lime #d1ff19, scoped tightly to eyebrows and a single H2 accent rather than to CTAs; the primary button is a near-black pill on white, the inverse of the convention.

seo:
  title: "Ghost Design System for React — lime eyebrow, InterDisplay, 14 components"
  metaDescription: "Ghost's marketing site as a DESIGN.md file. Electric-lime eyebrow accent, 96px InterDisplay hero, near-black primary button, 14 colors, 14 components. For React, Next.js, and AI tools."
  highlights:
    - "Lime eyebrow as voltage — electric chartreuse appears 8 times across the page, all on 12px uppercase tracked H2 labels above section headers, never on a CTA"
    - "96px InterDisplay hero — weight 700 with -2.4px tracking on the headline, rendered in a near-black teal ink rather than pure black"
    - "Near-black primary button — the CTA fills with the dark base tone rather than the brand lime, inverting the publishing-tools convention where Substack and Beehiiv reach for color"
    - "Two Inter cuts — InterDisplay carries headings and the 24px lede, InterVariable carries 15px nav and body, with Georgia held in reserve as the serif fallback"
    - "Alternating light-dark editorial bands — the page rhythm flips between warm white and the dark base across five distinct horizontal sections"
  tags:
    - "News & Publishing"
    - "Productivity & SaaS"
  lastUpdated: "2026-05-19"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Ghost's marketing site does something almost no publishing platform attempts: it reaches for an electric chartreuse — not a calm slate or a magazine red — as the only chromatic note above the fold, then keeps that lime entirely off the CTA. The hero h1 ("Turn your audience into a business.") sits at 96px InterDisplay weight 700 with tight -2.4px tracking, rendered in a near-black teal ink that reads as charcoal against the warm white canvas. Above the headline floats a 12px uppercase tracked eyebrow in the lime, and a 24px InterDisplay lede sits below in a soft slate. The primary "Get Started — free" pill is the dark base color filled with white text, sized at a deliberate 39px tall with 6px corner-radius. Where Substack reaches for its orange CTA and Beehiiv pairs purple with neon yellow, Ghost holds the voltage in the eyebrow tier and lets the typography carry the entire hero.

    The page is built as an alternating editorial band rhythm. The white hero hands off to a near-black product-dashboard band showing a chart-heavy analytics view, then returns to a white "Complete control" headline section, then drops to a dark olive band with a grid of customer site thumbnails, then closes on a white "Publish by web and email newsletters" section. Each band terminates with a flush horizontal edge — no dividers, no gradients, no atmospheric transitions — so the eye reads the page as a stack of magazine spreads rather than as a SaaS scroll. The dashboard band uses Tailwind slate borders at #e5e7eb (462 captured occurrences) to outline every analytics card; the dark olive band uses an even deeper near-black olive #1a2e05 as its surface tone.

    The DESIGN.md file packages the system into a machine-readable spec for React tooling. Inside: 14 color tokens drawn from the eight Tailwind slate greys that hold the dashboard chrome together, the warm-white canvas, the dark base near-black, the electric lime voltage, and the deep olive band surface; 11 typography tokens spanning InterDisplay from 96px display down to 12px uppercase eyebrow, plus InterVariable at 14-15px for nav and body and a Georgia serif fallback; six radii topped by 24px and a 9999px pill; and 14 component definitions covering the dark pill primary button, the lime eyebrow H2, the dashboard analytics card, the dark olive customer-site tile, and the dark surface band. Feed it to Claude or Cursor and the agent reproduces Ghost's specific moves: warm-white canvas alternating with near-black bands, electric lime held in reserve for the eyebrow tier only, near-black primary button rather than a lime CTA, and a 96px InterDisplay h1 in deep teal-ink rather than pure black.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://ghost.org"
      title: "Ghost — official site"
      description: "Ghost's public marketing site — the source of truth for the live tokens captured in this file."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is Ghost's primary brand color?"
      answer: "Ghost runs an electric chartreuse lime (`--color-lime`) as the page's single chromatic brand moment — but the lime is scoped tightly to the eyebrow tier (the 12px uppercase tracked H2 labels that sit above each section heading). Across the captured page the lime appears 8 times, 7 as text and 1 as background. The primary CTA pill, by contrast, fills with the dark base near-black rather than with the brand lime, inverting the convention used by Substack (orange CTA) and Beehiiv (purple-and-yellow CTA). The remaining brand-layer hexes — a yellow, a pink, a sky blue, a deep blue, a red — appear only inside customer-site thumbnails in the dark olive band, not in the page chrome itself."
    - id: "typography"
      title: "What typeface does Ghost use, and what should I use as a substitute?"
      answer: "Ghost runs two Inter cuts. InterDisplay handles every display surface — the 96px hero h1 at weight 700 with -2.4px tracking, the 48px section heading at weight 700, the 36px sub-display, the 24px body lede, and the 12px uppercase tracked eyebrow H2. InterVariable handles every running text surface — the 15px nav links, the 15px secondary body text, the 14px footnote text. Both faces are free and open-source under the SIL Open Font License, so they transfer cleanly to a self-hosted React project. Georgia is declared as the serif fallback (`--serif: Georgia, serif`) but never appears in the captured render — it sits in the CSS in case the editor theme calls for a serif body. The system mono stack (Menlo, ui-monospace) is similarly reserved."
    - id: "hero-color"
      title: "Why is Ghost's hero headline not pure black?"
      answer: "The hero h1 renders in `#112220` — a deep teal-ink that reads as charcoal against the warm white canvas. The choice is deliberate: pure black at 96px display weight would feel industrial against the warm cream undertone of the page surface, while the teal-ink carries a faint chromatic warmth that ties back to the dark olive `#1a2e05` band lower on the page. The dark base near-black `#15171a` (the `--color-base` token wired into CSS) handles the dashboard band background and the primary button, but never the display headline — that role belongs to the slightly softer teal-ink. Below the hero, the slate-700 `#334155` Tailwind tone carries body running text."
    - id: "dashboard-band"
      title: "Why does Ghost flip between light and dark bands instead of a single canvas?"
      answer: "The page is structured as a stack of editorial spreads rather than as a continuous scroll. The hero is warm-white; the next band is the dark base near-black holding a product-dashboard screenshot; the next is white again with a 48px section headline; the next is the dark olive `#1a2e05` band with a 3-column grid of customer-site thumbnails; the final band returns to white with the email-newsletter section. The light-dark flip lets each band carry its own visual weight — the dashboard chart needs the dark surface to make its lavender data line read, the customer-site thumbnails need the dark olive to mute their varied source colors into a uniform grid, and the white bands carry the editorial typography on its own. There are no atmospheric gradients between bands; each terminates on a flush horizontal edge."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build my own React publishing site?"
      answer: "Yes — feed it to Claude, Cursor, or any AI coding tool that reads structured design tokens. The agent will reproduce Ghost's specific moves: warm-white canvas alternating with near-black dashboard bands and a dark olive customer-site band, electric chartreuse lime scoped to the 12px uppercase eyebrow tier rather than to CTAs, a near-black primary button at 6px radius and 39px height, and a 96px InterDisplay hero in deep teal-ink. You can also reference the tokens directly — every hex, font family, radius, and spacing value is a quoted scalar you can paste into Tailwind config or CSS variables. The one move worth borrowing carefully: the lime eyebrow voltage only reads as confident restraint when the rest of the chrome stays monochrome; adding a second chromatic accent would push the page into a generic-SaaS register."

mockups:
  - "marketing-hero"
  - "dashboard-card-grid"

colors:
  primary: "#d1ff19"
  primary-soft: "#bef264"
  canvas: "#ffffff"
  ink: "#112220"
  ink-base: "#15171a"
  ink-soft: "#334155"
  ink-mute: "#64748b"
  ink-stone: "#94a3b8"
  hairline: "#e5e7eb"
  hairline-soft: "#cbd5e1"
  surface-deep: "#0f172a"
  surface-olive: "#1a2e05"
  hairline-dark: "#1f2937"
  shadow: "#000000"

typography:
  display-xl:
    fontFamily: "\"InterDisplay\", sans-serif"
    fontSize: 96px
    fontWeight: 700
    lineHeight: 96px
    letterSpacing: "-2.4px"
  display-lg:
    fontFamily: "\"InterDisplay\", sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 55.2px
    letterSpacing: "-1.2px"
  display-md:
    fontFamily: "\"InterDisplay\", sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: "-0.9px"
  body-lg:
    fontFamily: "\"InterDisplay\", sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 36px
    letterSpacing: 0
  body-md:
    fontFamily: "\"InterDisplay\", sans-serif"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 30px
    letterSpacing: 0
  heading-sm:
    fontFamily: "\"InterDisplay\", sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0
  eyebrow:
    fontFamily: "\"InterDisplay\", sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 12px
    letterSpacing: "1.2px"
  nav-link:
    fontFamily: "\"InterVariable\", sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 22.5px
    letterSpacing: 0
  body-sm:
    fontFamily: "\"InterVariable\", sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 22.5px
    letterSpacing: 0
  caption:
    fontFamily: "\"InterVariable\", sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: 0
  button-md:
    fontFamily: "\"InterVariable\", sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: 0

rounded:
  none: "0px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "36px"
  3xl: "48px"
  4xl: "72px"

components:
  hero-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "0px"
  eyebrow-h2:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.eyebrow}"
    padding: "0px"
  section-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
  body-paragraph:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.body-lg}"
  body-paragraph-muted:
    backgroundColor: "transparent"
    textColor: "{colors.ink-mute}"
    typography: "{typography.body-sm}"
  button-primary:
    backgroundColor: "{colors.ink-base}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "39px"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.shadow}"
    typography: "{typography.nav-link}"
    padding: "0px 16px"
    height: "72px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.shadow}"
    typography: "{typography.nav-link}"
    padding: "8px 0px"
  dashboard-band:
    backgroundColor: "{colors.ink-base}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "72px 24px"
  dashboard-card:
    backgroundColor: "{colors.ink-base}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "16px"
    borderColor: "{colors.hairline-dark}"
  olive-band:
    backgroundColor: "{colors.surface-olive}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "72px 24px"
  site-tile:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: "0px"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "39px"
    borderColor: "{colors.hairline}"
  card-hairline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.xl}"
    padding: "24px"
    borderColor: "{colors.hairline}"
---

## Overview

Ghost's marketing site argues that an open-source publishing platform can stake a typographic claim without reaching for a chromatic CTA. **Lime as eyebrow.** The single brand voltage — an electric chartreuse — appears 8 times across the captured page, all of them confined to the 12px uppercase tracked H2 labels that sit above each section heading. The primary "Get Started — free" button fills with the dark base near-black `{colors.ink-base}` (#15171a), not with the lime; the CTA inverts the convention that Substack uses for its orange call-to-action and that Beehiiv uses for its purple-and-yellow stack. Where the typical newsletter-platform hero shouts in a saturated brand fill, Ghost holds the chrome monochrome and lets the chartreuse signal "section change" rather than "click here."

The page is built as an alternating band rhythm rather than as a single continuous scroll. The warm-white hero hands off to a near-black dashboard band carrying a product analytics screenshot (lavender data line, slate hairlines, the same dark base tone as the primary button). The next band returns to white with a 48px InterDisplay section heading. The fourth band drops to a deep olive surface `{colors.surface-olive}` (#1a2e05) holding a 3-column grid of customer-site thumbnails; the olive mutes the varied source colors of each thumbnail into a uniform editorial grid. The final band returns to white with the email-newsletter section. Five bands, three light, two dark, each flush-edged with no atmospheric transitions. The structure is closer to a magazine spread than to a SaaS landing page.

Typography is two cuts of Inter. **InterDisplay** carries every display surface — the 96px hero h1 at weight 700 with tight -2.4px tracking, the 48px section heading, the 36px sub-display, and the 12px uppercase tracked eyebrow. **InterVariable** carries every running surface — the 15px nav links and the 14px footnote text. Georgia is declared as the serif fallback in CSS (`--serif: Georgia, serif`) but never renders in the captured marketing chrome; it sits in reserve for the editor theme.

**Key Characteristics:**
- Single chromatic voltage (`{colors.primary}` — `--color-lime`) confined entirely to the eyebrow tier — 8 total page occurrences, never on a CTA fill.
- Near-black primary button (`{colors.ink-base}` — #15171a, wired as `--color-base`) at 6px radius, 39px height, white text — the inverse of the lime-fill CTA convention.
- Hero h1 renders in `{colors.ink}` (#112220) — a deep teal-ink, never pure black — at 96px InterDisplay weight 700.
- Five-band editorial rhythm: warm white hero, near-black dashboard, white headline, deep olive customer grid, white newsletter band. Flush edges, no atmospheric gradients.
- Tailwind slate hairline (`{colors.hairline}` — #e5e7eb) is the dominant border tone — 462 of the captured border occurrences sit on this single value.
- Eight Tailwind slate greys carry the dashboard chrome (slate-100 through slate-700); the deep olive `{colors.surface-olive}` is the only saturated dark surface in the system.
- InterDisplay handles all headings; InterVariable handles all body and nav; Georgia and the system mono stack are reserved fallbacks that never render on the captured surface.
- The 96px hero size is unique to the headline — no second display step matches it. The next display tier drops to 48px.

## Colors

### Brand

- **Lime** (`{colors.primary}` — #d1ff19): frequency 8. Used as text (7), background (1). Wired in CSS as `--color-lime`. The single chromatic brand moment — confined to the 12px uppercase tracked eyebrow labels above each section heading. Never appears on a CTA fill or as a hover state.
- **Lime Soft** (`{colors.primary-soft}` — #bef264): frequency 3. A Tailwind lime-300 step lighter than the brand lime. Used sparingly inside customer-site thumbnails in the olive band; not part of the page chrome.

### Surface

- **Canvas** (`{colors.canvas}` — #ffffff): frequency 109 — 99 as text on dark surfaces, 8 as background, 2 inside gradients. The warm-white page floor used on the hero, the white headline band, and the newsletter band.
- **Ink Base** (`{colors.ink-base}` — #15171a): frequency 7 as background. Wired as `--color-base`. The dark surface for the dashboard band and the primary button fill — a true near-black with a faint warm undertone.
- **Surface Deep** (`{colors.surface-deep}` — #0f172a): frequency 2 as background. A Tailwind slate-900 used inside the dashboard analytics card chrome.
- **Surface Olive** (`{colors.surface-olive}` — #1a2e05): frequency 3 as background. Wired as a brand-layer hex in the extraction. The deep olive band surface holding the customer-site thumbnail grid — chromatic enough to read as a deliberate color, dark enough to mute the varied source colors of each thumbnail.

### Text

- **Ink** (`{colors.ink}` — #112220): frequency 4 as text. The hero h1 color — a deep teal-ink, never pure black. Reads as charcoal on the warm-white canvas while carrying a faint chromatic warmth that ties to the olive band lower on the page.
- **Ink Soft** (`{colors.ink-soft}` — #334155): frequency 9 — 8 as text, 1 as background. Wired as `--color-darkgrey` in legacy CSS, but the rendered value is Tailwind slate-700. Used for body paragraph running text under the hero.
- **Ink Mute** (`{colors.ink-mute}` — #64748b): frequency 9 as text. A Tailwind slate-500 used for secondary captions and the body text inside dashboard analytics cards.
- **Ink Stone** (`{colors.ink-stone}` — #94a3b8): frequency 93 as text. The dominant secondary-text tone — Tailwind slate-400 — carrying nav-link inactive states and the dashboard chrome metadata labels.
- **Shadow** (`{colors.shadow}` — #000000): frequency 306 — 236 as text on the dark dashboard band, 70 as shadow ink. The dominant text tone on dark surfaces; the dashboard chrome uses pure black for its primary text rather than the warm ink-base.

### Hairline

- **Hairline** (`{colors.hairline}` — #e5e7eb): frequency 464 — 462 of those are borders. The dominant border tone across the entire system. Card outlines, input field outlines, dashboard cell dividers — wired as `--color-whitegrey` in the legacy CSS, rendered as Tailwind slate-200.
- **Hairline Soft** (`{colors.hairline-soft}` — #cbd5e1): frequency 8 as text. Tailwind slate-300; used inside dashboard cards for metadata labels rather than as a border.
- **Hairline Dark** (`{colors.hairline-dark}` — #1f2937): frequency 3 as border. Tailwind slate-800; the divider tone for cards sitting on the dark dashboard band.

## Typography

### Font Families

The system runs two Inter cuts. **InterDisplay** (`--font-heading: "InterDisplay", sans-serif`) handles every display surface — the hero h1, all H2 / H3 section headings, the 24px lede, and the 12px uppercase eyebrow. **InterVariable** (`--font-sans-serif: "InterVariable", sans-serif`) handles every running text surface — the 15px nav links, the 15px body, the 14px footnote text. Both faces are free and open-source under the SIL Open Font License.

Georgia is declared as a serif fallback (`--serif: Georgia, serif`) but never appears in the captured marketing chrome — it sits in reserve for the Ghost editor theme. The mono stack (`--font-monospace: Menlo, ui-monospace, SFMono-Regular, Monaco, Consolas, Liberation Mono, Courier New, monospace`) is similarly reserved.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 96px | 700 | 96px | -2.4px | Hero h1 ("Turn your audience into a business.") |
| `{typography.display-lg}` | 48px | 700 | 55.2px | -1.2px | Section h2 ("Complete control over your website and branding") |
| `{typography.display-md}` | 36px | 700 | 36px | -0.9px | Sub-display H3 |
| `{typography.body-lg}` | 24px | 400 | 36px | 0 | Hero lede paragraph |
| `{typography.body-md}` | 24px | 500 | 30px | 0 | Featured body, link callouts |
| `{typography.heading-sm}` | 18px | 600 | 18px | 0 | H3 feature-card titles |
| `{typography.eyebrow}` | 12px | 700 | 12px | 1.2px | Uppercase tracked H2 labels in lime |
| `{typography.nav-link}` | 15px | 500 | 22.5px | 0 | Top-nav link labels |
| `{typography.body-sm}` | 15px | 400 | 22.5px | 0 | Default body running text |
| `{typography.caption}` | 14px | 400 | 21px | 0 | Footnote text and dashboard captions |
| `{typography.button-md}` | 14px | 400 | 21px | 0 | Primary CTA label |

### Principles

Display weight is heavy and consistent. The hero h1 sits at 96px / 700 with tight -2.4px tracking — the loudest typographic moment in the system, sized to dominate the viewport at desktop. The next display step drops dramatically to 48px / 700; there is no intermediate 64-80px tier. This binary scale (96px hero, 48px section) keeps the hero as the page's single typographic event and treats every other heading as a secondary anchor.

The eyebrow tier carries every section-change signal. At 12px InterDisplay weight 700 with 1.2px tracking and `text-transform: uppercase`, it does the work that a heavier H2 would normally do — naming the section ("Easy site design," etc.) without competing visually with the 48px display heading that follows.

### Note on Font Substitutes

Both InterDisplay and InterVariable are free under the SIL Open Font License — paste them into a self-hosted React project with no licensing concern. If a fallback is needed, the platform system-ui stack (San Francisco on macOS, Segoe UI on Windows, Roboto on Android) is the closest match for the 15px running text; **Geist** is the closest open-source alternative for the 96px display tier with comparable cap height.

## Layout

### Spacing System

- **Base unit:** 8px (`{spacing.sm}`) — the dominant gap value across the captured page.
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 36px · `{spacing.3xl}` 48px · `{spacing.4xl}` 72px.
- **Section padding (vertical):** ~72px between major editorial bands. The dashboard and olive bands carry the most generous internal padding (`{spacing.4xl}` 72px top and bottom).
- **Card internal padding:** `{spacing.base}` (16px) on dashboard analytics cards, `{spacing.lg}` (24px) on hairline-bordered feature cards.
- **Hero padding:** 0 horizontal on the headline itself; the centered container holds the 809px-wide h1 at native size.

### Grid & Container

- **Max content width:** ~1080px on the hero h1, ~1280px on the dashboard band, ~1200px on the olive customer-site grid.
- **Hero:** centered content stack — eyebrow chip, 96px headline, 24px lede, near-black primary pill — on a warm-white floor.
- **Dashboard band:** full-bleed near-black canvas holding a single dashboard screenshot at ~1200px wide with hairline-dark cell dividers and a lavender analytics line.
- **Customer-site grid:** 3-column grid on the olive band showing example customer publications (Lever News, 404 Media, The Browser, Platformer, Tangle).
- **Newsletter band:** centered split — a publishing-card mockup on the left, a section heading and 18px caption stack on the right.

### Rhythm

The page reads as five distinct horizontal spreads stacked vertically. The light bands carry the editorial typography; the dark bands carry the product imagery. Each band terminates on a flush edge — there is no gradient, no fade, no atmospheric transition. The five-band structure is closer to a print magazine layout than to a typical SaaS scroll, and the flush edges are deliberate: each spread should read as a separate page rather than as a continuous flow.

## Elevation

The system has essentially **no shadow tier** on the marketing surface. The captured page carries 70 shadow occurrences, all on `#000000` ink at low opacity, and almost all of them confined to subtle elevations on the dashboard cards inside the dark band. The light bands carry zero shadow — depth comes from hairline borders alone.

- **Flat (no shadow):** hero, white headline band, olive customer-site grid, newsletter band — every editorial surface.
- **Dashboard elevation:** the analytics cards on the dark band carry a faint 1px hairline-dark `{colors.hairline-dark}` border, with a low-opacity shadow halo beneath. The lavender data line is the only chromatic element inside the band.
- **Hairline outlines:** `{colors.hairline}` (462 occurrences) does the entire elevation job on the light bands. Cards are outlined, not lifted.

## Shapes

The radius scale runs from sharp to fully-rounded, with a strong default at 24px:

- `{rounded.none}` 0px — section bands and the dashboard chrome edges.
- `{rounded.xs}` 4px (1 occurrence) — the dashboard analytics line chart container.
- `{rounded.sm}` 6px (3 occurrences) — the primary button and small inline chips.
- `{rounded.md}` 8px (16 occurrences) — dashboard cards, input fields, secondary surfaces.
- `{rounded.lg}` 16px (5 occurrences) — larger feature cards.
- `{rounded.xl}` 24px (34 occurrences) — the dominant rounded surface, used on customer-site tiles and large content cards.
- `{rounded.full}` 9999px (2 occurrences) — circular avatar badges and a single pill chip.

The 24px tier carries 34 of the 61 total rounded surfaces, making it the system's default. The 6px primary button is deliberately tighter than the dominant tier — a small, deliberate shape choice that signals "click" against the otherwise soft chrome.

## Components

**`hero-heading`** — The 96px InterDisplay h1 in `{colors.ink}` (#112220, a deep teal-ink) on the warm-white canvas. Weight 700, tracking -2.4px, line-height 96px. The loudest typographic moment in the system; the next display step drops to 48px.

**`eyebrow-h2`** — The 12px uppercase tracked H2 label in `{colors.primary}` lime above each section heading. Wired as an H2 in the markup despite its small size — semantically the section name, visually a chromatic chip.

**`section-heading`** — The 48px InterDisplay display heading in `{colors.ink}` on white bands. Weight 700, tracking -1.2px. Used for "Complete control over your website and branding" and "Publish by web and email newsletters."

**`body-paragraph`** — The 24px InterDisplay lede in `{colors.ink-soft}` (slate-700). Used for the hero sub-paragraph and the lead lines beneath each section heading.

**`body-paragraph-muted`** — The 15px InterVariable secondary body text in `{colors.ink-mute}` (slate-500).

**`button-primary`** — The signature CTA. Near-black `{colors.ink-base}` (#15171a) fill, white text, `{rounded.sm}` 6px radius, 8x16 padding, 39px height. "Get Started — free" is the canonical instance, anchored in the hero and repeated in the top-nav right-cluster. The fill choice — near-black rather than lime — is the system's defining inversion.

**`top-nav`** — White canvas surface, ~72px height (matched to a 4xl spacing token). Holds the Ghost wordmark flush-left, the product-nav links ("Why Ghost," "Explore," "Tour," "Pricing") center, and the "Sign in" link plus near-black "Get Started" pill flush-right.

**`nav-link`** — Pure black `{colors.shadow}` text in `{typography.nav-link}` (15px InterVariable weight 500). Inactive — no hover-state pill captured.

**`dashboard-band`** — Full-bleed dark `{colors.ink-base}` band with 72x24 padding, no border-radius. Holds the product-analytics screenshot at ~1200px wide. The dashboard chrome itself uses pure black `{colors.shadow}` for primary text and slate-400 `{colors.ink-stone}` for metadata.

**`dashboard-card`** — Dark `{colors.ink-base}` fill matching the band surface, `{rounded.md}` 8px radius, 16px internal padding, 1px `{colors.hairline-dark}` border. Holds individual analytics tiles inside the dashboard band.

**`olive-band`** — Full-bleed `{colors.surface-olive}` (#1a2e05) band with 72x24 padding. Holds the 3-column customer-site thumbnail grid. The olive is the only saturated chromatic surface in the system.

**`site-tile`** — White `{colors.canvas}` fill, `{rounded.lg}` 16px radius, 0 padding (each customer-site thumbnail fills the tile edge-to-edge). Used in the olive customer-site grid.

**`text-input`** — White surface, ink text, 1px hairline border, `{rounded.md}` 8px radius, 8x16 padding, 39px height — matched to the primary button.

**`card-hairline`** — White fill, 1px `{colors.hairline}` border, `{rounded.xl}` 24px radius, 24px internal padding. The default feature card; the 24px radius is the system's dominant rounded tier.

## Do's and Don'ts

**Do** keep the lime (`{colors.primary}`) scoped to the eyebrow tier. The 12px uppercase tracked H2 labels are the entire chromatic budget of the page — multiplying the lime onto a CTA fill or a hover state collapses the system's defining restraint.

**Do** use `{colors.ink}` (#112220) for the hero headline rather than pure black. The deep teal-ink carries a faint warmth that ties to the olive band lower on the page; pure black at 96px display weight reads as industrial against the warm canvas.

**Do** alternate light and dark bands with flush edges. The five-band rhythm is the page's structural device — adding a gradient or atmospheric transition between bands flattens the magazine-spread feel into a generic continuous scroll.

**Do** outline `{component.card-hairline}` cards with `{colors.hairline}` (#e5e7eb) rather than lifting them with shadow. 462 of the captured border occurrences sit on this single hairline tone; introducing shadow elevation on a hairline-card breaks the system's flat depth language.

**Don't** fill `{component.button-primary}` with the lime brand color. The inversion — near-black CTA on warm-white canvas with a lime eyebrow above — is the system's signature. Filling the CTA with the lime would push the page into the Substack / Beehiiv register that Ghost specifically refuses.

**Don't** scale the hero headline down below 96px on desktop. The 96px / 700 / -2.4px tracking is a deliberate choice — dropping to 72px softens the typographic force that the system relies on to carry the otherwise-monochrome hero.

**Don't** use the `{colors.surface-olive}` (#1a2e05) outside the customer-site band. The olive is scoped to a single band as a mute background for varied source-color thumbnails; placing it elsewhere reads as a second brand chromatic moment and competes with the lime.

**Don't** introduce a serif body face. Georgia is declared as a fallback (`--serif: Georgia, serif`) for the editor theme, but the marketing system runs 100% InterDisplay and InterVariable. Serif body would push the page into the Substack / Medium editorial register that Ghost's marketing site specifically avoids.

## Known Gaps

- **Hover and focus states:** the captured marketing surface does not expose CTA hover-fills, focus rings, or active-press states. The `{component.button-primary}` carries only the resting state.
- **Form input error states:** `{component.text-input}` is captured at resting state only; error / validation styling lives inside the Ghost dashboard and editor.
- **Dark mode:** the public marketing surface alternates between light and dark bands rather than offering a separate dark-mode variant. The dashboard band already runs on the near-black `{colors.ink-base}` floor.
- **Motion:** the hero, dashboard, and olive band are static in the captured render; any scroll-triggered transitions (parallax, fade-in) live in client-side scripts not captured in the token spec.
- **Product surfaces:** this DESIGN.md captures the marketing site at `ghost.org` only. The Ghost editor and admin dashboard at `ghost.io` and `<your-site>.ghost.io/ghost/` carry richer token systems — editor toolbar, member analytics, publishing flows — that are not represented here.
- **Customer-site colors:** several brand-layer hexes captured in the extraction (a warm yellow, a soft pink, a sky blue, a deep navy, a saturated red) appear only inside customer-site thumbnails on the olive band, not in the Ghost page chrome itself, and are not declared as design tokens.
- **Mobile breakpoint:** the captured render is desktop-only at ~1280px viewport; mobile typography scales and navigation chrome are not represented.
