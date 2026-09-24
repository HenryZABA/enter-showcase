import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as React from "react";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/case-library/model-trending-prompts.tsx", import.meta.url), "utf8");
const cardFunction = source.slice(source.indexOf("function TrendingPromptCard("), source.indexOf("export function ModelTrendingPrompts("));
const compile = code => ts.transpileModule(code, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
const flatten = element => React.isValidElement(element) ? [element, ...React.Children.toArray(element.props.children).flatMap(flatten)] : [];
const entry = { id: "test", title: { en: "Original" }, description: { en: "Description" }, promptUrl: "/_prompts/test.txt", sourceName: "Author", sourceUrl: "https://example.test/source", kind: "original", media: { type: "video", src: "video.mp4", poster: "poster.webp" } };

function renderCard(copyOk = true) {
  const sourceElement = {};
  const opened = [], requests = [], copied = [], navigated = [];
  const dependencies = {
    React, useTranslation: () => ({ t: key => key }), useCurrentLanguage: () => "en",
    useRef: () => ({ current: sourceElement }), useState: value => [value, () => {}],
    loadPrompt: async url => { requests.push(url); return "exact\noriginal"; },
    copyText: async text => { copied.push(text); return copyOk; }, toast: { success() {}, error() {} },
    openEnter: () => navigated.push("https://enter.converge.ai/s/B1GyrW"),
    pickLocalized: value => value.en, HoverVideo: () => null,
    ArrowUpRight: () => null, ChevronRight: () => null, LoaderCircle: () => null, Copy: () => null,
  };
  const Card = new Function(...Object.keys(dependencies), `${compile(cardFunction)}; return TrendingPromptCard;`)(...Object.values(dependencies));
  const nodes = flatten(Card({ entry, onOpen: detail => opened.push(detail) }));
  return { nodes, opened, requests, copied, navigated, sourceElement, HoverVideo: dependencies.HoverVideo };
}

test("prompt list has no inline disclosure or eager body request", () => {
  const view = renderCard();
  assert.equal(view.nodes.some(node => node.type === "details" || node.type === "pre"), false);
  assert.equal(view.requests.length, 0);
});

test("read button opens a detail card with the real source and without library focus", () => {
  const view = renderCard(), trigger = {};
  view.nodes.find(node => node.props.className === "model-trending-read").props.onClick({ currentTarget: trigger });
  assert.deepEqual(view.opened, [{ entry, origin: { source: view.sourceElement, trigger }, focusAfterClose: false }]);
  assert.equal(view.requests.length, 0);
});

test("title opens detail and defers primary library focus until after close", () => {
  const view = renderCard(), trigger = {};
  view.nodes.find(node => node.props.className?.includes("model-trending-title-button")).props.onClick({ currentTarget: trigger });
  assert.equal(view.opened[0].focusAfterClose, true);
  assert.equal(view.opened[0].origin.trigger, trigger);
});

test("copy remains direct and video/source controls do not receive detail open handlers", async () => {
  const view = renderCard();
  view.nodes.find(node => node.props.className?.includes("model-trending-copy")).props.onClick();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(view.copied, ["exact\noriginal"]);
  assert.deepEqual(view.navigated, ["https://enter.converge.ai/s/B1GyrW"]);
  assert.equal(view.opened.length, 0);
  assert.equal(view.nodes.find(node => node.type === view.HoverVideo).props.onClick, undefined);
  assert.equal(view.nodes.find(node => node.type === "a").props.onClick, undefined);
});

test("failed list-card copy does not open Enter", async () => {
  const view = renderCard(false);
  view.nodes.find(node => node.props.className?.includes("model-trending-copy")).props.onClick();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(view.navigated.length, 0);
});

test("only a primary-entry detail close activates the other-library collapse", () => {
  for (const focusAfterClose of [false, true]) {
    let focusCalls = 0;
    const states = [];
    const Shell = () => null;
    const dependencies = {
      React, useTranslation: () => ({ t: key => key }), useCallback: fn => fn,
      useState: () => [{ entry, origin: {}, focusAfterClose }, value => states.push(value)],
      TrendingPromptCard: () => null, PromptDetailShell: Shell, BookText: () => null,
    };
    const fn = source.slice(source.indexOf("export function ModelTrendingPrompts(")).replace("export function", "function");
    const Grid = new Function(...Object.keys(dependencies), `${compile(fn)}; return ModelTrendingPrompts;`)(...Object.values(dependencies));
    const nodes = flatten(Grid({ entries: [entry], onPrimaryAction: () => { focusCalls += 1; } }));
    assert.equal(focusCalls, 0);
    nodes.find(node => node.type === Shell).props.onClosed();
    assert.deepEqual(states, [null]);
    assert.equal(focusCalls, focusAfterClose ? 1 : 0);
  }
});

test("prompt shell shares CaseFlipTransition and defers PromptPanel to settled detail", () => {
  const shell = readFileSync(new URL("../src/components/case-library/prompt-detail-shell.tsx", import.meta.url), "utf8");
  assert.match(shell, /import \{ CaseFlipTransition \} from "\.\/case-flip-transition"/);
  assert.match(shell, /settled && <PromptDetailBody/);
  assert.match(shell, /import\("\.\/prompt-panel"\)/);
  assert.match(shell, /promptKind="original"/);
  assert.doesNotMatch(shell, /LiveFrame|previewUrl/);
});
