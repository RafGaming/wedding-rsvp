"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const galleryImages = [
  {
    src: "/images/gallery/01.jpg",
    alt: "A pre-wedding moment together",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/02.jpg",
    alt: "A quiet garden portrait",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/03.jpg",
    alt: "A warm evening pre-wedding portrait",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/04.jpg",
    alt: "A candid pre-wedding moment",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/05_new.jpg",
    alt: "A romantic portrait together",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/06.jpg",
    alt: "A celebration of love",
    width: 1600,
    height: 1067,
  },
  {
    src: "/images/gallery/H1.jpg",
    alt: "A vertical pre-wedding portrait",
    width: 1080,
    height: 1350,
  },
  {
    src: "/images/gallery/H2.jpg",
    alt: "A vertical indoor pre-wedding portrait",
    width: 1080,
    height: 1350,
  },
  {
    src: "/images/gallery/H3.jpg",
    alt: "A vertical garden pre-wedding portrait",
    width: 1080,
    height: 1350,
  },
] as const;

export function WeddingGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function closeLightbox() {
    setSelectedIndex(null);
  }

  function moveLightbox(direction: "previous" | "next") {
    if (selectedIndex === null) return;

    const nextIndex =
      direction === "next"
        ? (selectedIndex + 1) % galleryImages.length
        : (selectedIndex - 1 + galleryImages.length) % galleryImages.length;

    setSelectedIndex(nextIndex);
  }

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") moveLightbox("next");
      if (event.key === "ArrowLeft") moveLightbox("previous");
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <>
      <section
        id="gallery"
        className="scroll-mt-24 border-b border-[#5d493e]/20 bg-[#fffaf6] px-6 py-20 sm:px-10 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-5 md:mb-16 md:grid-cols-[1fr_0.6fr] md:items-end">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.31em] text-[#5d493e]">
                Pre-wedding portraits
              </p>

              <h2 className="mt-5 font-display text-5xl font-medium leading-[0.84] tracking-[-0.065em] text-[#31463a] sm:text-7xl">
                Before the <em className="font-editorial text-[#c99095]">vows.</em>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#5d493e]">
              A few quiet moments from our pre-wedding shoot—kept like pieces
              of a printed editorial.
            </p>
          </div>

          <div className="columns-2 gap-3 sm:gap-4 md:columns-3">
            {galleryImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="group relative mb-3 block w-full break-inside-avoid overflow-hidden border border-[#5d493e]/20 bg-[#fffdf9] p-1 text-left shadow-[0_14px_34px_rgba(49,70,58,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(49,70,58,0.14)] sm:mb-4"
                aria-label={`Open pre-wedding portrait ${index + 1}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
                  priority={index < 3}
                  className="block h-auto w-full saturate-[0.9] contrast-[0.99] sepia-[0.03] transition duration-700 group-hover:scale-[1.025]"
                />

                <span className="pointer-events-none absolute inset-1 bg-gradient-to-br from-white/20 via-transparent to-[#31463a]/15 opacity-0 transition duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full border border-white/75 bg-[#31463a]/80 text-xs text-[#fffaf6] opacity-0 transition duration-300 group-hover:opacity-100">
                  +
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pre-wedding portrait viewer"
          onMouseDown={closeLightbox}
          className="fixed inset-0 z-[200] grid place-items-center bg-[#18251d]/95 p-4 backdrop-blur-md sm:p-7"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="fixed right-4 top-4 z-10 border border-[#fffaf6]/65 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#fffaf6] transition hover:bg-[#fffaf6] hover:text-[#31463a] sm:right-7 sm:top-7"
          >
            Close ×
          </button>

          <div
            onMouseDown={(event) => event.stopPropagation()}
            className="relative w-full max-w-6xl border border-[#fffaf6]/60 bg-[#fffaf6] p-2 shadow-2xl"
          >
            <Image
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].alt}
              width={galleryImages[selectedIndex].width}
              height={galleryImages[selectedIndex].height}
              sizes="94vw"
              priority
              className="mx-auto block max-h-[74vh] w-auto max-w-full object-contain bg-[#e8ddd6]"
            />

            <div className="flex items-center justify-between gap-4 px-2 pt-3 text-[8px] font-bold uppercase tracking-[0.18em] text-[#5d493e]">
              <span>Jeth &amp; France</span>
              <span>
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(galleryImages.length).padStart(2, "0")}
              </span>
            </div>

            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 gap-2 sm:right-6">
              <button
                type="button"
                onClick={() => moveLightbox("previous")}
                aria-label="Previous portrait"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#fffaf6]/75 bg-[#31463a]/80 text-lg text-[#fffaf6] transition hover:bg-[#31463a]"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => moveLightbox("next")}
                aria-label="Next portrait"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#fffaf6]/75 bg-[#31463a]/80 text-lg text-[#fffaf6] transition hover:bg-[#31463a]"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
