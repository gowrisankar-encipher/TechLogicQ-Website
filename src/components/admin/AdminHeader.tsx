import { ExternalLink, KeyRound, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import Logo from "../Logo";

export default function AdminHeader() {
  return (
    <header className="border-b border-navy-900/10 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden rounded-full bg-navy-900 px-2.5 py-1 text-xs font-semibold text-white sm:inline">Admin</span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/careers"
            target="_blank"
            aria-label="View site (opens in a new tab)"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink hover:bg-surface"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">View site</span>
          </Link>
          <Link
            href="/admin/password"
            aria-label="Change password"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink hover:bg-surface"
          >
            <KeyRound className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Password</span>
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink hover:bg-surface"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
