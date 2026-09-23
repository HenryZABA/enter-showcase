import { useEffect } from "react";
import { modelFaqSchema, type ModelFaq, type ModelPageModel } from "@/data/model-pages/types";

/** Restore previous head values when leaving this route, including prebuilt metadata. */
export function useModelPageSeo(model: ModelPageModel, title: string, description: string, faqs: ModelFaq[]) {
  const schema = JSON.stringify(modelFaqSchema(faqs));
  useEffect(() => {
    document.head.querySelectorAll("[data-model-static]").forEach(element => {
      if (element.matches('meta[name="description"]')) {
        element.setAttribute("content", element.getAttribute("data-default-content") ?? "");
        element.removeAttribute("data-default-content");
        element.removeAttribute("data-model-static");
      } else {
        element.remove();
      }
    });
    const restore: (() => void)[] = [];
    const setTag = (selector: string, tag: "meta" | "link", attributes: Record<string, string>) => {
      const existing = document.head.querySelector(selector);
      const element = existing ?? document.createElement(tag);
      const previous = Object.fromEntries(Object.keys(attributes).map(key => [key, element.getAttribute(key)]));
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      if (!existing) document.head.append(element);
      restore.push(() => {
        if (!existing) { element.remove(); return; }
        Object.entries(previous).forEach(([key, value]) => value === null ? element.removeAttribute(key) : element.setAttribute(key, value));
      });
    };
    setTag('meta[name="description"]', "meta", { name: "description", content: description });
    setTag('meta[name="keywords"]', "meta", { name: "keywords", content: model.keywords });
    setTag('link[rel="canonical"]', "link", { rel: "canonical", href: model.canonical });
    const image = new URL(model.image, model.canonical).href;
    for (const [property, content] of Object.entries({ "og:title": title, "og:description": description, "og:type": "website", "og:url": model.canonical, "og:image": image })) {
      setTag(`meta[property="${property}"]`, "meta", { property, content });
    }
    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.dataset.modelSeo = model.slug;
    structuredData.textContent = schema;
    document.head.append(structuredData);
    return () => { restore.reverse().forEach(cleanup => cleanup()); structuredData.remove(); };
  }, [model, title, description, schema]);
}
