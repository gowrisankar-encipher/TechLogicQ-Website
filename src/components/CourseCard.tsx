import { BarChart3, Clock } from "lucide-react";
import type { Course } from "@/data/content";
import { contactHref } from "@/lib/site";
import ButtonLink from "./ButtonLink";
import Reveal from "./Reveal";

type CourseCardProps = Course & { delay?: number };

export default function CourseCard({ title, description, topics, level, duration, delay }: CourseCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-600/10">
        <div className="h-1.5 bg-gradient-to-r from-navy-800 via-brand-500 to-accent-500" aria-hidden />
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-semibold leading-snug">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

          <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-navy-800">Key topics</h4>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <li key={topic} className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-ink">
                {topic}
              </li>
            ))}
          </ul>

          <dl className="mt-5 grid grid-cols-1 gap-2 border-t border-navy-900/8 pt-4 text-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-brand-600" aria-hidden />
              <dt className="sr-only">Level</dt>
              <dd className="font-medium text-navy-900">{level}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-600" aria-hidden />
              <dt className="sr-only">Duration</dt>
              <dd className="text-muted">{duration}</dd>
            </div>
          </dl>

          <ButtonLink
            href={contactHref(`Course enquiry: ${title}`)}
            variant="primary"
            size="md"
            className="mt-6 w-full"
            aria-label={`View course: ${title}`}
          >
            View Course
          </ButtonLink>
        </div>
      </article>
    </Reveal>
  );
}
