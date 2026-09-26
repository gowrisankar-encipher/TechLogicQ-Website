import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import DeleteJobButton from "@/components/admin/DeleteJobButton";
import { requireAdmin } from "@/lib/admin-session";
import { jobStore } from "@/lib/jobs/store";

export const dynamic = "force-dynamic";

const messages: Record<string, string> = {
  created: "Job opening added.",
  updated: "Job opening updated.",
  deleted: "Job opening deleted.",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  let jobs: Awaited<ReturnType<typeof jobStore.list>> = [];
  let loadError = false;
  try {
    jobs = await jobStore.list();
  } catch (error) {
    console.error("[admin] Could not load job openings", error);
    loadError = true;
  }

  return (
    <>
      <AdminHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Job openings</h1>
            <p className="mt-1 text-muted">
              {jobs.length} {jobs.length === 1 ? "opening" : "openings"} on the Careers page.
            </p>
          </div>
          <Link
            href="/admin/jobs/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent-500 px-5 font-semibold text-white hover:bg-accent-600"
          >
            <Plus className="h-5 w-5" aria-hidden />
            Add job opening
          </Link>
        </div>

        {saved && messages[saved] && (
          <p role="status" className="mt-6 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            {messages[saved]}
          </p>
        )}

        {loadError && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            Couldn&apos;t reach the database. Check MONGODB_URI and that this server&apos;s IP is allowed in MongoDB
            Atlas Network Access.
          </p>
        )}

        {loadError ? null : jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-navy-900/20 bg-white p-10 text-center">
            <p className="font-medium text-navy-900">No job openings yet.</p>
            <p className="mt-1 text-sm text-muted">Add your first opening and it will appear on the Careers page.</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-col gap-3 rounded-2xl border border-navy-900/8 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900">{job.title}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {job.company} · {job.location} · {job.type} · {job.experience}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-brand-600 hover:bg-brand-50"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                    Edit
                  </Link>
                  <DeleteJobButton id={job.id} title={job.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
