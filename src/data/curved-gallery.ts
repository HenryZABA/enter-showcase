import { assetPath } from "@/lib/app-paths";
import { gpt6AstraCollection } from "./showcase-collections/gpt-6-astra";
import { gpt6SolLunaCollection } from "./showcase-collections/gpt-6-sol-luna";
import { claudeOpus55Collection } from "./showcase-collections/claude-opus-5-5";
import { showcaseCollectionHref } from "./showcase-collections";

export type CurvedGalleryItem = {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  status: "available" | "decorative";
  href?: string;
};

const mediaRoot = assetPath("media/showcase-collections");

/** Newly generated abstract art is decorative, not a promised product or collection. */
export const curvedGalleryItems: CurvedGalleryItem[] = [
  { id: gpt6AstraCollection.slug, type: "video", src: `${mediaRoot}/gpt-6-astra-v1.mp4`, poster: `${mediaRoot}/gpt-6-astra-poster-v1.webp`, width: 1280, height: 720, title: gpt6AstraCollection.displayName, status: "available", href: showcaseCollectionHref(gpt6AstraCollection) },
  { id: gpt6SolLunaCollection.slug, type: "image", src: gpt6SolLunaCollection.coverImage, width: 1376, height: 768, title: gpt6SolLunaCollection.displayName, status: "available", href: showcaseCollectionHref(gpt6SolLunaCollection) },
  { id: claudeOpus55Collection.slug, type: "image", src: claudeOpus55Collection.coverImage, width: 1376, height: 768, title: claudeOpus55Collection.displayName, status: "available", href: showcaseCollectionHref(claudeOpus55Collection) },
  { id: "violet-waves", type: "image", src: `${mediaRoot}/violet-waves-v2.webp`, width: 1200, height: 670, title: "", status: "decorative" },
  { id: "pearl-sky", type: "image", src: `${mediaRoot}/pearl-sky-v2.webp`, width: 1200, height: 896, title: "", status: "decorative" },
  { id: "lemon-layers", type: "image", src: `${mediaRoot}/lemon-layers-v2.webp`, width: 1024, height: 1024, title: "", status: "decorative" },
];
