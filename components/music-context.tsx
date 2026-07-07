"use client";

import {
  createContext,
  useContext,
  useRef,
  ReactNode,
} from "react";
import BackgroundMusic from "./background-music";
  import { useEffect } from "react";

type MusicContextType = {
  playMusic: () => Promise<void>;
  pauseMusic: () => void;
  resumeMusic: () => Promise<void>;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);

//   const playMusic = async () => {
//     try {
//       await audioRef.current?.play();
//     } catch (err) {
//       console.error(err);
//     }
//   };
    const playMusic = async () => {
  console.log("playMusic called");

  if (!audioRef.current) {
    console.log("audioRef is null");
    return;
  }

  console.log(audioRef.current.paused);

  try {
    await audioRef.current.play();

    console.log("SUCCESS");
    console.log(audioRef.current.paused);
  } catch (e) {
    console.error("FAILED", e);
  }
};

const pauseMusic = () => {
  console.log("pauseMusic called");
  audioRef.current?.pause();
};

const resumeMusic = async () => {
  console.log("resumeMusic called");

  try {
    await audioRef.current?.play();
  } catch (err) {
    console.error(err);
  }
};

//   const pauseMusic = () => {
//     audioRef.current?.pause();
//   };

//   const resumeMusic = async () => {
//     try {
//       await audioRef.current?.play();
//     } catch (err) {
//       console.error(err);
//     }
//   };

    useEffect(() => {
    console.log("MusicProvider mounted");

    return () => {
        console.log("MusicProvider unmounted");
    };
    }, []);

  return (
    <MusicContext.Provider
      value={{
        playMusic,
        pauseMusic,
        resumeMusic,
      }}
    >
      <BackgroundMusic ref={audioRef} />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error("useMusic must be used inside MusicProvider");
  }

  return context;
}