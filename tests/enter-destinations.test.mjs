import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

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

test("prompt body is read-only; downloads are in the detail toolbars", () => {
  const body = read("src/components/case-library/prompt-panel.tsx");
  assert.doesNotMatch(body, /handleCopy|handleDownload|copyText|downloadTextFile|common\.copy|common\.download/);
  assert.match(body, /whitespace-pre-wrap/);
  for (const path of ["case-detail-dialog.tsx", "prompt-detail-shell.tsx"]) {
    assert.match(read("src/components/case-library/"+path), /<DownloadPromptButton/);
  }
});
