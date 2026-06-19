"use client";

import { useEffect } from "react";

export function PremiumEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".premium-page > section, .premium-page > footer",
      ),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    sections.forEach((section, index) => {
      section.classList.add("premium-reveal");
      section.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 55, 220)}ms`,
      );
      observer.observe(section);
    });

    let animationFrame = 0;

    function handlePointerMove(event: PointerEvent) {
      if (prefersReducedMotion) return;

      const hasFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;

      if (!hasFinePointer) return;

      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--pointer-x",
          `${(event.clientX / window.innerWidth) * 100}%`,
        );

        document.documentElement.style.setProperty(
          "--pointer-y",
          `${(event.clientY / window.innerHeight) * 100}%`,
        );
      });
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="premium-vfx" aria-hidden="true">
      <span className="premium-vfx-orb premium-vfx-orb--rose" />
      <span className="premium-vfx-orb premium-vfx-orb--sage" />
      <span className="premium-vfx-orb premium-vfx-orb--ivory" />
      <span className="premium-vfx-grain" />
    </div>
  );
}