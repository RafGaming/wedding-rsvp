"use client";

import { useState } from "react";
import { wedding } from "@/lib/wedding";

const faqItems = [
  {
    question: "How do I RSVP?",
    answer:
      "Select RSVP, complete the form, and submit your response.",
  },
  {
    question: "What is the dress code?",
    answer: wedding.dressCode.description,
  },
  {
    question: "When should guests arrive?",
    answer:
      "Guest arrival, ceremony, and reception times will be announced soon. Please revisit this website closer to the wedding date for the final schedule.",
  },
  {
    question: "May I bring an additional guest?",
    answer:
      "Please follow the number of seats shown after entering your invitation code. This helps us prepare a comfortable and properly seated celebration for everyone.",
  },
  {
    question: "Where will the wedding take place?",
    answer: `${wedding.venue.name}, ${wedding.venue.address}`,
  },
];

export function WeddingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-y border-[#e9ddd5] bg-[#f3dddd]/30 px-6 py-28 sm:px-10 sm:py-36"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#705a4d]">
            Helpful Details
          </p>

          <h2 className="font-display mt-5 text-5xl leading-[0.92] text-[#425647] sm:text-6xl">
            A few things
            <br />
            to <span className="font-editorial text-[#d9a6a8]">know.</span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-8 text-[#705a4d] sm:text-base">
            Everything you need before joining us for this special day.
          </p>
        </div>

        <div className="border-t border-[#ddcec5]">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className="border-b border-[#ddcec5]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-2xl leading-tight text-[#425647] sm:text-3xl">
                    {item.question}
                  </span>

                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#a6b29e] text-lg text-[#425647] transition ${
                      isOpen ? "rotate-45 bg-[#425647] text-[#fffaf6]" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] pb-6 opacity-100"
                      : "grid-rows-[0fr] pb-0 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl text-sm leading-8 text-[#705a4d] sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}