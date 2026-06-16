import Image from "next/image";
import { featuredProject } from "@/lib/content";
import ProjectVideoGrid from "@/components/ProjectVideoGrid";
import Reveal from "@/components/Reveal";

export default function FeaturedProjectArticle() {
  return (
    <article className="section-divider bg-surface pb-16 pt-8">
      <div className="content-shell mx-auto max-w-[980px] px-6 py-8 sm:py-10">
        <Reveal>
          <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {featuredProject.title}
          </h1>
        </Reveal>

        <div className="mt-10">
          <ProjectVideoGrid />
        </div>

        <Reveal
          className="mt-12 space-y-6 text-base leading-relaxed text-gray-700 sm:text-lg"
          delayMs={120}
        >
          <h2 className="text-xl font-bold text-gray-900">背景</h2>
          {featuredProject.background.map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}

          <h2 className="pt-4 text-xl font-bold text-gray-900">理念及目標</h2>
          <p>{featuredProject.goalsIntro}</p>
          <ul className="list-disc space-y-2 pl-6">
            {featuredProject.goals.map((goal) => (
              <li key={goal.slice(0, 20)}>{goal}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-10" delayMs={160}>
          <Image
            src={featuredProject.image}
            alt={featuredProject.title}
            width={980}
            height={650}
            className="media-fade h-auto w-full rounded-2xl object-cover shadow-[0_28px_45px_-35px_rgba(42,82,117,0.55)]"
          />
        </Reveal>
      </div>
    </article>
  );
}
