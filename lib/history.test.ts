import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseSaved } from "./history";

describe("parseSaved", () => {
  it("accepts valid entry", () => {
    const s = parseSaved({
      id: "h_1",
      at: 1,
      seeds: ["#4F6F5A", "#ABC"],
      mood: "modern",
      harmony: "custom",
    });
    assert.ok(s);
    assert.equal(s!.seeds[0], "#4F6F5A");
    assert.equal(s!.seeds[1], "#AABBCC");
  });

  it("rejects bad mood / seeds", () => {
    assert.equal(
      parseSaved({ id: "x", at: 1, seeds: ["#000"], mood: "nope", harmony: "custom" }),
      null,
    );
    assert.equal(
      parseSaved({ id: "x", at: 1, seeds: ["bad"], mood: "modern", harmony: "custom" }),
      null,
    );
    assert.equal(parseSaved(null), null);
  });
});
