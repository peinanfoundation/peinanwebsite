"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";

type AboutContent = {
  banner: {
    label: string;
    title: string;
    description: string;
  };
  purpose: string;
  mission: string;
  vision: string;
  values: string[];
  teamImage: string;
  officeImage: string;
};

const emptyContent: AboutContent = {
  banner: { label: "", title: "", description: "" },
  purpose: "",
  mission: "",
  vision: "",
  values: [""],
  teamImage: "",
  officeImage: "",
};

export default function AboutAdmin() {
  const [content, setContent] = useState<AboutContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<"team" | "office" | null>(null);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/about-content");
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.error ?? "載入失敗，請重新整理頁面");
        return;
      }

      const loaded = data.content as AboutContent;
      setContent({
        ...loaded,
        values: loaded.values.length ? loaded.values : [""],
      });
    } catch {
      setMessage("載入失敗，請檢查網路後再試");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleImageUpload(file: File, type: "team" | "office") {
    setUploading(type);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/admin/upload/about-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.error ?? "上傳失敗，請重新登入後再試");
        return;
      }

      setContent((prev) => ({
        ...prev,
        [type === "team" ? "teamImage" : "officeImage"]: data.image,
      }));
      setMessage(type === "team" ? "團隊圖片已上傳" : "辦公室圖片已上傳");
    } catch {
      setMessage("上傳失敗，請檢查網路後再試");
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/admin/about-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...content,
          values: content.values.filter(Boolean),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.error ?? "儲存失敗");
        return;
      }

      setMessage("已儲存關於我們頁面內容");
      await loadData();
    } catch {
      setMessage("儲存失敗，請檢查網路後再試");
    }
  }

  function updateValue(index: number, value: string) {
    setContent((prev) => ({
      ...prev,
      values: prev.values.map((item, i) => (i === index ? value : item)),
    }));
  }

  function addValue() {
    setContent((prev) => ({ ...prev, values: [...prev.values, ""] }));
  }

  function removeValue(index: number) {
    setContent((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">頁面橫幅</h2>
          <p className="mt-2 text-sm text-slate-500">管理「關於我們」頁面頂部標題區塊</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">標籤</span>
              <input
                type="text"
                value={content.banner.label}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    banner: { ...prev.banner, label: event.target.value },
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">標題</span>
              <input
                type="text"
                value={content.banner.title}
                onChange={(event) =>
                  setContent((prev) => ({
                    ...prev,
                    banner: { ...prev.banner, title: event.target.value },
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">描述</span>
            <input
              type="text"
              value={content.banner.description}
              onChange={(event) =>
                setContent((prev) => ({
                  ...prev,
                  banner: { ...prev.banner, description: event.target.value },
                }))
              }
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">文字內容</h2>

          <label className="mt-6 block">
            <span className="text-sm font-medium text-slate-700">培楠宗旨</span>
            <textarea
              value={content.purpose}
              onChange={(event) =>
                setContent((prev) => ({ ...prev, purpose: event.target.value }))
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">使命</span>
            <textarea
              value={content.mission}
              onChange={(event) =>
                setContent((prev) => ({ ...prev, mission: event.target.value }))
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-slate-700">願景</span>
            <textarea
              value={content.vision}
              onChange={(event) =>
                setContent((prev) => ({ ...prev, vision: event.target.value }))
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">核心價值</span>
              <button
                type="button"
                onClick={addValue}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Plus size={14} />
                新增
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {content.values.map((value, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(event) => updateValue(index, event.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-slate-500 hover:bg-slate-50"
                    aria-label="移除核心價值"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900">圖片</h2>

          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <ImageField
              label="團隊活動圖片"
              image={content.teamImage}
              uploading={uploading === "team"}
              onUpload={(file) => handleImageUpload(file, "team")}
            />
            <ImageField
              label="辦公室圖片"
              image={content.officeImage}
              uploading={uploading === "office"}
              onUpload={(file) => handleImageUpload(file, "office")}
            />
          </div>
        </section>

        <button
          type="submit"
          className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          儲存變更
        </button>
      </form>
    </div>
  );
}

function ImageField({
  label,
  image,
  uploading,
  onUpload,
}: {
  label: string;
  image: string;
  uploading: boolean;
  onUpload: (file: File) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {image && (
        <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-slate-200">
          <Image src={image} alt={label} fill className="object-cover" />
        </div>
      )}
      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
        <Upload size={16} />
        {uploading ? "上傳中..." : "上傳圖片"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
