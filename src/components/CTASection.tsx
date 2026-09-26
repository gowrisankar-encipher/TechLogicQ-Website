import type { ReactNode } from "react";
import ButtonLink from "./ButtonLink";
import Reveal from "./Reveal";

type Cta = { label: string; href: string; external?: boolean; icon?: ReactNode };

type CTASectionProps = {
  title: ReactNode;
  description?: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  children?: ReactNode;
};

export default function CTASection({ title, description, primaryCta, secondaryCta, children }: CTASectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-700 px-6 py-12 text-center sm:px-12 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent-500/25 blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl font-bold leading-tight !text-white sm:text-4xl">{title}</h2>
          {description && <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{description}</p>}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={primaryCta.href} variant="accent" size="lg" external={primaryCta.external}>
              {primaryCta.icon}
              {primaryCta.label}
            </ButtonLink>
            {secondaryCta && (
              <ButtonLink href={secondaryCta.href} variant="light" size="lg" external={secondaryCta.external}>
                {secondaryCta.icon}
                {secondaryCta.label}
              </ButtonLink>
            )}
          </div>
          {children}
        </div>
      </Reveal>
    </section>
  );
}
