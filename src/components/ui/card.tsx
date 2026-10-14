import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-card shadow-card ${className}`}
      {...props}
    />
  );
}

// Solid by default. Transparency only applies when backdrop blur is supported.
export function Glass({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`border-b border-border bg-glass supports-backdrop-filter:bg-glass/95 supports-backdrop-filter:backdrop-blur-md ${className}`}
      {...props}
    />
  );
}
