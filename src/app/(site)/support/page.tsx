import Image from "next/image";
import Link from "next/link";
import { Coins, HandHeart, Mail } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { siteConfig, supportContent, images } from "@/lib/content";

export default function SupportPage() {
  return (
    <>
      <PageBanner
        label="支持我們"
        title="與我們一起，創造更多可能"
        description={supportContent.intro}
      />

      <section className="section-divider bg-surface py-20">
        <div className="content-shell mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="interactive-card rounded-2xl border border-accent-light bg-surface-alt p-8">
              <div className="mb-6 overflow-hidden rounded-xl">
                <Image
                  src={images.supportDonate}
                  alt="捐款支持"
                  width={600}
                  height={400}
                  className="media-fade h-auto w-full object-cover"
                />
              </div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
                  <Coins className="text-brand-dark" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">捐款支持</h2>
                  <p className="text-sm text-slate-500">Make a Donation</p>
                </div>
              </div>
              <p className="text-slate-600">{supportContent.intro}</p>
              <div className="mt-6 rounded-xl bg-white p-6 ring-1 ring-accent-light">
                <h3 className="font-semibold text-slate-800">線下捐款</h3>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">
                      {siteConfig.bankName}：
                    </span>
                    {siteConfig.bankAccount}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">
                      戶口名稱：
                    </span>
                    {siteConfig.accountName}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">商業及機構贊助歡迎聯絡我們</p>
            </div>

            <div className="interactive-card rounded-2xl border border-accent-light bg-surface-alt p-8">
              <div className="mb-6 overflow-hidden rounded-xl">
                <Image
                  src={images.supportVolunteer}
                  alt="成為義工"
                  width={600}
                  height={400}
                  className="media-fade h-auto w-full object-cover"
                />
              </div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-light">
                  <HandHeart className="text-brand-dark" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">成為義工</h2>
                  <p className="text-sm text-slate-500">Volunteer Your Time</p>
                </div>
              </div>
              <p className="text-slate-600">{supportContent.volunteerIntro}</p>
              <h3 className="mt-6 font-semibold text-slate-800">義工類別</h3>
              <ul className="mt-4 space-y-3">
                {supportContent.volunteerRoles.map((role) => (
                  <li
                    key={role.title}
                    className="interactive-card rounded-lg bg-white p-4 ring-1 ring-accent-light"
                  >
                    <p className="font-medium text-slate-800">{role.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {role.description}
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href={`mailto:${siteConfig.email}?subject=義工申請`}
                className="interactive-button mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                <Mail size={16} />
                義工申請表
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
