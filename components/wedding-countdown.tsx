"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const weddingDate = new Date("2026-08-16T00:00:00+08:00").getTime();

function calculateTimeLeft(): TimeLeft {
  const difference = Math.max(weddingDate - Date.now(), 0);

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function formatNumber(value: number | null) {
  if (value === null) return "--";

  return String(value).padStart(2, "0");
}

export function WeddingCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateCountdown();

    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const countdownItems = [
    { label: "Days", value: timeLeft?.days ?? null },
    { label: "Hours", value: timeLeft?.hours ?? null },
    { label: "Minutes", value: timeLeft?.minutes ?? null },
    { label: "Seconds", value: timeLeft?.seconds ?? null },
  ];

  return (
    <section className="scroll-mt-24 border-y border-[#52695a] bg-[#425647] px-6 py-20 text-[#fffaf6] sm:px-10 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d9a6a8]">
            Counting down
          </p>

          <h2 className="font-display mt-5 text-5xl leading-[0.9] sm:text-6xl">
            Until we say
            <br />
            <span className="font-editorial text-[#f3dddd]">“I do.”</span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-8 text-[#edf0ea]/75 sm:text-base">
            We are looking forward to celebrating with the people we love on{" "}
            {wedding.date.display}.
          </p>
        </div>

        <div className="grid grid-cols-2 border-y border-[#78907e]/45 sm:grid-cols-4 sm:divide-x sm:divide-[#78907e]/45">
          {countdownItems.map((item) => (
            <div
              key={item.label}
              className="border-b border-[#78907e]/45 px-5 py-8 text-center last:border-b-0 sm:border-b-0 sm:px-6"
            >
              <p className="font-display text-5xl tracking-[-0.05em] text-[#fffaf6] sm:text-6xl">
                {formatNumber(item.value)}
              </p>

              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#d9a6a8]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}