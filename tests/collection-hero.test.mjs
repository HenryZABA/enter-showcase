import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as React from "react";
import ts from "typescript";
import { ENTER_DESTINATION } from "../src/lib/model-prompt-action.ts";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const source = read("src/components/case-library/hero-stage.tsx");
const fn = source.slice(source.indexOf("export const HeroStage =")).replace("export const", "const");
const js = ts.transpileModule(fn, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText;
const Link = () => null;
const dependencies = { React, memo: fn => fn, useTranslation: () => ({ t: key => key }), Button: () => null, Link, ENTER_DESTINATION };
const Hero = new Function(...Object.keys(dependencies), `${js}; return HeroStage;`)(...Object.values(dependencies));
const flatten = element => React.isValidElement(element) ? [element, ...React.Children.toArray(element.props.children).flatMap(flatten)] : [];
const content = { eyebrow: "", titleLine1: "GPT-6 Sol & Luna", titleLine2: "Prompts and app examples", image: "/cover.webp", imageWidth: 1280, imageHeight: 720 };

test("compact collection hero shows overlaid text with one direct Build in Enter link", () => {
  const hero = Hero({ content, compact: true, blended: true });
  const nodes = flatten(hero);
  assert.match(hero.props.className, /showcase-hero-compact/);
  assert.equal(nodes.some(node => ["input", "textarea", "form"].includes(node.type)), false);
  assert.equal(nodes.filter(node => node.type === "h1").length, 1);
  const links = nodes.filter(node => node.type === "a");
  assert.equal(links.length, 1);
  assert.equal(links[0].props.href, "https://enter.converge.ai/s/B1GyrW");
  assert.equal(links[0].props.children, "hero.buildInEnter");
  assert.equal(links[0].props.target, "_blank");
  assert.equal(links[0].props.onClick, undefined);
  assert.equal(nodes.find(node => node.type === "img").props.fetchPriority, "high");
});

test("homepage hero keeps its original collection CTA and default height variant", () => {
  const path = "/prompts/collection/gpt-6-sol-luna?hl=en";
  const hero = Hero({ content, collectionHref: path, blended: true });
  assert.doesNotMatch(hero.props.className, /showcase-hero-compact/);
  assert.equal(flatten(hero).find(node => node.type === Link).props.to, path);
});

test("all three model pages use the shared compact hero and have no composer props", () => {
  const page = read("src/components/case-library/model-detail-page.tsx");
  assert.match(page, /<HeroStage compact blended/);
  assert.doesNotMatch(page, /ModelPromptComposer|initialPrompt/);
  for (const name of ["Gpt6AstraPage", "Gpt6SolLunaPage", "ClaudeOpus55Page"]) {
    const wrapper = read(`src/pages/showcase/${name}.tsx`);
    assert.match(wrapper, /<ModelDetailPage/);
    assert.doesNotMatch(wrapper, /initialPrompt/);
  }
});
