"use client";

type EnvelopeProps = {
  onOpen: () => void;
};

export default function Envelope({ onOpen }: EnvelopeProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f3ef]">
      <div className="text-center">
        <div className="mb-8 text-7xl">
          ✉️
        </div>

        <h1 className="mb-3 font-serif text-4xl text-[#5d493e]">
          You're Invited
        </h1>

        <p className="mb-10 text-[#6b665f]">
          Tap the envelope to open our wedding invitation.
        </p>

        <button
          onClick={onOpen}
          className="rounded-full bg-[#7b9274] px-8 py-4 text-white transition hover:scale-105 hover:bg-[#698161]"
        >
          Open Invitation
        </button>
      </div>
    </div>
  );
}