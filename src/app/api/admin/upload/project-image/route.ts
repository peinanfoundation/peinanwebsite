import { NextResponse } from "next/server";
import { createId } from "@/lib/cms";
import { processProjectPhotoImage, processStoryImage } from "@/lib/image-utils";
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

    const isMainImage = parsed.type === "main";
    const rawBuffer = Buffer.from(await parsed.file.arrayBuffer());
    const buffer = isMainImage
      ? await processStoryImage(rawBuffer)
      : await processProjectPhotoImage(rawBuffer);

    const filename = `${createId(isMainImage ? "project-main" : "project")}.jpg`;
    const folder = isMainImage ? "project-main" : "project-photos";
    const { image } = await saveProcessedImage(
      `uploads/${folder}/${filename}`,
      `uploads/${folder}/${filename}`,
      buffer,
    );
    return NextResponse.json({ ok: true, image });
  } catch (error) {
    return uploadErrorResponse(error);
  }
}
