"use server";

import { redirect } from "next/navigation";
import {
  clearGroomAdminSession,
  createGroomAdminSession,
  isGroomAdminConfigured,
  isGroomPasswordValid,
} from "@/lib/groom-rsvp-auth";

export async function loginGroomAdmin(formData: FormData) {
  if (!isGroomAdminConfigured()) {
    redirect("/groom-rsvp?error=config");
  }

  const password = typeof formData.get("password") === "string"
    ? String(formData.get("password"))
    : "";

  if (!isGroomPasswordValid(password)) {
    redirect("/groom-rsvp?error=password");
  }

  await createGroomAdminSession();
  redirect("/groom-rsvp");
}

export async function logoutGroomAdmin() {
  await clearGroomAdminSession();
  redirect("/groom-rsvp");
}
