import { NextResponse } from "next/server";
import { createId } from "@/lib/cms";
import { processStoryImage } from "@/lib/image-utils";
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

    const imageType = parsed.type === "office" ? "office" : "team";
    const filename = `${createId(`about-${imageType}`)}.jpg`;
    const buffer = await processStoryImage(
      Buffer.from(await parsed.file.arrayBuffer()),
    );
    const folder = imageType === "office" ? "about-office" : "about-team";
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
