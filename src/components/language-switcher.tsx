import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fallbackLng, languageOptions, normalizeLanguage } from "@/i18n/config";

type LanguageSwitcherProps = {
  className?: string;
};

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentLanguage =
    normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? fallbackLng;

  return (
    <Select
      value={currentLanguage}
      onValueChange={(language) => {
        void i18n.changeLanguage(language);
        const params = new URLSearchParams(searchParams); params.set("hl", language); setSearchParams(params, { replace: true });
      }}
    >
      <SelectTrigger className={cn("min-w-[140px]", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="showcase-language-menu border-border bg-popover text-popover-foreground">
        {languageOptions.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
