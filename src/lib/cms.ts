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

export type FeaturedProject = {
  title: string;
  background: string[];
  goalsIntro: string;
  goals: string[];
  image: string;
};

export type ProjectVideo = {
  id: string;
  youtubeId: string;
  title: string;
};

export type ProjectPhoto = {
  id: string;
  image: string;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  publishedAt: string;
};

type FeaturedProjectData = FeaturedProject;
type ProjectVideosData = { videos: ProjectVideo[] };
type ProjectPhotosData = { photos: ProjectPhoto[] };
type NewsItemsData = { items: NewsItem[] };

const HERO_SLIDES_FILE = "hero-slides.json";
const HERO_STORIES_FILE = "hero-stories.json";
const FEATURED_PROJECT_FILE = "featured-project.json";
const PROJECT_VIDEOS_FILE = "project-videos.json";
const PROJECT_PHOTOS_FILE = "project-photos.json";
const NEWS_ITEMS_FILE = "news-items.json";

const HERO_SLIDE_LIBRARY_DIRS = [
  path.join(process.cwd(), "public", "images", "hero-slides"),
  path.join(process.cwd(), "public", "uploads", "hero-slides"),
];

const PROJECT_PHOTO_LIBRARY_DIRS = [
  path.join(process.cwd(), "public", "jobspic"),
  path.join(process.cwd(), "public", "uploads", "project-photos"),
];

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp)$/i;

const defaultFeaturedProject: FeaturedProject = {
  title: "「乖孩子好學生」教育獎學計劃",
  background: [],
  goalsIntro: "",
  goals: [],
  image: "/images/hero-slide-grassroots.jpg",
};

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

export async function getFeaturedProject(): Promise<FeaturedProject> {
  return readCmsJson<FeaturedProjectData>(FEATURED_PROJECT_FILE, defaultFeaturedProject);
}

export async function saveFeaturedProject(project: FeaturedProject) {
  await writeCmsJson(FEATURED_PROJECT_FILE, project);
}

export async function getProjectVideos(): Promise<ProjectVideo[]> {
  const data = await readCmsJson<ProjectVideosData>(PROJECT_VIDEOS_FILE, { videos: [] });
  return data.videos;
}

export async function saveProjectVideos(videos: ProjectVideo[]) {
  await writeCmsJson(PROJECT_VIDEOS_FILE, { videos });
}

export async function getProjectPhotos(): Promise<ProjectPhoto[]> {
  const data = await readCmsJson<ProjectPhotosData>(PROJECT_PHOTOS_FILE, { photos: [] });
  return data.photos;
}

export async function saveProjectPhotos(photos: ProjectPhoto[]) {
  await writeCmsJson(PROJECT_PHOTOS_FILE, { photos });
}

export async function getProjectPhotoLibrary() {
  const images: { path: string; filename: string; source: string }[] = [];

  for (const dir of PROJECT_PHOTO_LIBRARY_DIRS) {
    const source = dir.includes("/uploads/") ? "uploads" : "library";
    try {
      const files = await readdir(dir);
      for (const file of files.filter((f) => IMAGE_EXTENSIONS.test(f))) {
        const publicPath = source === "uploads"
          ? `/uploads/project-photos/${file}`
          : `/jobspic/${file}`;
        images.push({ path: publicPath, filename: file, source });
      }
    } catch {
      // directory may not exist yet
    }
  }

  const blobImages = await listUploadedImages("uploads/project-photos/");
  images.push(...blobImages);

  const unique = new Map(images.map((item) => [item.path, item]));
  return Array.from(unique.values()).sort((a, b) =>
    a.filename.localeCompare(b.filename, "zh-HK"),
  );
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

export function createNewsSlug(title: string, existingSlugs: string[]) {
  const sanitized = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const base = sanitized || createId("news");
  let slug = base;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function getNewsItems(): Promise<NewsItem[]> {
  const data = await readCmsJson<NewsItemsData>(NEWS_ITEMS_FILE, { items: [] });
  return data.items;
}

export async function getNewsItemBySlug(slug: string) {
  const items = await getNewsItems();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function saveNewsItems(items: NewsItem[]) {
  await writeCmsJson(NEWS_ITEMS_FILE, { items });
}
