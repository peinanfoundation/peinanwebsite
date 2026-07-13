import HeroSlider from "@/components/HeroSlider";
import HomeProjectVideos from "@/components/HomeProjectVideos";
import HeroServiceSections from "@/components/HeroServiceSections";
import Contact from "@/components/Contact";
import { getFeaturedProject, getHeroSlides, getHeroStories, getProjectVideos } from "@/lib/cms";
import {
  featuredProject as fallbackProject,
  heroSlides as fallbackSlides,
  heroServiceSlides as fallbackStories,
  projectHeroVideos as fallbackVideos,
} from "@/lib/content";

export default async function Home() {
  const [cmsSlides, cmsStories, cmsProject, cmsVideos] = await Promise.all([
    getHeroSlides(),
    getHeroStories(),
    getFeaturedProject(),
    getProjectVideos(),
  ]);

  const slides =
    cmsSlides.length > 0
      ? cmsSlides
      : fallbackSlides.map((slide, index) => ({
          id: `fallback-${index}`,
          image: slide.image,
          alt: slide.alt,
        }));

  const stories =
    cmsStories.length > 0
      ? cmsStories
      : fallbackStories.map((story, index) => ({
          id: `fallback-${index}`,
          title: story.title,
          description: story.description,
          mediaType: "image" as const,
          image: story.image,
          youtubeId: null,
        }));

  const projectTitle = cmsProject.title || fallbackProject.title;
  const videos =
    cmsVideos.length > 0
      ? cmsVideos
      : fallbackVideos.map((video, index) => ({
          id: `fallback-${index}`,
          youtubeId: video.youtubeId,
          title: video.title,
        }));

  return (
    <>
      <HeroSlider slides={slides} />
      <HomeProjectVideos title={projectTitle} videos={videos} />
      <HeroServiceSections stories={stories} />
      <Contact />
    </>
  );
}
