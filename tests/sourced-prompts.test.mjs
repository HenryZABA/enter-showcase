import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

const directory = new URL("../public/_prompts/sourced/", import.meta.url);
const metadata = readFileSync(new URL("../src/data/model-pages/trending-prompts.ts", import.meta.url), "utf8");

test("only twelve distinct, hash-verified original prompt assets ship", () => {
  const files = readdirSync(directory).sort();
  assert.equal(files.length, 12);
  for (const file of files) {
    const bytes = readFileSync(new URL(file, directory));
    const sha = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
    assert.match(file, new RegExp(`-${sha}\\.txt$`));
    assert.equal(metadata.split(`sourced/${file}`).length - 1, 1);
    assert.ok(bytes.length > 0);
  }
  assert.equal((metadata.match(/group: "shared", promptUrl:/g) ?? []).length, 9);
  assert.equal((metadata.match(/group: "gpt", promptUrl:/g) ?? []).length, 3);
  assert.match(metadata, /"gpt-6-astra": \[\]/);
  assert.match(metadata, /"gpt-6-sol-luna": sourcedPrompts/);
  assert.match(metadata, /"claude-opus-5-5": sourcedPrompts\.filter\(entry => entry\.group === "shared"\)/);
});
