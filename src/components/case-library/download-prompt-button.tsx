import { Download, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { PromptKind } from "@/data/cases";
import { loadPrompt } from "@/lib/prompt-cache";
import { downloadTextFile, sanitizeFilename } from "@/lib/prompt-file";
import { openEnter } from "@/lib/model-prompt-action";

const loadMarkdown = () => import("@/lib/prompt-bundle");
type Props = {
  title: string;
  promptUrl?: string | null;
  promptText?: string;
  promptKind: PromptKind | null;
  className?: string;
  appearance?: "toolbar" | "card" | "composer";
};

export function DownloadPromptButton({ title, promptUrl, promptText, promptKind, className, appearance = "toolbar" }: Props) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const available = promptText !== undefined ? Boolean(promptText.trim()) : Boolean(promptUrl);
  const download = async () => {
    if (!available || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      const [text, { buildSinglePromptMarkdown }] = await Promise.all([
        promptText !== undefined ? Promise.resolve(promptText) : loadPrompt(promptUrl!),
        loadMarkdown(),
      ]);
      if (!text.trim()) throw new Error("Empty prompt");
      const markdown = buildSinglePromptMarkdown(title, text, promptKind, t);
      if (!downloadTextFile(`${sanitizeFilename(title)}-prompt.md`, markdown)) throw new Error("Download failed");
      toast.success(t("common.downloadStarted"));
      openEnter();
    } catch {
      toast.error(t("common.downloadFailed"));
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  const contents = <>{busy ? <LoaderCircle className="model-copy-spinner" size={17} aria-hidden="true" /> : <Download size={17} aria-hidden="true" />}{t("prompt.downloadMd")}</>;
  const props = { type: "button" as const, onClick: () => void download(), disabled: !available || busy, "aria-busy": busy, className };
  return appearance === "toolbar" ? <Button {...props} variant="secondary">{contents}</Button> : <button {...props}>{contents}</button>;
}
