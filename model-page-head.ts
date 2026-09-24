import fs from "node:fs";
import path from "node:path";
import { createInstance, type TFunction } from "i18next";
import type { PluginOption } from "vite";
import en from "./public/locales/en.json";
import { astraModel, getAstraCopy } from "./src/data/model-pages/gpt-6-astra";
import { getSolLunaCopy, solLunaModel } from "./src/data/model-pages/gpt-6-sol-luna";
import { getOpusCopy, opusModel } from "./src/data/model-pages/claude-opus-5-5";
import { modelFaqSchema, type ModelPageCopy, type ModelPageModel } from "./src/data/model-pages/types";

const escapeAttribute = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

type StaticModelPage = { model: ModelPageModel; getCopy: (t: TFunction) => ModelPageCopy };
const modelPages: StaticModelPage[] = [
  { model: astraModel, getCopy: getAstraCopy },
  { model: solLunaModel, getCopy: getSolLunaCopy },
  { model: opusModel, getCopy: getOpusCopy },
];

/** Page-specific head output only; intentionally does not claim to prerender the CSR body. */
export function modelPageHeadPlugin(projectRoot: string): PluginOption {
  return {
    name: "enter-model-page-head",
    async closeBundle() {
      const outDir = path.resolve(projectRoot, "dist");
      const source = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const i18n = createInstance();
      await i18n.init({ lng: "en", fallbackLng: "en", resources: { en: { translation: en } }, keySeparator: false, nsSeparator: false });
      const originalDescription = source.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0];
      if (!originalDescription) throw new Error("Model page head requires the existing default description.");
      const originalContent = originalDescription.match(/content="([^"]*)"/)?.[1] ?? "";
      const meta = (name: string, content: string, property = false) => `<meta data-model-static ${property ? "property" : "name"}="${name}" content="${escapeAttribute(content)}">`;

      for (const { model, getCopy } of modelPages) {
        const copy = getCopy(i18n.getFixedT("en"));
        const tags = [
          meta("keywords", model.keywords),
          `<link data-model-static rel="canonical" href="${model.canonical}">`,
          meta("og:title", copy.title, true),
          meta("og:description", copy.description, true),
          meta("og:type", "website", true),
          meta("og:url", model.canonical, true),
          meta("og:image", new URL(model.image, model.canonical).href, true),
          ...(copy.faqs.length ? [`<script data-model-static type="application/ld+json">${JSON.stringify(modelFaqSchema(copy.faqs)).replaceAll("<", "\\u003c")}</script>`] : []),
        ].join("");
        const html = source
          .replace(/<title>.*?<\/title>/s, `<title>${escapeAttribute(copy.title)}</title>`)
          .replace(originalDescription, `<meta data-model-static data-default-content="${originalContent}" name="description" content="${escapeAttribute(copy.description)}">`)
          .replace("</head>", `${tags}</head>`);
        for (const prefix of ["prompts", "showcases"]) {
          // Retain legacy entry HTML; React redirects it to the new collection URL.
          for (const route of [path.join(prefix, "collection", model.slug), path.join(prefix, model.slug)]) {
            const destination = path.join(outDir, route);
            fs.mkdirSync(destination, { recursive: true });
            fs.writeFileSync(path.join(destination, "index.html"), html);
          }
        }
      }
    },
  };
}
