import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type LookupBody = {
  invitationCode?: string;
};

// Open /api/rsvp/lookup in the browser to confirm the route is alive.
export function GET() {
  return NextResponse.json({
    ok: true,
    message: "RSVP lookup route is working.",
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LookupBody;

    const invitationCode = body.invitationCode?.trim().toUpperCase();

    if (!invitationCode) {
      return NextResponse.json(
        { error: "Please enter your invitation code." },
        { status: 400 }
      );
    }

    if (!/^[A-Z0-9-]{6,40}$/.test(invitationCode)) {
      return NextResponse.json(
        { error: "Please enter a valid invitation code." },
        { status: 400 }
      );
    }

    const { data: guest, error } = await supabaseAdmin
      .from("guests")
      .select(
        "id, primary_guest_name, max_attendees, attendance_status, attendee_count, submitted_at"
      )
      .eq("invite_code", invitationCode)
      .maybeSingle();

    if (error) {
      console.error("Supabase RSVP lookup error:", error);

      return NextResponse.json(
        { error: "The RSVP database could not be reached right now." },
        { status: 500 }
      );
    }

    if (!guest) {
      return NextResponse.json(
        { error: "We could not find that invitation code." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        guest: {
          id: guest.id,
          name: guest.primary_guest_name,
          maxAttendees: guest.max_attendees,
          attendanceStatus: guest.attendance_status,
          attendeeCount: guest.attendee_count,
          submittedAt: guest.submitted_at,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("RSVP lookup route crashed:", error);

    return NextResponse.json(
      { error: "Something went wrong while checking your invitation." },
      { status: 500 }
    );
  }
}