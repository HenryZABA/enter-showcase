import assert from "node:assert/strict";
import { test } from "node:test";
import { copyPromptAndOpenEnter } from "../src/lib/model-prompt-action.ts";

test("copies the exact edited prompt before opening Enter without prompt parameters", async () => {
  const calls = [];
  const text = "  为我的咖啡店创建网站\nUse warm colours & keep the menu editable.  ";
  await copyPromptAndOpenEnter(text, {
    copy: async value => { calls.push(["copy", value]); },
    navigate: url => { calls.push(["navigate", url]); },
  });
  assert.deepEqual(calls, [["copy", text], ["navigate", "https://enter.converge.ai/"]]);
});

test("does not copy or navigate for empty and whitespace-only input", async () => {
  for (const prompt of ["", "  ", "\n\t"]) {
    await copyPromptAndOpenEnter(prompt, {
      copy: async () => assert.fail("Empty input must not write the clipboard"),
      navigate: () => assert.fail("Empty input must not navigate"),
    });
  }
});

test("waits for clipboard completion before navigating", async () => {
  let finishCopy;
  let navigated = false;
  const pending = copyPromptAndOpenEnter("A new project", {
    copy: () => new Promise(resolve => { finishCopy = resolve; }),
    navigate: () => { navigated = true; },
  });
  await Promise.resolve();
  assert.equal(navigated, false);
  finishCopy();
  await pending;
  assert.equal(navigated, true);
});

test("clipboard denial rejects without navigating", async () => {
  await assert.rejects(copyPromptAndOpenEnter("My project", {
    copy: async () => { throw new Error("Clipboard denied"); },
    navigate: () => assert.fail("Denied clipboard must not navigate"),
  }), /Clipboard denied/);
});

test("unavailable clipboard rejects without navigating", async () => {
  await assert.rejects(copyPromptAndOpenEnter("My project", {
    copy: () => { throw new TypeError("Clipboard unavailable"); },
    navigate: () => assert.fail("Unavailable clipboard must not navigate"),
  }), /Clipboard unavailable/);
});
