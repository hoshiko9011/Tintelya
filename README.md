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

---

## Why Tintelya?

Most palette tools stop at a grid of hex codes. Tintelya is built for the gap between “pretty swatches” and “shippable UI tokens.”

No account and no backend for palette logic — generation runs in your browser.
Google Fonts are loaded from Google’s servers for typography.

---

## Features

- **Seed colors** — Up to five hex values. In “Your colors” harmony, all five influence the palette.
- **Moods** — Modern, Soft, Pastel, Vibrant, Minimal, Dark remap surfaces and type.
- **Harmony** — Keep your colors, or derive secondary/accent relationships.
- **Live website preview** — Desktop / tablet / mobile frames.
- **WCAG contrast checks** — Selected token pairs graded AA / AAA / fail (not a full-page audit).
- **Export** — HEX list, CSS variables, Tailwind `@theme`, JSON — all semantic tokens including onPrimary / onSecondary / onAccent.
- **Saved locally** — `localStorage` in this browser. Palette math stays on-device; font files may still be requested from Google Fonts.

---

## Quick start

```bash
git clone https://github.com/hoshiko9011/Tintelya.git
cd Tintelya
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (color + palette + history) |

---

## License

[MIT](./LICENSE)

---

<p align="center">
  <sub>Made for quieter websites · Tintelya</sub>
</p>
