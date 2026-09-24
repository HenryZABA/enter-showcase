import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as React from "react";
import ts from "typescript";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const flatten = element => React.isValidElement(element) ? [element, ...React.Children.toArray(element.props.children).flatMap(flatten)] : [];

test("generic Enter links share one destination without rewriting project remixes or SEO", () => {
  const footer = read("src/data/footer.ts");
  assert.equal((footer.match(/href: ENTER_DESTINATION/g) ?? []).length, 21);
  assert.doesNotMatch(footer, /href: "https:\/\/enter\.converge\.ai\//);
  assert.match(read("src/components/case-library/hero-stage.tsx"), /href=\{ENTER_DESTINATION\}/);
  const remixes = [...read("src/data/cases.ts").matchAll(/remixUrl: "([^"]+)"/g)].map(match => new URL(match[1]));
  assert.equal(remixes.length, 12);
  assert.ok(remixes.every(url => url.pathname === "/workspace/" && /^[a-f0-9]{32}$/.test(url.searchParams.get("assetId"))));
  assert.match(read("src/data/model-pages/gpt-6-sol-luna.ts"), /canonical: "https:\/\/enter\.converge\.ai\/prompts\/collection\/gpt-6-sol-luna"/);
});

for (const successful of [true, false]) {
  test(`detail copy and download ${successful ? "open Enter after success" : "do not navigate on failure"}`, async () => {
    const source = read("src/components/case-library/prompt-panel.tsx");
    const fn = source.slice(source.indexOf("export const PromptPanel =")).replace("export const", "const");
    const compiled = ts.transpileModule(fn, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
    const calls = [];
    let state = 0;
    const Button = () => null;
    const dependencies = {
      React, useTranslation: () => ({ t: key => key }), useState: () => [["exact\nprompt", false, 0][state++], () => {}], useEffect: () => {},
      Button, Copy: () => null, Download: () => null, FileX2: () => null,
      copyText: async value => { calls.push(["copy", value]); return successful; },
      buildSinglePromptMarkdown: (_, text) => text,
      downloadTextFile: (_, text) => { calls.push(["download", text]); return successful; },
      sanitizeFilename: value => value, openEnter: () => calls.push(["navigate"]), toast: { success() {}, error() {} },
    };
    const Panel = new Function(...Object.keys(dependencies), `${compiled}; return PromptPanel;`)(...Object.values(dependencies));
    const nodes = flatten(Panel({ promptUrl: "/prompt.txt", promptKind: "original", title: "Title" }));
    const button = key => nodes.find(node => node.type === Button && React.Children.toArray(node.props.children).includes(key));
    await button("common.copy").props.onClick();
    assert.deepEqual(calls, successful ? [["copy", "exact\nprompt"], ["navigate"]] : [["copy", "exact\nprompt"]]);
    calls.length = 0;
    button("common.download").props.onClick();
    assert.deepEqual(calls, successful ? [["download", "exact\nprompt"], ["navigate"]] : [["download", "exact\nprompt"]]);
  });
}
