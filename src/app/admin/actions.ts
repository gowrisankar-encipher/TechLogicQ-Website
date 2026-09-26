"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { changeAdminPassword, isAdminLoginAvailable, verifyAdminLogin } from "@/lib/admin-account";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "@/lib/auth";
import { jobStore } from "@/lib/jobs/store";
import { parseJobInput, type JobFieldErrors, type JobInput } from "@/lib/jobs/types";

// ---------- Login / logout ----------
export type LoginState = { error?: string; email?: string };

const failedLogins = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  let available = false;
  try {
    available = await isAdminLoginAvailable();
  } catch (error) {
    console.error("[admin] Could not reach the database", error);
    return { error: "Couldn't reach the database. Please try again shortly." };
  }
  if (!available) {
    return {
      error: "Admin login is not set up yet. Set MONGODB_URI and ADMIN_SESSION_SECRET, then run npm run create-admin.",
    };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const record = failedLogins.get(ip);
  if (record && record.resetAt > Date.now() && record.count >= MAX_ATTEMPTS) {
    return { error: "Too many failed attempts. Please try again in 15 minutes." };
  }

  const email = String(form.get("email") ?? "").slice(0, 200);
  let ok = false;
  try {
    ok = await verifyAdminLogin(email, String(form.get("password") ?? ""));
  } catch (error) {
    console.error("[admin] Login failed", error);
    return { error: "Couldn't reach the database. Please try again shortly.", email };
  }
  if (!ok) {
    const fresh = !record || record.resetAt <= Date.now();
    failedLogins.set(ip, {
      count: fresh ? 1 : record.count + 1,
      resetAt: fresh ? Date.now() + LOCK_MS : record.resetAt,
    });
    return { error: "Incorrect email or password.", email };
  }

  failedLogins.delete(ip);
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Change password ----------
export type PasswordState = {
  error?: string;
  fieldErrors?: { current?: string; next?: string; confirm?: string };
  done?: boolean;
};

export async function changePassword(_prev: PasswordState, form: FormData): Promise<PasswordState> {
  await requireAdmin();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  if (next !== String(form.get("confirm") ?? "")) return { fieldErrors: { confirm: "Passwords don't match." } };

  const result = await changeAdminPassword(current, next).catch((error) => {
    console.error("[admin] Password change failed", error);
    return { ok: false as const, field: "form" as const, error: "Couldn't reach the database. Please try again." };
  });
  if (result.ok) return { done: true };
  return result.field === "form" ? { error: result.error } : { fieldErrors: { [result.field]: result.error } };
}

// ---------- Job openings ----------
export type JobFormState = { errors?: JobFieldErrors; error?: string; values?: JobInput };

function refreshPublicPages() {
  revalidatePath("/careers");
  revalidatePath("/admin");
}

export async function createJob(_prev: JobFormState, form: FormData): Promise<JobFormState> {
  await requireAdmin();
  const { data, errors } = parseJobInput(form);
  // Return the submitted values so the form keeps them (React resets forms after an action).
  if (Object.keys(errors).length) return { errors, values: data };
  await jobStore.create(data);
  refreshPublicPages();
  redirect("/admin?saved=created");
}

export async function updateJob(id: string, _prev: JobFormState, form: FormData): Promise<JobFormState> {
  await requireAdmin();
  const { data, errors } = parseJobInput(form);
  if (Object.keys(errors).length) return { errors, values: data };
  const updated = await jobStore.update(id, data);
  if (!updated) return { error: "This job opening no longer exists.", values: data };
  refreshPublicPages();
  redirect("/admin?saved=updated");
}

export async function deleteJob(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (id) await jobStore.remove(id);
  refreshPublicPages();
  redirect("/admin?saved=deleted");
}
