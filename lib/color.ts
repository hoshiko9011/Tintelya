export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };

const HEX6 = /^#?([0-9A-Fa-f]{6})$/;
const HEX3 = /^#?([0-9A-Fa-f]{3})$/;

export function parseHex(input: string): string | null {
  const trimmed = input.trim();
  const six = trimmed.match(HEX6);
  if (six) return `#${six[1]!.toUpperCase()}`;
  const three = trimmed.match(HEX3);
  if (three) {
    const [a, b, c] = three[1]!;
    return `#${a}${a}${b}${b}${c}${c}`.toUpperCase();
  }
  return null;
}

export function hexToRgb(hex: string): RGB {
  const parsed = parseHex(hex);
  if (!parsed) return { r: 0, g: 0, b: 0 };
  const n = parsed.slice(1);
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(100, s)) / 100;
  const ll = Math.max(0, Math.min(100, l)) / 100;
  const k = (n: number) => (n + hh / 30) % 12;
  const a = ss * Math.min(ll, 1 - ll);
  const f = (n: number) =>
    ll - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function rotateHue(hex: string, deg: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, h: hsl.h + deg });
}

function channelLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

export function contrastRatio(a: string, b: string): number {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

export type ContrastGrade = "fail" | "AA" | "AAA";

export function contrastGrade(ratio: number, large = false): ContrastGrade {
  const aa = large ? 3 : 4.5;
  const aaa = large ? 4.5 : 7;
  if (ratio >= aaa) return "AAA";
  if (ratio >= aa) return "AA";
  return "fail";
}

export function bestTextOn(
  bg: string,
  dark = "#171411",
  light = "#FAFAF7",
): string {
  return contrastRatio(light, bg) >= contrastRatio(dark, bg) ? light : dark;
}

export function ensureContrast(fg: string, bg: string, min = 4.5): string {
  const goLight = relativeLuminance(bg) < 0.45;
  let hsl = hexToHsl(fg);
  let steps = 0;
  while (contrastRatio(hslToHex(hsl), bg) < min && steps < 50) {
    hsl = {
      ...hsl,
      l: goLight ? Math.min(100, hsl.l + 2) : Math.max(0, hsl.l - 2),
    };
    steps += 1;
  }
  const result = hslToHex(hsl);
  return contrastRatio(result, bg) < min ? bestTextOn(bg) : result;
}

export function randomHex(rng: () => number = Math.random): string {
  return hslToHex({
    h: rng() * 360,
    s: 38 + rng() * 36,
    l: 38 + rng() * 22,
  });
}
