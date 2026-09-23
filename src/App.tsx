import { useEffect, type ReactNode } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Toaster } from "sonner";
import { useTranslation } from "react-i18next";

import { getShowcaseCollection, showcaseCollections } from "@/data/showcase-collections";
import { useAppHref } from "@/hooks/use-app-href";
import { normalizeLanguage } from "@/i18n/util";
import { SUBPATH_ROUTE } from "@/lib/app-paths";
import CuratedShowcaseCollectionPage from "@/pages/showcase/CuratedShowcaseCollectionPage";
import ShowcaseCollectionsPage from "@/pages/showcase/ShowcaseCollectionsPage";
import ShowcasesPage from "@/pages/showcase/ShowcasesPage";
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

function CollectionPage() {
  const { slug = "" } = useParams();
  const collection = getShowcaseCollection(slug) ?? showcaseCollections.find((item) => item.legacySlugs.includes(slug));
  return collection ? <CuratedShowcaseCollectionPage collection={collection} /> : <MissingPage />;
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
    <Route key={`${key}-collections`} path={`${showcasePath}/collections`} element={<ShowcaseCollectionsPage />} />,
    <Route key={`${key}-collection`} path={`${showcasePath}/collections/:slug`} element={<CollectionPage />} />,
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
