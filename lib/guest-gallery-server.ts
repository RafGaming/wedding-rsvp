import { timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

const GUEST_PHOTOS_BUCKET = "guest-photos";

type GuestPhotoRow = {
  id: string;
  storage_path: string;
  guest_name: string | null;
  caption: string | null;
  uploaded_at: string;
};

export type ApprovedGuestPhoto = {
  id: string;
  guestName: string | null;
  caption: string | null;
  uploadedAt: string;
  imageUrl: string;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getGuestGalleryServerClient() {
  return createClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SECRET_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export function isGuestGalleryTokenValid(token: string | null | undefined) {
  const configuredToken = process.env.GUEST_GALLERY_TOKEN?.trim();

  if (!configuredToken || !token) {
    return false;
  }

  const expected = Buffer.from(configuredToken);
  const received = Buffer.from(token);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

export async function getApprovedGuestPhotos(
  limit = 72,
): Promise<ApprovedGuestPhoto[]> {
  const supabase = getGuestGalleryServerClient();

  const { data, error } = await supabase
    .from("guest_photos")
    .select("id, storage_path, guest_name, caption, uploaded_at")
    .eq("status", "approved")
    .order("uploaded_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Could not load approved guest photos.");
  }

  const photos = (data ?? []) as GuestPhotoRow[];

  const signedPhotos = await Promise.all(
    photos.map(async (photo) => {
      const { data: signedData, error: signedUrlError } = await supabase.storage
        .from(GUEST_PHOTOS_BUCKET)
        .createSignedUrl(photo.storage_path, 60 * 60);

      if (signedUrlError || !signedData?.signedUrl) {
        return null;
      }

      return {
        id: photo.id,
        guestName: photo.guest_name,
        caption: photo.caption,
        uploadedAt: photo.uploaded_at,
        imageUrl: signedData.signedUrl,
      };
    }),
  );

  return signedPhotos.filter(
    (photo): photo is ApprovedGuestPhoto => photo !== null,
  );
}
