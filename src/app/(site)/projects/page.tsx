import {
  getFeaturedProject,
  getProjectPhotos,
  getProjectVideos,
} from "@/lib/cms";
import { featuredProject as fallbackProject, projectHeroVideos as fallbackVideos } from "@/lib/content";
import FeaturedProjectArticle from "@/components/FeaturedProjectArticle";

export default async function ProjectsPage() {
  const [cmsProject, cmsVideos, cmsPhotos] = await Promise.all([
    getFeaturedProject(),
    getProjectVideos(),
    getProjectPhotos(),
  ]);

  const project =
    cmsProject.title && cmsProject.background.length > 0
      ? cmsProject
      : {
          title: fallbackProject.title,
          background: [...fallbackProject.background],
          goalsIntro: fallbackProject.goalsIntro,
          goals: [...fallbackProject.goals],
          image: fallbackProject.image,
        };

  const videos =
    cmsVideos.length > 0
      ? cmsVideos
      : fallbackVideos.map((video, index) => ({
          id: `fallback-${index}`,
          youtubeId: video.youtubeId,
          title: video.title,
        }));

  const photos = cmsPhotos;

  return (
    <FeaturedProjectArticle project={project} videos={videos} photos={photos} />
  );
}
