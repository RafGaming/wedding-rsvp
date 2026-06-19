"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./guest-photo-upload.module.css";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type SubmissionState =
  | { type: "idle"; message: "" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function GuestPhotoUpload({ accessToken }: { accessToken: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<SubmissionState>({
    type: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ type: "idle", message: "" });

    const form = event.currentTarget;
    const photoInput = form.elements.namedItem("photo") as HTMLInputElement | null;
    const photo = photoInput?.files?.[0];

    if (!photo) {
      setState({ type: "error", message: "Choose a photo first." });
      return;
    }

    if (!ACCEPTED_TYPES.includes(photo.type)) {
      setState({
        type: "error",
        message: "Please use a JPG, PNG, or WebP image.",
      });
      return;
    }

    if (photo.size > MAX_UPLOAD_BYTES) {
      setState({
        type: "error",
        message: "Please choose an image smaller than 15 MB.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(form);
      formData.set("accessToken", accessToken);

      const response = await fetch("/api/guest-photos/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "The upload could not be completed.");
      }

      formRef.current?.reset();
      setSelectedFileName("");
      router.refresh();

      setState({
        type: "success",
        message:
          result?.message ??
          "Thank you! Your photo is now live in the Guests’ Gallery.",
      });
    } catch (error) {
      setState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "The upload could not be completed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className={styles.formHeading}>
        <div>
          <p>Share a memory</p>
          <span>It goes live the moment it is uploaded.</span>
        </div>
        <b aria-hidden="true">✦</b>
      </div>

      <div className={styles.formRule} aria-hidden="true" />

      <label className={styles.label}>
        <span>Your name <em>optional</em></span>
        <input
          name="guestName"
          type="text"
          maxLength={80}
          autoComplete="name"
          placeholder="e.g. Maria"
        />
      </label>

      <label className={styles.label}>
        <span>A short note <em>optional</em></span>
        <textarea
          name="caption"
          maxLength={280}
          rows={3}
          placeholder="Leave a little message for the couple"
        />
      </label>

      <label className={styles.photoPicker}>
        <input
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          required
          onChange={(event) =>
            setSelectedFileName(event.target.files?.[0]?.name ?? "")
          }
        />

        <span className={styles.photoPickerKicker}>Photo upload</span>
        <strong className={styles.fileAction}>
          {selectedFileName || "Choose or take a photo"}
        </strong>
        <small>JPG, PNG, or WebP · Maximum 15 MB</small>
      </label>

      <button className={styles.submitButton} disabled={isSubmitting} type="submit">
        <span>{isSubmitting ? "Uploading memory…" : "Add to the gallery"}</span>
        <b aria-hidden="true">↗</b>
      </button>

      {state.type !== "idle" && (
        <p
          className={
            state.type === "success" ? styles.successMessage : styles.errorMessage
          }
          role={state.type === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
