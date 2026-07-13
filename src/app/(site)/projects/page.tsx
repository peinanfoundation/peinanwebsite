import path from "node:path";
import { readdir } from "node:fs/promises";
import FeaturedProjectArticle from "@/components/FeaturedProjectArticle";

async function getJobspicImages() {
  try {
    const jobspicDir = path.join(process.cwd(), "public", "jobspic");
    const files = await readdir(jobspicDir);

    return files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, "zh-HK"))
      .map((file) => `/jobspic/${encodeURIComponent(file)}`);
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const jobImages = await getJobspicImages();
  return <FeaturedProjectArticle jobImages={jobImages} />;
}
