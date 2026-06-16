import Reveal from "@/components/Reveal";

interface PageBannerProps {
  label: string;
  title: string;
  description?: string;
}

export default function PageBanner({ label, title, description }: PageBannerProps) {
  return (
    <section className="section-divider bg-surface pb-16 pt-8">
      <Reveal className="content-shell mx-auto max-w-7xl px-6 py-8 text-center lg:px-8 lg:py-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-dark">
          {label}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-800 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">{description}</p>
        )}
      </Reveal>
    </section>
  );
}
