import HeroSlider from "@/components/HeroSlider";
import HomeProjectVideos from "@/components/HomeProjectVideos";
import HeroServiceSections from "@/components/HeroServiceSections";
import Contact from "@/components/Contact";
import { getHeroSlides, getHeroStories } from "@/lib/cms";
import { heroSlides as fallbackSlides, heroServiceSlides as fallbackStories } from "@/lib/content";

export default async function Home() {
  const [cmsSlides, cmsStories] = await Promise.all([getHeroSlides(), getHeroStories()]);

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

  return (
    <>
      <HeroSlider slides={slides} />
      <HomeProjectVideos />
      <HeroServiceSections stories={stories} />
      <Contact />
    </>
  );
}
