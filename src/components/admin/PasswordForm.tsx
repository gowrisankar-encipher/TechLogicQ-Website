"use client";

import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { changePassword, type PasswordState } from "@/app/admin/actions";

const fields = [
  { name: "current", label: "Current password", autoComplete: "current-password" },
  { name: "next", label: "New password", autoComplete: "new-password", hint: "At least 10 characters." },
  { name: "confirm", label: "Confirm new password", autoComplete: "new-password" },
] as const;

export default function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-5">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="text-sm font-medium text-navy-900">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type="password"
            autoComplete={f.autoComplete}
            required
            aria-invalid={errors[f.name] ? true : undefined}
            aria-describedby={`${f.name}-hint`}
            className={`mt-1.5 block w-full rounded-xl border bg-white px-4 py-3 text-base text-navy-900 focus:outline-none focus:ring-4 ${
              errors[f.name]
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-navy-900/15 focus:border-brand-500 focus:ring-brand-100"
            }`}
          />
          {(errors[f.name] || ("hint" in f && f.hint)) && (
            <p id={`${f.name}-hint`} className={`mt-1.5 text-sm ${errors[f.name] ? "text-red-600" : "text-muted"}`}>
              {errors[f.name] ?? ("hint" in f ? f.hint : "")}
            </p>
          )}
        </div>
      ))}

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.done && (
        <p role="status" className="flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Password updated. Use the new password next time you sign in.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70 sm:w-auto"
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <KeyRound className="h-5 w-5" aria-hidden />}
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
