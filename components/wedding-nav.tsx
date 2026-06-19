"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { id: "story", label: "Story" },
  { id: "details", label: "Details" },
  { id: "film", label: "Film" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
];

export function WeddingNav() {
  const [activeId, setActiveId] = useState("story");

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e9ddd5]/90 bg-[#fffaf6]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
        <a
          href="#top"
          className="font-display shrink-0 text-xl tracking-[-0.06em] text-[#425647]"
          aria-label="Back to top"
        >
          J <span className="font-editorial text-[#d9a6a8]">&amp;</span> F
        </a>

        {/* Desktop only: all page-section links stay visible without horizontal scrolling. */}
        <div className="hidden items-center gap-5 text-[10px] font-semibold uppercase tracking-[0.18em] lg:flex">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative py-2 transition ${
                  isActive
                    ? "text-[#425647]"
                    : "text-[#a6b29e] hover:text-[#425647]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-px w-full origin-left bg-[#d9a6a8] transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Always visible on mobile: no horizontal menu required to find the Guests' Gallery. */}
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="/guests-gallery"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#7d9882] bg-[#f8fbf6] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#425647] transition hover:border-[#425647] hover:bg-[#eaf1e8] sm:px-3.5"
            aria-label="Open Guests' Gallery"
          >
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
              <circle cx="8.5" cy="9" r="1.3" />
              <path d="m5.5 17 4.6-4.3 3.1 2.7 2.3-2 3.1 3.9" />
            </svg>
            <span className="hidden xs:inline">Guest </span>Photos
          </a>

          <a
            href="#rsvp"
            className="inline-flex rounded-full border border-[#425647] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#425647] transition hover:bg-[#425647] hover:text-[#fffaf6] sm:px-4"
          >
            RSVP
          </a>
        </div>
      </div>
    </nav>
  );
}
