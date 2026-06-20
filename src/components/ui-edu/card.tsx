import * as React from "react";
import { cn } from "@/lib/utils";

export function EducationalCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-card p-6 shadow-card hover-lift font-edu",
        className,
      )}
      {...props}
    />
  );
}

export function FeatureCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-7 shadow-card hover-lift",
        className,
      )}
      {...props}
    />
  );
}

export function IconCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft",
        className,
      )}
      {...props}
    />
  );
}

export function IllustrationContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-gradient-hero p-1 shadow-float",
        className,
      )}
      {...props}
    />
  );
}