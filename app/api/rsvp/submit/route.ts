import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type SubmitBody = {
  fullName?: unknown;
  attendanceStatus?: unknown;
  attendeeCount?: unknown;
  contactNumber?: unknown;
  dietaryRestrictions?: unknown;
  guestMessage?: unknown;
  suggestedInvitees?: unknown;
  website?: unknown;
};

function cleanRequiredText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanOptionalText(value: unknown, maxLength: number) {
  const cleaned = cleanRequiredText(value, maxLength);
  return cleaned || null;
}

function looksLikeContactNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 20;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody;

    // Hidden honeypot. A real guest never sees or completes this field.
    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ success: true });
    }

    const fullName = cleanRequiredText(body.fullName, 120);
    const contactNumber = cleanRequiredText(body.contactNumber, 40);
    const attendanceStatus =
      typeof body.attendanceStatus === "string"
        ? body.attendanceStatus
        : "";

    if (fullName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (attendanceStatus !== "accepted" && attendanceStatus !== "declined") {
      return NextResponse.json(
        { error: "Please choose whether you will attend." },
        { status: 400 }
      );
    }

    if (!looksLikeContactNumber(contactNumber)) {
      return NextResponse.json(
        { error: "Please enter a valid contact number." },
        { status: 400 }
      );
    }

    const attendeeCount =
      attendanceStatus === "accepted" ? Number(body.attendeeCount) : 0;

    if (
      attendanceStatus === "accepted" &&
      (!Number.isInteger(attendeeCount) ||
        attendeeCount < 1 ||
        attendeeCount > 20)
    ) {
      return NextResponse.json(
        { error: "Please choose between 1 and 20 attendees." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("rsvp_submissions").insert({
      full_name: fullName,
      attending: attendanceStatus === "accepted",
      guest_count: attendeeCount,
      contact_number: contactNumber,
      dietary_restrictions:
        attendanceStatus === "accepted"
          ? cleanOptionalText(body.dietaryRestrictions, 1000)
          : null,
      message: cleanOptionalText(body.guestMessage, 1000),
      suggested_invitees: cleanOptionalText(body.suggestedInvitees, 1000),
    });

    if (error) {
      console.error("Could not save public RSVP:", error);

      return NextResponse.json(
        { error: "We could not save your RSVP. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      attendanceStatus,
      attendeeCount,
    });
  } catch (error) {
    console.error("Public RSVP submit route crashed:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving your RSVP." },
      { status: 500 }
    );
  }
}
