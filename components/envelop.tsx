"use client";

type EnvelopeProps = {
  onOpen: () => void;
};

export default function Envelope({ onOpen }: EnvelopeProps) {
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#7b9274] px-6">
  <div className="flex flex-col items-center text-center">
    {/* Envelope */}
    <button
      onClick={onOpen}
      aria-label="Open Wedding Invitation"
      className="group relative mb-8 h-48 w-72 transition duration-300 hover:scale-105 sm:mb-10 sm:h-56 sm:w-80 md:h-64 md:w-96"
    >
      {/* Envelope Body */}
      <div className="absolute inset-0 rounded-md bg-[#fdf8f2] shadow-2xl" />

      {/* Left Flap */}
      <div className="absolute bottom-0 left-0 h-0 w-0 border-b-[96px] border-l-[144px] border-b-[#efe5d8] border-l-transparent sm:border-b-[112px] sm:border-l-[160px] md:border-b-[128px] md:border-l-[192px]" />

      {/* Right Flap */}
      <div className="absolute bottom-0 right-0 h-0 w-0 border-b-[96px] border-r-[144px] border-b-[#efe5d8] border-r-transparent sm:border-b-[112px] sm:border-r-[160px] md:border-b-[128px] md:border-r-[192px]" />

      {/* Top Flap */}
      <div className="absolute left-0 top-0 h-0 w-0 border-l-[144px] border-r-[144px] border-t-[96px] border-l-transparent border-r-transparent border-t-[#e4d7c8] sm:border-l-[160px] sm:border-r-[160px] sm:border-t-[112px] md:border-l-[192px] md:border-r-[192px] md:border-t-[128px]" />

      {/* Wax Seal */}
      <div className="absolute left-1/2 top-[58%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#d9a6a8] text-lg text-white shadow-lg transition group-hover:scale-110 sm:h-14 sm:w-14 sm:text-xl md:h-16 md:w-16 md:text-2xl">
        ❤
      </div>
    </button>

    <p className="max-w-xs text-base leading-7 text-[#f8f6f2] sm:max-w-sm sm:text-lg sm:leading-8">
      Tap the envelope to open our wedding invitation.
    </p>

    <button
      onClick={onOpen}
      className="mt-8 rounded-full border border-white/60 bg-white/15 px-8 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:bg-white hover:text-[#5f7b5d] sm:mt-10 sm:px-10 sm:py-4 sm:text-sm"
    >
      Open Invitation
    </button>
  </div>
</div>
  );
}