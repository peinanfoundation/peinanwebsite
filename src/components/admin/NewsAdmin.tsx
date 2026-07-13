"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  publishedAt: string;
};

type NewsForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
};

const emptyForm = (): NewsForm => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  publishedAt: new Date().toISOString().slice(0, 10),
});

export default function NewsAdmin() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsForm>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    const response = await fetch("/api/admin/news-items");
    const data = await response.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleImageUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload/news-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "上傳失敗");
      setUploading(false);
      return;
    }

    const data = await response.json();
    setForm((prev) => ({ ...prev, image: data.image }));
    setMessage("封面圖已上傳");
    setUploading(false);
  }

  function startEdit(item: NewsItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      image: item.image ?? "",
      publishedAt: item.publishedAt,
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    setMessage("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/admin/news-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: editingId && editingId !== "new" ? "update" : "add",
        id: editingId !== "new" ? editingId : undefined,
        title: form.title,
        slug: form.slug || undefined,
        excerpt: form.excerpt,
        content: form.content || form.excerpt,
        image: form.image || null,
        publishedAt: form.publishedAt,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "儲存失敗");
      return;
    }

    setMessage(editingId && editingId !== "new" ? "已更新動向" : "已新增動向");
    cancelEdit();
    await loadData();
  }

  async function removeItem(id: string) {
    await fetch("/api/admin/news-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", id }),
    });
    setMessage("已移除動向");
    if (editingId === id) cancelEdit();
    await loadData();
  }

  if (loading) {
    return <p className="text-slate-500">載入中...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">培楠動向</h2>
            <p className="mt-2 text-sm text-slate-500">新增、編輯或移除機構活動動向</p>
          </div>
          {!editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm());
                setEditingId("new");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <Plus size={16} />
              新增動向
            </button>
          )}
        </div>

        {(editingId || form.title) && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-slate-100 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">標題</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">發布日期</span>
                <input
                  type="date"
                  value={form.publishedAt}
                  onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">網址代稱（選填，留空自動產生）</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="news-01"
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">摘要（列表顯示）</span>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">完整內容</span>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={8}
                placeholder="留空則使用摘要作為內容"
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
              />
            </label>

            <div>
              <span className="text-sm font-medium text-slate-700">封面圖（選填）</span>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                  <Upload size={16} />
                  {uploading ? "上傳中..." : "上傳封面"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                {form.image && (
                  <div className="relative h-20 w-32 overflow-hidden rounded-lg ring-1 ring-slate-200">
                    <Image src={form.image} alt="封面預覽" fill className="object-cover" sizes="120px" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {editingId && editingId !== "new" ? "儲存變更" : "新增動向"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
            </div>
          </form>
        )}

        {message && <p className="mt-4 text-sm text-brand-dark">{message}</p>}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-bold text-slate-900">現有動向（{items.length}）</h3>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">尚未加入任何動向</p>
        ) : (
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 lg:flex-row"
              >
                {item.image && (
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 lg:w-40">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="160px" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-slate-400">{item.publishedAt}</p>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.excerpt}</p>
                  <p className="mt-1 text-xs text-slate-400">/news/{item.slug}</p>
                </div>
                <div className="flex gap-2 lg:flex-col">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    <Pencil size={14} />
                    編輯
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    移除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
