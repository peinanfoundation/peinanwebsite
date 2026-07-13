import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { NewsItem } from "@/lib/cms";
import Reveal from "@/components/Reveal";

type NewsProps = {
  items: NewsItem[];
};

export default function News({ items }: NewsProps) {
  return (
    <section className="section-divider bg-surface pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delayMs={90 + index * 70}>
              <article className="interactive-card group flex h-full flex-col rounded-2xl bg-white/88 p-6 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{item.publishedAt}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-brand-dark">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {item.excerpt}
                </p>
                <Link
                  href={`/news/${item.slug}`}
                  className="interactive-button mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark hover:text-brand"
                >
                  了解更多
                  <ArrowRight size={14} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
