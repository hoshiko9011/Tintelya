import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generatePalette } from "./palette";
import {
  EXPORT_KEYS,
  paletteAsCss,
  paletteAsJson,
  paletteAsLines,
  paletteAsTailwind,
} from "./export-palette";

const palette = generatePalette(
  ["#4F6F5A", "#C9BBA8", "#B8573A"],
  "modern",
  "custom",
);

describe("EXPORT_KEYS", () => {
  it("covers all 15 semantic tokens", () => {
    assert.equal(EXPORT_KEYS.length, 15);
    const keys = new Set(EXPORT_KEYS.map((e) => e.key));
    for (const k of [
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
    ] as const) {
      assert.ok(keys.has(k), k);
    }
  });
});

describe("paletteAsLines", () => {
  it("includes every token name and value", () => {
    const text = paletteAsLines(palette);
    for (const { key, name } of EXPORT_KEYS) {
      assert.ok(text.includes(name), name);
      assert.ok(text.includes(palette[key]), key);
    }
  });
});

describe("paletteAsCss", () => {
  it("emits :root custom properties for every token", () => {
    const css = paletteAsCss(palette);
    assert.ok(css.startsWith(":root"));
    for (const { key, css: name } of EXPORT_KEYS) {
      assert.ok(css.includes(`--color-${name}: ${palette[key]};`), name);
    }
  });
});

describe("paletteAsTailwind", () => {
  it("emits @theme variables for every token", () => {
    const tw = paletteAsTailwind(palette);
    assert.ok(tw.startsWith("@theme"));
    for (const { key, css: name } of EXPORT_KEYS) {
      assert.ok(tw.includes(`--color-${name}: ${palette[key]};`), name);
    }
  });
});

describe("paletteAsJson", () => {
  it("is valid JSON with all colors and metadata", () => {
    const raw = paletteAsJson(palette, {
      mood: "modern",
      harmony: "custom",
      seeds: ["#4F6F5A", "#C9BBA8", "#B8573A"],
    });
    const data = JSON.parse(raw) as {
      mood: string;
      harmony: string;
      seeds: string[];
      colors: Record<string, string>;
    };
    assert.equal(data.mood, "modern");
    assert.equal(data.harmony, "custom");
    assert.equal(data.seeds.length, 3);
    for (const { key } of EXPORT_KEYS) {
      assert.equal(data.colors[key], palette[key]);
    }
  });
});
