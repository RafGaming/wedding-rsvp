"use client";

import { useEffect, useState } from "react";

export function WeddingIntro() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const storageKey = "jethro-france-wedding-intro-seen";

    if (window.sessionStorage.getItem(storageKey) === "true") {
      setVisible(false);
      return;
    }

    const startExit = window.setTimeout(() => {
      setLeaving(true);
      window.sessionStorage.setItem(storageKey, "true");
    }, 1450);

    const finishExit = window.setTimeout(() => {
      setVisible(false);
    }, 2150);

    return () => {
      window.clearTimeout(startExit);
      window.clearTimeout(finishExit);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`wedding-intro ${leaving ? "wedding-intro--leaving" : ""}`}
      aria-hidden="true"
    >
      <div className="wedding-intro-content">
        <p className="wedding-intro-kicker">A garden celebration</p>
        <p className="wedding-intro-monogram">
          J <span>&</span> F
        </p>
        <p className="wedding-intro-date">August 16 · 2026</p>
      </div>
    </div>
  );
}
