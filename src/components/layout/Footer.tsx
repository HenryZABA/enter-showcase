import { ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-background">
      <div className="container flex flex-wrap items-center justify-end gap-4 py-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to top
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
