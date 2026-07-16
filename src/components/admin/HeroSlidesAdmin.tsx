"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";

type Slide = {
  id: string;
  image: string;
  alt: string;
};

type LibraryItem = {
  path: string;
  filename: string;
  source: string;
  isActive: boolean;
};

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    const response = await fetch("/api/admin/hero-slides");
    const data = await response.json();
    setSlides(data.slides ?? []);
    setLibrary(data.library ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/admin/upload/hero-slide", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json().catch(() => ({}));

      if (!uploadResponse.ok) {
        setMessage(uploadData.error ?? "上傳失敗，請重新登入後再試");
        return;
      }

      const addResponse = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          image: uploadData.image,
          alt: "培楠基金活動花絮",
        }),
      });
      const addData = await addResponse.json().catch(() => ({}));

      if (!addResponse.ok) {
        setMessage(addData.error ?? "加入幻燈片失敗");
      } else {
        setMessage("已上傳並加入幻燈片");
        await loadData();
      }
    } catch {
      setMessage("上傳失敗，請檢查網路後再試");
    } finally {
      setUploading(false);
    }
  }

  async function addFromLibrary(image: string) {
    const response = await fetch("/api/admin/hero-slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", image, alt: "培楠基金活動花絮" }),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "加入失敗");
      return;
    }

    setMessage("已加入幻燈片");
    await loadData();
  }

  async function removeSlide(id: string) {
    await fetch("/api/admin/hero-slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", id }),
    });
    setMessage("已移除幻燈片");
    await loadData();
  }

  if (loading) {
    return <p className="text-slate-500">載入中...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-bold text-slate-900">首頁幻燈片</h2>
        <p className="mt-2 text-sm text-slate-500">
          管理首頁輪播圖片。上傳後會自動縮放為 1897×1049 比例。
        </p>

        <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          <Upload size={16} />
          {uploading ? "上傳中..." : "上傳新圖片"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleUpload(file);
              event.target.value = "";
            }}
          />
        </label>

        {message && <p className="mt-4 text-sm text-brand-dark">{message}</p>}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-bold text-slate-900">目前幻燈片（{slides.length}）</h3>
        {slides.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">尚未加入任何幻燈片</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="overflow-hidden rounded-xl ring-1 ring-slate-200"
              >
                <div className="relative aspect-[1897/1049] bg-slate-100">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm text-slate-600">第 {index + 1} 張</span>
                  <button
                    type="button"
                    onClick={() => removeSlide(slide.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
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

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-bold text-slate-900">幻燈片庫存（{library.length}）</h3>
        <p className="mt-2 text-sm text-slate-500">
          所有可用圖片。綠色標記代表已加入首頁幻燈片。
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {library.map((item) => (
            <div
              key={item.path}
              className={`overflow-hidden rounded-xl ring-1 ${
                item.isActive ? "ring-green-400" : "ring-slate-200"
              }`}
            >
              <div className="relative aspect-[1897/1049] bg-slate-100">
                <Image
                  src={item.path}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  sizes="250px"
                />
                {item.isActive && (
                  <span className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                    使用中
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-slate-500">{item.filename}</p>
                <p className="text-xs text-slate-400">
                  {item.source === "uploads" ? "後台上傳" : "原有圖庫"}
                </p>
                {!item.isActive && (
                  <button
                    type="button"
                    onClick={() => addFromLibrary(item.path)}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    加入幻燈片
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
