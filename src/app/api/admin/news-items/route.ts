import { NextResponse } from "next/server";
import {
  createId,
  createNewsSlug,
  getNewsItems,
  saveNewsItems,
  type NewsItem,
} from "@/lib/cms";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const items = await getNewsItems();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  const body = await request.json();
  const action = body.action as string;
  const items = await getNewsItems();
  const slugs = items.map((item) => item.slug);

  if (action === "add") {
    const title = String(body.title ?? "").trim();
    const excerpt = String(body.excerpt ?? "").trim();
    const content = String(body.content ?? excerpt).trim();
    const image = body.image ? String(body.image) : null;
    const publishedAt = String(body.publishedAt ?? new Date().toISOString().slice(0, 10));
    const slugInput = String(body.slug ?? "").trim();
    const slug = slugInput || createNewsSlug(title, slugs);

    if (!title || !excerpt) {
      return NextResponse.json({ error: "請填寫標題和摘要" }, { status: 400 });
    }

    if (slugs.includes(slug)) {
      return NextResponse.json({ error: "此網址代稱已被使用" }, { status: 400 });
    }

    const item: NewsItem = {
      id: createId("news"),
      slug,
      title,
      excerpt,
      content,
      image,
      publishedAt,
    };

    await saveNewsItems([item, ...items]);
    return NextResponse.json({ ok: true, item });
  }

  if (action === "update") {
    const id = String(body.id ?? "");
    const title = String(body.title ?? "").trim();
    const excerpt = String(body.excerpt ?? "").trim();
    const content = String(body.content ?? excerpt).trim();
    const image = body.image ? String(body.image) : null;
    const publishedAt = String(body.publishedAt ?? "").trim();
    const slugInput = String(body.slug ?? "").trim();

    if (!title || !excerpt || !publishedAt) {
      return NextResponse.json({ error: "請填寫標題、摘要及日期" }, { status: 400 });
    }

    const otherSlugs = items.filter((item) => item.id !== id).map((item) => item.slug);
    const slug = slugInput || createNewsSlug(title, otherSlugs);

    if (otherSlugs.includes(slug)) {
      return NextResponse.json({ error: "此網址代稱已被使用" }, { status: 400 });
    }

    const updated: NewsItem[] = items.map((item) =>
      item.id === id
        ? { ...item, title, excerpt, content, image, publishedAt, slug }
        : item,
    );

    if (!updated.some((item) => item.id === id)) {
      return NextResponse.json({ error: "找不到該動向" }, { status: 404 });
    }

    await saveNewsItems(updated);
    return NextResponse.json({ ok: true });
  }

  if (action === "remove") {
    const id = String(body.id ?? "");
    await saveNewsItems(items.filter((item) => item.id !== id));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "未知操作" }, { status: 400 });
}
