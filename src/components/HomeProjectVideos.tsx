import { featuredProject } from "@/lib/content";
import ProjectVideoGrid from "@/components/ProjectVideoGrid";
import Reveal from "@/components/Reveal";

export default function HomeProjectVideos() {
  return (
    <section className="section-divider bg-surface py-12 sm:py-16">
      <div className="content-shell mx-auto max-w-[980px] px-6 py-8 sm:py-10">
        <Reveal>
          <h2 className="text-center text-xl font-bold text-gray-900 sm:text-2xl">
            {featuredProject.title}
          </h2>
        </Reveal>

        <div className="mt-8">
          <ProjectVideoGrid />
        </div>
      </div>
    </section>
  );
}
