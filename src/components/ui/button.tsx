import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";
const base =
  "inline-flex min-h-touch items-center justify-center gap-2 rounded-control px-5 py-3 text-sm font-semibold transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-default aria-disabled:opacity-50";
const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-strong active:bg-brand-strong",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-brand-soft",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
