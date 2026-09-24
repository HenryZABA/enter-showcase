import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as React from "react";
import ts from "typescript";
import { sanitizeFilename } from "../src/lib/prompt-file.ts";

const NL = String.fromCharCode(10);
const original = ["原文", "```code```"].join(NL);
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const compile = code => ts.transpileModule(code, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
const source = read("src/components/case-library/download-prompt-button.tsx");
const fn = source.slice(source.indexOf("export function DownloadPromptButton(")).replace("export function", "function");
function render(props = {}, { failLoad = false, downloadOk = true } = {}) {
  const calls = [];
  const deps = {
    React, useTranslation: () => ({ t: key => key }), useRef: () => ({ current: false }), useState: initial => [initial, () => {}],
    Button: () => null, Download: () => null, LoaderCircle: () => null,
    loadPrompt: async url => { calls.push(["load", url]); if (failLoad) throw new Error("Network error"); return original; },
    loadMarkdown: async () => ({ buildSinglePromptMarkdown: (title, text, kind) => [title, kind, text].join(NL) }),
    sanitizeFilename, downloadTextFile: (name, text) => { calls.push(["download", name, text]); return downloadOk; },
    openEnter: () => calls.push(["enter"]), toast: { success: key => calls.push(["success", key]), error: key => calls.push(["error", key]) },
  };
  const Component = new Function(...Object.keys(deps), `${compile(fn)}; return DownloadPromptButton;`)(...Object.values(deps));
  return { element: Component({ title: "A / Prompt", promptKind: "original", promptUrl: "/original.txt", ...props }), calls };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test("shared action downloads MD before opening Enter, with no clipboard access", async () => {
  const view = render();
  assert.deepEqual(view.calls, []);
  view.element.props.onClick(); view.element.props.onClick();
  await flush();
  assert.deepEqual(view.calls, [["load", "/original.txt"], ["download", "A-Prompt-prompt.md", ["A / Prompt", "original", original].join(NL)], ["success", "common.downloadStarted"], ["enter"]]);
  assert.doesNotMatch(source, /clipboard|copyText/);
});

test("explicit prompt text is downloaded verbatim instead of refetching the original", async () => {
  const edited = ["  Edited", "提示词  "].join(NL);
  const view = render({ promptText: edited, promptKind: "recreation" });
  view.element.props.onClick(); await flush();
  assert.equal(view.calls.some(call => call[0] === "load"), false);
  assert.equal(view.calls[0][2], ["A / Prompt", "recreation", edited].join(NL));
});

for (const options of [{ failLoad: true }, { downloadOk: false }]) {
  test(`failed download never redirects: ${JSON.stringify(options)}`, async () => {
    const view = render({}, options); view.element.props.onClick(); await flush();
    assert.equal(view.calls.some(call => call[0] === "enter"), false);
    assert.deepEqual(view.calls.at(-1), ["error", "common.downloadFailed"]);
  });
}

test("missing and blank prompts have disabled download actions", async () => {
  for (const props of [{ promptUrl: null }, { promptText: " " + NL }]) {
    const view = render(props); assert.equal(view.element.props.disabled, true);
    view.element.props.onClick(); await flush(); assert.deepEqual(view.calls, []);
  }
});

test("Case toolbar places the shared download immediately after Preview and Remix", () => {
  const code = read("src/components/case-library/case-detail-dialog.tsx");
  const text = code.slice(code.indexOf("export const CaseDetailDialog")).replace("export const", "const");
  const DownloadPromptButton = () => null;
  const deps = { React, useTranslation: () => ({ t: key => key }), useCurrentLanguage: () => "en", pickCaseTitle: entry => entry.title, Button: () => null, ArrowUpRight: () => null, Lock: () => null, PromptPanel: () => null, DownloadPromptButton };
  const Component = new Function(...Object.keys(deps), `${compile(text)}; return CaseDetailDialog;`)(...Object.values(deps));
  const result = Component({ entry: { id: "case", title: "Case", previewUrl: "preview", remixUrl: "remix", promptUrl: "prompt", promptKind: "original" } });
  const row = React.Children.toArray(result.props.children)[0];
  const actions = React.Children.toArray(row.props.children);
  assert.match(row.props.className, /prompt-detail-actions/);
  assert.equal(actions.length, 3);
  assert.equal(actions[2].type, DownloadPromptButton);
  assert.equal(actions[2].props.promptUrl, "prompt");
});

test("MD formatter preserves original text and safely fences embedded backticks", () => {
  const bundle = read("src/lib/prompt-bundle.ts");
  const code = bundle.slice(bundle.indexOf("/** Minimal"), bundle.indexOf("/** Build a provenance")).replace(/export /g, "");
  const format = new Function(`${compile(code)}; return buildSinglePromptMarkdown;`)();
  const text = ["中文", "```js", "const a = 1;", "```", ""].join(NL);
  const markdown = format("Title", text, "original", key => key);
  assert.ok(markdown.startsWith("# Title" + NL)); assert.ok(markdown.includes(text)); assert.ok(markdown.includes("````text" + NL));
});
