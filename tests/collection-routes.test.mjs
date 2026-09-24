import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as React from "react";
import { createRoutesFromElements, matchRoutes, Route } from "react-router-dom";
import ts from "typescript";
import { withEntryPrefix, assetPath } from "../src/lib/app-paths.ts";

const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const factory = app.slice(app.indexOf("function createShowcaseRoutes("), app.indexOf("export default function App("));
const compiled = ts.transpileModule(factory, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
const names = ["RootRedirect", "ShowcasesPage", "ShowcaseCollectionsPage", "Gpt6AstraPage", "Gpt6SolLunaPage", "ClaudeOpus55Page", "CollectionPage", "PageRedirect"];
// Evaluate the actual production route factory with inert page components; no DOM or providers needed.
const createRoutes = new Function("React", "Route", ...names, `${compiled}; return createShowcaseRoutes;`)(React, Route, ...names.map(() => () => null));
const routes = createRoutesFromElements([...createRoutes(""), ...createRoutes("/prompts")]);

for (const prefix of ["/prompts", "/showcases"]) {
  test(`${prefix} serves nested collection pages and redirects legacy model links`, () => {
    for (const slug of ["gpt-6-astra", "gpt-6-sol-luna", "claude-opus-5-5"]) {
      const path = `${prefix}/collection/${slug}`;
      const match = matchRoutes(routes, path).at(-1);
      assert.equal(match.route.path, path);
      const legacy = matchRoutes(routes, `${prefix}/${slug}`).at(-1);
      assert.equal(legacy.route.element.props.to, path);
      assert.equal(withEntryPrefix(`/showcases/collection/${slug}`, prefix), path);
    }
    assert.equal(matchRoutes(routes, `${prefix}/collections`).at(-1).route.element.props.to, `${prefix}/collection`);
    assert.equal(matchRoutes(routes, `${prefix}/collections/gpt6`).at(-1).route.element.props.legacy, true);
  });
}

test("redirects preserve language, campaign query and hash", () => {
  const redirect = app.slice(app.indexOf("function PageRedirect("), app.indexOf("function RootRedirect("));
  const js = ts.transpileModule(redirect, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
  const render = new Function("React", "Navigate", "useLocation", `${js}; return PageRedirect;`)(React, () => null, () => ({ search: "?hl=zh-CN&utm_source=test", hash: "#prompts" }));
  assert.equal(render({ to: "/prompts/collection/gpt-6-sol-luna" }).props.to, "/prompts/collection/gpt-6-sol-luna?hl=zh-CN&utm_source=test#prompts");
  assert.equal(assetPath("sourced/example.txt"), "/_prompts/sourced/example.txt");
});
