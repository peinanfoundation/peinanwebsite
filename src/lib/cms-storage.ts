import { readFile } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

const CMS_PREFIX = "cms/";

function hasValidBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? "";
  return token.startsWith("vercel_blob_rw_");
}

export function useBlobStorage() {
  // Connected Blob store on Vercel can authenticate via OIDC without RW token.
  return hasValidBlobToken() || Boolean(process.env.BLOB_STORE_ID);
}

function getBlobAuthOptions() {
  if (!hasValidBlobToken()) return {};
  return { token: process.env.BLOB_READ_WRITE_TOKEN };
}

async function readLocalJson<T>(filename: string, fallback: T): Promise<T> {
  try {
    const localPath = path.join(process.cwd(), "data", filename);
    const raw = await readFile(localPath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function isEmptyCmsPayload(filename: string, data: unknown) {
  if (!data || typeof data !== "object") return true;

  const record = data as Record<string, unknown>;

  if (filename === "featured-project.json") {
    const project = data as { background?: string[]; goalsIntro?: string };
    return !project.goalsIntro && !(project.background?.length);
  }

  if (filename === "about-content.json") {
    const about = data as { purpose?: string };
    return !about.purpose;
  }

  for (const key of ["slides", "stories", "items", "photos", "videos"]) {
    if (Array.isArray(record[key])) {
      return record[key].length === 0;
    }
  }

  return false;
}

export async function readCmsJson<T>(filename: string, fallback: T): Promise<T> {
  const localData = await readLocalJson(filename, fallback);

  if (!useBlobStorage()) {
    return localData;
  }

  const key = `${CMS_PREFIX}${filename}`;

  try {
    const { blobs } = await list({ prefix: key, ...getBlobAuthOptions() });
    const match = blobs.find((blob) => blob.pathname === key);

    if (!match) {
      if (!isEmptyCmsPayload(filename, localData)) {
        await writeCmsJson(filename, localData);
      }
      return localData;
    }

    const response = await fetch(match.url, { cache: "no-store" });
    if (!response.ok) return localData;

    const remote = (await response.json()) as T;
    if (isEmptyCmsPayload(filename, remote)) {
      return localData;
    }

    return remote;
  } catch {
    return localData;
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

  await put(`${CMS_PREFIX}${filename}`, JSON.stringify(data, null, 2), {
    access: "public",
    ...getBlobAuthOptions(),
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
  const blob = await put(storagePath, toUploadBody(buffer), {
    access: "public",
    ...getBlobAuthOptions(),
    contentType,
  });
  return blob.url;
}

export async function listUploadedImages(prefix: string) {
  if (!useBlobStorage()) return [];

  const { blobs } = await list({ prefix, ...getBlobAuthOptions() });
  return blobs.map((blob) => ({
    path: blob.url,
    filename: blob.pathname.split("/").pop() ?? blob.pathname,
    source: "uploads" as const,
  }));
}
