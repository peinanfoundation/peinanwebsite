import Link from "next/link";
import {
  getAboutContent,
  getFeaturedProject,
  getHeroSlides,
  getHeroStories,
  getNewsItems,
  getProjectPhotos,
  getProjectVideos,
} from "@/lib/cms";
import { getAdminBasePath } from "@/lib/admin-path";

export default async function AdminDashboardPage() {
  const adminBase = getAdminBasePath();
  const [slides, stories, project, videos, photos, news, about] = await Promise.all([
    getHeroSlides(),
    getHeroStories(),
    getFeaturedProject(),
    getProjectVideos(),
    getProjectPhotos(),
    getNewsItems(),
    getAboutContent(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">總覽</h2>
        <p className="mt-2 text-sm text-slate-500">管理網站各版塊內容</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        <Link
          href={`${adminBase}/projects`}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-slate-500">重點項目</p>
          <p className="mt-2 truncate text-lg font-bold text-slate-900">{project.title}</p>
          <p className="mt-1 text-sm text-slate-500">
            {videos.length} 部影片 · {photos.length} 張相片
          </p>
          <p className="mt-2 text-sm text-brand-dark">管理重點項目 →</p>
        </Link>

        <Link
          href={`${adminBase}/about`}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-slate-500">關於我們</p>
          <p className="mt-2 truncate text-lg font-bold text-slate-900">{about.banner.title}</p>
          <p className="mt-1 text-sm text-slate-500">{about.values.length} 項核心價值</p>
          <p className="mt-2 text-sm text-brand-dark">管理關於我們 →</p>
        </Link>

        <Link
          href={`${adminBase}/news`}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-slate-500">培楠動向</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{news.length}</p>
          <p className="mt-2 text-sm text-brand-dark">管理培楠動向 →</p>
        </Link>
      </div>
    </div>
  );
}
