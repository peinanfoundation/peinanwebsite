import { NextResponse } from "next/server";
import { createId } from "@/lib/cms";
import { processHeroSlideImage } from "@/lib/image-utils";
import { isAuthenticated } from "@/lib/auth";
import { uploadImageBlob, useBlobStorage } from "@/lib/cms-storage";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "請選擇圖片檔案" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "只接受圖片檔案" }, { status: 400 });
  }

  const filename = `${createId("hero")}.jpg`;
  const buffer = await processHeroSlideImage(Buffer.from(await file.arrayBuffer()));

  if (useBlobStorage()) {
    const image = await uploadImageBlob(`uploads/hero-slides/${filename}`, buffer);
    return NextResponse.json({ ok: true, image });
  }

  const outputPath = path.join(process.cwd(), "public", "uploads", "hero-slides", filename);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);

  return NextResponse.json({
    ok: true,
    image: `/uploads/hero-slides/${filename}`,
  });
}
