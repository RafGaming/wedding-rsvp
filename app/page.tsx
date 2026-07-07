"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import BackgroundMusic from "@/components/background-music";
import Envelope from "@/components/envelop";
import { useMusic } from "@/components/music-context";

export default function Page() {
  const router = useRouter();
  const { playMusic } = useMusic();

  const handleOpen = async () => {
    await playMusic();
    router.push("/invitation");
  };

  return <Envelope onOpen={handleOpen} />;
}