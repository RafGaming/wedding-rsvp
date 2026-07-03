import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  isGroomAdminConfigured,
  isGroomAdminSession,
} from "@/lib/groom-rsvp-auth";
import { loginGroomAdmin, logoutGroomAdmin } from "./actions";

export const dynamic = "force-dynamic";

type RSVPSubmission = {
  id: string;
  full_name: string;
  attending: boolean;
  guest_count: number;
  contact_number: string;
  dietary_restrictions: string | null;
  message: string | null;
  suggested_invitees: string | null;
  created_at: string;
};

type GroomRSVPPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

function EmptyValue() {
  return <span className="text-[#9a9a8e]">—</span>;
}

export default async function GroomRSVPPage({
  searchParams,
}: GroomRSVPPageProps) {
  const { error } = await searchParams;
  const errorCode = firstValue(error);

  if (!(await isGroomAdminSession())) {
    const isConfigured = isGroomAdminConfigured();

    return (
      <main className="min-h-screen bg-[#fffaf6] px-5 py-6 text-[#31463a] sm:px-10 sm:py-10">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-xl flex-col">
          <header className="flex items-center justify-between border-b border-[#5d493e]/20 pb-5">
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#5d493e] transition hover:text-[#c99095]"
            >
              ← Wedding website
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a6b29e]">
              Private
            </span>
          </header>

          <section className="my-auto py-16">
            <div className="border border-[#5d493e]/20 bg-white/70 p-6 shadow-[18px_20px_0_rgba(243,221,221,0.58)] sm:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5d493e]">
                Jethro &amp; France
              </p>

              <h1 className="font-display mt-6 text-5xl font-medium leading-[0.88] tracking-[-0.06em] text-[#31463a] sm:text-6xl">
                RSVP
                <br />
                <em className="font-editorial text-[#c99095]">dashboard.</em>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#5d493e]">
                A private view of guest responses, reserved only for the groom.
              </p>

              {!isConfigured ? (
                <div className="mt-8 border-l-2 border-[#c99095] bg-[#fbeeee] px-4 py-4 text-sm leading-6 text-[#7d4e52]">
                  Add <code>GROOM_RSVP_PASSWORD</code> and{" "}
                  <code>GROOM_RSVP_SESSION_SECRET</code> to your environment
                  variables before using this panel.
                </div>
              ) : (
                <form action={loginGroomAdmin} className="mt-9 grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5d493e]">
                      Groom password
                    </span>
                    <input
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      placeholder="Enter private password"
                      className="w-full border-b border-[#d9ccc2] bg-transparent px-1 py-3 text-sm text-[#31463a] outline-none transition placeholder:text-[#b5a49a] focus:border-[#a6b29e]"
                    />
                  </label>

                  {errorCode === "password" && (
                    <p
                      role="alert"
                      className="border-l-2 border-[#b6686d] bg-[#fbeeee] px-4 py-3 text-sm text-[#9a5c5f]"
                    >
                      Incorrect password. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-2 rounded-full bg-[#31463a] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fffaf6] transition hover:bg-[#5d493e]"
                  >
                    Open RSVP dashboard
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  const { data, error: loadError } = await supabaseAdmin
    .from("rsvp_submissions")
    .select(
      "id, full_name, attending, guest_count, contact_number, dietary_restrictions, message, suggested_invitees, created_at",
    )
    .order("created_at", { ascending: false });

  if (loadError) {
    throw new Error("Could not load RSVP responses.");
  }

  const responses = (data ?? []) as RSVPSubmission[];
  const attendingResponses = responses.filter((response) => response.attending);
  const declinedResponses = responses.filter((response) => !response.attending);
  const attendeeTotal = attendingResponses.reduce(
    (total, response) => total + Number(response.guest_count || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#fffaf6] px-5 py-6 text-[#31463a] sm:px-10 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-[#5d493e]/20 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#5d493e]">
              Jethro &amp; France
            </p>
            <h1 className="font-display mt-2 text-4xl font-medium tracking-[-0.06em] text-[#31463a] sm:text-5xl">
              RSVP <em className="font-editorial text-[#c99095]">dashboard.</em>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5d493e] transition hover:text-[#c99095]"
            >
              View website ↗
            </Link>

            <form action={logoutGroomAdmin}>
              <button
                type="submit"
                className="rounded-full border border-[#31463a] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#31463a] transition hover:bg-[#31463a] hover:text-[#fffaf6]"
              >
                Lock panel
              </button>
            </form>
          </div>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <article className="border border-[#5d493e]/20 bg-white/65 p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8d7a6e]">
              Total responses
            </p>
            <strong className="font-display mt-3 block text-5xl font-medium tracking-[-0.06em] text-[#31463a]">
              {responses.length}
            </strong>
          </article>

          <article className="border border-[#5d493e]/20 bg-[#edf4ec] p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#57735d]">
              Happily accepts
            </p>
            <strong className="font-display mt-3 block text-5xl font-medium tracking-[-0.06em] text-[#31463a]">
              {attendingResponses.length}
            </strong>
          </article>

          <article className="border border-[#5d493e]/20 bg-[#f8eeee] p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#9a5c5f]">
              Regretfully declines
            </p>
            <strong className="font-display mt-3 block text-5xl font-medium tracking-[-0.06em] text-[#31463a]">
              {declinedResponses.length}
            </strong>
          </article>

          <article className="border border-[#5d493e]/20 bg-[#f7f1e9] p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8d7a6e]">
              Expected attendees
            </p>
            <strong className="font-display mt-3 block text-5xl font-medium tracking-[-0.06em] text-[#31463a]">
              {attendeeTotal}
            </strong>
          </article>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#5d493e]">
                Guest replies
              </p>
              <p className="mt-2 text-sm text-[#8d7a6e]">
                Newest response first. Tap a guest to view all details.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a6b29e]">
              Manila time
            </span>
          </div>

          {responses.length === 0 ? (
            <div className="border border-dashed border-[#5d493e]/25 bg-white/45 px-6 py-16 text-center">
              <p className="font-display text-3xl text-[#31463a]">
                No RSVPs yet.
              </p>
              <p className="mt-3 text-sm text-[#8d7a6e]">
                Guest responses will appear here as soon as they submit the form.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden border border-[#5d493e]/20 bg-white/65">
              <div className="hidden grid-cols-[1.4fr_0.8fr_0.7fr_1.1fr_1fr] gap-4 border-b border-[#5d493e]/15 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.17em] text-[#8d7a6e] md:grid">
                <span>Guest</span>
                <span>Response</span>
                <span>Seats</span>
                <span>Contact</span>
                <span>Submitted</span>
              </div>

              <div>
                {responses.map((response) => (
                  <details
                    key={response.id}
                    className="group border-b border-[#5d493e]/15 last:border-b-0"
                  >
                    <summary className="grid cursor-pointer list-none gap-3 px-5 py-5 transition hover:bg-[#f7f1e9]/70 md:grid-cols-[1.4fr_0.8fr_0.7fr_1.1fr_1fr] md:items-center md:gap-4">
                      <div>
                        <p className="font-display text-2xl leading-none text-[#31463a]">
                          {response.full_name}
                        </p>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a6b29e] md:hidden">
                          {formatSubmittedAt(response.created_at)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                          response.attending
                            ? "bg-[#dcebdc] text-[#385b40]"
                            : "bg-[#f4dddd] text-[#8c5559]"
                        }`}
                      >
                        {response.attending ? "Accepts" : "Declines"}
                      </span>

                      <span className="text-sm text-[#5d493e]">
                        {response.attending
                          ? `${response.guest_count} ${
                              response.guest_count === 1 ? "seat" : "seats"
                            }`
                          : "—"}
                      </span>

                      <a
                        href={`tel:${response.contact_number.replace(/\s/g, "")}`}
                        className="w-fit text-sm text-[#5d493e] underline decoration-[#c99095] underline-offset-4 transition hover:text-[#c99095]"
                      >
                        {response.contact_number}
                      </a>

                      <span className="hidden text-sm text-[#8d7a6e] md:block">
                        {formatSubmittedAt(response.created_at)}
                      </span>
                    </summary>

                    <div className="grid gap-5 border-t border-[#5d493e]/10 bg-[#fffaf6] px-5 py-5 text-sm leading-6 text-[#5d493e] sm:grid-cols-2">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8d7a6e]">
                          Dietary restrictions
                        </p>
                        <p className="mt-2">
                          {response.dietary_restrictions || <EmptyValue />}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8d7a6e]">
                          Suggested invitees
                        </p>
                        <p className="mt-2">
                          {response.suggested_invitees || <EmptyValue />}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8d7a6e]">
                          Message to the couple
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">
                          {response.message || <EmptyValue />}
                        </p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
