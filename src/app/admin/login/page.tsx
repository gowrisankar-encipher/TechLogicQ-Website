import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/Logo";
import { isAdmin } from "@/lib/admin-session";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-navy-900/8 bg-white p-7 shadow-sm sm:p-10">
        <Logo />
        <h1 className="mt-8 text-2xl font-bold">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted">Manage job openings on the Careers page.</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
