import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

type TechnologyCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  items: readonly string[];
  delay?: number;
};

export default function TechnologyCard({ icon: Icon, title, description, items, delay }: TechnologyCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/10 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-brand-500 text-white">
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${title} technologies`}>
          {items.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-1.5 text-sm font-medium text-navy-800 transition-colors group-hover:border-brand-200"
            >
              {item}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}
