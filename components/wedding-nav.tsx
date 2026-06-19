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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
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
    <nav className="sticky top-0 z-50 border-b border-[#e9ddd5]/90 bg-[#fffaf6]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-6 sm:px-10">
        <a
          href="#top"
          className="font-display shrink-0 text-xl tracking-[-0.06em] text-[#425647]"
          aria-label="Back to top"
        >
          J <span className="font-editorial text-[#d9a6a8]">&</span> F
        </a>

        <div className="flex max-w-[65vw] items-center gap-4 overflow-x-auto whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] sm:max-w-none sm:gap-6">
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

        <a
          href="#rsvp"
          className="hidden rounded-full border border-[#425647] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#425647] transition hover:bg-[#425647] hover:text-[#fffaf6] sm:inline-flex"
        >
          RSVP
        </a>
      </div>
    </nav>
  );
}
