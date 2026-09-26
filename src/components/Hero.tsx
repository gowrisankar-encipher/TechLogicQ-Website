import type { ReactNode } from "react";
import ButtonLink from "./ButtonLink";
import HeroIllustration from "./HeroIllustration";

type Cta = { label: string; href: string };

type HeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** "home" shows the large split hero with illustration; "page" is a compact banner for inner pages. */
  variant?: "home" | "page";
};

export default function Hero({ eyebrow, title, description, primaryCta, secondaryCta, variant = "page" }: HeroProps) {
  const isHome = variant === "home";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-100/70 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 rounded-full bg-accent-50 blur-3xl" />

      <div
        className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
          isHome ? "grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:py-24" : "py-14 text-center sm:py-20"
        }`}
      >
        <div className={`animate-fade-up ${isHome ? "" : "mx-auto max-w-3xl"}`}>
          {eyebrow && (
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1
            className={`mt-5 font-extrabold leading-[1.1] ${
              isHome ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl"
            }`}
          >
            {title}
          </h1>
          <p
            className={`mt-5 text-base leading-relaxed text-muted sm:text-lg ${isHome ? "max-w-xl" : "mx-auto max-w-2xl"}`}
          >
            {description}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${isHome ? "" : "sm:justify-center"}`}>
              {primaryCta && (
                <ButtonLink href={primaryCta.href} variant="accent" size="lg">
                  {primaryCta.label}
                </ButtonLink>
              )}
              {secondaryCta && (
                <ButtonLink href={secondaryCta.href} variant="secondary" size="lg">
                  {secondaryCta.label}
                </ButtonLink>
              )}
            </div>
          )}
        </div>

        {isHome && (
          <div className="animate-fade-up [animation-delay:150ms]">
            <HeroIllustration className="mx-auto h-auto w-full max-w-md sm:max-w-lg lg:max-w-none" />
          </div>
        )}
      </div>
    </section>
  );
}
