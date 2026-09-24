import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Toaster } from "sonner";
import { useTranslation } from "react-i18next";

import { getShowcaseCollection, showcaseCollectionHref, showcaseCollections } from "@/data/showcase-collections";
import { useAppHref } from "@/hooks/use-app-href";
import { normalizeLanguage } from "@/i18n/util";
import { SUBPATH_ROUTE } from "@/lib/app-paths";
import CuratedShowcaseCollectionPage from "@/pages/showcase/CuratedShowcaseCollectionPage";
import ShowcaseCollectionsPage from "@/pages/showcase/ShowcaseCollectionsPage";
import ShowcasesPage from "@/pages/showcase/ShowcasesPage";
import Gpt6AstraPage from "@/pages/showcase/Gpt6AstraPage";
import Gpt6SolLunaPage from "@/pages/showcase/Gpt6SolLunaPage";
import ClaudeOpus55Page from "@/pages/showcase/ClaudeOpus55Page";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import { CookieConsentProvider } from "@/providers/cookie-consent-provider";

function MissingPage() {
  const appHref = useAppHref();
  const { search } = useLocation();
  return (
    <main className="container py-20">
      <h1 className="text-3xl">404</h1>
      <Link to={`${appHref("/showcases")}${search}`}>Back to Library</Link>
    </main>
  );
}

function CollectionPage({ legacy = false }: { legacy?: boolean }) {
  const { slug = "" } = useParams();
  const appHref = useAppHref();
  const collection = getShowcaseCollection(slug) ?? showcaseCollections.find((item) => item.legacySlugs?.includes(slug));
  if (!collection) return <MissingPage />;
  return legacy ? <PageRedirect to={appHref(showcaseCollectionHref(collection))} /> : <CuratedShowcaseCollectionPage collection={collection} />;
}

function PageRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

function RootRedirect() {
  const { search } = useLocation();
  return <Navigate to={`${SUBPATH_ROUTE}${search}`} replace />;
}

function LanguageSync() {
  const { search, pathname } = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    const language = normalizeLanguage(new URLSearchParams(search).get("hl"));
    if (language && language !== i18n.language) void i18n.changeLanguage(language);
  }, [search, i18n]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function createShowcaseRoutes(prefix: "" | typeof SUBPATH_ROUTE): ReactNode[] {
  const key = prefix || "root";
  const showcasePath = prefix || "/showcases";
  return [
    ...(prefix
      ? []
      : [<Route key="root-index" path="/" element={<RootRedirect />} />]),
    <Route key={`${key}-showcases`} path={showcasePath} element={<ShowcasesPage />} />,
    <Route key={`${key}-collections`} path={`${showcasePath}/collection`} element={<ShowcaseCollectionsPage />} />,
    <Route key={`${key}-astra-model`} path={`${showcasePath}/collection/gpt-6-astra`} element={<Gpt6AstraPage />} />,
    <Route key={`${key}-sol-luna-model`} path={`${showcasePath}/collection/gpt-6-sol-luna`} element={<Gpt6SolLunaPage />} />,
    <Route key={`${key}-opus-model`} path={`${showcasePath}/collection/claude-opus-5-5`} element={<ClaudeOpus55Page />} />,
    <Route key={`${key}-collection`} path={`${showcasePath}/collection/:slug`} element={<CollectionPage />} />,
    <Route key={`${key}-legacy-collections`} path={`${showcasePath}/collections`} element={<PageRedirect to={`${showcasePath}/collection`} />} />,
    <Route key={`${key}-legacy-astra`} path={`${showcasePath}/gpt-6-astra`} element={<PageRedirect to={`${showcasePath}/collection/gpt-6-astra`} />} />,
    <Route key={`${key}-legacy-sol-luna`} path={`${showcasePath}/gpt-6-sol-luna`} element={<PageRedirect to={`${showcasePath}/collection/gpt-6-sol-luna`} />} />,
    <Route key={`${key}-legacy-opus`} path={`${showcasePath}/claude-opus-5-5`} element={<PageRedirect to={`${showcasePath}/collection/claude-opus-5-5`} />} />,
    <Route key={`${key}-legacy-collection`} path={`${showcasePath}/collections/:slug`} element={<CollectionPage legacy />} />,
  ];
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageSync />
      <CookieConsentProvider>
        <AnalyticsProvider>
          <Routes>
            {createShowcaseRoutes("")}
            {createShowcaseRoutes(SUBPATH_ROUTE)}
            <Route path="*" element={<MissingPage />} />
          </Routes>
          <Toaster richColors />
        </AnalyticsProvider>
      </CookieConsentProvider>
    </BrowserRouter>
  );
}
