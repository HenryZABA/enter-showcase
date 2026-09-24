import assert from "node:assert/strict";
import { test } from "node:test";
import { ENTER_DESTINATION, openEnter } from "../src/lib/model-prompt-action.ts";

test("opens the supplied destination in a new tab and clears its opener", t => {
  const previous = globalThis.window;
  t.after(() => { globalThis.window = previous; });
  const tab = { opener: {} };
  globalThis.window = { open(url, target) { assert.equal(url, ENTER_DESTINATION); assert.equal(target, "_blank"); return tab; }, location: { assign: () => assert.fail("Must keep current page when a new tab opens") } };
  openEnter();
  assert.equal(tab.opener, null);
});

test("blocked popups still navigate to the exact same destination", t => {
  const previous = globalThis.window;
  t.after(() => { globalThis.window = previous; });
  const visited = [];
  globalThis.window = { open: () => null, location: { assign: url => visited.push(url) } };
  openEnter();
  assert.deepEqual(visited, ["https://enter.converge.ai/s/B1GyrW"]);
});
