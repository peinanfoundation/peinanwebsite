import PageBanner from "@/components/PageBanner";
import News from "@/components/News";

export default function NewsPage() {
  return (
    <>
      <PageBanner
        label="培楠動向"
        title="機構活動"
        description="培楠愛國教育基金最新活動與社區服務動態"
      />
      <News />
    </>
  );
}
