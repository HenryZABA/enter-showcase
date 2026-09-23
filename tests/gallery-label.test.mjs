import assert from "node:assert/strict";
import { test } from "node:test";
import { fitGalleryLabel } from "../src/lib/curved-gallery/label.ts";

const measure = text => Array.from(text).length * 10;

test("short gallery labels remain verbatim", () => {
  assert.equal(fitGalleryLabel("探索 Prompts", 200, measure), "探索 Prompts");
});

test("long labels truncate without horizontally compressing Chinese glyphs", () => {
  const result = fitGalleryLabel("探索完整提示词合集", 60, measure);
  assert.equal(result, "探索完整提…");
  assert.ok(measure(result) <= 60);
  assert.equal(fitGalleryLabel("探索", 0, measure), "");
});
