import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  contrastRatio,
  contrastGrade,
  ensureContrast,
  mixHex,
  relativeLuminance,
} from "./color";

describe("parseHex", () => {
  it("parses 6-digit hex", () => {
    assert.equal(parseHex("#4F6F5A"), "#4F6F5A");
    assert.equal(parseHex("4f6f5a"), "#4F6F5A");
  });
  it("parses 3-digit hex", () => {
    assert.equal(parseHex("#abc"), "#AABBCC");
  });
  it("rejects invalid", () => {
    assert.equal(parseHex(""), null);
    assert.equal(parseHex("not-a-color"), null);
    assert.equal(parseHex("#gg0000"), null);
  });
});

describe("hexToRgb / rgbToHex", () => {
  it("round-trips", () => {
    assert.deepEqual(hexToRgb("#FF0000"), { r: 255, g: 0, b: 0 });
    assert.equal(rgbToHex({ r: 255, g: 0, b: 0 }), "#FF0000");
    assert.equal(rgbToHex(hexToRgb("#4F6F5A")), "#4F6F5A");
  });
  it("clamps out of range", () => {
    assert.equal(rgbToHex({ r: 300, g: -10, b: 128 }), "#FF0080");
  });
});

describe("RGB/HSL", () => {
  it("converts pure colors", () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    assert.ok(Math.abs(hsl.h - 0) < 1);
    assert.ok(hsl.s > 99);
    const rgb = hslToRgb({ h: 120, s: 100, l: 50 });
    assert.equal(rgb.g, 255);
    assert.equal(rgb.r, 0);
  });
});

describe("contrastRatio / grade", () => {
  it("black on white is max contrast", () => {
    const r = contrastRatio("#000000", "#FFFFFF");
    assert.ok(r > 20);
    assert.equal(contrastGrade(r), "AAA");
  });
  it("identical colors fail", () => {
    assert.equal(contrastGrade(contrastRatio("#808080", "#808080")), "fail");
  });
  it("grades thresholds", () => {
    assert.equal(contrastGrade(7), "AAA");
    assert.equal(contrastGrade(4.5), "AA");
    assert.equal(contrastGrade(3), "fail");
    assert.equal(contrastGrade(3, true), "AA");
  });
});

describe("ensureContrast", () => {
  it("raises contrast against dark bg", () => {
    const bg = "#111111";
    const result = ensureContrast("#333333", bg, 4.5);
    assert.ok(contrastRatio(result, bg) >= 4.5);
  });
  it("handles near-white on white", () => {
    const bg = "#FFFFFF";
    const result = ensureContrast("#EEEEEE", bg, 4.5);
    assert.ok(contrastRatio(result, bg) >= 4.5);
  });
});

describe("mixHex", () => {
  it("midpoint of black and white is gray", () => {
    assert.equal(mixHex("#000000", "#FFFFFF", 0.5), "#808080");
  });
});

describe("relativeLuminance", () => {
  it("white is 1, black is 0", () => {
    assert.ok(Math.abs(relativeLuminance("#FFFFFF") - 1) < 0.001);
    assert.ok(relativeLuminance("#000000") < 0.001);
  });
});
