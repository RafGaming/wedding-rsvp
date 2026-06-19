"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding";

const filmSource = "/video/01-web.mp4";

export function WeddingFilm() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function closeFilm() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const playTimer = window.setTimeout(() => {
      void videoRef.current?.play().catch(() => {
        // Some mobile browsers require a tap on the video before audio begins.
      });
    }, 80);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeFilm();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(playTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <section id="film" className="film-section scroll-mt-24">
        <div className="film-layout">
          <div className="film-copy">
            <p className="eyebrow film-eyebrow">Our film</p>

            <h2>
              A little glimpse
              <br />
              before the <em>forever.</em>
            </h2>

            <p>
              A moving collection of the quiet moments, laughter, and love that
              brought us to this day.
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="film-play-button"
            >
              <span className="film-play-icon" aria-hidden="true">
                ▶
              </span>
              <span>Play our story</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="film-preview"
            aria-label="Play Jethro and France pre-wedding film"
          >
            <Image
              src={wedding.media.heroImage}
              alt={`${wedding.couple.nameOne} and ${wedding.couple.nameTwo} pre-wedding film preview`}
              width={1920}
              height={1080}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="film-preview-image"
            />

            <span className="film-preview-wash" aria-hidden="true" />
            <span className="film-preview-play" aria-hidden="true">
              ▶
            </span>
            <span className="film-preview-caption" aria-hidden="true">
              Watch with sound
            </span>
          </button>
        </div>
      </section>

      {isOpen && (
        <div
          className="film-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Jethro and France pre-wedding film"
          onMouseDown={closeFilm}
        >
          <button
            type="button"
            onClick={closeFilm}
            className="film-modal-close"
            aria-label="Close film player"
          >
            Close ×
          </button>

          <div
            className="film-modal-panel"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <video
              ref={videoRef}
              className="film-modal-video"
              src={filmSource}
              controls
              playsInline
              preload="metadata"
              poster={wedding.media.heroImage}
            >
              Your browser does not support this video.
            </video>

            <div className="film-modal-meta">
              <span>Jethro &amp; France</span>
              <span>Pre-wedding film · 2026</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
