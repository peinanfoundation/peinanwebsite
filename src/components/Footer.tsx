import Link from "next/link";
import { siteConfig } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="section-divider border-t border-accent-light bg-surface py-8">
      <div className="content-shell mx-auto flex max-w-[980px] flex-col items-center gap-3 px-6 py-6 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
        <Link
          href="/privacy"
          className="transition-colors hover:text-brand-dark"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
