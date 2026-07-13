import { NextResponse } from "next/server";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { createId } from "@/lib/cms";
import { processProjectPhotoImage, processStoryImage } from "@/lib/image-utils";
import { isAuthenticated } from "@/lib/auth";
import { uploadImageBlob, useBlobStorage } from "@/lib/cms-storage";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const type = String(formData.get("type") ?? "photo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "請選擇圖片檔案" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "只接受圖片檔案" }, { status: 400 });
  }

  const rawBuffer = Buffer.from(await file.arrayBuffer());
  const isMainImage = type === "main";
  const buffer = isMainImage
    ? await processStoryImage(rawBuffer)
    : await processProjectPhotoImage(rawBuffer);

  const filename = `${createId(isMainImage ? "project-main" : "project")}.jpg`;

  if (useBlobStorage()) {
    const folder = isMainImage ? "uploads/project-main" : "uploads/project-photos";
    const image = await uploadImageBlob(`${folder}/${filename}`, buffer);
    return NextResponse.json({ ok: true, image });
  }

  const folder = isMainImage ? "project-main" : "project-photos";
  const outputPath = path.join(process.cwd(), "public", "uploads", folder, filename);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);

  return NextResponse.json({
    ok: true,
    image: `/uploads/${folder}/${filename}`,
  });
}
