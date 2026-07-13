"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";

type FeaturedProject = {
  title: string;
  background: string[];
  goalsIntro: string;
  goals: string[];
  image: string;
};

type ProjectVideo = {
  id: string;
  youtubeId: string;
  title: string;
};

type ProjectPhoto = {
  id: string;
  image: string;
};

type LibraryItem = {
  path: string;
  filename: string;
  source: string;
  isActive: boolean;
};

type VideoForm = { title: string; youtubeUrl: string };

const emptyVideoForm: VideoForm = { title: "", youtubeUrl: "" };

export default function ProjectsAdmin() {
  const [project, setProject] = useState<FeaturedProject>({
    title: "",
    background: [""],
    goalsIntro: "",
    goals: [""],
    image: "",
  });
  const [videos, setVideos] = useState<ProjectVideo[]>([]);
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [videoForm, setVideoForm] = useState<VideoForm>(emptyVideoForm);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    const [projectRes, videosRes, photosRes] = await Promise.all([
      fetch("/api/admin/featured-project"),
      fetch("/api/admin/project-videos"),
      fetch("/api/admin/project-photos"),
    ]);
    const projectData = await projectRes.json();
    const videosData = await videosRes.json();
    const photosData = await photosRes.json();

    const p = projectData.project as FeaturedProject;
    setProject({
      ...p,
      background: p.background.length ? p.background : [""],
      goals: p.goals.length ? p.goals : [""],
    });
    setVideos(videosData.videos ?? []);
    setPhotos(photosData.photos ?? []);
    setLibrary(photosData.library ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function uploadImage(file: File, type: "main" | "photo") {
    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/admin/upload/project-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "上傳失敗");
      setUploading(false);
      return null;
    }

    const data = await response.json();
    setUploading(false);
    return data.image as string;
  }

  async function handleProjectSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/featured-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...project,
        background: project.background.filter(Boolean),
        goals: project.goals.filter(Boolean),
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "儲存失敗");
      return;
    }

    setMessage("已儲存項目內容");
    await loadData();
  }

  async function handleVideoSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/project-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: editingVideoId && editingVideoId !== "new" ? "update" : "add",
        id: editingVideoId !== "new" ? editingVideoId : undefined,
        title: videoForm.title,
        youtubeUrl: videoForm.youtubeUrl,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "儲存失敗");
      return;
    }

    setMessage(editingVideoId === "new" || !editingVideoId ? "已新增影片" : "已更新影片");
    setEditingVideoId(null);
    setVideoForm(emptyVideoForm);
    await loadData();
  }

  async function removeVideo(id: string) {
    await fetch("/api/admin/project-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", id }),
    });
    setMessage("已移除影片");
    await loadData();
  }

  async function addPhotoFromLibrary(image: string) {
    const response = await fetch("/api/admin/project-photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", image }),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "加入失敗");
      return;
    }

    setMessage("已加入活動相片");
    await loadData();
  }

  async function removePhoto(id: string) {
    await fetch("/api/admin/project-photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", id }),
    });
    setMessage("已移除活動相片");
    await loadData();
  }

  function updateListItem(
    field: "background" | "goals",
    index: number,
    value: string,
  ) {
    setProject((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  }

  function addListItem(field: "background" | "goals") {
    setProject((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  }

  function removeListItem(field: "background" | "goals", index: number) {
    setProject((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  if (loading) {
    return <p className="text-slate-500">載入中...</p>;
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-lg bg-brand/10 px-4 py-3 text-sm text-brand-dark">{message}</p>
      )}

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">重點項目內容</h2>
        <p className="mt-2 text-sm text-slate-500">編輯標題、背景、理念目標及主圖</p>

        <form onSubmit={handleProjectSubmit} className="mt-6 space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">標題</span>
            <input
              type="text"
              value={project.title}
              onChange={(e) => setProject((p) => ({ ...p, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
              required
            />
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">背景段落</span>
              <button
                type="button"
                onClick={() => addListItem("background")}
                className="inline-flex items-center gap-1 text-sm text-brand-dark"
              >
                <Plus size={14} /> 新增段落
              </button>
            </div>
            <div className="space-y-3">
              {project.background.map((paragraph, index) => (
                <div key={`bg-${index}`} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateListItem("background", index, e.target.value)}
                    rows={3}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem("background", index)}
                    className="self-start rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label="移除段落"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">理念及目標介紹</span>
            <textarea
              value={project.goalsIntro}
              onChange={(e) => setProject((p) => ({ ...p, goalsIntro: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
              required
            />
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">目標列表</span>
              <button
                type="button"
                onClick={() => addListItem("goals")}
                className="inline-flex items-center gap-1 text-sm text-brand-dark"
              >
                <Plus size={14} /> 新增目標
              </button>
            </div>
            <div className="space-y-3">
              {project.goals.map((goal, index) => (
                <div key={`goal-${index}`} className="flex gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => updateListItem("goals", index, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem("goals", index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label="移除目標"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-700">主圖</span>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                <Upload size={16} />
                {uploading ? "上傳中..." : "上傳主圖"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const image = await uploadImage(file, "main");
                    if (image) setProject((p) => ({ ...p, image }));
                    e.target.value = "";
                  }}
                />
              </label>
              {project.image && (
                <div className="relative h-24 w-36 overflow-hidden rounded-lg ring-1 ring-slate-200">
                  <Image src={project.image} alt="主圖預覽" fill className="object-cover" sizes="150px" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            儲存項目內容
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">YouTube 影片</h2>
            <p className="mt-1 text-sm text-slate-500">管理重點項目頁面的嵌入影片</p>
          </div>
          {!editingVideoId && (
            <button
              type="button"
              onClick={() => {
                setVideoForm(emptyVideoForm);
                setEditingVideoId("new");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <Plus size={16} /> 新增影片
            </button>
          )}
        </div>

        {(editingVideoId || videoForm.title) && (
          <form onSubmit={handleVideoSubmit} className="mt-6 space-y-4 border-t border-slate-100 pt-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">標題</span>
              <input
                type="text"
                value={videoForm.title}
                onChange={(e) => setVideoForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">YouTube 連結</span>
              <input
                type="url"
                value={videoForm.youtubeUrl}
                onChange={(e) => setVideoForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-brand/30 focus:ring-2"
                required
              />
            </label>
            <div className="flex gap-3">
              <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
                {editingVideoId && editingVideoId !== "new" ? "儲存變更" : "新增影片"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingVideoId(null);
                  setVideoForm(emptyVideoForm);
                }}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 lg:flex-row">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black lg:w-64">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">{video.title}</h4>
                <p className="mt-1 text-sm text-slate-500">{video.youtubeId}</p>
              </div>
              <div className="flex gap-2 lg:flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideoId(video.id);
                    setVideoForm({
                      title: video.title,
                      youtubeUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
                    });
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                >
                  <Pencil size={14} /> 編輯
                </button>
                <button
                  type="button"
                  onClick={() => removeVideo(video.id)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} /> 移除
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">活動相片（{photos.length}）</h2>
        <p className="mt-2 text-sm text-slate-500">管理重點項目頁面底部的活動相片</p>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
          <Upload size={16} />
          {uploading ? "上傳中..." : "上傳新相片"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const image = await uploadImage(file, "photo");
              if (image) await addPhotoFromLibrary(image);
              e.target.value = "";
            }}
          />
        </label>

        {photos.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {photos.map((photo, index) => (
              <div key={photo.id} className="overflow-hidden rounded-xl ring-1 ring-slate-200">
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image src={photo.image} alt={`活動相片 ${index + 1}`} fill className="object-cover" sizes="250px" />
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm text-slate-600">第 {index + 1} 張</span>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 rounded-lg px-2 py-1"
                  >
                    <Trash2 size={14} /> 移除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h3 className="mt-8 text-lg font-bold text-slate-900">相片庫存（{library.length}）</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {library.map((item) => (
            <div
              key={item.path}
              className={`overflow-hidden rounded-xl ring-1 ${item.isActive ? "ring-green-400" : "ring-slate-200"}`}
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image src={item.path} alt={item.filename} fill className="object-cover" sizes="200px" />
                {item.isActive && (
                  <span className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                    使用中
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-slate-500">{item.filename}</p>
                {!item.isActive && (
                  <button
                    type="button"
                    onClick={() => addPhotoFromLibrary(item.path)}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                  >
                    加入活動相片
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
