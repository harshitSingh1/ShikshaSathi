import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      tone: {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/15 text-secondary",
        accent: "bg-accent/20 text-foreground",
        success: "bg-success/15 text-success",
        muted: "bg-muted text-muted-foreground",
        glass: "bg-white/20 text-white backdrop-blur-md border border-white/30",
      },
    },
    defaultVariants: { tone: "primary" },
  },
);

export interface EduBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function EduBadge({ className, tone, ...props }: EduBadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}