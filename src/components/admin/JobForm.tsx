"use client";

import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import type { JobFormState } from "@/app/admin/actions";
import { EMPLOYMENT_TYPES, type Job, type JobInput } from "@/lib/jobs/types";

type JobFormProps = {
  action: (state: JobFormState, form: FormData) => Promise<JobFormState>;
  job?: Job;
  submitLabel: string;
};

const inputClasses =
  "mt-1.5 block w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 focus:outline-none focus:ring-4";

const fields: { name: keyof JobInput; label: string; placeholder: string; hint?: string; optional?: boolean }[] = [
  { name: "title", label: "Job title", placeholder: "e.g. Java Backend Developer" },
  { name: "company", label: "Company", placeholder: "e.g. Acme Technologies" },
  { name: "location", label: "Location", placeholder: "e.g. Chennai / Remote" },
  { name: "experience", label: "Experience", placeholder: "e.g. 0–1 years" },
  { name: "skills", label: "Skills", placeholder: "Java, Spring Boot, SQL", hint: "Separate skills with commas." },
  {
    name: "applyLink",
    label: "Apply link",
    placeholder: "https://… or hr@company.com",
    hint: "Where candidates apply. Leave empty to send them to the contact form.",
    optional: true,
  },
];

export default function JobForm({ action, job, submitLabel }: JobFormProps) {
  const [state, formAction, pending] = useActionState<JobFormState, FormData>(action, {});
  const errors = state.errors ?? {};
  const current = state.values ?? job;
  const value = (name: keyof JobInput) => {
    if (!current) return "";
    const v = current[name];
    return Array.isArray(v) ? v.join(", ") : v;
  };
  const border = (name: keyof JobInput) =>
    errors[name]
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-navy-900/15 focus:border-brand-500 focus:ring-brand-100";

  return (
    <form action={formAction} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.name === "skills" || f.name === "applyLink" ? "sm:col-span-2" : ""}>
            <label htmlFor={f.name} className="text-sm font-medium text-navy-900">
              {f.label}
              {f.optional && <span className="font-normal text-muted"> (optional)</span>}
            </label>
            <input
              id={f.name}
              name={f.name}
              defaultValue={value(f.name)}
              placeholder={f.placeholder}
              aria-invalid={errors[f.name] ? true : undefined}
              aria-describedby={`${f.name}-hint`}
              className={`${inputClasses} ${border(f.name)}`}
            />
            <p id={`${f.name}-hint`} className={`mt-1.5 text-sm ${errors[f.name] ? "text-red-600" : "text-muted"}`}>
              {errors[f.name] ?? f.hint}
            </p>
          </div>
        ))}

        <div>
          <label htmlFor="type" className="text-sm font-medium text-navy-900">
            Employment type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={current?.type ?? "Full-time"}
            className={`${inputClasses} border-navy-900/15 focus:border-brand-500 focus:ring-brand-100`}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-navy-900">
          Short description <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={current?.description ?? ""}
          className={`${inputClasses} resize-y border-navy-900/15 focus:border-brand-500 focus:ring-brand-100`}
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-navy-900/15 px-6 font-semibold text-navy-900 hover:border-brand-500"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-600 px-6 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
        >
          {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Save className="h-5 w-5" aria-hidden />}
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
