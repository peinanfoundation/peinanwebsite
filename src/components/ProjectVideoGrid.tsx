import type { ProjectVideo } from "@/lib/cms";
import Reveal from "@/components/Reveal";

type ProjectVideoGridProps = {
  videos: ProjectVideo[];
};

export default function ProjectVideoGrid({ videos }: ProjectVideoGridProps) {
  return (
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
  );
}
