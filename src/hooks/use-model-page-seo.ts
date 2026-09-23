import { useEffect } from "react";
import { astraModel, astraFaqSchema, type ModelFaq } from "@/data/model-pages/gpt-6-astra";

/** Restore previous head values when leaving this route, including prebuilt metadata. */
export function useModelPageSeo(title: string, description: string, faqs: ModelFaq[]) {
  const schema = JSON.stringify(astraFaqSchema(faqs));
  useEffect(() => {
    // Adopt build-time metadata once, retaining the site's default description for SPA exit.
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
    setTag('meta[name="keywords"]', "meta", { name: "keywords", content: astraModel.keywords });
    setTag('link[rel="canonical"]', "link", { rel: "canonical", href: astraModel.canonical });
    const image = new URL(astraModel.image, astraModel.canonical).href;
    for (const [property, content] of Object.entries({ "og:title": title, "og:description": description, "og:type": "website", "og:url": astraModel.canonical, "og:image": image })) {
      setTag(`meta[property="${property}"]`, "meta", { property, content });
    }
    const structuredData = document.createElement("script");
    structuredData.type = "application/ld+json";
    structuredData.dataset.modelSeo = "astra";
    structuredData.textContent = schema;
    document.head.append(structuredData);
    return () => { restore.reverse().forEach(cleanup => cleanup()); structuredData.remove(); };
  }, [title, description, schema]);
}
