"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding";

export function WeddingGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const images = wedding.media.galleryImages;

  function closeLightbox() {
    setSelectedIndex(null);
  }

  function moveLightbox(direction: "previous" | "next") {
    if (selectedIndex === null) return;

    const nextIndex =
      direction === "next"
        ? (selectedIndex + 1) % images.length
        : (selectedIndex - 1 + images.length) % images.length;

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
      <section id="gallery" className="gallery-editorial scroll-mt-24">
        <div className="gallery-editorial-heading">
          <div>
            <p className="eyebrow">Pre-wedding portraits</p>
            <h2 className="section-title">
              Before the <em>vows.</em>
            </h2>
          </div>

          <p>
            A few quiet moments from our pre-wedding shoot—kept like pieces of
            a printed editorial.
          </p>
        </div>

        <div className="gallery-editorial-grid">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`gallery-tile gallery-tile--${index + 1}`}
              aria-label={`Open pre-wedding portrait ${index + 1}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1920}
                height={1080}
                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 42vw"
                className="gallery-tile-image"
              />
              <span className="gallery-tile-wash" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Pre-wedding portrait viewer"
          onMouseDown={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="gallery-lightbox-close"
            aria-label="Close portrait viewer"
          >
            Close ×
          </button>

          <div
            className="gallery-lightbox-panel"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              width={1920}
              height={1080}
              sizes="100vw"
              className="gallery-lightbox-image"
              priority
            />

            <div className="gallery-lightbox-footer">
              <span>Jethro &amp; France</span>
              <span>
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </span>
            </div>

            <div className="gallery-lightbox-controls">
              <button
                type="button"
                onClick={() => moveLightbox("previous")}
                aria-label="Previous portrait"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => moveLightbox("next")}
                aria-label="Next portrait"
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
