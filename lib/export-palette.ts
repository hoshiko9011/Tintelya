import type { Mood, Harmony, Palette } from "./palette";

/** Every token on Palette, including on* roles. */
export const EXPORT_KEYS: { key: keyof Palette; name: string; css: string }[] = [
  { key: "primary", name: "Primary", css: "primary" },
  { key: "secondary", name: "Secondary", css: "secondary" },
  { key: "accent", name: "Accent", css: "accent" },
  { key: "background", name: "Background", css: "background" },
  { key: "surface", name: "Surface", css: "surface" },
  { key: "elevated", name: "Elevated", css: "elevated" },
  { key: "text", name: "Text", css: "text" },
  { key: "muted", name: "Muted", css: "muted" },
  { key: "border", name: "Border", css: "border" },
  { key: "success", name: "Success", css: "success" },
  { key: "warning", name: "Warning", css: "warning" },
  { key: "danger", name: "Danger", css: "danger" },
  { key: "onPrimary", name: "On Primary", css: "on-primary" },
  { key: "onSecondary", name: "On Secondary", css: "on-secondary" },
  { key: "onAccent", name: "On Accent", css: "on-accent" },
];

export function paletteAsLines(palette: Palette): string {
  return EXPORT_KEYS.map(({ key, name }) => `${name}: ${palette[key]}`).join("\n");
}

export function paletteAsCss(palette: Palette): string {
  const body = EXPORT_KEYS.map(
    ({ key, css }) => `  --color-${css}: ${palette[key]};`,
  ).join("\n");
  return `:root {\n${body}\n}`;
}

export function paletteAsTailwind(palette: Palette): string {
  const body = EXPORT_KEYS.map(
    ({ key, css }) => `  --color-${css}: ${palette[key]};`,
  ).join("\n");
  return `@theme {\n${body}\n}`;
}

export function paletteAsJson(
  palette: Palette,
  meta: { mood: Mood; harmony: Harmony; seeds: string[] },
): string {
  const colors = Object.fromEntries(
    EXPORT_KEYS.map(({ key }) => [key, palette[key]]),
  );
  return JSON.stringify(
    {
      mood: meta.mood,
      harmony: meta.harmony,
      seeds: meta.seeds,
      colors,
    },
    null,
    2,
  );
}
