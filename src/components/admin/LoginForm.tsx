"use client";

import { Loader2, LogIn } from "lucide-react";
import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const inputClasses =
  "mt-1.5 block w-full rounded-xl border border-navy-900/15 bg-white px-4 py-3 text-base text-navy-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-navy-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-navy-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClasses}
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
      >
        {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <LogIn className="h-5 w-5" aria-hidden />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
