import { NextResponse } from "next/server";
import { getFeaturedProject, saveFeaturedProject, type FeaturedProject } from "@/lib/cms";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const project = await getFeaturedProject();
  return NextResponse.json({ project });
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權，請重新登入後台" }, { status: 401 });
  }

  try {
  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const goalsIntro = String(body.goalsIntro ?? "").trim();
  const image = String(body.image ?? "").trim();
  const background = Array.isArray(body.background)
    ? body.background.map((p: unknown) => String(p).trim()).filter(Boolean)
    : [];
  const goals = Array.isArray(body.goals)
    ? body.goals.map((g: unknown) => String(g).trim()).filter(Boolean)
    : [];

  if (!title || !goalsIntro || !image) {
    return NextResponse.json({ error: "請填寫標題、理念介紹及主圖" }, { status: 400 });
  }

  const project: FeaturedProject = { title, background, goalsIntro, goals, image };
  await saveFeaturedProject(project);
  return NextResponse.json({ ok: true, project });
  } catch (error) {
    const message = error instanceof Error ? error.message : "儲存失敗";
    console.error("[featured-project]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
