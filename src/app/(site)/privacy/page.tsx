import PageBanner from "@/components/PageBanner";
import { privacyContent } from "@/lib/content";

export default function PrivacyPage() {
  return (
    <>
      <PageBanner label="Privacy Policy" title="私隱政策" />

      <section className="section-divider bg-surface py-20">
        <div className="content-shell mx-auto max-w-3xl px-6 py-8 lg:px-8 lg:py-10">
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold text-slate-800">版權聲明</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                {privacyContent.copyright}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">使用細則</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                {privacyContent.usage}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
