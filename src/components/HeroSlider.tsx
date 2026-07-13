"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/cms";

const INTERVAL_MS = 3000;
const TRANSITION_MS = 600;
const HERO_WIDTH = 1897;
const HERO_HEIGHT = 1049;

type HeroSliderProps = {
  slides: HeroSlide[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setActiveIndex((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-black"
      aria-label="首頁幻燈片"
      aria-roledescription="carousel"
    >
      <div
        className="relative w-full"
        style={{ aspectRatio: `${HERO_WIDTH} / ${HERO_HEIGHT}` }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.87, 0, 0.13, 1)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="group relative h-full min-w-full flex-shrink-0"
                aria-hidden={index !== activeIndex}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${slides.length}`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className={`object-cover object-center transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] ${
                    index === activeIndex ? "hero-pop-active" : ""
                  }`}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute top-1/2 left-5 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/90 transition-opacity hover:opacity-70 sm:left-8"
              aria-label="上一張"
            >
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute top-1/2 right-5 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/90 transition-opacity hover:opacity-70 sm:right-8"
              aria-label="下一張"
            >
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>

            <nav
              aria-label="投影片導覽"
              className="absolute bottom-8 left-1/2 z-10 max-w-[90%] -translate-x-1/2"
            >
              <ol className="flex flex-wrap items-center justify-center gap-2">
                {slides.map((slide, index) => (
                  <li key={slide.id}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      className={`rounded-full bg-white transition-all duration-300 ${
                        index === activeIndex
                          ? "h-[11px] w-[11px] opacity-100"
                          : "h-[7px] w-[7px] opacity-50 hover:opacity-75"
                      }`}
                      aria-label={`前往第 ${index + 1} 張`}
                      aria-current={index === activeIndex ? "true" : undefined}
                    />
                  </li>
                ))}
              </ol>
            </nav>
          </>
        )}
      </div>
    </section>
  );
}
