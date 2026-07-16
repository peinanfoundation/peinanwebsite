import { NextResponse } from "next/server";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { isAuthenticated } from "@/lib/auth";
import { uploadImageBlob, useBlobStorage } from "@/lib/cms-storage";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function requireAdmin() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權，請重新登入後台" }, { status: 401 });
  }
  return null;
}

export async function readUploadImage(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: NextResponse.json({ error: "請選擇圖片檔案" }, { status: 400 }) };
  }

  if (!file.type.startsWith("image/")) {
    return { error: NextResponse.json({ error: "只接受圖片檔案" }, { status: 400 }) };
  }

  if (/heic|heif/i.test(file.type) || /\.heic$|\.heif$/i.test(file.name)) {
    return {
      error: NextResponse.json(
        { error: "暫不支援 HEIC／HEIF，請先轉成 JPG 或 PNG 再上傳" },
        { status: 400 },
      ),
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      error: NextResponse.json(
        { error: "圖片太大（上限約 4MB），請壓縮後再上傳" },
        { status: 400 },
      ),
    };
  }

  return { file, type: String(formData.get("type") ?? "") };
}

export async function saveProcessedImage(
  storagePath: string,
  localPublicPath: string,
  buffer: Buffer,
) {
  if (useBlobStorage()) {
    const image = await uploadImageBlob(storagePath, buffer);
    return { image };
  }

  if (process.env.VERCEL) {
    throw new Error("正式環境未設定 Blob 儲存，無法上傳圖片");
  }

  const outputPath = path.join(process.cwd(), "public", localPublicPath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);
  return { image: `/${localPublicPath}` };
}

export function uploadErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "上傳失敗，請稍後再試";
  console.error("[admin-upload]", error);
  return NextResponse.json({ error: message }, { status: 500 });
}
