import type { ComponentProps } from "react";

export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`mx-auto w-full max-w-page px-gutter md:px-gutter-md lg:px-gutter-lg ${className}`}
      {...props}
    />
  );
}
