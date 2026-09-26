"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error";

const fields: { name: keyof ContactPayload; label: string; type: string; autoComplete: string; required: boolean }[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: false },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off", required: true },
];

const inputClasses =
  "mt-1.5 block w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 placeholder:text-muted/60 transition focus:outline-none focus:ring-4";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [serverError, setServerError] = useState("");

  const defaultSubject = searchParams.get("subject")?.slice(0, 150) ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const { data, errors: found } = validateContact(values);
    setErrors(found);
    setServerError("");

    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: ContactErrors };
      if (!res.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }
      form.reset();
      setStatus("success");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-600" aria-hidden />
        <h3 className="mt-4 text-xl font-semibold">Thank you for reaching out!</h3>
        <p className="mt-2 text-muted">Your message has been sent. We&apos;ll get back to you as soon as we can.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 min-h-11 rounded-full px-5 text-sm font-semibold text-brand-600 hover:bg-white"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-describedby={serverError ? "form-error" : undefined}>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name];
          return (
            <div key={field.name} className={field.name === "subject" ? "sm:col-span-2" : ""}>
              <label htmlFor={`contact-${field.name}`} className="text-sm font-medium text-navy-900">
                {field.label}
                {field.required ? (
                  <span className="text-accent-600" aria-hidden>
                    {" "}*
                  </span>
                ) : (
                  <span className="font-normal text-muted"> (optional)</span>
                )}
              </label>
              <input
                id={`contact-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                required={field.required}
                defaultValue={field.name === "subject" ? defaultSubject : undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `contact-${field.name}-error` : undefined}
                className={`${inputClasses} ${
                  error
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-navy-900/15 focus:border-brand-500 focus:ring-brand-100"
                }`}
              />
              {error && (
                <p id={`contact-${field.name}-error`} className="mt-1.5 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-navy-900">
          Message
          <span className="text-accent-600" aria-hidden>
            {" "}*
          </span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${inputClasses} resize-y ${
            errors.message
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-navy-900/15 focus:border-brand-500 focus:ring-brand-100"
          }`}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-sm text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {serverError && (
        <p id="form-error" role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-6 text-base font-semibold text-white shadow-sm shadow-accent-500/25 transition hover:-translate-y-0.5 hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:translate-y-0 disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        ) : (
          <Send className="h-5 w-5" aria-hidden />
        )}
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
      <p className="text-xs text-muted">Fields marked * are required.</p>
    </form>
  );
}
