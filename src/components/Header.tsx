"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navItems, siteConfig, images } from "@/lib/content";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-accent-light/80 bg-surface/90 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? "shadow-[0_8px_24px_-20px_rgba(40,82,115,0.9)]" : "shadow-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3 lg:px-10">
        <Link href="/" className="flex items-center">
          <Image
            src={images.logo}
            alt={siteConfig.name}
            width={1600}
            height={505}
            className="h-[78px] w-auto sm:h-[93px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-5 py-2.5 text-[18px] font-medium text-slate-700 transition-colors hover:bg-surface-alt hover:text-brand-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/support"
          className="interactive-button hidden rounded-full bg-brand px-6 py-3 text-[18px] font-semibold text-white transition-all hover:bg-brand-dark lg:block"
        >
          支持我們
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2.5 text-slate-700 hover:bg-surface-alt lg:hidden"
          aria-label="開啟選單"
        >
          {isOpen ? <X size={31} /> : <Menu size={31} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-accent-light bg-surface px-8 py-5 lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-5 py-4 text-[18px] font-medium text-slate-700 hover:bg-surface-alt hover:text-brand-dark"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
