import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generatePalette } from "./palette";

describe("generatePalette", () => {
  it("returns all semantic keys", () => {
    const p = generatePalette(["#4F6F5A"], "modern", "custom");
    for (const key of [
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
      assert.match(p[key], /^#[0-9A-F]{6}$/);
    }
  });

  it("uses five seed colors in custom harmony", () => {
    const seeds = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];
    const p = generatePalette(seeds, "modern", "custom");
    assert.ok(p.primary);
    const three = generatePalette(seeds.slice(0, 3), "modern", "custom");
    assert.notEqual(p.secondary, three.secondary);
  });

  it("handles single seed", () => {
    const p = generatePalette(["#2F4A5C"], "soft", "analogous");
    assert.match(p.primary, /^#/);
    assert.notEqual(p.secondary, p.primary);
  });

  it("handles invalid seeds via fallback", () => {
    const p = generatePalette(["nope"], "minimal", "mono");
    assert.match(p.primary, /^#[0-9A-F]{6}$/);
  });

  it("dark mood produces dark background", async () => {
    const p = generatePalette(["#8C3A2A"], "dark", "custom");
    const { relativeLuminance } = await import("./color");
    assert.ok(relativeLuminance(p.background) < 0.2);
  });
});
