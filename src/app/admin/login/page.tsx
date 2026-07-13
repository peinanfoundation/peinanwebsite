"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminBasePath } from "@/lib/admin-path";

export default function AdminLoginPage() {
  const router = useRouter();
  const adminBase = getAdminBasePath();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "登入失敗");
      setLoading(false);
      return;
    }

    router.push(adminBase);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
      >
        <h1 className="text-2xl font-bold text-slate-900">後台登入</h1>
        <p className="mt-2 text-sm text-slate-500">培楠愛國教育基金網站管理系統</p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">帳號</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
              autoComplete="username"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">密碼</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "登入中..." : "登入"}
        </button>
      </form>
    </div>
  );
}
