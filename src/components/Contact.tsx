import Image from "next/image";
import { siteConfig, images } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="section-divider bg-surface py-16 sm:py-20">
      <div className="content-shell mx-auto max-w-[980px] px-6 py-10 text-center sm:py-12">
        <Reveal>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            聯絡我們
          </h2>
        </Reveal>

        <Reveal delayMs={90}>
          <div className="mt-10 space-y-3 text-base text-gray-700 sm:text-lg">
            <p>
              <a
                href="tel:+85239050377"
                className="transition-colors hover:text-brand-dark"
              >
                {siteConfig.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors hover:text-brand-dark"
              >
                {siteConfig.email}
              </a>
            </p>
            <p>{siteConfig.address.zh}</p>
          </div>
        </Reveal>

        <Reveal delayMs={150}>
          <a
            href={siteConfig.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-button mt-8 inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src={images.facebook}
              alt="Facebook"
              width={28}
              height={28}
              className="pop-hover rounded-full"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
