"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

const WEDDING_TIME = new Date("2026-08-16T00:00:00+08:00").getTime();
const MOVEMENT_WINDOW_MS = 120 * 24 * 60 * 60 * 1000;

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  meetingProgress: number;
};

function getCountdownValue(now: number): CountdownValue {
  const remaining = Math.max(WEDDING_TIME - now, 0);

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining / (60 * 60 * 1000)) % 24);
  const minutes = Math.floor((remaining / (60 * 1000)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  const rawProgress = Math.min(
    Math.max(1 - remaining / MOVEMENT_WINDOW_MS, 0),
    1,
  );

  // They stop just before touching instead of overlapping.
  const meetingProgress = rawProgress * 0.92;

  return { days, hours, minutes, seconds, meetingProgress };
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export function WeddingCountdown() {
  const [countdown, setCountdown] = useState<CountdownValue>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    meetingProgress: 0,
  });

  useEffect(() => {
    function updateCountdown() {
      setCountdown(getCountdownValue(Date.now()));
    }

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const portraitStyle = {
    "--bride-shift": `${countdown.meetingProgress * 42}%`,
    "--groom-shift": `-${countdown.meetingProgress * 42}%`,
  } as CSSProperties;

  const units = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <section id="countdown" className="countdown-meeting scroll-mt-24">
      <div className="countdown-meeting-inner">
        <p className="countdown-kicker">Counting down</p>

        <h2 className="countdown-title">
          Until we say <em>“I do.”</em>
        </h2>

        <p className="countdown-intro">
          We are looking forward to celebrating with the people we love on
          Sunday, August 16, 2026.
        </p>

        <div className="countdown-line" aria-label="Wedding countdown">
          {units.map((unit) => (
            <div className="countdown-unit" key={unit.label}>
              <span className="countdown-number">{formatNumber(unit.value)}</span>
              <span className="countdown-label">{unit.label}</span>
            </div>
          ))}
        </div>

        <div className="countdown-couple-stage" style={portraitStyle}>
          <div className="countdown-couple countdown-couple--bride">
            <Image
              src="/images/bride.png"
              alt=""
              width={1100}
              height={1400}
              sizes="(max-width: 767px) 32vw, 18vw"
              className="countdown-couple-image"
            />
          </div>

          <div className="countdown-couple countdown-couple--groom">
            <Image
              src="/images/groom.png"
              alt=""
              width={1100}
              height={1400}
              sizes="(max-width: 767px) 32vw, 18vw"
              className="countdown-couple-image"
            />
          </div>

          <span className="countdown-couple-ground" aria-hidden="true" />
        </div>

        <p className="countdown-caption">
          Every moment brings us closer to the beginning of our forever.
        </p>
      </div>
    </section>
  );
}
