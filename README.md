# Tintelya

**A color studio for websites.** Pick the colors you already love, choose a mood, and Tintelya builds a full UI palette — then shows it on a live page so you can tell if it actually works.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)

> Generate palettes · Check contrast · Preview on a real layout · Export CSS, Tailwind, JSON

---

## Preview

<p align="center">
  <img src="docs/preview.png" alt="Tintelya studio — seed colors, live website preview, and palette tokens" width="900" />
</p>

<p align="center"><em>Add a screenshot at <code>docs/preview.png</code> after running locally (optional).</em></p>

---

## Features

- **Seed colors you control** — add up to five hex values, lock the ones you want to keep, shuffle the rest
- **Moods** — Modern, Soft, Pastel, Vibrant, Minimal, Dark. Surfaces and type are generated as a system, not a random swatch dump
- **Color harmony** — analogous, complementary, triadic, split, or mono — or keep your own colors as-is
- **Live website preview** — a ceramic studio landing page (nav, hero, product cards, quote, CTA) restyles instantly. Toggle desktop / tablet / mobile
- **WCAG contrast** — body, muted, primary, and button-label pairs graded AA / AAA / fail
- **Click-to-copy tokens** — Primary, Secondary, Accent, Background, Surface, Elevated, Text, Muted, Border, Success, Warning, Danger
- **Export** — HEX list, CSS variables, Tailwind v4 `@theme`, or JSON
- **Presets & saved palettes** — Grove, Harbor, Ember, Iris, Ink, Bloom; save work to this browser
- **Runs entirely in the browser** — no account, no backend

---

## Quick start

```bash
git clone https://github.com/hoshiko9011/Tintelya.git
cd Tintelya
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

---

## How it works

1. **Seeds** — your 1–5 colors. The first is treated as primary.
2. **Harmony** — Tintelya derives secondary and accent (or uses extra seeds when set to “Your colors”).
3. **Mood** — maps those hues onto website roles (background, surface, text, border, semantic status) with target lightness/saturation, then nudges body text until it meets WCAG contrast.
4. **Preview** — the mock site is driven by CSS variables from the generated palette, so you see buttons, cards, and type in context — not just a grid of chips.

---

## Project structure

```text
app/
  page.tsx          # Studio UI (client)
  layout.tsx        # Document shell + metadata
  globals.css       # Studio chrome + website preview styles
lib/
  color.ts          # Hex / HSL / WCAG contrast
  palette.ts        # Mood + harmony generation
  export-palette.ts # CSS / Tailwind / JSON
```

---

## Tech stack

| Layer     | Choice                                      |
| --------- | ------------------------------------------- |
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language  | TypeScript                                  |
| Styling   | CSS (design tokens in `globals.css`)        |
| UI        | React 19                                    |

---

## Roadmap

- [ ] Share a palette via URL
- [ ] Image-to-palette (extract colors from a screenshot)
- [ ] Figma / CSS custom-property snippets with `--color-on-primary`
- [ ] Persist named palettes across devices (optional accounts)

---

## License

Private / personal project unless otherwise noted.
