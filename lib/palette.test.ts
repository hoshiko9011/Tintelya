import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generatePalette, HARMONIES, MOODS, type Harmony, type Mood } from "./palette";
import { relativeLuminance } from "./color";

const TOKEN_KEYS = [
  "primary",
  "secondary",
  "accent",
  "background",
  "surface",
  "elevated",
  "text",
  "muted",
  "border",
  "success",
  "warning",
  "danger",
  "onPrimary",
  "onSecondary",
  "onAccent",
] as const;

function assertValidPalette(p: ReturnType<typeof generatePalette>) {
  for (const key of TOKEN_KEYS) {
    assert.match(p[key], /^#[0-9A-F]{6}$/, `${key} should be uppercase 6-digit hex`);
  }
}

describe("generatePalette", () => {
  it("returns all 15 semantic tokens as uppercase hex", () => {
    assertValidPalette(generatePalette(["#4F6F5A"], "modern", "custom"));
  });

  it("one seed: valid and deterministic", () => {
    const a = generatePalette(["#2F4A5C"], "soft", "analogous");
    const b = generatePalette(["#2F4A5C"], "soft", "analogous");
    assert.deepEqual(a, b);
    assertValidPalette(a);
    assert.notEqual(a.secondary, a.primary);
  });

  it("two seeds: custom uses both for primary and secondary", () => {
    const s0 = "#FF0000";
    const s1 = "#00FF00";
    const p = generatePalette([s0, s1], "modern", "custom");
    assertValidPalette(p);
    const one = generatePalette([s0], "modern", "custom");
    assert.notEqual(p.secondary, one.secondary);
  });

  it("three seeds: custom incorporates third into accent path", () => {
    const seeds = ["#FF0000", "#00FF00", "#0000FF"];
    const p = generatePalette(seeds, "modern", "custom");
    const two = generatePalette(seeds.slice(0, 2), "modern", "custom");
    assert.notEqual(p.accent, two.accent);
  });

  it("four seeds: fourth seed shifts secondary via mix", () => {
    const base = ["#FF0000", "#00FF00", "#0000FF"];
    const withFourth = [...base, "#FFFF00"];
    const three = generatePalette(base, "modern", "custom");
    const four = generatePalette(withFourth, "modern", "custom");
    assert.notEqual(four.secondary, three.secondary);
  });

  it("five seeds: fifth seed shifts accent via mix", () => {
    const four = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
    const five = [...four, "#FF00FF"];
    const p4 = generatePalette(four, "modern", "custom");
    const p5 = generatePalette(five, "modern", "custom");
    assert.notEqual(p5.accent, p4.accent);
  });

  it("invalid seeds fall back to a valid palette", () => {
    const p = generatePalette(["nope"], "minimal", "mono");
    assertValidPalette(p);
  });

  it("dark mood produces dark background", () => {
    const p = generatePalette(["#8C3A2A"], "dark", "custom");
    assert.ok(relativeLuminance(p.background) < 0.2);
  });

  for (const mood of MOODS.map((m) => m.id) as Mood[]) {
    it(`produces valid tokens for mood ${mood}`, () => {
      assertValidPalette(generatePalette(["#5B4B8A", "#C4B8A5"], mood, "custom"));
    });
  }

  for (const harmony of HARMONIES.map((h) => h.id) as Harmony[]) {
    it(`produces valid tokens for harmony ${harmony}`, () => {
      assertValidPalette(generatePalette(["#4F6F5A"], "modern", harmony));
    });
  }
});
