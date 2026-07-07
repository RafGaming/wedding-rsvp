"use client";

import { forwardRef } from "react";

const BackgroundMusic = forwardRef<HTMLAudioElement>((_, ref) => {
  return (
    <audio ref={ref} loop preload="auto">
      <source src="/music/youre-still-the-one.mp3" type="audio/mpeg" />
    </audio>
  );
});

BackgroundMusic.displayName = "BackgroundMusic";

export default BackgroundMusic; 