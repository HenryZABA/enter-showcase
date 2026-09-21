import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-background">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-6">
        <Link to="/showcases" className="font-display text-sm font-semibold text-foreground">
          Enter Showcase
        </Link>
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
