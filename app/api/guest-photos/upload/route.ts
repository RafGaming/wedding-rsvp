import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  getGuestGalleryServerClient,
  isGuestGalleryTokenValid,
} from "@/lib/guest-gallery-server";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const GUEST_PHOTOS_BUCKET = "guest-photos";

type DetectedImage = {
  extension: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
};

function readText(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const cleanValue = value.replace(/\s+/g, " ").trim();
  return cleanValue ? cleanValue.slice(0, maxLength) : null;
}

function detectImage(bytes: Uint8Array): DetectedImage | null {
  const isJpeg =
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;

  if (isJpeg) {
    return { extension: "jpg", mimeType: "image/jpeg" };
  }

  const isPng =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;

  if (isPng) {
    return { extension: "png", mimeType: "image/png" };
  }

  const isWebp =
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  if (isWebp) {
    return { extension: "webp", mimeType: "image/webp" };
  }

  return null;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const accessToken = readText(formData.get("accessToken"), 512);

    if (!isGuestGalleryTokenValid(accessToken)) {
      return jsonError("This photo-upload link is not valid.", 403);
    }

    const file = formData.get("photo");

    if (!(file instanceof File)) {
      return jsonError("Choose a photo before submitting.", 400);
    }

    if (file.size === 0) {
      return jsonError("That photo is empty. Please choose another image.", 400);
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return jsonError("Please choose an image smaller than 15 MB.", 413);
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const detectedImage = detectImage(bytes);

    if (!detectedImage) {
      return jsonError("Only JPG, PNG, and WebP images are allowed.", 415);
    }

    const guestName = readText(formData.get("guestName"), 80);
    const caption = readText(formData.get("caption"), 280);

    const dateFolder = new Date().toISOString().slice(0, 10);
    const storagePath = `uploads/${dateFolder}/${randomUUID()}.${detectedImage.extension}`;

    const supabase = getGuestGalleryServerClient();

    const { error: storageError } = await supabase.storage
      .from(GUEST_PHOTOS_BUCKET)
      .upload(storagePath, bytes, {
        cacheControl: "3600",
        contentType: detectedImage.mimeType,
        upsert: false,
      });

    if (storageError) {
      return jsonError("We could not save that photo. Please try again.", 500);
    }

    const { error: databaseError } = await supabase.from("guest_photos").insert({
      storage_path: storagePath,
      guest_name: guestName,
      caption,
      status: "approved",
      approved_at: new Date().toISOString(),
    });

    if (databaseError) {
      await supabase.storage.from(GUEST_PHOTOS_BUCKET).remove([storagePath]);

      return jsonError("We could not save that photo. Please try again.", 500);
    }

    return NextResponse.json({
      ok: true,
      message: "Thank you! Your photo is now live in the Guests’ Gallery.",
    });
  } catch (error) {
    console.error("Guest photo upload failed:", error);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
