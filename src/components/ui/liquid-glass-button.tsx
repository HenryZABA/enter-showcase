import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import "@/styles/liquid-glass-button.css";

const liquidButtonVariants = cva(
  "liquid-glass-button inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium text-foreground outline-none disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-sm",
      },
      flowingBorder: {
        true: "liquid-glass-button-flowing",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      flowingBorder: false,
    },
  },
);

function LiquidButtonContent({ children }: { children: React.ReactNode }) {
  return <>
    <span aria-hidden="true" className="liquid-glass-button-surface" />
    <span className="liquid-glass-button-content">{children}</span>
  </>;
}

type LiquidLinkProps = LinkProps & VariantProps<typeof liquidButtonVariants>;

const LiquidLink = React.forwardRef<HTMLAnchorElement, LiquidLinkProps>(
  ({ className, size, flowingBorder, children, ...props }, ref) => (
    <Link
      ref={ref}
      data-slot="liquid-glass-button"
      className={cn(liquidButtonVariants({ size, flowingBorder }), className)}
      {...props}
    >
      <LiquidButtonContent>{children}</LiquidButtonContent>
    </Link>
  ),
);
LiquidLink.displayName = "LiquidLink";

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidButtonVariants> {}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, size, flowingBorder, children, ...props }, ref) => (
    <button
      ref={ref}
      data-slot="liquid-glass-button"
      className={cn(liquidButtonVariants({ size, flowingBorder }), className)}
      {...props}
    >
      <LiquidButtonContent>{children}</LiquidButtonContent>
    </button>
  ),
);
LiquidButton.displayName = "LiquidButton";

export { LiquidButton, LiquidLink };
