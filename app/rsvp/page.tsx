"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { wedding } from "@/lib/wedding";

type Guest = {
  id: string;
  name: string;
  maxAttendees: number;
  attendanceStatus: "pending" | "accepted" | "declined";
  attendeeCount: number | null;
  submittedAt: string | null;
};

type Attendee = {
  name: string;
  meal: string;
};

type AttendanceChoice = "accepted" | "declined" | null;

export default function RSVPPage() {
  const [invitationCode, setInvitationCode] = useState("");
  const [guest, setGuest] = useState<Guest | null>(null);

  const [attendanceChoice, setAttendanceChoice] =
    useState<AttendanceChoice>(null);

  const [attendeeCount, setAttendeeCount] = useState(1);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  const [dietaryNotes, setDietaryNotes] = useState("");
  const [songRequest, setSongRequest] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  const [message, setMessage] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  function createAttendees(count: number, primaryName = "") {
    return Array.from({ length: count }, (_, index) => ({
      name: index === 0 ? primaryName : "",
      meal: "No preference",
    }));
  }

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanCode = invitationCode.trim().toUpperCase();

    if (!cleanCode) {
      setMessage("Please enter your invitation code to continue.");
      return;
    }

    setIsLookingUp(true);
    setMessage("");
    setGuest(null);
    setAttendanceChoice(null);
    setIsComplete(false);

    try {
      const response = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationCode: cleanCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "We could not find that invitation.");
        return;
      }

      const foundGuest = data.guest as Guest;

      setGuest(foundGuest);
      setAttendeeCount(1);
      setAttendees(createAttendees(1, foundGuest.name));
      setDietaryNotes("");
      setSongRequest("");
      setGuestMessage("");
    } catch {
      setMessage(
        "The RSVP system could not be reached. Please try again in a moment."
      );
    } finally {
      setIsLookingUp(false);
    }
  }

  function changeAttendeeCount(nextCount: number) {
    setAttendeeCount(nextCount);

    setAttendees((currentAttendees) =>
      Array.from({ length: nextCount }, (_, index) => ({
        name:
          currentAttendees[index]?.name ??
          (index === 0 ? guest?.name ?? "" : ""),
        meal: currentAttendees[index]?.meal ?? "No preference",
      }))
    );
  }

  function updateAttendee(
    index: number,
    field: "name" | "meal",
    value: string
  ) {
    setAttendees((currentAttendees) =>
      currentAttendees.map((attendee, attendeeIndex) =>
        attendeeIndex === index
          ? { ...attendee, [field]: value }
          : attendee
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!guest) return;

    if (!attendanceChoice) {
      setMessage("Please choose whether you will attend.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationCode: invitationCode.trim().toUpperCase(),
          attendanceStatus: attendanceChoice,
          attendeeCount:
            attendanceChoice === "accepted" ? attendeeCount : 0,
          attendeeDetails:
            attendanceChoice === "accepted" ? attendees : [],
          dietaryNotes:
            attendanceChoice === "accepted" ? dietaryNotes : "",
          songRequest: attendanceChoice === "accepted" ? songRequest : "",
          guestMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "We could not save your RSVP.");
        return;
      }

      setIsComplete(true);
    } catch {
      setMessage(
        "We could not save your RSVP right now. Please check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function resetLookup() {
    setInvitationCode("");
    setGuest(null);
    setAttendanceChoice(null);
    setAttendeeCount(1);
    setAttendees([]);
    setDietaryNotes("");
    setSongRequest("");
    setGuestMessage("");
    setMessage("");
    setIsComplete(false);
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

        <section className="flex flex-1 items-center justify-center py-16">
          <div className="w-full max-w-2xl">
            {!guest && !isComplete && (
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
                  Please enter the invitation code shared with you to confirm
                  your place at the wedding of {wedding.couple.nameOne} and{" "}
                  {wedding.couple.nameTwo}.
                </p>

                <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#a6b29e]">
                  Kindly reply on or before {wedding.rsvp.deadline}
                </p>

                <form
                  onSubmit={handleLookup}
                  className="mx-auto mt-10 max-w-md text-left"
                >
                  <label
                    htmlFor="invitation-code"
                    className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.23em] text-[#735f52]"
                  >
                    Invitation Code
                  </label>

                  <input
                    id="invitation-code"
                    type="text"
                    value={invitationCode}
                    onChange={(event) => {
                      setInvitationCode(event.target.value.toUpperCase());
                      setMessage("");
                    }}
                    placeholder="Example: TEST2026"
                    autoComplete="off"
                    maxLength={40}
                    className="w-full border border-[#d9ccc2] bg-white/70 px-5 py-4 text-center text-sm font-semibold tracking-[0.12em] text-[#4f6252] outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[#ad9b90] focus:border-[#a6b29e] focus:ring-1 focus:ring-[#a6b29e]"
                  />

                  <button
                    type="submit"
                    disabled={isLookingUp}
                    className="mt-5 w-full rounded-full bg-[#4f6252] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fffaf6] transition hover:bg-[#735f52] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLookingUp ? "Checking Invitation..." : "Continue"}
                  </button>

                  {message && (
                    <p
                      role="status"
                      className="mt-5 text-center text-sm leading-6 text-[#9a5c5f]"
                    >
                      {message}
                    </p>
                  )}
                </form>
              </div>
            )}

            {guest && !isComplete && guest.attendanceStatus !== "pending" && (
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#735f52]">
                  RSVP received
                </p>

                <h1 className="font-display mt-6 text-6xl leading-[0.9] text-[#4f6252] sm:text-7xl">
                  Thank you,
                  <br />
                  {guest.name}.
                </h1>

                <div className="mx-auto my-10 flex items-center justify-center gap-4">
                  <span className="h-px w-10 bg-[#a6b29e]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9a6a8]" />
                  <span className="h-px w-10 bg-[#a6b29e]" />
                </div>

                <p className="mx-auto max-w-md text-sm leading-7 text-[#735f52]">
                  {guest.attendanceStatus === "accepted"
                    ? `Your RSVP has already been confirmed for ${
                        guest.attendeeCount ?? guest.maxAttendees
                      } guest${
                        (guest.attendeeCount ?? guest.maxAttendees) === 1
                          ? ""
                          : "s"
                      }.`
                    : "Your RSVP is marked as unable to attend."}
                </p>

                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#735f52]">
                  Please contact {wedding.rsvp.contactName} if you need to
                  make changes.
                </p>

                <button
                  type="button"
                  onClick={resetLookup}
                  className="mt-10 border-b border-[#4f6252] pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4f6252] transition hover:border-[#d9a6a8] hover:text-[#d9a6a8]"
                >
                  Use a different invitation code
                </button>
              </div>
            )}

            {guest && !isComplete && guest.attendanceStatus === "pending" && (
              <form onSubmit={handleSubmit}>
                <div className="text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#735f52]">
                    Invitation found
                  </p>

                  <h1 className="font-display mt-6 text-6xl leading-[0.9] text-[#4f6252] sm:text-7xl">
                    Welcome,
                    <br />
                    {guest.name}.
                  </h1>

                  <div className="mx-auto my-10 flex items-center justify-center gap-4">
                    <span className="h-px w-10 bg-[#a6b29e]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d9a6a8]" />
                    <span className="h-px w-10 bg-[#a6b29e]" />
                  </div>

                  <div className="border-y border-[#e9ddd5] py-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a6b29e]">
                      Reserved for your party
                    </p>

                    <p className="font-display mt-4 text-5xl text-[#4f6252]">
                      {guest.maxAttendees}{" "}
                      {guest.maxAttendees === 1 ? "Seat" : "Seats"}
                    </p>
                  </div>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                  <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-[#735f52]">
                    Will you be joining us?
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAttendanceChoice("accepted");
                        setMessage("");
                      }}
                      className={`rounded-full border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                        attendanceChoice === "accepted"
                          ? "border-[#4f6252] bg-[#4f6252] text-[#fffaf6]"
                          : "border-[#d9ccc2] bg-white/60 text-[#4f6252] hover:border-[#4f6252]"
                      }`}
                    >
                      Joyfully Accept
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAttendanceChoice("declined");
                        setMessage("");
                      }}
                      className={`rounded-full border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
                        attendanceChoice === "declined"
                          ? "border-[#735f52] bg-[#735f52] text-[#fffaf6]"
                          : "border-[#d9ccc2] bg-white/60 text-[#4f6252] hover:border-[#735f52]"
                      }`}
                    >
                      Regretfully Decline
                    </button>
                  </div>

                  {attendanceChoice === "accepted" && (
                    <div className="mt-12 space-y-8">
                      <div>
                        <label
                          htmlFor="attendee-count"
                          className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.23em] text-[#735f52]"
                        >
                          Number of Guests Attending
                        </label>

                        <select
                          id="attendee-count"
                          value={attendeeCount}
                          onChange={(event) =>
                            changeAttendeeCount(Number(event.target.value))
                          }
                          className="w-full border border-[#d9ccc2] bg-white/70 px-5 py-4 text-sm text-[#4f6252] outline-none focus:border-[#a6b29e] focus:ring-1 focus:ring-[#a6b29e]"
                        >
                          {Array.from(
                            { length: guest.maxAttendees },
                            (_, index) => index + 1
                          ).map((count) => (
                            <option key={count} value={count}>
                              {count} {count === 1 ? "Guest" : "Guests"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-5">
                        {attendees.map((attendee, index) => (
                          <div
                            key={index}
                            className="border border-[#e9ddd5] bg-white/40 p-5"
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a6b29e]">
                              {index === 0
                                ? "Primary Guest"
                                : `Guest ${index + 1}`}
                            </p>

                            <label
                              htmlFor={`guest-name-${index}`}
                              className="mt-5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]"
                            >
                              Full Name
                            </label>

                            <input
                              id={`guest-name-${index}`}
                              type="text"
                              value={attendee.name}
                              onChange={(event) =>
                                updateAttendee(
                                  index,
                                  "name",
                                  event.target.value
                                )
                              }
                              className="mt-2 w-full border border-[#d9ccc2] bg-white/70 px-4 py-3 text-sm text-[#4f6252] outline-none focus:border-[#a6b29e] focus:ring-1 focus:ring-[#a6b29e]"
                            />

                            <label
                              htmlFor={`meal-${index}`}
                              className="mt-5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#735f52]"
                            >
                              Meal Preference
                            </label>

                            <select
                              id={`meal-${index}`}
                              value={attendee.meal}
                              onChange={(event) =>
                                updateAttendee(
                                  index,
                                  "meal",
                                  event.target.value
                                )
                              }
                              className="mt-2 w-full border border-[#d9ccc2] bg-white/70 px-4 py-3 text-sm text-[#4f6252] outline-none focus:border-[#a6b29e] focus:ring-1 focus:ring-[#a6b29e]"
                            >
                              <option>No preference</option>
                              <option>Beef</option>
                              <option>Chicken</option>
                              <option>Fish</option>
                              <option>Vegetarian</option>
                            </select>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label
                          htmlFor="dietary-notes"
                          className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.23em] text-[#735f52]"
                        >
                          Dietary Notes
                        </label>

                        <textarea
                          id="dietary-notes"
                          value={dietaryNotes}
                          onChange={(event) =>
                            setDietaryNotes(event.target.value)
                          }
                          placeholder="Allergies, dietary restrictions, or special meal requests"
                          rows={4}
                          className="w-full resize-none border border-[#d9ccc2] bg-white/70 px-4 py-3 text-sm leading-6 text-[#4f6252] outline-none placeholder:text-[#ad9b90] focus:border-[#a6b29e] focus:ring-1 focus:ring-[#a6b29e]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="song-request"
                          className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.23em] text-[#735f52]"
                        >
                          Song Request{" "}
                          <span className="normal-case">(optional)</span>
                        </label>

                        <input
                          id="song-request"
                          type="text"
                          value={songRequest}
                          onChange={(event) =>
                            setSongRequest(event.target.value)
                          }
                          placeholder="A song that will get you on the dance floor"
                          className="w-full border border-[#d9ccc2] bg-white/70 px-4 py-3 text-sm text-[#4f6252] outline-none placeholder:text-[#ad9b90] focus:border-[#a6b29e] focus:ring-1 focus:ring-[#a6b29e]"
                        />
                      </div>
                    </div>
                  )}

                  {attendanceChoice && (
                    <div className="mt-8">
                      <label
                        htmlFor="guest-message"
                        className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.23em] text-[#735f52]"
                      >
                        Message for the Couple{" "}
                        <span className="normal-case">(optional)</span>
                      </label>

                      <textarea
                        id="guest-message"
                        value={guestMessage}
                        onChange={(event) =>
                          setGuestMessage(event.target.value)
                        }
                        placeholder="Leave a kind note for the couple"
                        rows={4}
                        className="w-full resize-none border border-[#d9ccc2] bg-white/70 px-4 py-3 text-sm leading-6 text-[#4f6252] outline-none placeholder:text-[#ad9b90] focus:border-[#a6b29e] focus:ring-1 focus:ring-[#a6b29e]"
                      />
                    </div>
                  )}

                  {message && (
                    <p
                      role="status"
                      className="mt-6 text-center text-sm leading-6 text-[#9a5c5f]"
                    >
                      {message}
                    </p>
                  )}

                  {attendanceChoice && (
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="mt-10 w-full rounded-full bg-[#4f6252] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fffaf6] transition hover:bg-[#735f52] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Saving Your RSVP..." : "Submit RSVP"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={resetLookup}
                    className="mx-auto mt-8 block border-b border-[#4f6252] pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4f6252] transition hover:border-[#d9a6a8] hover:text-[#d9a6a8]"
                  >
                    Use a different invitation code
                  </button>
                </div>
              </form>
            )}

            {isComplete && (
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#735f52]">
                  RSVP received
                </p>

                <h1 className="font-display mt-6 text-6xl leading-[0.9] text-[#4f6252] sm:text-7xl">
                  Thank you
                  <br />
                  for letting us know.
                </h1>

                <div className="mx-auto my-10 flex items-center justify-center gap-4">
                  <span className="h-px w-10 bg-[#a6b29e]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9a6a8]" />
                  <span className="h-px w-10 bg-[#a6b29e]" />
                </div>

                <p className="mx-auto max-w-md text-sm leading-7 text-[#735f52]">
                  {attendanceChoice === "accepted"
                    ? "We are so happy you will be celebrating this special day with us."
                    : "We will miss you, but we are grateful for your kind wishes."}
                </p>

                <Link
                  href="/"
                  className="mt-10 inline-flex rounded-full border border-[#4f6252] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4f6252] transition hover:bg-[#4f6252] hover:text-[#fffaf6]"
                >
                  Back to Invitation
                </Link>
              </div>
            )}
          </div>
        </section>

        <footer className="pb-2 text-center text-[10px] uppercase tracking-[0.28em] text-[#a6b29e]">
          {wedding.couple.nameOne} & {wedding.couple.nameTwo} ·{" "}
          {wedding.date.display}
        </footer>
      </div>
    </main>
  );
}