import { NextResponse } from "next/server";
import {
  createId,
  getHeroSlideLibrary,
  getHeroSlides,
  saveHeroSlides,
  type HeroSlide,
} from "@/lib/cms";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const [slides, library] = await Promise.all([getHeroSlides(), getHeroSlideLibrary()]);
  const activeImages = new Set(slides.map((slide) => slide.image));

  return NextResponse.json({
    slides,
    library: library.map((item) => ({
      ...item,
      isActive: activeImages.has(item.path),
    })),
  });
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權，請重新登入後台" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "add") {
      const image = String(body.image ?? "");
      const alt = String(body.alt ?? "培楠基金活動花絮");
      if (!image) {
        return NextResponse.json({ error: "請選擇圖片" }, { status: 400 });
      }

      const slides = await getHeroSlides();
      if (slides.some((slide) => slide.image === image)) {
        return NextResponse.json({ error: "此圖片已在幻燈片中" }, { status: 400 });
      }

      const newSlide: HeroSlide = { id: createId("slide"), image, alt };
      await saveHeroSlides([...slides, newSlide]);
      return NextResponse.json({ ok: true, slide: newSlide });
    }

    if (action === "remove") {
      const id = String(body.id ?? "");
      const slides = await getHeroSlides();
      await saveHeroSlides(slides.filter((slide) => slide.id !== id));
      return NextResponse.json({ ok: true });
    }

    if (action === "updateAlt") {
      const id = String(body.id ?? "");
      const alt = String(body.alt ?? "");
      const slides = await getHeroSlides();
      await saveHeroSlides(
        slides.map((slide) => (slide.id === id ? { ...slide, alt } : slide)),
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "未知操作" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "儲存失敗";
    console.error("[hero-slides]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
