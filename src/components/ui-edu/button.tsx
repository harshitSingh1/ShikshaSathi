import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const eduButton = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-primary text-white shadow-glow hover:-translate-y-0.5 hover:shadow-float",
        secondary:
          "bg-card text-foreground border border-border shadow-soft hover:border-primary/40 hover:-translate-y-0.5",
        glass:
          "bg-white/15 text-white backdrop-blur-md border border-white/30 hover:bg-white/25",
        ghost: "text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface EduButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof eduButton> {
  asChild?: boolean;
}

export const EduButton = React.forwardRef<HTMLButtonElement, EduButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(eduButton({ variant, size }), className)} {...props} />;
  },
);
EduButton.displayName = "EduButton";