import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

const files = [
  "hero-slides.json",
  "hero-stories.json",
  "featured-project.json",
  "project-videos.json",
  "project-photos.json",
  "news-items.json",
  "about-content.json",
];

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("Missing BLOB_READ_WRITE_TOKEN");
  process.exit(1);
}

for (const file of files) {
  const body = await readFile(path.join(process.cwd(), "data", file), "utf8");
  await put(`cms/${file}`, body, {
    access: "public",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  console.log(`restored ${file}`);
}
