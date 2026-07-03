import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "groom_rsvp_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

type AdminSession = {
  role: "groom-rsvp";
  expiresAt: number;
};

function getAdminPassword() {
  return process.env.GROOM_RSVP_PASSWORD?.trim() ?? "";
}

function getSessionSecret() {
  return process.env.GROOM_RSVP_SESSION_SECRET?.trim() ?? "";
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function readSession(payload: string): AdminSession | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;

    if (
      parsed.role !== "groom-rsvp" ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function isGroomAdminConfigured() {
  return Boolean(getAdminPassword() && getSessionSecret());
}

export function isGroomPasswordValid(candidate: string) {
  const password = getAdminPassword();

  if (!password || !candidate) {
    return false;
  }

  return safeEqual(candidate, password);
}

export async function isGroomAdminSession() {
  const secret = getSessionSecret();
  const cookieStore = await cookies();
  const storedCookie = cookieStore.get(COOKIE_NAME)?.value;

  if (!secret || !storedCookie) {
    return false;
  }

  const separator = storedCookie.lastIndexOf(".");

  if (separator === -1) {
    return false;
  }

  const payload = storedCookie.slice(0, separator);
  const receivedSignature = storedCookie.slice(separator + 1);
  const expectedSignature = sign(payload, secret);

  if (!safeEqual(receivedSignature, expectedSignature)) {
    return false;
  }

  return Boolean(readSession(payload));
}

export async function createGroomAdminSession() {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("GROOM_RSVP_SESSION_SECRET is missing.");
  }

  const session: AdminSession = {
    role: "groom-rsvp",
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  };

  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const value = `${payload}.${sign(payload, secret)}`;
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearGroomAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
