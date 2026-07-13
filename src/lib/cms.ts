import { readdir } from "node:fs/promises";
import path from "node:path";
import { listUploadedImages, readCmsJson, writeCmsJson } from "@/lib/cms-storage";

export type HeroSlide = {
  id: string;
  image: string;
  alt: string;
};

export type HeroStory = {
  id: string;
  title: string;
  description: string;
  mediaType: "image" | "youtube";
  image: string | null;
  youtubeId: string | null;
};

type HeroSlidesData = { slides: HeroSlide[] };
type HeroStoriesData = { stories: HeroStory[] };

const HERO_SLIDES_FILE = "hero-slides.json";
const HERO_STORIES_FILE = "hero-stories.json";

const HERO_SLIDE_LIBRARY_DIRS = [
  path.join(process.cwd(), "public", "images", "hero-slides"),
  path.join(process.cwd(), "public", "uploads", "hero-slides"),
];

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp)$/i;

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const data = await readCmsJson<HeroSlidesData>(HERO_SLIDES_FILE, { slides: [] });
  return data.slides;
}

export async function saveHeroSlides(slides: HeroSlide[]) {
  await writeCmsJson(HERO_SLIDES_FILE, { slides });
}

export async function getHeroStories(): Promise<HeroStory[]> {
  const data = await readCmsJson<HeroStoriesData>(HERO_STORIES_FILE, { stories: [] });
  return data.stories;
}

export async function saveHeroStories(stories: HeroStory[]) {
  await writeCmsJson(HERO_STORIES_FILE, { stories });
}

export async function getHeroSlideLibrary() {
  const images: { path: string; filename: string; source: string }[] = [];

  for (const dir of HERO_SLIDE_LIBRARY_DIRS) {
    const source = dir.includes("/uploads/") ? "uploads" : "library";
    try {
      const files = await readdir(dir);
      for (const file of files.filter((f) => IMAGE_EXTENSIONS.test(f))) {
        const publicPath = source === "uploads"
          ? `/uploads/hero-slides/${file}`
          : `/images/hero-slides/${file}`;
        images.push({ path: publicPath, filename: file, source });
      }
    } catch {
      // directory may not exist yet
    }
  }

  const blobImages = await listUploadedImages("uploads/hero-slides/");
  images.push(...blobImages);

  const unique = new Map(images.map((item) => [item.path, item]));
  return Array.from(unique.values()).sort((a, b) =>
    a.filename.localeCompare(b.filename, "zh-HK"),
  );
}

export function extractYoutubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
