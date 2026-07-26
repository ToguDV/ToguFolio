---
version: 1.0
name: "Portfolio"
description: >-
  Desarrollador portfolio con estetica terminal/ASCII. Superficie oscura basada en Catppuccin Mocha,
  tipografia monoespaciada JetBrains Mono, acentos en tonos pastel (mauve, lavender, blue).
  Interacciones con elementos ASCII animados (Matrix rain, ASCII constellation, frame animator).
  Sensacion de "hacker craftsman" — tecnico pero con personalidad.

seo:
  title: "Portfolio — Catppuccin Mocha, JetBrains Mono, terminal aesthetic"
  metaDescription: "Desarrollador portfolio con estetica terminal ASCII sobre paleta Catppuccin Mocha. JetBrains Mono, acentos mauve/lavender, efectos canvas animados."
  highlights:
    - "Paleta Catppuccin Mocha — superficie #1e1e2e con acentos pastel #f5c2e7 (mauve) y #89b4fa (blue)"
    - "Tipografia monoespaciada — JetBrains Mono 400/700 en todo el sitio, sin serif ni sans-serif"
    - "Efectos ASCII animados — matrix rain, ASCII constellation, frame animator con reduced-motion bail"
    - "Navegacion sticky con scroll-padding para anchors"
    - "Bandas de seccion alternadas (surface/soft/surface-raised) con bordes hairline"
  tags:
    - "Portfolio"
    - "Developer"
    - "Terminal Aesthetic"
  lastUpdated: "2026-07-26"
  author:
    name: "Developer"
  opening: |
    Portfolio pessoal con estetica de terminal y elementos ASCII animados. La superficie oscura
    de Catppuccin Mocha (#1e1e2e) sirve como lienzo para los acentos mauve (#f5c2e7) y lavender
    (#cba6f7). La tipografia JetBrains Mono mantiene la coherencia terminal en toda la pagina.
    Los efectos canvas (matrix rain, constellation) anaden movimiento sin comprometer
    accesibilidad (reduced-motion bail). El resultado: un portfolio que parece un terminal
    bien cuidado, no un generador de landing pages.

colors:
  canvas: "#1e1e2e"
  surface-soft: "#181825"
  surface: "#1e1e2e"
  surface-raised: "#313244"
  hairline: "#45475a"
  hairline-soft: "#585b70"
  ink: "#f5c2e7"
  ink-soft: "#f2cdcd"
  ink-mute: "#cba6f7"
  text: "#cdd6f4"
  text-mute: "#a6adc8"
  cta-bg: "#cba6f7"
  cta-text: "#1e1e2e"
  accent: "#89b4fa"

typography:
  font-mono: "'JetBrains Mono', ui-monospace, Menlo, monospace"
  display-xl: "72px"
  display-lg: "36px"
  display-md: "24px"
  body-lg: "18px"
  body-md: "15px"
  caption: "13px"
  eyebrow: "11px"

rounded:
  sm: "2px"
  md: "4px"

spacing:
  section-padding-y: "64px"
  section-padding-x: "24px"
  grid-max-w: "48rem"
  nav-height: "56px"

components:
  shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
  section-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    padding: "64px 24px"
  section-soft:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.text}"
    padding: "64px 24px"
  section-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    padding: "64px 24px"
  heading-xl:
    textColor: "{colors.ink}"
    fontSize: "72px"
    fontFamily: "{typography.font-mono}"
  heading-lg:
    textColor: "{colors.ink}"
    fontSize: "36px"
    fontFamily: "{typography.font-mono}"
  heading-md:
    textColor: "{colors.ink}"
    fontSize: "24px"
    fontFamily: "{typography.font-mono}"
  body-lg:
    textColor: "{colors.text}"
    fontSize: "18px"
    fontFamily: "{typography.font-mono}"
  body-md:
    textColor: "{colors.text}"
    fontSize: "15px"
    fontFamily: "{typography.font-mono}"
  eyebrow:
    textColor: "{colors.ink-mute}"
    fontSize: "11px"
    fontFamily: "{typography.font-mono}"
    textTransform: "uppercase"
    letterSpacing: "0.1em"
  link-ink:
    textColor: "{colors.ink}"
  link-text:
    textColor: "{colors.text}"
  link-arrow:
    textColor: "{colors.ink-mute}"
  keycap-primary:
    backgroundColor: "{colors.cta-bg}"
    textColor: "{colors.cta-text}"
    fontFamily: "{typography.font-mono}"
  keycap-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-mute}"
    fontFamily: "{typography.font-mono}"
  tag:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-mute}"
    borderColor: "{colors.hairline-soft}"
  nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    height: "56px"
  footer:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.text-mute}"
---

## Overview

Portfolio pessoal de desenvolvedor con estetica terminal. La superficie escura Catppuccin Mocha
sirve como lienzo para acentos mauve y lavender, manteniendo coherencia monoespaciada en toda
la tipografia. Los efectos ASCII animados (matrix rain, constellation, frame animator) anaden
movimiento sin comprometer accesibilidad.

**Caracteristicas clave:**
- Paleta Catppuccin Mocha con acentos pastel (mauve #f5c2e7, lavender #cba6f7, blue #89b4fa)
- Tipografia 100% JetBrains Mono (400 y 700)
- Efectos canvas con reduced-motion bail (matrix rain, constellation)
- Navegacion sticky con offset para anchors
- Bordes hairline para separacion sutil
- Radii minimos (2px, 4px) — sensacion terminal, no soft UI

## Colors

### Surface

- **Canvas** (`{colors.canvas}` — #1e1e2e): superficie base, fondo principal de secciones dark
- **Surface Soft** (`{colors.surface-soft}` — #181825): superficie mas oscura, fondos alternos
- **Surface** (`{colors.surface}` — #1e1e2e): sinonimo de canvas, consistencia
- **Surface Raised** (`{colors.surface-raised}` — #313244): elementos elevados, tags, cards

### Hairline

- **Hairline** (`{colors.hairline}` — #45475a): bordes primarios, separadores
- **Hairline Soft** (`{colors.hairline-soft}` — #585b70): bordes secundarios, tags

### Ink (texto sobre superficies oscuras)

- **Ink** (`{colors.ink}` — #f5c2e7): mauve, texto primario sobre fondo oscuro (headings)
- **Ink Soft** (`{colors.ink-soft}` — #f2cdcd): rosewater, texto secundario
- **Ink Mute** (`{colors.ink-mute}` — #cba6f7): lavender, texto terciario, eyebrow labels

### Text

- **Text** (`{colors.text}` — #cdd6f4): texto principal body
- **Text Mute** (`{colors.text-mute}` — #a6adc8): texto secundario

### Action

- **CTA BG** (`{colors.cta-bg}` — #cba6f7): fondo de call-to-action (mauve)
- **CTA Text** (`{colors.cta-text}` — #1e1e2e): texto sobre CTA (oscuro)
- **Accent** (`{colors.accent}` — #89b4fa): azul para enlaces y highlights

## Typography

Tipografia 100% monoespaciada — JetBrains Mono en todo el sitio.

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.display-xl}` | 72px | 700 | Hero heading |
| `{typography.display-lg}` | 36px | 700 | Section headings |
| `{typography.display-md}` | 24px | 700 | Subsection headings |
| `{typography.body-lg}` | 18px | 400 | Body lead text |
| `{typography.body-md}` | 15px | 400 | Body running text |
| `{typography.caption}` | 13px | 400 | Footnotes, captions |
| `{typography.eyebrow}` | 11px | 400 | Uppercase labels, tracking 0.1em |

## Layout

### Spacing

- **Section padding:** 64px vertical, 24px horizontal
- **Grid max width:** 48rem (768px)
- **Nav height:** 56px

### Section Tones

El portfolio alterna bandas con diferentes tones de surface:
- `dark`: canvas (#1e1e2e)
- `soft`: surface-soft (#181825)
- `surface`: surface (#1e1e2e)

## Shapes

Radii minimos — sensacion terminal/technical:

- `{rounded.sm}` 2px — small elements
- `{rounded.md}` 4px — default for cards, tags

## Components

### Shell
Contenedor principal. Flex column, min-height 100vh, bg canvas, text text.

### Section
Wrapper de seccion. Props: `tone` (dark/soft/surface), `wide` (max-width), `id` (anchor).
Scroll-margin igual a nav-height para offset de anchor.

### Heading
H1-H3 con color ink. xl (72px), lg (36px), md (24px).

### Eyebrow
Label uppercase 11px con letter-spacing 0.1em, color ink-mute.

### Link
Polymorphic `<a>`. Variants: `ink` (mauve), `text` (blue text), `arrow` (muted).

### Keycap
Bracket-style links `[label]`. Variants: `primary` (mauve bg), `secondary` (raised surface).

### Tag
Bordered tag con surface-raised bg y hairline-soft border.

### Nav
Navegacion sticky顶部. Height 56px, bg canvas, text text.

### Footer
Pie de pagina. bg surface-soft, text text-mute.

## Animation

Tres sistemas coexistentes:

1. **Canvas effects** — useEffect + requestAnimationFrame, DPR + ResizeObserver, reduced-motion bail
2. **CSS @keyframes** — caret blink (Caret.module.css), step-end 1.06s
3. **CSS transitions** — AsciiFrameAnimator wrapper height swap, bubble fade

### Reduced Motion

Todos los efectos canvas hard-bail en `(prefers-reduced-motion: reduce)`. CSS animations/transitions
override global en base.css. El visual estatico se mantiene; solo motion se remueve.

## Accessibility

- Focus rings: 2px solid mauve, outline-offset 2px (global en base.css)
- Interactive elements son `<a>` o `<button>` reales
- AsciiConstellation canvas es `pointer-events: none`
- Navegacion con scroll-padding-top para offset sticky nav

## Do's and Don'ts

**Do** usar `--color-ink` para headings sobre fondo oscuro. El mauve lee bien contra #1e1e2e.

**Do** mantener tipografia JetBrains Mono en todo el sitio. No mezclar con sans-serif.

**Do** usar Section con tone alternados para crear ritmo visual.

**Don't** anadir radio grande ( > 4px ) — la sensacion terminal requiere bordes sharp.

**Don't** usar colores fuera de la paleta Catppuccin Mocha. Los acentos pastel son deliberados.
