import Image from "next/image";
import Link from "next/link";
import { BookOpen, Flag, HeartHandshake, ArrowRight } from "lucide-react";
import { projects } from "@/lib/content";
import Reveal from "@/components/Reveal";

const iconMap = {
  "book-open": BookOpen,
  flag: Flag,
  "heart-handshake": HeartHandshake,
};

export default function Projects({ preview = false }: { preview?: boolean }) {
  const items = preview ? projects : projects;

  return (
    <section
      id="projects"
      className={`section-divider ${preview ? "py-24" : "pb-24"}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {preview && (
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-dark">
                重點項目
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                三大服務領域
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                我們聚焦三大核心服務，從教育支援到青年培育，再到社區關懷，全方位服務香港社會。
              </p>
            </div>
          </Reveal>
        )}

        <div className={`grid gap-8 lg:grid-cols-3 ${preview ? "mt-16" : ""}`}>
          {items.map((project, index) => {
            const Icon = iconMap[project.icon as keyof typeof iconMap];
            return (
              <Reveal key={project.id} delayMs={80 + index * 70}>
                <article className="interactive-card group overflow-hidden rounded-2xl bg-white/88 shadow-sm ring-1 ring-gray-100">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="media-fade object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-20`}
                    />
                  </div>
                  <div className="p-8">
                    <div className="mb-4 flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${project.gradient} text-white`}
                      >
                        <Icon size={24} />
                      </div>
                      <span className="text-3xl font-bold text-gray-100">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {project.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-gray-600">
                      {project.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {preview && (
          <Reveal delayMs={140}>
            <div className="mt-12 text-center">
              <Link
                href="/projects"
                className="interactive-button inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand"
              >
                查看全部項目
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
