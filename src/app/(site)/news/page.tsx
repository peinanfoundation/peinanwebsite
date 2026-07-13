import PageBanner from "@/components/PageBanner";
import News from "@/components/News";
import { getNewsItems } from "@/lib/cms";
import { newsItems as fallbackNews } from "@/lib/content";

export default async function NewsPage() {
  const cmsItems = await getNewsItems();

  const items =
    cmsItems.length > 0
      ? [...cmsItems].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      : fallbackNews.map((item) => ({
          id: `fallback-${item.id}`,
          slug: `news-${String(item.id).padStart(2, "0")}`,
          title: item.title,
          excerpt: item.excerpt,
          content: item.excerpt,
          image: null,
          publishedAt: "2025-01-01",
        }));

  return (
    <>
      <PageBanner
        label="培楠動向"
        title="機構活動"
        description="培楠愛國教育基金最新活動與社區服務動態"
      />
      <News items={items} />
    </>
  );
}
