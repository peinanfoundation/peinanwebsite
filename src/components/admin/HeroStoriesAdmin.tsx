"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";

type Story = {
  id: string;
  title: string;
  description: string;
  mediaType: "image" | "youtube";
  image: string | null;
  youtubeId: string | null;
};

type StoryForm = {
  title: string;
  description: string;
  mediaType: "image" | "youtube";
  image: string;
  youtubeUrl: string;
};

const emptyForm: StoryForm = {
  title: "",
  description: "",
  mediaType: "image",
  image: "",
  youtubeUrl: "",
};

export default function HeroStoriesAdmin() {
  const [stories, setStories] = useState<Story[]>([]);
  const [form, setForm] = useState<StoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    const response = await fetch("/api/admin/hero-stories");
    const data = await response.json();
    setStories(data.stories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleImageUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload/story-image", {
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
    setMessage("圖片已上傳並自動縮放");
    setUploading(false);
  }

  function startEdit(story: Story) {
    setEditingId(story.id);
    setForm({
      title: story.title,
      description: story.description,
      mediaType: story.mediaType,
      image: story.image ?? "",
      youtubeUrl: story.youtubeId
        ? `https://www.youtube.com/watch?v=${story.youtubeId}`
        : "",
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const payload = {
      action: editingId && editingId !== "new" ? "update" : "add",
      id: editingId !== "new" ? editingId : undefined,
      title: form.title,
      description: form.description,
      mediaType: form.mediaType,
      image: form.mediaType === "image" ? form.image : undefined,
      youtubeUrl: form.mediaType === "youtube" ? form.youtubeUrl : undefined,
    };

    const response = await fetch("/api/admin/hero-stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "儲存失敗");
      return;
    }

    setMessage(editingId ? "已更新 Story" : "已新增 Story");
    cancelEdit();
    await loadData();
  }

  async function removeStory(id: string) {
    await fetch("/api/admin/hero-stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", id }),
    });
    setMessage("已移除 Story");
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
            <h2 className="text-xl font-bold text-slate-900">首頁 Story</h2>
            <p className="mt-2 text-sm text-slate-500">
              管理首頁圖文區塊，可加入圖片（自動縮放 980×650）或 YouTube 影片。
            </p>
          </div>
          {!editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setEditingId("new");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <Plus size={16} />
              新增 Story
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
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">媒體類型</span>
                <select
                  value={form.mediaType}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      mediaType: event.target.value as "image" | "youtube",
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                >
                  <option value="image">圖片</option>
                  <option value="youtube">YouTube 影片</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">內容文字</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                rows={5}
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                required
              />
            </label>

            {form.mediaType === "image" ? (
              <div>
                <span className="text-sm font-medium text-slate-700">圖片</span>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Upload size={16} />
                    {uploading ? "上傳中..." : "上傳圖片"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) handleImageUpload(file);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {form.image && (
                    <div className="relative h-24 w-36 overflow-hidden rounded-lg ring-1 ring-slate-200">
                      <Image
                        src={form.image}
                        alt="預覽"
                        fill
                        className="object-cover"
                        sizes="150px"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">YouTube 連結</span>
                <input
                  type="url"
                  value={form.youtubeUrl}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, youtubeUrl: event.target.value }))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                  required
                />
              </label>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {editingId && editingId !== "new" ? "儲存變更" : "新增 Story"}
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
        <h3 className="text-lg font-bold text-slate-900">現有 Story（{stories.length}）</h3>
        {stories.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">尚未加入任何 Story</p>
        ) : (
          <div className="mt-4 space-y-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 lg:flex-row"
              >
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 lg:w-56">
                  {story.mediaType === "youtube" && story.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${story.youtubeId}`}
                      title={story.title}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  ) : story.image ? (
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                      sizes="250px"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{story.title}</h4>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                    {story.description}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {story.mediaType === "youtube" ? "YouTube 影片" : "圖片"}
                  </p>
                </div>
                <div className="flex gap-2 lg:flex-col">
                  <button
                    type="button"
                    onClick={() => startEdit(story)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil size={14} />
                    編輯
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStory(story.id)}
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
