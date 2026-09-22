import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { withEntryPrefix } from "@/lib/app-paths";

export function useAppHref() {
  const { pathname } = useLocation();
  return useCallback((path: string) => withEntryPrefix(path, pathname), [pathname]);
}
