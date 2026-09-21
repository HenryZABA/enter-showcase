import { useLayoutEffect } from "react";

/** Keep the Showcase theme and document title scoped to the active route. */
export function useShowcaseTheme(title: string) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousTitle = document.title;
    root.classList.add("showcase-active");
    document.title = title;
    return () => {
      root.classList.remove("showcase-active");
      document.title = previousTitle;
    };
  }, [title]);
}
