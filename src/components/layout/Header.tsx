import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useCurrentLanguage } from "@/hooks/use-current-language";
export function Header({ showSearch: _showSearch = false }: { showSearch?: boolean }) {
 const {t} = useTranslation(); const language = useCurrentLanguage();
 const href = (path: string) => `${path}?hl=${encodeURIComponent(language)}`;
 return <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-xl">
  <div className="container flex min-h-14 flex-wrap items-center gap-3 py-2">
   <Link to={href('/showcases')} className="inline-flex items-center gap-1.5" aria-label="Enter">
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0">
     <defs>
      <linearGradient id="enter-logo-gradient" x1="2" y1="18" x2="18" y2="2" gradientUnits="userSpaceOnUse">
       <stop stopColor="#ffb000" />
       <stop offset="0.5" stopColor="#ff5d77" />
       <stop offset="1" stopColor="#d84cff" />
      </linearGradient>
     </defs>
     <path d="M2 18V10a8 8 0 0 1 16 0v8H2Z" fill="url(#enter-logo-gradient)" />
    </svg>
    <span className="font-display text-lg font-semibold tracking-tight">Enter</span>
   </Link>
   <nav aria-label="Showcase" className="ml-auto flex items-center gap-1">
    <Link className="rounded-full px-3 py-2 text-sm hover:bg-secondary" to={href('/showcases')}>{t('nav.youcases')}</Link>
    <Link className="rounded-full px-3 py-2 text-sm hover:bg-secondary" to={href('/showcases/collections')}>{t('youcases.collections')}</Link>
   </nav>
   <LanguageSwitcher className="min-w-[110px] w-[130px]" />
  </div>
 </header>;
}
