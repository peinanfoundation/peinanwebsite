"use client";

import { useRouter } from "next/navigation";
import { getAdminLoginPath } from "@/lib/admin-path";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push(getAdminLoginPath());
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
    >
      登出
    </button>
  );
}
