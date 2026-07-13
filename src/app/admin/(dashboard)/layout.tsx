import type { Metadata } from "next";
import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { getAdminBasePath } from "@/lib/admin-path";

export const metadata: Metadata = {
  title: "後台管理 | 培楠愛國教育基金",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminBase = getAdminBasePath();

  const navItems = [
    { href: adminBase, label: "總覽" },
    { href: `${adminBase}/hero-slides`, label: "首頁幻燈片" },
    { href: `${adminBase}/hero-stories`, label: "首頁 Story" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-slate-500">培楠愛國教育基金</p>
            <h1 className="text-lg font-bold text-slate-900">網站後台</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-brand-dark hover:underline">
              查看網站
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-dark"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
