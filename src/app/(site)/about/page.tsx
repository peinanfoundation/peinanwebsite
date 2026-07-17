import Image from "next/image";
import { Target, Eye, Sparkles } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { getAboutContent } from "@/lib/cms";
import { aboutContent as fallbackAbout, images } from "@/lib/content";

export default async function AboutPage() {
  const cmsAbout = await getAboutContent();

  const about =
    cmsAbout.purpose && cmsAbout.mission && cmsAbout.vision
      ? cmsAbout
      : {
          banner: {
            label: "關於我們",
            title: "培楠愛國教育基金",
            description: "認可慈善機構，致力促進國民教育，弘揚中華優良傳統美德",
          },
          purpose: fallbackAbout.purpose,
          mission: fallbackAbout.mission,
          vision: fallbackAbout.vision,
          values: [...fallbackAbout.values],
          teamImage: images.aboutTeam,
          officeImage: images.aboutOffice,
        };

  return (
    <>
      <PageBanner
        label={about.banner.label}
        title={about.banner.title}
        description={about.banner.description}
      />

      <section className="section-divider bg-surface py-20">
        <div className="content-shell mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl ring-1 ring-accent-light">
              <Image
                src={about.teamImage}
                alt="培楠團隊活動"
                width={800}
                height={600}
                className="media-fade h-auto w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">培楠宗旨</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{about.purpose}</p>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="interactive-card rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
                <Target className="text-brand-dark" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">使命</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{about.mission}</p>
            </div>

            <div className="interactive-card rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <Eye className="text-amber-700" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">願景</h3>
              <p className="mt-3 leading-relaxed text-gray-600">{about.vision}</p>
            </div>
          </div>

          <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="mb-6 flex items-center justify-center gap-2">
                <Sparkles className="text-brand-dark" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">核心價值</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {about.values.map((value) => (
                  <span
                    key={value}
                    className="interactive-button rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
            <div className="order-1 overflow-hidden rounded-2xl ring-1 ring-accent-light lg:order-2">
              <Image
                src={about.officeImage}
                alt="培楠辦公室"
                width={800}
                height={600}
                className="media-fade h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
