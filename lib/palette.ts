import {
  bestTextOn,
  ensureContrast,
  hexToHsl,
  hslToHex,
  parseHex,
  rotateHue,
} from "./color";

export type Mood = "modern" | "soft" | "pastel" | "vibrant" | "minimal" | "dark";
export type Harmony =
  | "custom"
  | "analogous"
  | "complementary"
  | "triadic"
  | "split"
  | "mono";

export const MOODS: { id: Mood; label: string; hint: string }[] = [
  { id: "modern", label: "Modern", hint: "Balanced surfaces, clear hierarchy" },
  { id: "soft", label: "Soft", hint: "Airy backgrounds, gentle chroma" },
  { id: "pastel", label: "Pastel", hint: "High lightness, quiet saturation" },
  { id: "vibrant", label: "Vibrant", hint: "Punchy accents on clean paper" },
  { id: "minimal", label: "Minimal", hint: "Near-neutral, one chromatic note" },
  { id: "dark", label: "Dark", hint: "Ink surfaces, luminous type" },
];

export const HARMONIES: { id: Harmony; label: string }[] = [
  { id: "custom", label: "Your colors" },
  { id: "analogous", label: "Analogous" },
  { id: "complementary", label: "Complement" },
  { id: "triadic", label: "Triadic" },
  { id: "split", label: "Split" },
  { id: "mono", label: "Mono" },
];

export type Palette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  elevated: string;
  text: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  onPrimary: string;
  onSecondary: string;
  onAccent: string;
};

export const SWATCHES: { key: keyof Palette; name: string }[] = [
  { key: "primary", name: "Primary" },
  { key: "secondary", name: "Secondary" },
  { key: "accent", name: "Accent" },
  { key: "background", name: "Background" },
  { key: "surface", name: "Surface" },
  { key: "elevated", name: "Elevated" },
  { key: "text", name: "Text" },
  { key: "muted", name: "Muted" },
  { key: "border", name: "Border" },
  { key: "success", name: "Success" },
  { key: "warning", name: "Warning" },
  { key: "danger", name: "Danger" },
];

type SurfaceRecipe = {
  bgL: number;
  bgS: number;
  surfaceL: number;
  surfaceS: number;
  elevatedL: number;
  elevatedS: number;
  textL: number;
  textS: number;
  mutedL: number;
  mutedS: number;
  borderL: number;
  borderS: number;
  chromaMul: number;
  chromaLShift: number;
};

const RECIPES: Record<Mood, SurfaceRecipe> = {
  modern: {
    bgL: 97,
    bgS: 8,
    surfaceL: 100,
    surfaceS: 4,
    elevatedL: 94.5,
    elevatedS: 10,
    textL: 12,
    textS: 14,
    mutedL: 42,
    mutedS: 10,
    borderL: 88,
    borderS: 8,
    chromaMul: 1,
    chromaLShift: 0,
  },
  soft: {
    bgL: 96,
    bgS: 14,
    surfaceL: 99,
    surfaceS: 8,
    elevatedL: 93,
    elevatedS: 16,
    textL: 18,
    textS: 16,
    mutedL: 46,
    mutedS: 12,
    borderL: 86,
    borderS: 12,
    chromaMul: 0.78,
    chromaLShift: 8,
  },
  pastel: {
    bgL: 97,
    bgS: 16,
    surfaceL: 99,
    surfaceS: 12,
    elevatedL: 93,
    elevatedS: 20,
    textL: 22,
    textS: 18,
    mutedL: 48,
    mutedS: 14,
    borderL: 86,
    borderS: 16,
    chromaMul: 0.55,
    chromaLShift: 18,
  },
  vibrant: {
    bgL: 98,
    bgS: 6,
    surfaceL: 100,
    surfaceS: 2,
    elevatedL: 95,
    elevatedS: 10,
    textL: 10,
    textS: 12,
    mutedL: 40,
    mutedS: 10,
    borderL: 88,
    borderS: 8,
    chromaMul: 1.12,
    chromaLShift: -2,
  },
  minimal: {
    bgL: 98,
    bgS: 2,
    surfaceL: 100,
    surfaceS: 0,
    elevatedL: 95,
    elevatedS: 3,
    textL: 10,
    textS: 4,
    mutedL: 44,
    mutedS: 3,
    borderL: 90,
    borderS: 3,
    chromaMul: 0.72,
    chromaLShift: 0,
  },
  dark: {
    bgL: 7,
    bgS: 12,
    surfaceL: 12,
    surfaceS: 11,
    elevatedL: 16,
    elevatedS: 12,
    textL: 96,
    textS: 6,
    mutedL: 68,
    mutedS: 8,
    borderL: 22,
    borderS: 10,
    chromaMul: 0.92,
    chromaLShift: 4,
  },
};

const FALLBACK = "#4F6F5A";

function pickTrio(seeds: string[], harmony: Harmony): [string, string, string] {
  const main = parseHex(seeds[0] ?? "") ?? FALLBACK;
  const secondSeed = seeds[1] ? parseHex(seeds[1]) : null;
  const thirdSeed = seeds[2] ? parseHex(seeds[2]) : null;

  if (harmony === "custom") {
    return [
      main,
      secondSeed ?? rotateHue(main, 28),
      thirdSeed ?? rotateHue(main, -32),
    ];
  }
  if (harmony === "analogous") {
    return [main, rotateHue(main, 32), rotateHue(main, -28)];
  }
  if (harmony === "complementary") {
    return [main, rotateHue(main, 180), rotateHue(main, 28)];
  }
  if (harmony === "triadic") {
    return [main, rotateHue(main, 120), rotateHue(main, 240)];
  }
  if (harmony === "split") {
    return [main, rotateHue(main, 150), rotateHue(main, 210)];
  }
  const hsl = hexToHsl(main);
  return [
    main,
    hslToHex({ ...hsl, l: Math.min(88, hsl.l + 18), s: hsl.s * 0.7 }),
    hslToHex({ ...hsl, l: Math.max(18, hsl.l - 16), s: hsl.s * 0.85 }),
  ];
}

function roleColor(base: string, s: number, l: number): string {
  const hsl = hexToHsl(base);
  return hslToHex({
    h: hsl.h,
    s: Math.max(0, Math.min(100, s)),
    l: Math.max(0, Math.min(100, l)),
  });
}

function applyChroma(hex: string, mul: number, lShift: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({
    h: hsl.h,
    s: Math.max(8, Math.min(100, hsl.s * mul)),
    l: Math.max(12, Math.min(88, hsl.l + lShift)),
  });
}

function tintSemantic(hue: number, baseHue: number, s: number, l: number): string {
  const delta = ((baseHue - hue + 540) % 360) - 180;
  return hslToHex({ h: hue + delta * 0.18, s, l });
}

export function generatePalette(
  seeds: string[],
  mood: Mood,
  harmony: Harmony,
): Palette {
  const recipe = RECIPES[mood];
  let [primary, secondary, accent] = pickTrio(seeds, harmony);
  primary = applyChroma(primary, recipe.chromaMul, recipe.chromaLShift);
  secondary = applyChroma(secondary, recipe.chromaMul * 0.9, recipe.chromaLShift);
  accent = applyChroma(
    accent,
    Math.min(1.2, recipe.chromaMul * 1.05),
    recipe.chromaLShift,
  );

  const background = roleColor(primary, recipe.bgS, recipe.bgL);
  const surface = roleColor(primary, recipe.surfaceS, recipe.surfaceL);
  const elevated = roleColor(primary, recipe.elevatedS, recipe.elevatedL);
  const text = ensureContrast(
    roleColor(primary, recipe.textS, recipe.textL),
    background,
    7,
  );
  const muted = ensureContrast(
    roleColor(primary, recipe.mutedS, recipe.mutedL),
    background,
    4.5,
  );
  const border = roleColor(primary, recipe.borderS, recipe.borderL);

  const baseHue = hexToHsl(primary).h;
  const dark = mood === "dark";
  const success = tintSemantic(148, baseHue, dark ? 42 : 48, dark ? 48 : 38);
  const warning = tintSemantic(38, baseHue, dark ? 58 : 62, dark ? 56 : 46);
  const danger = tintSemantic(8, baseHue, dark ? 55 : 58, dark ? 58 : 48);

  return {
    primary,
    secondary,
    accent,
    background,
    surface,
    elevated,
    text,
    muted,
    border,
    success,
    warning,
    danger,
    onPrimary: bestTextOn(primary),
    onSecondary: bestTextOn(secondary),
    onAccent: bestTextOn(accent),
  };
}

export const PRESETS: { name: string; seeds: string[]; mood: Mood }[] = [
  { name: "Grove", seeds: ["#4F6F5A", "#C9BBA8", "#B8573A"], mood: "modern" },
  { name: "Harbor", seeds: ["#2F4A5C", "#A8B7C0", "#C4A574"], mood: "soft" },
  { name: "Ember", seeds: ["#8C3A2A", "#E8D5C4", "#2C2420"], mood: "dark" },
  { name: "Iris", seeds: ["#5B4B8A", "#C4B8A5", "#E07A5F"], mood: "modern" },
  { name: "Ink", seeds: ["#1F2428", "#D7D2C8", "#6F8F7A"], mood: "minimal" },
  { name: "Bloom", seeds: ["#C48B9F", "#F3E4D8", "#5C6B52"], mood: "pastel" },
];

export type Seed = { id: string; hex: string; locked: boolean };

export function newSeedId(): string {
  return `s_${Math.random().toString(36).slice(2, 9)}`;
}

export function defaultSeeds(): Seed[] {
  return PRESETS[0]!.seeds.map((hex) => ({
    id: newSeedId(),
    hex,
    locked: false,
  }));
}
