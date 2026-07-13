import type { FeaturedProject, ProjectVideo } from "@/lib/cms";
import ProjectVideoGrid from "@/components/ProjectVideoGrid";
import Reveal from "@/components/Reveal";

type HomeProjectVideosProps = {
  title: string;
  videos: ProjectVideo[];
};

export default function HomeProjectVideos({ title, videos }: HomeProjectVideosProps) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="section-divider bg-surface py-12 sm:py-16">
      <div className="content-shell mx-auto max-w-[980px] px-6 py-8 sm:py-10">
        <Reveal>
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            {title}
          </h2>
        </Reveal>

        <div className="mt-8">
          <ProjectVideoGrid videos={videos} />
        </div>
      </div>
    </section>
  );
}
