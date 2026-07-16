import { NextResponse } from "next/server";
import { createId } from "@/lib/cms";
import { processHeroSlideImage } from "@/lib/image-utils";
import {
  readUploadImage,
  requireAdmin,
  saveProcessedImage,
  uploadErrorResponse,
} from "@/lib/admin-upload";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const parsed = await readUploadImage(request);
    if ("error" in parsed) return parsed.error;

    const filename = `${createId("hero")}.jpg`;
    const buffer = await processHeroSlideImage(
      Buffer.from(await parsed.file.arrayBuffer()),
    );
    const { image } = await saveProcessedImage(
      `uploads/hero-slides/${filename}`,
      `uploads/hero-slides/${filename}`,
      buffer,
    );
    return NextResponse.json({ ok: true, image });
  } catch (error) {
    return uploadErrorResponse(error);
  }
}
