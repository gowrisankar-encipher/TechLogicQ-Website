import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import JobForm from "@/components/admin/JobForm";
import { requireAdmin } from "@/lib/admin-session";
import { jobStore } from "@/lib/jobs/store";
import { updateJob } from "../../../actions";

export const metadata = { title: "Edit Job Opening" };
export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const job = await jobStore.get(id);
  if (!job) notFound();

  return (
    <>
      <AdminHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Edit job opening</h1>
        <div className="mt-8 rounded-3xl border border-navy-900/8 bg-white p-6 sm:p-8">
          <JobForm action={updateJob.bind(null, job.id)} job={job} submitLabel="Save changes" />
        </div>
      </main>
    </>
  );
}
