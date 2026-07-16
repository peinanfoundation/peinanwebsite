import { readFile } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

const CMS_PREFIX = "cms/";

export function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

async function seedFromLocal<T>(filename: string, fallback: T): Promise<T> {
  try {
    const localPath = path.join(process.cwd(), "data", filename);
    const raw = await readFile(localPath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function readCmsJson<T>(filename: string, fallback: T): Promise<T> {
  if (!useBlobStorage()) {
    try {
      const localPath = path.join(process.cwd(), "data", filename);
      const raw = await readFile(localPath, "utf8");
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  const token = getBlobToken();
  const key = `${CMS_PREFIX}${filename}`;

  try {
    const { blobs } = await list({ prefix: key, token });
    const match = blobs.find((blob) => blob.pathname === key);

    if (!match) {
      const seeded = await seedFromLocal(filename, fallback);
      if (seeded !== fallback) {
        await writeCmsJson(filename, seeded);
      }
      return seeded;
    }

    const response = await fetch(match.url, { cache: "no-store" });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return seedFromLocal(filename, fallback);
  }
}

export async function writeCmsJson<T>(filename: string, data: T) {
  if (!useBlobStorage()) {
    if (process.env.VERCEL) {
      throw new Error("正式環境未設定 Blob 儲存，無法儲存內容");
    }
    const { mkdir, writeFile } = await import("node:fs/promises");
    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    await writeFile(
      path.join(dataDir, filename),
      `${JSON.stringify(data, null, 2)}\n`,
      "utf8",
    );
    return;
  }

  const token = getBlobToken();
  await put(`${CMS_PREFIX}${filename}`, JSON.stringify(data, null, 2), {
    access: "public",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

function toUploadBody(buffer: Buffer) {
  // Vercel Blob rejects SharedArrayBuffer-backed views from sharp output.
  return Buffer.from(buffer);
}

export async function uploadImageBlob(
  storagePath: string,
  buffer: Buffer,
  contentType = "image/jpeg",
) {
  const token = getBlobToken();
  const blob = await put(storagePath, toUploadBody(buffer), {
    access: "public",
    token,
    contentType,
  });
  return blob.url;
}

export async function listUploadedImages(prefix: string) {
  if (!useBlobStorage()) return [];

  const token = getBlobToken();
  const { blobs } = await list({ prefix, token });
  return blobs.map((blob) => ({
    path: blob.url,
    filename: blob.pathname.split("/").pop() ?? blob.pathname,
    source: "uploads" as const,
  }));
}
