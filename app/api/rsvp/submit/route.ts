import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type Attendee = {
  name?: unknown;
  meal?: unknown;
};

type SubmitBody = {
  invitationCode?: unknown;
  attendanceStatus?: unknown;
  attendeeCount?: unknown;
  attendeeDetails?: unknown;
  dietaryNotes?: unknown;
  songRequest?: unknown;
  guestMessage?: unknown;
};

function cleanOptionalText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim().slice(0, maxLength);

  return cleaned || null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody;

    const invitationCode =
      typeof body.invitationCode === "string"
        ? body.invitationCode.trim().toUpperCase()
        : "";

    const attendanceStatus =
      typeof body.attendanceStatus === "string"
        ? body.attendanceStatus
        : "";

    if (!/^[A-Z0-9-]{6,40}$/.test(invitationCode)) {
      return NextResponse.json(
        { error: "Please enter a valid invitation code." },
        { status: 400 }
      );
    }

    if (
      attendanceStatus !== "accepted" &&
      attendanceStatus !== "declined"
    ) {
      return NextResponse.json(
        { error: "Please choose whether you will attend." },
        { status: 400 }
      );
    }

    const { data: guest, error: guestError } = await supabaseAdmin
      .from("guests")
      .select("id, max_attendees, attendance_status")
      .eq("invite_code", invitationCode)
      .maybeSingle();

    if (guestError) {
      console.error("Could not verify guest:", guestError);

      return NextResponse.json(
        { error: "We could not verify this invitation right now." },
        { status: 500 }
      );
    }

    if (!guest) {
      return NextResponse.json(
        { error: "We could not find that invitation code." },
        { status: 404 }
      );
    }

    // Stops a guest from submitting twice by accident.
    if (guest.attendance_status !== "pending") {
      return NextResponse.json(
        {
          error:
            "This invitation has already received an RSVP. Please contact the couple if you need to make changes.",
        },
        { status: 409 }
      );
    }

    // DECLINED RSVP
    if (attendanceStatus === "declined") {
      const { error: updateError } = await supabaseAdmin
        .from("guests")
        .update({
          attendance_status: "declined",
          attendee_count: 0,
          attendee_details: [],
          dietary_notes: null,
          song_request: null,
          guest_message: cleanOptionalText(body.guestMessage, 1000),
          submitted_at: new Date().toISOString(),
        })
        .eq("id", guest.id);

      if (updateError) {
        console.error("Could not save declined RSVP:", updateError);

        return NextResponse.json(
          { error: "We could not save your RSVP. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        attendanceStatus: "declined",
      });
    }

    // ACCEPTED RSVP
    const attendeeCount = Number(body.attendeeCount);

    if (
      !Number.isInteger(attendeeCount) ||
      attendeeCount < 1 ||
      attendeeCount > guest.max_attendees
    ) {
      return NextResponse.json(
        {
          error: `Your invitation is reserved for up to ${guest.max_attendees} guest${
            guest.max_attendees === 1 ? "" : "s"
          }.`,
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.attendeeDetails)) {
      return NextResponse.json(
        { error: "Please provide the names of all attending guests." },
        { status: 400 }
      );
    }

    if (body.attendeeDetails.length !== attendeeCount) {
      return NextResponse.json(
        { error: "Please complete the details for every attending guest." },
        { status: 400 }
      );
    }

    const attendeeDetails = body.attendeeDetails.map((attendee) => {
      const record = attendee as Attendee;

      const name =
        typeof record.name === "string"
          ? record.name.trim().slice(0, 120)
          : "";

      const meal =
        typeof record.meal === "string"
          ? record.meal.trim().slice(0, 80)
          : "No preference";

      return {
        name,
        meal: meal || "No preference",
      };
    });

    const hasMissingName = attendeeDetails.some(
      (attendee) => !attendee.name
    );

    if (hasMissingName) {
      return NextResponse.json(
        { error: "Please enter the name of every attending guest." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("guests")
      .update({
        attendance_status: "accepted",
        attendee_count: attendeeCount,
        attendee_details: attendeeDetails,
        dietary_notes: cleanOptionalText(body.dietaryNotes, 1000),
        song_request: cleanOptionalText(body.songRequest, 200),
        guest_message: cleanOptionalText(body.guestMessage, 1000),
        submitted_at: new Date().toISOString(),
      })
      .eq("id", guest.id);

    if (updateError) {
      console.error("Could not save accepted RSVP:", updateError);

      return NextResponse.json(
        { error: "We could not save your RSVP. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attendanceStatus: "accepted",
      attendeeCount,
    });
  } catch (error) {
    console.error("RSVP submit route crashed:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving your RSVP." },
      { status: 500 }
    );
  }
}