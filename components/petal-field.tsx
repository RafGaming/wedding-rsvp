"use client";

import type { CSSProperties } from "react";

type PetalVariant = "hero" | "countdown" | "invitation" | "details" | "rsvp";

type Petal = {
  x: number;
  y: number;
  size: number;
  rotate: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  midX: number;
  midY: number;
  blur?: number;
};

type PetalStyle = CSSProperties & {
  "--petal-size": string;
  "--petal-drift-x": string;
  "--petal-drift-y": string;
  "--petal-mid-x": string;
  "--petal-mid-y": string;
};

const petals: Record<PetalVariant, Petal[]> = {
  hero: [
    { x: 4, y: 12, size: 34, rotate: -24, opacity: 0.30, duration: 13, delay: 1, driftX: 12, driftY: 30, midX: 8, midY: 12 },
    { x: 12, y: 29, size: 22, rotate: 36, opacity: 0.20, duration: 17, delay: 5, driftX: -12, driftY: 24, midX: 7, midY: 10 },
    { x: 24, y: 9, size: 28, rotate: -10, opacity: 0.24, duration: 15, delay: 3, driftX: 18, driftY: 18, midX: -6, midY: 9 },
    { x: 49, y: 15, size: 42, rotate: 18, opacity: 0.28, duration: 19, delay: 8, driftX: -17, driftY: 34, midX: 9, midY: 13 },
    { x: 64, y: 6, size: 20, rotate: -35, opacity: 0.18, duration: 14, delay: 4, driftX: 8, driftY: 22, midX: -5, midY: 11, blur: 0.35 },
    { x: 84, y: 19, size: 32, rotate: 27, opacity: 0.25, duration: 16, delay: 10, driftX: -14, driftY: 28, midX: 6, midY: 8 },
    { x: 92, y: 38, size: 19, rotate: 10, opacity: 0.18, duration: 18, delay: 6, driftX: -10, driftY: 22, midX: 4, midY: 12 },
    { x: 5, y: 59, size: 26, rotate: 48, opacity: 0.22, duration: 15, delay: 2, driftX: 12, driftY: 20, midX: -8, midY: 8 },
    { x: 25, y: 74, size: 39, rotate: -18, opacity: 0.25, duration: 18, delay: 7, driftX: 17, driftY: 30, midX: 5, midY: 12 },
    { x: 47, y: 61, size: 23, rotate: 39, opacity: 0.19, duration: 14, delay: 11, driftX: -13, driftY: 24, midX: 7, midY: 9 },
    { x: 72, y: 76, size: 31, rotate: -29, opacity: 0.26, duration: 17, delay: 9, driftX: 11, driftY: 27, midX: -6, midY: 11 },
    { x: 89, y: 68, size: 24, rotate: 14, opacity: 0.20, duration: 16, delay: 12, driftX: -12, driftY: 20, midX: 5, midY: 8 },
  ],
  countdown: [
    { x: 5, y: 15, size: 31, rotate: -18, opacity: 0.28, duration: 15, delay: 1, driftX: 13, driftY: 24, midX: -6, midY: 10 },
    { x: 14, y: 38, size: 22, rotate: 34, opacity: 0.20, duration: 17, delay: 7, driftX: -8, driftY: 22, midX: 5, midY: 8 },
    { x: 25, y: 8, size: 37, rotate: 13, opacity: 0.24, duration: 18, delay: 4, driftX: 15, driftY: 26, midX: 8, midY: 11 },
    { x: 36, y: 72, size: 20, rotate: -30, opacity: 0.18, duration: 14, delay: 10, driftX: -10, driftY: 18, midX: 5, midY: 8 },
    { x: 48, y: 6, size: 26, rotate: 45, opacity: 0.18, duration: 16, delay: 2, driftX: 11, driftY: 21, midX: -4, midY: 10 },
    { x: 60, y: 78, size: 35, rotate: -22, opacity: 0.22, duration: 19, delay: 6, driftX: -15, driftY: 27, midX: 7, midY: 12 },
    { x: 72, y: 10, size: 21, rotate: 25, opacity: 0.17, duration: 15, delay: 12, driftX: 8, driftY: 19, midX: -6, midY: 8 },
    { x: 88, y: 22, size: 34, rotate: -12, opacity: 0.27, duration: 18, delay: 3, driftX: -12, driftY: 29, midX: 6, midY: 13 },
    { x: 93, y: 56, size: 23, rotate: 48, opacity: 0.19, duration: 16, delay: 9, driftX: -9, driftY: 20, midX: 3, midY: 9 },
    { x: 12, y: 82, size: 29, rotate: 18, opacity: 0.21, duration: 17, delay: 13, driftX: 13, driftY: 20, midX: -5, midY: 9 },
    { x: 81, y: 81, size: 29, rotate: -37, opacity: 0.20, duration: 14, delay: 5, driftX: -11, driftY: 23, midX: 5, midY: 10 },
    { x: 31, y: 50, size: 17, rotate: 20, opacity: 0.16, duration: 13, delay: 8, driftX: 7, driftY: 16, midX: -4, midY: 7, blur: 0.4 },
  ],
  invitation: [
    { x: 4, y: 16, size: 35, rotate: -22, opacity: 0.24, duration: 16, delay: 3, driftX: 11, driftY: 24, midX: -7, midY: 9 },
    { x: 12, y: 48, size: 22, rotate: 38, opacity: 0.18, duration: 13, delay: 8, driftX: -8, driftY: 20, midX: 4, midY: 8 },
    { x: 28, y: 8, size: 27, rotate: 12, opacity: 0.20, duration: 17, delay: 1, driftX: 12, driftY: 24, midX: 5, midY: 10 },
    { x: 43, y: 23, size: 19, rotate: -35, opacity: 0.17, duration: 14, delay: 6, driftX: -9, driftY: 18, midX: 6, midY: 8 },
    { x: 58, y: 71, size: 34, rotate: 23, opacity: 0.22, duration: 18, delay: 11, driftX: 14, driftY: 27, midX: -5, midY: 12 },
    { x: 73, y: 11, size: 24, rotate: -15, opacity: 0.19, duration: 15, delay: 4, driftX: -12, driftY: 22, midX: 5, midY: 9 },
    { x: 87, y: 28, size: 38, rotate: 37, opacity: 0.28, duration: 19, delay: 9, driftX: -13, driftY: 30, midX: 7, midY: 13 },
    { x: 94, y: 55, size: 20, rotate: -28, opacity: 0.17, duration: 13, delay: 2, driftX: -7, driftY: 18, midX: 4, midY: 7 },
    { x: 7, y: 80, size: 29, rotate: 20, opacity: 0.22, duration: 17, delay: 12, driftX: 11, driftY: 21, midX: -5, midY: 10 },
    { x: 25, y: 87, size: 18, rotate: 42, opacity: 0.16, duration: 14, delay: 5, driftX: 8, driftY: 17, midX: -4, midY: 8 },
    { x: 76, y: 84, size: 31, rotate: -20, opacity: 0.23, duration: 16, delay: 10, driftX: -12, driftY: 25, midX: 5, midY: 11 },
    { x: 90, y: 74, size: 26, rotate: 15, opacity: 0.19, duration: 15, delay: 7, driftX: -9, driftY: 21, midX: 4, midY: 9 },
  ],
  details: [
    { x: 4, y: 13, size: 28, rotate: -20, opacity: 0.20, duration: 15, delay: 2, driftX: 11, driftY: 23, midX: -5, midY: 10 },
    { x: 13, y: 36, size: 20, rotate: 34, opacity: 0.16, duration: 17, delay: 8, driftX: -8, driftY: 18, midX: 5, midY: 8 },
    { x: 27, y: 7, size: 35, rotate: 16, opacity: 0.23, duration: 18, delay: 4, driftX: 13, driftY: 26, midX: 7, midY: 11 },
    { x: 40, y: 68, size: 19, rotate: -32, opacity: 0.15, duration: 13, delay: 11, driftX: -8, driftY: 19, midX: 4, midY: 8 },
    { x: 55, y: 20, size: 26, rotate: 29, opacity: 0.18, duration: 16, delay: 5, driftX: 10, driftY: 22, midX: -4, midY: 10 },
    { x: 66, y: 78, size: 32, rotate: -14, opacity: 0.20, duration: 19, delay: 9, driftX: -12, driftY: 28, midX: 5, midY: 12 },
    { x: 78, y: 10, size: 21, rotate: 41, opacity: 0.17, duration: 14, delay: 1, driftX: 8, driftY: 20, midX: -5, midY: 8 },
    { x: 91, y: 32, size: 37, rotate: -25, opacity: 0.24, duration: 17, delay: 12, driftX: -13, driftY: 25, midX: 6, midY: 11 },
    { x: 95, y: 61, size: 18, rotate: 14, opacity: 0.15, duration: 13, delay: 7, driftX: -7, driftY: 17, midX: 3, midY: 8 },
    { x: 8, y: 81, size: 31, rotate: 25, opacity: 0.20, duration: 16, delay: 10, driftX: 12, driftY: 22, midX: -6, midY: 9 },
    { x: 28, y: 89, size: 17, rotate: -37, opacity: 0.14, duration: 14, delay: 3, driftX: 7, driftY: 15, midX: -4, midY: 7 },
    { x: 83, y: 87, size: 28, rotate: 19, opacity: 0.19, duration: 18, delay: 6, driftX: -11, driftY: 24, midX: 5, midY: 10 },
  ],
  rsvp: [
    { x: 4, y: 14, size: 37, rotate: -18, opacity: 0.25, duration: 18, delay: 2, driftX: 13, driftY: 27, midX: -6, midY: 11 },
    { x: 13, y: 42, size: 21, rotate: 36, opacity: 0.18, duration: 14, delay: 9, driftX: -8, driftY: 19, midX: 4, midY: 8 },
    { x: 28, y: 8, size: 27, rotate: 13, opacity: 0.20, duration: 16, delay: 4, driftX: 11, driftY: 22, midX: 6, midY: 10 },
    { x: 39, y: 70, size: 20, rotate: -35, opacity: 0.15, duration: 13, delay: 12, driftX: -9, driftY: 18, midX: 4, midY: 8 },
    { x: 53, y: 18, size: 30, rotate: 25, opacity: 0.21, duration: 17, delay: 6, driftX: 12, driftY: 24, midX: -5, midY: 11 },
    { x: 64, y: 80, size: 35, rotate: -17, opacity: 0.23, duration: 19, delay: 1, driftX: -13, driftY: 28, midX: 6, midY: 12 },
    { x: 76, y: 8, size: 22, rotate: 38, opacity: 0.17, duration: 15, delay: 8, driftX: 8, driftY: 20, midX: -4, midY: 8 },
    { x: 89, y: 25, size: 38, rotate: -23, opacity: 0.27, duration: 18, delay: 5, driftX: -12, driftY: 30, midX: 7, midY: 13 },
    { x: 95, y: 53, size: 19, rotate: 17, opacity: 0.16, duration: 14, delay: 11, driftX: -7, driftY: 18, midX: 3, midY: 8 },
    { x: 8, y: 82, size: 32, rotate: 22, opacity: 0.21, duration: 17, delay: 3, driftX: 12, driftY: 23, midX: -5, midY: 9 },
    { x: 24, y: 89, size: 18, rotate: -39, opacity: 0.14, duration: 13, delay: 7, driftX: 7, driftY: 16, midX: -4, midY: 7 },
    { x: 82, y: 89, size: 29, rotate: 19, opacity: 0.20, duration: 16, delay: 10, driftX: -11, driftY: 24, midX: 5, midY: 10 },
  ],
};

export function PetalField({ variant }: { variant: PetalVariant }) {
  return (
    <div className={`petal-field petal-field--${variant}`} aria-hidden="true">
      {petals[variant].map((petal, index) => {
        const style: PetalStyle = {
          left: `${petal.x}%`,
          top: `${petal.y}%`,
          opacity: petal.opacity,
          rotate: `${petal.rotate}deg`,
          filter: petal.blur ? `blur(${petal.blur}px)` : undefined,
          animationDuration: `${petal.duration}s`,
          animationDelay: `-${petal.delay}s`,
          "--petal-size": `${petal.size}px`,
          "--petal-drift-x": `${petal.driftX}px`,
          "--petal-drift-y": `${petal.driftY}px`,
          "--petal-mid-x": `${petal.midX}px`,
          "--petal-mid-y": `${petal.midY}px`,
        };

        return <span className="petal-field__petal" key={index} style={style} />;
      })}
    </div>
  );
}
