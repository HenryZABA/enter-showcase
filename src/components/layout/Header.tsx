import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useCurrentLanguage } from "@/hooks/use-current-language";
export function Header({ showSearch: _showSearch = false }: { showSearch?: boolean }) {
 const {t} = useTranslation(); const language = useCurrentLanguage();
 const href = (path: string) => `${path}?hl=${encodeURIComponent(language)}`;
 return <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-xl">
  <div className="container flex min-h-14 flex-wrap items-center gap-3 py-2">
   <Link to={href('/showcases')} className="font-display text-lg font-semibold tracking-tight">Enter <span className="text-muted-foreground">Showcase</span></Link>
   <nav aria-label="Showcase" className="ml-auto flex items-center gap-1">
    <Link className="rounded-full px-3 py-2 text-sm hover:bg-secondary" to={href('/showcases')}>{t('nav.youcases')}</Link>
    <Link className="rounded-full px-3 py-2 text-sm hover:bg-secondary" to={href('/showcases/collections')}>{t('youcases.collections')}</Link>
   </nav>
   <LanguageSwitcher className="min-w-[110px] w-[130px]" />
  </div>
 </header>;
}
