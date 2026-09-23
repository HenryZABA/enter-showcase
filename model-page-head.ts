import fs from "node:fs";
import path from "node:path";
import { createInstance } from "i18next";
import type { PluginOption } from "vite";
import en from "./public/locales/en.json";
import { astraFaqSchema, astraModel, getAstraCopy } from "./src/data/model-pages/gpt-6-astra";

const escapeAttribute = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** Page-specific head output only; intentionally does not claim to prerender the CSR body. */
export function modelPageHeadPlugin(projectRoot: string): PluginOption {
  return {
    name: "enter-astra-model-head",
    async closeBundle() {
      const outDir = path.resolve(projectRoot, "dist");
      const source = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const i18n = createInstance();
      await i18n.init({ lng: "en", fallbackLng: "en", resources: { en: { translation: en } }, keySeparator: false, nsSeparator: false });
      const copy = getAstraCopy(i18n.getFixedT("en"));
      const originalDescription = source.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0];
      if (!originalDescription) throw new Error("Model page head requires the existing default description.");
      const originalContent = originalDescription.match(/content="([^"]*)"/)?.[1] ?? "";
      const meta = (name: string, content: string, property = false) => `<meta data-model-static ${property ? "property" : "name"}="${name}" content="${escapeAttribute(content)}">`;
      const tags = [
        meta("keywords", astraModel.keywords),
        `<link data-model-static rel="canonical" href="${astraModel.canonical}">`,
        meta("og:title", copy.title, true),
        meta("og:description", copy.description, true),
        meta("og:type", "website", true),
        meta("og:url", astraModel.canonical, true),
        meta("og:image", new URL(astraModel.image, astraModel.canonical).href, true),
        `<script data-model-static type="application/ld+json">${JSON.stringify(astraFaqSchema(copy.faqs)).replaceAll("<", "\\u003c")}</script>`,
      ].join("");
      const html = source
        .replace(/<title>.*?<\/title>/s, `<title>${escapeAttribute(copy.title)}</title>`)
        .replace(originalDescription, `<meta data-model-static data-default-content="${originalContent}" name="description" content="${escapeAttribute(copy.description)}">`)
        .replace("</head>", `${tags}</head>`);
      for (const route of ["prompts/gpt-6-astra", "showcases/gpt-6-astra"]) {
        const destination = path.join(outDir, route);
        fs.mkdirSync(destination, { recursive: true });
        fs.writeFileSync(path.join(destination, "index.html"), html);
      }
    },
  };
}
