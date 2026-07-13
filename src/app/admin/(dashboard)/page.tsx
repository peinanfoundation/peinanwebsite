import Link from "next/link";
import { getHeroSlides, getHeroStories } from "@/lib/cms";
import { getAdminBasePath } from "@/lib/admin-path";

export default async function AdminDashboardPage() {
  const adminBase = getAdminBasePath();
  const [slides, stories] = await Promise.all([getHeroSlides(), getHeroStories()]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">總覽</h2>
        <p className="mt-2 text-sm text-slate-500">管理首頁幻燈片與 Story 內容</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href={`${adminBase}/hero-slides`}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-slate-500">首頁幻燈片</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{slides.length}</p>
          <p className="mt-2 text-sm text-brand-dark">管理幻燈片 →</p>
        </Link>

        <Link
          href={`${adminBase}/hero-stories`}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-slate-500">首頁 Story</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stories.length}</p>
          <p className="mt-2 text-sm text-brand-dark">管理 Story →</p>
        </Link>
      </div>
    </div>
  );
}
