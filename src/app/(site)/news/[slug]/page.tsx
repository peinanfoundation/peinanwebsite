import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { getNewsItemBySlug, getNewsItems } from "@/lib/cms";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const items = await getNewsItems();
  return items.map((item) => ({ slug: item.slug }));
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = await getNewsItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const paragraphs = item.content.split(/\n{2,}/).filter(Boolean);

  return (
    <>
      <PageBanner label="培楠動向" title={item.title} />
      <article className="section-divider bg-surface pb-20">
        <div className="content-shell mx-auto max-w-[780px] px-6 py-8">
          <Reveal>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark hover:text-brand"
            >
              <ArrowLeft size={16} />
              返回培楠動向
            </Link>
          </Reveal>

          <Reveal className="mt-6 flex items-center gap-2 text-sm text-gray-500" delayMs={60}>
            <Calendar size={14} />
            <span>{item.publishedAt}</span>
          </Reveal>

          {item.image && (
            <Reveal className="mt-8" delayMs={90}>
              <div className="relative aspect-[980/650] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 780px) 100vw, 780px"
                  priority
                />
              </div>
            </Reveal>
          )}

          <Reveal
            className="mt-10 space-y-6 text-base leading-relaxed text-gray-700 sm:text-lg"
            delayMs={120}
          >
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Reveal>
        </div>
      </article>
    </>
  );
}
