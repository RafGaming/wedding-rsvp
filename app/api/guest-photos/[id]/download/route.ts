import { NextResponse } from "next/server";
import { getGuestGalleryServerClient } from "@/lib/guest-gallery-server";

export const runtime = "nodejs";

const GUEST_PHOTOS_BUCKET = "guest-photos";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function fileInfo(storagePath: string, photoId: string) {
  const extension = storagePath.split(".").pop()?.toLowerCase();

  const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);
  const safeExtension = extension && allowedExtensions.has(extension) ? extension : "jpg";

  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };

  return {
    contentType: contentTypes[safeExtension],
    filename: `jethro-france-guest-photo-${photoId}.${safeExtension}`,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  try {
    const supabase = getGuestGalleryServerClient();

    const { data: photo, error: photoError } = await supabase
      .from("guest_photos")
      .select("storage_path")
      .eq("id", id)
      .eq("status", "approved")
      .maybeSingle();

    if (photoError || !photo?.storage_path) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    const { data: file, error: fileError } = await supabase.storage
      .from(GUEST_PHOTOS_BUCKET)
      .download(photo.storage_path);

    if (fileError || !file) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    const { contentType, filename } = fileInfo(photo.storage_path, id);
    const imageBytes = await file.arrayBuffer();

    return new NextResponse(imageBytes, {
      headers: {
        "Content-Type": file.type || contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Guest photo download failed:", error);

    return NextResponse.json(
      { error: "The photo could not be downloaded right now." },
      { status: 500 },
    );
  }
}
