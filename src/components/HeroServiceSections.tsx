import Image from "next/image";
import type { HeroStory } from "@/lib/cms";
import Reveal from "@/components/Reveal";

type HeroServiceSectionsProps = {
  stories: HeroStory[];
};

export default function HeroServiceSections({ stories }: HeroServiceSectionsProps) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface">
      {stories.map((story, index) => (
        <section key={story.id} className="section-divider py-10 sm:py-14">
          <div className="content-shell mx-auto grid max-w-[980px] items-center gap-8 px-6 py-7 lg:grid-cols-2 lg:gap-10 lg:py-9">
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <Reveal delayMs={60}>
                <div className="home-image-pop group relative overflow-hidden rounded-2xl shadow-[0_28px_45px_-35px_rgba(42,82,117,0.55)]">
                  {story.mediaType === "youtube" && story.youtubeId ? (
                    <div className="relative aspect-[980/650] w-full bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${story.youtubeId}`}
                        title={story.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  ) : story.image ? (
                    <>
                      <Image
                        src={story.image}
                        alt={story.title}
                        width={980}
                        height={650}
                        className="media-fade h-auto w-full object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/12 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                    </>
                  ) : null}
                </div>
              </Reveal>
            </div>
            <div className={index % 2 === 1 ? "lg:order-1" : ""}>
              <Reveal delayMs={120}>
                <h2
                  className="font-bold text-gray-900"
                  style={{ fontSize: "clamp(24px, 4vw, 36px)", lineHeight: 1.2 }}
                >
                  {story.title}
                </h2>
                <p
                  className="mt-4 text-gray-700"
                  style={{ fontSize: "clamp(15px, 2vw, 18px)", lineHeight: 1.8 }}
                >
                  {story.description}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
