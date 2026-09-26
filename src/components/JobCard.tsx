import { Briefcase, Building2, Clock, ExternalLink, MapPin } from "lucide-react";
import { isEmail, type Job } from "@/lib/jobs/types";
import { contactHref } from "@/lib/site";
import ButtonLink from "./ButtonLink";
import Reveal from "./Reveal";

type JobCardProps = { job: Job; delay?: number };

function applyTarget(job: Job) {
  if (!job.applyLink) return { href: contactHref(`Job application: ${job.title} at ${job.company}`), external: false };
  if (isEmail(job.applyLink)) {
    const subject = encodeURIComponent(`Application: ${job.title}`);
    return { href: `mailto:${job.applyLink}?subject=${subject}`, external: false };
  }
  return { href: job.applyLink, external: true };
}

export default function JobCard({ job, delay }: JobCardProps) {
  const { company, title, location, experience, skills, type, description } = job;
  const apply = applyTarget(job);

  return (
    <Reveal delay={delay} className="h-full">
      <article className="flex h-full flex-col rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/10">
        <div className="flex items-start justify-between gap-3">
          <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted">
            <Building2 className="h-4 w-4 shrink-0" aria-hidden />
            <span className="sr-only">Company:</span>
            <span className="truncate">{company}</span>
          </p>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              type === "Internship" || type === "Freelance"
                ? "bg-accent-50 text-accent-600"
                : "bg-brand-50 text-brand-700"
            }`}
          >
            {type}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug">{title}</h3>
        {description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{description}</p>}

        <dl className="mt-4 space-y-2 text-sm text-ink">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            <dt className="sr-only">Location</dt>
            <dd>{location}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            <dt className="sr-only">Experience</dt>
            <dd>{experience}</dd>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
            <dt className="sr-only">Employment type</dt>
            <dd>{type}</dd>
          </div>
        </dl>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
          {skills.map((skill) => (
            <li key={skill} className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-ink">
              {skill}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <ButtonLink
            href={apply.href}
            external={apply.external}
            variant="secondary"
            className="w-full"
            aria-label={`Apply for ${title} at ${company}`}
          >
            Apply
            {apply.external && <ExternalLink className="h-4 w-4" aria-hidden />}
          </ButtonLink>
        </div>
      </article>
    </Reveal>
  );
}
