import Image from "next/image";
import type { FeaturedProject, ProjectPhoto, ProjectVideo } from "@/lib/cms";
import Reveal from "@/components/Reveal";

type FeaturedProjectArticleProps = {
  project: FeaturedProject;
  videos: ProjectVideo[];
  photos: ProjectPhoto[];
};

export default function FeaturedProjectArticle({
  project,
  videos,
  photos,
}: FeaturedProjectArticleProps) {
  return (
    <article className="section-divider bg-surface pb-16 pt-8">
      <div className="content-shell mx-auto max-w-[980px] px-6 py-8 sm:py-10">
        <Reveal>
          <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {project.title}
          </h1>
        </Reveal>

        {videos.length > 0 && (
          <div className="mt-10">
            <div className="grid gap-8 lg:grid-cols-2">
              {videos.map((video, index) => (
                <Reveal key={video.id} delayMs={120 + index * 80}>
                  <div className="interactive-card no-shine overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-accent-light">
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal
          className="mt-12 space-y-6 text-base leading-relaxed text-gray-700 sm:text-lg"
          delayMs={120}
        >
          <h2 className="text-xl font-bold text-gray-900">背景</h2>
          {project.background.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}

          <h2 className="pt-4 text-xl font-bold text-gray-900">理念及目標</h2>
          <p>{project.goalsIntro}</p>
          <ul className="list-disc space-y-2 pl-6">
            {project.goals.map((goal) => (
              <li key={goal.slice(0, 24)}>{goal}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-10" delayMs={160}>
          <Image
            src={project.image}
            alt={project.title}
            width={980}
            height={650}
            className="media-fade h-auto w-full rounded-2xl object-cover shadow-[0_28px_45px_-35px_rgba(42,82,117,0.55)]"
          />
        </Reveal>

        {photos.length > 0 && (
          <Reveal className="mt-14" delayMs={220}>
            <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
              活動相片
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {photos.map((photo, index) => (
                <Reveal key={photo.id} delayMs={240 + index * 30}>
                  <article className="interactive-card overflow-hidden rounded-2xl ring-1 ring-accent-light/70">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={photo.image}
                        alt={`活動相片 ${index + 1}`}
                        fill
                        className="media-fade object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </article>
  );
}
