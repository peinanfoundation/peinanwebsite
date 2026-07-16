import { NextResponse } from "next/server";
import {
  createId,
  getProjectPhotoLibrary,
  getProjectPhotos,
  saveProjectPhotos,
  type ProjectPhoto,
} from "@/lib/cms";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const [photos, library] = await Promise.all([getProjectPhotos(), getProjectPhotoLibrary()]);
  const activeImages = new Set(photos.map((photo) => photo.image));

  return NextResponse.json({
    photos,
    library: library.map((item) => ({
      ...item,
      isActive: activeImages.has(item.path),
    })),
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權，請重新登入後台" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "add") {
      const image = String(body.image ?? "");
      if (!image) {
        return NextResponse.json({ error: "請選擇圖片" }, { status: 400 });
      }

      const photos = await getProjectPhotos();
      if (photos.some((photo) => photo.image === image)) {
        return NextResponse.json({ error: "此圖片已在活動相片中" }, { status: 400 });
      }

      const photo: ProjectPhoto = { id: createId("photo"), image };
      await saveProjectPhotos([...photos, photo]);
      return NextResponse.json({ ok: true, photo });
    }

    if (action === "remove") {
      const id = String(body.id ?? "");
      const photos = await getProjectPhotos();
      await saveProjectPhotos(photos.filter((photo) => photo.id !== id));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "未知操作" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "儲存失敗";
    console.error("[project-photos]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
