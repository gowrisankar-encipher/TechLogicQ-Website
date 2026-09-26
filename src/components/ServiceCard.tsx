import { ArrowRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { contactHref } from "@/lib/site";
import Reveal from "./Reveal";

type ServiceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
};

export default function ServiceCard({ icon: Icon, title, description, delay }: ServiceCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent-400/60 hover:shadow-xl hover:shadow-accent-500/10">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        <Link
          href={contactHref(`Web Development: ${title}`)}
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Learn More <span className="sr-only">about {title}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </article>
    </Reveal>
  );
}
