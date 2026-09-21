import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useParams } from "react-router-dom";
import { Toaster } from "sonner";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "@/i18n/util";
import { getShowcaseCollection, showcaseCollections } from "@/data/showcase-collections";
import ShowcasesPage from "@/pages/showcase/ShowcasesPage";
import ShowcaseCollectionsPage from "@/pages/showcase/ShowcaseCollectionsPage";
import CuratedShowcaseCollectionPage from "@/pages/showcase/CuratedShowcaseCollectionPage";
function MissingPage() { return <main className="container py-20"><h1 className="text-3xl">404</h1><Link to="/showcases">Back to Library</Link></main>; }
function CollectionPage() {
 const {slug = ''} = useParams(); const collection = getShowcaseCollection(slug) ?? showcaseCollections.find(c => c.legacySlugs.includes(slug));
 return collection ? <CuratedShowcaseCollectionPage collection={collection} /> : <MissingPage />;
}
function RootRedirect() { const {search} = useLocation(); return <Navigate to={`/showcases${search}`} replace />; }
function LanguageSync() {
 const {search, pathname} = useLocation(); const {i18n} = useTranslation();
 useEffect(() => { const lng = normalizeLanguage(new URLSearchParams(search).get('hl')); if(lng && lng !== i18n.language) void i18n.changeLanguage(lng); },[search, i18n]);
 useEffect(() => { window.scrollTo(0,0); },[pathname]); return null;
}
export default function App() { return <BrowserRouter><LanguageSync /><Routes>
 <Route path="/" element={<RootRedirect />} />
 <Route path="/showcases" element={<ShowcasesPage />} />
 <Route path="/showcases/collections" element={<ShowcaseCollectionsPage />} />
 <Route path="/showcases/collections/:slug" element={<CollectionPage />} />
 <Route path="*" element={<MissingPage />} />
 </Routes><Toaster richColors /></BrowserRouter>; }
