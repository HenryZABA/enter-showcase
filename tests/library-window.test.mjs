import assert from "node:assert/strict";
import { test } from "node:test";
import { libraryWindow } from "../src/components/case-library/library-window.ts";

for (const [total, expectedMore] of [[0, false], [9, false], [10, true], [12, true], [14, true], [25, true]]) {
  test(`library preview is bounded to nine for ${total} items`, () => {
    const window = libraryWindow(total, false, false, 1);
    assert.equal(window.size, 9);
    assert.equal(window.more, expectedMore);
    assert.equal(Math.min(window.size, total), Math.min(9, total));
  });
}

test("focusing or exploring shows up to 24 and pages 25 items", () => {
  assert.deepEqual(libraryWindow(25, false, true, 1), { start: 0, size: 24, more: false, pages: 2, current: 1 });
  assert.deepEqual(libraryWindow(25, true, false, 2), { start: 24, size: 24, more: false, pages: 2, current: 2 });
  assert.deepEqual(libraryWindow(0, true, true, 99), { start: 0, size: 24, more: false, pages: 1, current: 1 });
});
