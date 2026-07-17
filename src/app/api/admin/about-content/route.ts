import { NextResponse } from "next/server";
import { getAboutContent, saveAboutContent, type AboutContent } from "@/lib/cms";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const content = await getAboutContent();
  return NextResponse.json({ content });
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "未授權，請重新登入後台" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const bannerLabel = String(body.banner?.label ?? "").trim();
    const bannerTitle = String(body.banner?.title ?? "").trim();
    const bannerDescription = String(body.banner?.description ?? "").trim();
    const purpose = String(body.purpose ?? "").trim();
    const mission = String(body.mission ?? "").trim();
    const vision = String(body.vision ?? "").trim();
    const teamImage = String(body.teamImage ?? "").trim();
    const officeImage = String(body.officeImage ?? "").trim();
    const values = Array.isArray(body.values)
      ? body.values.map((value: unknown) => String(value).trim()).filter(Boolean)
      : [];

    if (
      !bannerLabel ||
      !bannerTitle ||
      !bannerDescription ||
      !purpose ||
      !mission ||
      !vision ||
      !teamImage ||
      !officeImage
    ) {
      return NextResponse.json({ error: "請填寫所有必填欄位及圖片" }, { status: 400 });
    }

    if (values.length === 0) {
      return NextResponse.json({ error: "請至少填寫一項核心價值" }, { status: 400 });
    }

    const content: AboutContent = {
      banner: {
        label: bannerLabel,
        title: bannerTitle,
        description: bannerDescription,
      },
      purpose,
      mission,
      vision,
      values,
      teamImage,
      officeImage,
    };

    await saveAboutContent(content);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "儲存失敗";
    console.error("[about-content]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
