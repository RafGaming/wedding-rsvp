"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { wedding } from "@/lib/wedding";

type AttendanceChoice = "accepted" | "declined" | "";

type SubmissionState =
  | { type: "idle"; message: "" }
  | { type: "error"; message: string };

export default function RSVPPage() {
  const [attendanceChoice, setAttendanceChoice] =
    useState<AttendanceChoice>("");
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [state, setState] = useState<SubmissionState>({
    type: "idle",
    message: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submittedAttendance, setSubmittedAttendance] =
    useState<AttendanceChoice>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ type: "idle", message: "" });

    if (!attendanceChoice) {
      setState({
        type: "error",
        message: "Please let us know whether you will be joining us.",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSaving(true);

    try {
      const response = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          attendanceStatus: attendanceChoice,
          attendeeCount:
            attendanceChoice === "accepted" ? attendeeCount : 0,
          contactNumber: formData.get("contactNumber"),
          dietaryRestrictions: formData.get("dietaryRestrictions"),
          guestMessage: formData.get("guestMessage"),
          suggestedInvitees: formData.get("suggestedInvitees"),
          website: formData.get("website"),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok) {
        setState({
          type: "error",
          message: data?.error ?? "We could not save your RSVP. Please try again.",
        });
        return;
      }

      setSubmittedAttendance(attendanceChoice);
      setIsComplete(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setState({
        type: "error",
        message:
          "We could not save your RSVP right now. Please check your connection and try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isComplete) {
    const isAttending = submittedAttendance === "accepted";

    return (
      <main className="relative min-h-screen overflow-hidden bg-[#fffaf6] px-6 py-8 text-[#4f6252] sm:px-10 sm:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full border border-[#e9ddd5]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#f3dddd]/60 blur-3xl"
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
          <header className="flex items-center justify-between border-b border-[#e9ddd5] pb-5">
            <Link
              href="/"
              className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#735f52] transition hover:text-[#d9a6a8]"
            >
              ← Back to Invitation
            </Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a6b29e]">
              RSVP received
            </p>
          </header>

          <section className="flex flex-1 items-center justify-center py-16 text-center">
            <div className="max-w-xl">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#d9a6a8] bg-[#fffdf9] text-2xl text-[#d9a6a8]">
                ♥
              </div>

              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#735f52]">
                Thank you
              </p>

              <h1 className="font-display mt-5 text-6xl leading-[0.9] text-[#4f6252] sm:text-7xl">
                {isAttending ? "We can’t wait to celebrate." : "Your wishes mean so much."}
              </h1>

              <div className="mx-auto my-9 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-[#a6b29e]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#d9a6a8]" />
                <span className="h-px w-10 bg-[#a6b29e]" />
              </div>

              <p className="mx-auto max-w-md text-sm leading-7 text-[#735f52] sm:text-base">
                {isAttending
                  ? "Your RSVP has been received. We are so happy you will be part of this special day."
                  : "Your RSVP has been received. You will be missed, and we are grateful for your love and support."}
              </p>

              <p className="mt-7 font-display text-3xl text-[#4f6252]">
                {wedding.couple.nameOne} <span className="font-editorial text-[#d9a6a8]">&amp;</span>{" "}
                {wedding.couple.nameTwo}
              </p>

              <Link
                href="/"
                className="mt-10 inline-flex rounded-full border border-[#4f6252] px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#4f6252] transition hover:bg-[#4f6252] hover:text-[#fffaf6]"
              >
                Return to invitation
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffaf6] px-6 py-8 text-[#4f6252] sm:px-10 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-28 h-80 w-80 rounded-full border border-[#e9ddd5]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#f3dddd]/50 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <header className="flex items-center justify-between border-b border-[#e9ddd5] pb-5">
          <Link
            href="/"
            className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#735f52] transition hover:text-[#d9a6a8]"
          >
            ← Back to Invitation
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a6b29e]">
            RSVP
          </p>
        </header>

        <section className="flex flex-1 justify-center py-14 sm:py-16">
          <div className="w-full max-w-2xl">
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#735f52]">
                You are invited
              </p>

              <h1 className="font-display mt-6 text-6xl leading-[0.9] text-[#4f6252] sm:text-7xl">
                Reserve your
                <br />
                place with us.
              </h1>

              <div className="mx-auto my-10 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-[#a6b29e]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#d9a6a8]" />
                <span className="h-px w-10 bg-[#a6b29e]" />
              </div>

              <p className="mx-auto max-w-md text-sm leading-7 text-[#735f52] sm:text-base">
                We’re so excited to celebrate with you. Kindly complete the
                form below to let us know if you can join us.
              </p>

              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#a6b29e]">
                Kindly reply on or before {wedding.rsvp.deadline}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-12 border border-[#dfd3c9] bg-white/65 p-5 shadow-[18px_20px_0_rgba(243,221,221,0.42)] sm:p-9"
            >
              {/* Honeypot: hidden from real guests, catches simple automated spam. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-[#e9ddd5] pb-5">
                <div>
                  <p className="font-display text-3xl leading-none text-[#4f6252]">
                    Your response
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#8d7a6e]">
                    Fields marked with * are required.
                  </p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-[#d9a6a8] text-sm text-[#d9a6a8]">
                  ✦
                </span>
              </div>

              <div className="mt-8 grid gap-7">
                <label className="grid gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]">
                    Full Name *
                  </span>
                  <input
                    name="fullName"
                    required
                    maxLength={120}
                    autoComplete="name"
                    placeholder="Juan Dela Cruz"
                    className="w-full border-b border-[#d9ccc2] bg-transparent px-1 py-3 text-sm text-[#4f6252] outline-none transition placeholder:text-[#b5a49a] focus:border-[#a6b29e]"
                  />
                </label>

                <fieldset>
                  <legend className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]">
                    Will you be joining us? *
                  </legend>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label
                      className={`cursor-pointer border p-4 transition ${
                        attendanceChoice === "accepted"
                          ? "border-[#4f6252] bg-[#eef4ec]"
                          : "border-[#dfd3c9] bg-white/50 hover:border-[#a6b29e]"
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="attendance"
                        value="accepted"
                        checked={attendanceChoice === "accepted"}
                        onChange={() => {
                          setAttendanceChoice("accepted");
                          setState({ type: "idle", message: "" });
                        }}
                      />
                      <span className="block text-sm font-semibold text-[#4f6252]">
                        Happily Accepts
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#8d7a6e]">
                        I’ll be there to celebrate.
                      </span>
                    </label>

                    <label
                      className={`cursor-pointer border p-4 transition ${
                        attendanceChoice === "declined"
                          ? "border-[#4f6252] bg-[#f8eeee]"
                          : "border-[#dfd3c9] bg-white/50 hover:border-[#a6b29e]"
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="attendance"
                        value="declined"
                        checked={attendanceChoice === "declined"}
                        onChange={() => {
                          setAttendanceChoice("declined");
                          setState({ type: "idle", message: "" });
                        }}
                      />
                      <span className="block text-sm font-semibold text-[#4f6252]">
                        Regretfully Declines
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#8d7a6e]">
                        I’m unable to attend.
                      </span>
                    </label>
                  </div>
                </fieldset>

                {attendanceChoice === "accepted" && (
                  <label className="grid gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]">
                      Number of Attendees *
                    </span>
                    <select
                      value={attendeeCount}
                      onChange={(event) => setAttendeeCount(Number(event.target.value))}
                      className="w-full border-b border-[#d9ccc2] bg-transparent px-1 py-3 text-sm text-[#4f6252] outline-none transition focus:border-[#a6b29e]"
                    >
                      {Array.from({ length: 20 }, (_, index) => index + 1).map(
                        (count) => (
                          <option key={count} value={count}>
                            {count} {count === 1 ? "guest" : "guests"}
                          </option>
                        )
                      )}
                    </select>
                    <span className="text-xs leading-5 text-[#9b897e]">
                      Please include yourself in this total.
                    </span>
                  </label>
                )}

                <label className="grid gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]">
                    Contact Number *
                  </span>
                  <input
                    name="contactNumber"
                    required
                    maxLength={40}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="09XXXXXXXXX"
                    className="w-full border-b border-[#d9ccc2] bg-transparent px-1 py-3 text-sm text-[#4f6252] outline-none transition placeholder:text-[#b5a49a] focus:border-[#a6b29e]"
                  />
                </label>

                {attendanceChoice === "accepted" && (
                  <label className="grid gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]">
                      Dietary Restrictions <em className="normal-case tracking-normal text-[#a6b29e]">optional</em>
                    </span>
                    <textarea
                      name="dietaryRestrictions"
                      maxLength={1000}
                      rows={3}
                      placeholder="Vegetarian, seafood allergy, nut allergy..."
                      className="w-full resize-y border border-[#dfd3c9] bg-white/55 p-3 text-sm text-[#4f6252] outline-none transition placeholder:text-[#b5a49a] focus:border-[#a6b29e]"
                    />
                  </label>
                )}

                <label className="grid gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]">
                    Message to the Couple <em className="normal-case tracking-normal text-[#a6b29e]">optional</em>
                  </span>
                  <textarea
                    name="guestMessage"
                    maxLength={1000}
                    rows={4}
                    placeholder="Leave us a sweet message or wedding wish..."
                    className="w-full resize-y border border-[#dfd3c9] bg-white/55 p-3 text-sm text-[#4f6252] outline-none transition placeholder:text-[#b5a49a] focus:border-[#a6b29e]"
                  />
                </label>

                <section className="border border-[#dfd3c9] bg-[#fffaf6]/70 p-4 sm:p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]">
                    A small favor
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[#735f52]">
                     <strong>This invitation is intended for you only (one invitation per person), </strong>as we have a limited number of guests.
                    If there&apos;s anyone else you&apos;d like to suggest whom we both know, please let us know. You may also check our Facebook profile using the link below if you&apos;d like to recommend someone.
                    Please understand that, due to our limited guest capacity, we&apos;re unable to guarantee that we&apos;ll be able to extend an invitation to everyone who is suggested. We truly appreciate your understanding.
                  </p>

                  <a
                    href="https://www.facebook.com/share/1DxtP24m9L/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 border-b border-[#4f6252] pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4f6252] transition hover:border-[#d9a6a8] hover:text-[#d9a6a8]"
                  >
                    Groom's Facebook
                    <span aria-hidden="true">↗</span>
                  </a>
                  <a
                    href="https://www.facebook.com/share/18fFNcHr7b/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 border-b border-[#4f6252] pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4f6252] transition hover:border-[#d9a6a8] hover:text-[#d9a6a8]"
                  >
                    Bride's Facebook
                    <span aria-hidden="true">↗</span>
                  </a>
                </section>
              </div>

              {state.type === "error" && (
                <p
                  role="alert"
                  className="mt-6 border-l-2 border-[#b6686d] bg-[#fbeeee] px-4 py-3 text-sm leading-6 text-[#9a5c5f]"
                >
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="mt-9 w-full rounded-full bg-[#4f6252] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fffaf6] transition hover:bg-[#735f52] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving RSVP..." : "Confirm Attendance"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
