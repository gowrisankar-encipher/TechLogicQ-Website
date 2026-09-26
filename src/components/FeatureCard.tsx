import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import Reveal from "./Reveal";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  delay?: number;
  accent?: "blue" | "orange" | "navy";
  compact?: boolean;
};

const accents = {
  blue: "bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white",
  orange: "bg-accent-50 text-accent-600 group-hover:bg-accent-500 group-hover:text-white",
  navy: "bg-navy-900/5 text-navy-900 group-hover:bg-navy-900 group-hover:text-white",
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  delay,
  accent = "blue",
  compact = false,
}: FeatureCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`group relative flex h-full flex-col rounded-2xl border border-navy-900/8 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/10 ${
          compact ? "p-5" : "p-6 sm:p-7"
        }`}
      >
        <span
          className={`flex items-center justify-center rounded-xl transition-colors duration-300 ${accents[accent]} ${
            compact ? "h-11 w-11" : "h-12 w-12"
          }`}
        >
          <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} aria-hidden />
        </span>
        <h3 className={`mt-4 font-semibold leading-snug ${compact ? "text-base" : "text-lg"}`}>{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        {href && (
          <Link
            href={href}
            className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-600 after:absolute after:inset-0 after:rounded-2xl hover:text-brand-700"
          >
            Learn more <span className="sr-only">about {title}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        )}
      </article>
    </Reveal>
  );
}
