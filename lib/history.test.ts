import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseSaved, writeHistory, HISTORY_KEY, MAX_HISTORY } from "./history";

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
      parseSaved({ id: "x", at: 1, seeds: ["not-a-color"], mood: "modern", harmony: "custom" }),
      null,
    );
    assert.equal(parseSaved(null), null);
  });

  it("rejects empty or oversized seed lists", () => {
    assert.equal(
      parseSaved({ id: "x", at: 1, seeds: [], mood: "modern", harmony: "custom" }),
      null,
    );
    assert.equal(
      parseSaved({
        id: "x",
        at: 1,
        seeds: ["#111111", "#222222", "#333333", "#444444", "#555555", "#666666"],
        mood: "modern",
        harmony: "custom",
      }),
      null,
    );
  });
});

describe("history constants", () => {
  it("exposes storage key and limit", () => {
    assert.equal(HISTORY_KEY, "tintelya.history");
    assert.equal(MAX_HISTORY, 12);
  });
});

describe("writeHistory", () => {
  it("returns a boolean (false when localStorage is unavailable)", () => {
    const result = writeHistory([
      {
        id: "h_test",
        at: 1,
        seeds: ["#4F6F5A"],
        mood: "modern",
        harmony: "custom",
      },
    ]);
    assert.equal(typeof result, "boolean");
  });
});
