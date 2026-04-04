import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  href?: string;
};

export function Button({ className = "", href, children, ...rest }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center border-0 bg-black px-6 py-3 font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

  if (href) {
    return (
      <a href={href} className={`${base} ${className}`.trim()}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={`${base} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
