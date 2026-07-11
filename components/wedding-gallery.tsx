"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./wedding-gallery.module.css";

const galleryImages = [
  { src: "/images/gallery/01.jpg", alt: "A close pre-wedding portrait", orientation: "landscape", width: 1600, height: 1067 },
  { src: "/images/gallery/02.jpg", alt: "A garden pre-wedding portrait", orientation: "landscape", width: 1600, height: 1067 },
  { src: "/images/gallery/03.jpg", alt: "An evening pre-wedding moment", orientation: "landscape", width: 1600, height: 1067 },
  { src: "/images/gallery/04.jpg", alt: "A warm indoor pre-wedding portrait", orientation: "landscape", width: 1600, height: 1067 },
  { src: "/images/gallery/05.jpg", alt: "A romantic portrait together", orientation: "landscape", width: 1600, height: 1067 },
  { src: "/images/gallery/06.jpg", alt: "A playful garden moment", orientation: "landscape", width: 1600, height: 1067 },
  { src: "/images/gallery/H1.jpg", alt: "A formal vertical pre-wedding portrait", orientation: "portrait", width: 1080, height: 1350 },
  { src: "/images/gallery/H2.jpg", alt: "A vertical indoor pre-wedding portrait", orientation: "portrait", width: 1080, height: 1350 },
  { src: "/images/gallery/H3.jpg", alt: "A vertical garden pre-wedding portrait", orientation: "portrait", width: 1080, height: 1350 },
] as const;

export function WeddingGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = Array.from(section.querySelectorAll<HTMLElement>("[data-gallery-item]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => current === null ? 0 : (current + 1) % galleryImages.length);
      }
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => current === null ? 0 : (current - 1 + galleryImages.length) % galleryImages.length);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  function move(direction: "previous" | "next") {
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return direction === "next"
        ? (current + 1) % galleryImages.length
        : (current - 1 + galleryImages.length) % galleryImages.length;
    });
  }

  return (
    <>
      <section ref={sectionRef} id="gallery" className={styles.section}>
        <div className={styles.ambientGlow} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />

        <div className={styles.inner}>
          <header className={styles.heading}>
            <div>
              <p className={styles.eyebrow}>Pre-wedding portraits</p>
              <h2>Before the <em>vows.</em></h2>
            </div>

            <p>
              A few quiet moments from our pre-wedding shoot—kept like pieces
              of a printed editorial.
            </p>
          </header>

          <div className={styles.galleryGrid}>
            {galleryImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                data-gallery-item
                data-visible="false"
                data-orientation={image.orientation}
                onClick={() => setSelectedIndex(index)}
                className={styles.card}
                style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}
                aria-label={`Open portrait ${index + 1}`}
              >
                <span className={styles.frame}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                    priority={index < 2}
                    className={styles.image}
                  />

                  <span className={styles.imageWash} aria-hidden="true" />
                  <span className={styles.indexBadge} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.openBadge} aria-hidden="true">View</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Wedding gallery viewer"
          onMouseDown={() => setSelectedIndex(null)}
        >
          <button type="button" onClick={() => setSelectedIndex(null)} className={styles.closeButton}>
            Close ×
          </button>

          <div className={styles.lightboxPanel} onMouseDown={(event) => event.stopPropagation()}>
            <Image
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].alt}
              width={galleryImages[selectedIndex].width}
              height={galleryImages[selectedIndex].height}
              sizes="96vw"
              priority
              className={styles.lightboxImage}
            />

            <div className={styles.lightboxFooter}>
              <span>Jethro &amp; France</span>
              <span>{String(selectedIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}</span>
            </div>

            <button type="button" onClick={() => move("previous")} className={`${styles.navButton} ${styles.navButtonPrevious}`} aria-label="Previous image">←</button>
            <button type="button" onClick={() => move("next")} className={`${styles.navButton} ${styles.navButtonNext}`} aria-label="Next image">→</button>
          </div>
        </div>
      )}
    </>
  );
}
