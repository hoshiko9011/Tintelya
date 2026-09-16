import { SWATCHES, type Mood, type Harmony, type Palette } from "./palette";

export function paletteAsLines(palette: Palette): string {
  return SWATCHES.map(({ key, name }) => `${name}: ${palette[key]}`).join("\n");
}

export function paletteAsCss(palette: Palette): string {
  const body = SWATCHES.map(
    ({ key }) => `  --color-${key}: ${palette[key]};`,
  ).join("\n");
  return `:root {\n${body}\n  --color-on-primary: ${palette.onPrimary};\n}`;
}

export function paletteAsTailwind(palette: Palette): string {
  const body = SWATCHES.map(
    ({ key }) => `  --color-${key}: ${palette[key]};`,
  ).join("\n");
  return `@theme {\n${body}\n}`;
}

export function paletteAsJson(
  palette: Palette,
  meta: { mood: Mood; harmony: Harmony; seeds: string[] },
): string {
  return JSON.stringify(
    {
      mood: meta.mood,
      harmony: meta.harmony,
      seeds: meta.seeds,
      colors: Object.fromEntries(SWATCHES.map(({ key }) => [key, palette[key]])),
    },
    null,
    2,
  );
}
