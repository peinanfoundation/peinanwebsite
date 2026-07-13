import { NextResponse } from "next/server";
import {
  createId,
  extractYoutubeId,
  getProjectVideos,
  saveProjectVideos,
  type ProjectVideo,
} from "@/lib/cms";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const videos = await getProjectVideos();
  return NextResponse.json({ videos });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const body = await request.json();
  const action = body.action as string;
  const videos = await getProjectVideos();

  if (action === "add") {
    const title = String(body.title ?? "").trim();
    const youtubeId = extractYoutubeId(String(body.youtubeUrl ?? ""));

    if (!title || !youtubeId) {
      return NextResponse.json({ error: "請填寫標題及正確的 YouTube 連結" }, { status: 400 });
    }

    const video: ProjectVideo = { id: createId("video"), title, youtubeId };
    await saveProjectVideos([...videos, video]);
    return NextResponse.json({ ok: true, video });
  }

  if (action === "update") {
    const id = String(body.id ?? "");
    const title = String(body.title ?? "").trim();
    const youtubeId = extractYoutubeId(String(body.youtubeUrl ?? body.youtubeId ?? ""));

    if (!title || !youtubeId) {
      return NextResponse.json({ error: "請填寫標題及正確的 YouTube 連結" }, { status: 400 });
    }

    const updated: ProjectVideo[] = videos.map((video) =>
      video.id === id ? { ...video, title, youtubeId } : video,
    );

    if (!updated.some((video) => video.id === id)) {
      return NextResponse.json({ error: "找不到該影片" }, { status: 404 });
    }

    await saveProjectVideos(updated);
    return NextResponse.json({ ok: true });
  }

  if (action === "remove") {
    const id = String(body.id ?? "");
    await saveProjectVideos(videos.filter((video) => video.id !== id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "未知操作" }, { status: 400 });
}
