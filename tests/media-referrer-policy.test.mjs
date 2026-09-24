import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("document suppresses cross-origin Referer before loading media resources", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const policy = '<meta name="referrer" content="same-origin">';
  assert.ok(html.includes(policy), "External video hosts reject the preview Referer with HTTP 403");
  assert.ok(html.indexOf(policy) < html.indexOf('<script'), "Policy must apply before the player initializes");
  assert.ok(html.indexOf(policy) < html.indexOf('<link'), "Policy should precede external resource discovery");
});
