import { NextResponse } from "next/server";
import {
  createId,
  extractYoutubeId,
  getHeroStories,
  saveHeroStories,
  type HeroStory,
} from "@/lib/cms";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const stories = await getHeroStories();
  return NextResponse.json({ stories });
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權，請重新登入後台" }, { status: 401 });
  }

  try {
  const body = await request.json();
  const action = body.action as string;
  const stories = await getHeroStories();

  if (action === "add") {
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const mediaType: HeroStory["mediaType"] =
      body.mediaType === "youtube" ? "youtube" : "image";

    if (!title || !description) {
      return NextResponse.json({ error: "請填寫標題和內容" }, { status: 400 });
    }

    let image: string | null = null;
    let youtubeId: string | null = null;

    if (mediaType === "youtube") {
      youtubeId = extractYoutubeId(String(body.youtubeUrl ?? ""));
      if (!youtubeId) {
        return NextResponse.json({ error: "YouTube 連結格式不正確" }, { status: 400 });
      }
    } else {
      image = String(body.image ?? "");
      if (!image) {
        return NextResponse.json({ error: "請上傳圖片" }, { status: 400 });
      }
    }

    const story: HeroStory = {
      id: createId("story"),
      title,
      description,
      mediaType,
      image,
      youtubeId,
    };

    await saveHeroStories([...stories, story]);
    return NextResponse.json({ ok: true, story });
  }

  if (action === "update") {
    const id = String(body.id ?? "");
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const mediaType: HeroStory["mediaType"] =
      body.mediaType === "youtube" ? "youtube" : "image";

    if (!title || !description) {
      return NextResponse.json({ error: "請填寫標題和內容" }, { status: 400 });
    }

    let image: string | null = null;
    let youtubeId: string | null = null;

    if (mediaType === "youtube") {
      youtubeId = extractYoutubeId(String(body.youtubeUrl ?? body.youtubeId ?? ""));
      if (!youtubeId) {
        return NextResponse.json({ error: "YouTube 連結格式不正確" }, { status: 400 });
      }
    } else {
      image = String(body.image ?? "");
      if (!image) {
        return NextResponse.json({ error: "請上傳圖片" }, { status: 400 });
      }
    }

    const updated: HeroStory[] = stories.map((story) =>
      story.id === id
        ? { ...story, title, description, mediaType, image, youtubeId }
        : story,
    );

    if (!updated.some((story) => story.id === id)) {
      return NextResponse.json({ error: "找不到該 story" }, { status: 404 });
    }

    await saveHeroStories(updated);
    return NextResponse.json({ ok: true });
  }

  if (action === "remove") {
    const id = String(body.id ?? "");
    await saveHeroStories(stories.filter((story) => story.id !== id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "未知操作" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "儲存失敗";
    console.error("[hero-stories]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
