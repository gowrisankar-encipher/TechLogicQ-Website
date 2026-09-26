import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "light";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700",
  accent: "bg-accent-500 text-white shadow-sm shadow-accent-500/25 hover:bg-accent-600",
  secondary: "border border-navy-900/15 bg-white text-navy-900 hover:border-brand-500 hover:text-brand-600",
  ghost: "text-brand-600 hover:text-brand-700 hover:bg-brand-50",
  light: "bg-white text-navy-900 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export const buttonClasses = (variant: Variant = "primary", size: Size = "md", className = "") =>
  `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${variants[variant]} ${sizes[size]} ${className}`;

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  "aria-label"?: string;
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
