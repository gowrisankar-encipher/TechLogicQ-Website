"use client";

import { Trash2 } from "lucide-react";
import { deleteJob } from "@/app/admin/actions";

export default function DeleteJobButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteJob}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${title}"? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Delete ${title}`}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        Delete
      </button>
    </form>
  );
}
