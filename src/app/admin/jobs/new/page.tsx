import AdminHeader from "@/components/admin/AdminHeader";
import JobForm from "@/components/admin/JobForm";
import { requireAdmin } from "@/lib/admin-session";
import { createJob } from "../../actions";

export const metadata = { title: "Add Job Opening" };

export default async function NewJobPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Add job opening</h1>
        <div className="mt-8 rounded-3xl border border-navy-900/8 bg-white p-6 sm:p-8">
          <JobForm action={createJob} submitLabel="Add job opening" />
        </div>
      </main>
    </>
  );
}
