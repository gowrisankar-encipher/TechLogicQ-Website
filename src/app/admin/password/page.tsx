import AdminHeader from "@/components/admin/AdminHeader";
import PasswordForm from "@/components/admin/PasswordForm";
import { getAdminEmail } from "@/lib/admin-account";
import { requireAdmin } from "@/lib/admin-session";
import { isMongoConfigured } from "@/lib/mongo";

export const metadata = { title: "Change Password" };
export const dynamic = "force-dynamic";

export default async function PasswordPage() {
  await requireAdmin();
  const email = await getAdminEmail().catch(() => "");

  return (
    <>
      <AdminHeader />
      <main id="main" className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Change password</h1>
        {email && <p className="mt-1 text-muted">Signed in as {email}</p>}
        <div className="mt-8 rounded-3xl border border-navy-900/8 bg-white p-6 sm:p-8">
          {isMongoConfigured() ? (
            <PasswordForm />
          ) : (
            <p className="text-sm text-muted">
              Password changes are saved in MongoDB. Set <code>MONGODB_URI</code> in <code>.env.local</code> to enable
              this page.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
