<p align="center">
  <img src="docs/banner.svg" alt="Tintelya — a color studio for websites" width="100%" />
</p>

<h1 align="center">Tintelya</h1>

<p align="center">
  <strong>A color studio for websites.</strong><br />
  Start with colors you already love. Tintelya turns them into a full UI palette —<br />
  then shows the result on a real layout so you can see if it actually works.
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <img src="https://img.shields.io/badge/Runs_in_the_browser-0c0c0d?style=for-the-badge" alt="Runs in the browser" />
</p>

<p align="center">
  <em>Generate · Contrast · Preview · Export</em>
</p>

---

## Why Tintelya?

Most palette tools stop at a grid of hex codes. That’s fine for inspiration — less fine when you need a **website system**.

Tintelya is built for the gap between “pretty swatches” and “shippable UI tokens”:

| What you give it | What you get back |
| --- | --- |
| 1–5 seed colors | Primary, secondary, accent |
| A mood (Modern, Soft, Pastel…) | Background, surface, elevated, text, muted, border |
| Optional harmony | Success / warning / danger tinted to your hue |
| — | Live site preview + WCAG grades + one-click export |

No account. No backend. Everything runs in the browser.

---

## Features

### Seed colors you control
Add up to five hex values. Lock the ones you want to keep, shuffle the rest, or load a preset (Grove, Harbor, Ember, Iris, Ink, Bloom).

### Moods that behave like design systems
Modern, Soft, Pastel, Vibrant, Minimal, and Dark don’t just recolor chips — they remap surfaces and type so the palette feels intentional.

### Color harmony
Keep **your colors**, or derive secondary and accent with analogous, complementary, triadic, split, or mono relationships.

### Live website preview
A full ceramic-studio landing page (nav, hero, product cards, quote, CTA) restyles as you edit. Switch desktop / tablet / mobile frames to stress-test the system.

### WCAG contrast, in context
Body text, muted text, primary-on-background, and button labels are graded **AA / AAA / fail** so weak pairs don’t hide until production.

### Export when you’re ready
Copy a HEX list, CSS variables, Tailwind v4 `@theme` block, or JSON — including mood, harmony, and seed metadata.

### Saved locally
Bookmark a palette in this browser and restore it later. Nothing leaves your machine.

---

## Quick start

```bash
git clone https://github.com/hoshiko9011/Tintelya.git
cd Tintelya
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

## How it works

```text
Seeds ──► Harmony ──► Mood recipes ──► Role colors ──► Contrast nudge ──► Preview + export
```

1. **Seeds** — Your 1–5 colors. The first is treated as primary.
2. **Harmony** — Secondary and accent are either kept from extra seeds or derived from the primary.
3. **Mood** — Lightness/saturation recipes map those hues onto website roles (background, surface, text, border, semantics).
4. **Contrast** — Body and muted text are nudged until they meet WCAG targets against the background.
5. **Preview** — The mock site is driven by CSS variables from the generated palette, so buttons, cards, and type update together.

---

## Project structure

```text
app/
  page.tsx            # Client entry (re-exports the studio)
  layout.tsx          # Document shell, fonts, metadata
  globals.css         # Studio chrome + website preview styles
lib/
  studio-app.tsx      # Full studio UI
  color.ts            # Hex / HSL / relative luminance / WCAG
  palette.ts          # Mood recipes, harmony, generatePalette()
  export-palette.ts   # HEX · CSS · Tailwind · JSON serializers
docs/
  banner.svg          # README hero banner
```

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Plain CSS with a small design-token system |
| Persistence | `localStorage` (optional saves) |

No database, no auth, no third-party color APIs.

---

## Roadmap

- [ ] Share a palette via URL (encode seeds + mood + harmony)
- [ ] Extract a starting palette from an image or screenshot
- [ ] Richer export snippets (`--color-on-primary`, Figma-friendly tokens)
- [ ] Named palettes that sync across devices (optional accounts)

---

## Contributing

This is a personal / experimental studio. If you fork it:

1. Keep generation pure (no network calls in the color path).
2. Prefer small modules in `lib/` over growing `studio-app.tsx` forever.
3. Treat the website preview as a test surface — if a palette looks wrong there, fix the system, not the mock.

---

## License

Private / personal project unless otherwise noted.

---

<p align="center">
  <sub>Made for quieter websites · Tintelya</sub>
</p>
