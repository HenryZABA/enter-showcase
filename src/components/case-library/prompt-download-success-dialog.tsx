import { ArrowUpRight, CircleCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PromptDownloadSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
};

export const PromptDownloadSuccessDialog = ({
  open,
  onOpenChange,
  count,
}: PromptDownloadSuccessDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t("common.close")} className="showcase-download-dialog max-w-md border-border bg-card text-card-foreground">
        <DialogHeader className="pr-10 text-left">
          <CircleCheck aria-hidden="true" className="mb-3 h-8 w-8 text-primary" />
          <DialogTitle className="font-display text-2xl">
            {t("bundle.successTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            {t("bundle.successBody", { value: count })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-3 sm:space-x-0">
          <Button asChild>
            <a
              href="https://enter.converge.ai/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("bundle.tryInEnter")}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
