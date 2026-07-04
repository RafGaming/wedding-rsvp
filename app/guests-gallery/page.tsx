import { GuestPhotoUpload } from "@/components/guest-photo-upload";
import {
  getApprovedGuestPhotos,
  isGuestGalleryTokenValid,
} from "@/lib/guest-gallery-server";
import styles from "./guests-gallery.module.css";

export const dynamic = "force-dynamic";

type GuestGalleryPageProps = {
  searchParams: Promise<{
    access?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function GuestsGalleryPage({
  searchParams,
}: GuestGalleryPageProps) {
  const { access } = await searchParams;
  const accessToken = firstValue(access);
  const canUpload = isGuestGalleryTokenValid(accessToken);
  const photos = await getApprovedGuestPhotos();

  return (
    <main className={styles.page}>
      <div className={styles.paperTexture} aria-hidden="true" />
      <div className={styles.topBloom} aria-hidden="true" />
      <div className={styles.bottomBloom} aria-hidden="true" />

      <header className={`${styles.hero} ${canUpload ? styles.heroUpload : ""}`}>
        <a href="/" className={styles.backLink}>
          <span aria-hidden="true">←</span>
          Wedding website
        </a>

        <div className={styles.heroEyebrow}>
          <span>Jeth &amp; France</span>
          <i aria-hidden="true" />
          <span>August 16, 2026</span>
        </div>

        <p className={styles.kicker}>
          {canUpload ? "The photo guestbook" : "A visual guestbook"}
        </p>

        {canUpload ? (
          <>
            <h1>
              Add your
              <span>memory.</span>
            </h1>

            <p className={styles.heroCopy}>
              You are part of the story. Take a photo or choose one from your
              phone, then leave it here for Jeth and France.
            </p>

            <a href="#share" className={styles.heroCta}>
              Share a photo <span aria-hidden="true">↓</span>
            </a>
          </>
        ) : (
          <>
            <h1>
              <span>Guests’</span>
              Gallery
            </h1>

            <p className={styles.heroCopy}>
              The candid smiles, quiet moments, and beautiful chaos shared by
              the people who made this celebration complete.
            </p>
          </>
        )}

        <div className={styles.heroRule} aria-hidden="true">
          <span />
          <b>✦</b>
          <span />
        </div>
      </header>

      {canUpload && accessToken && (
        <section id="share" className={styles.uploadSection}>
          <div className={styles.uploadCopy}>
            <p className={styles.kicker}>Leave your mark</p>
            <h2>
              Your moment,
              <em> preserved.</em>
            </h2>
            <p>
              Capture the room, your table, the dance floor, or your favorite
              memory. Your image is shared instantly with everyone celebrating
              this day.
            </p>

            <div className={styles.uploadDetails}>
              <span>Instantly shared</span>
              <i aria-hidden="true" />
              <span>Up to 15 MB</span>
            </div>
          </div>

          <div className={styles.uploadFormFrame}>
            <GuestPhotoUpload accessToken={accessToken} />
          </div>
        </section>
      )}

      <section className={styles.gallerySection}>
        <div className={styles.galleryHeading}>
          <div>
            <p className={styles.kicker}>Collected with love</p>
            <h2>
              The people
              <em> in our story.</em>
            </h2>
          </div>

          <div className={styles.galleryCount}>
            <strong>{String(photos.length).padStart(2, "0")}</strong>
            <span>shared {photos.length === 1 ? "memory" : "memories"}</span>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className={styles.emptyGallery}>
            <div className={styles.emptyGalleryMark} aria-hidden="true">
              ✦
            </div>
            <p className={styles.kicker}>The album is just beginning</p>
            <h3>The first shared memory will appear here soon.</h3>
            <span>
              {canUpload
                ? "Choose a photo from your phone above to begin the collection."
                : "Scan the wedding QR code to add a photo from your phone."}
            </span>
          </div>
        ) : (
          <div className={styles.photoGrid}>
            {photos.map((photo, index) => (
              <figure className={styles.photoCard} key={photo.id}>
                <div className={styles.photoImageFrame}>
                  <img
                    alt={
                      photo.caption ||
                      (photo.guestName
                        ? `Photo shared by ${photo.guestName}`
                        : "A guest-shared wedding memory")
                    }
                    loading={index < 4 ? "eager" : "lazy"}
                    src={photo.imageUrl}
                  />

                  <span className={styles.photoCount} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <a
                    className={styles.downloadButton}
                    href={`/api/guest-photos/${photo.id}/download`}
                  >
                    <span>Download</span>
                    <b aria-hidden="true">↓</b>
                  </a>
                </div>

                <figcaption className={styles.photoMeta}>
                  <div>
                    {photo.caption ? (
                      <p>“{photo.caption}”</p>
                    ) : (
                      <p className={styles.defaultCaption}>A shared memory</p>
                    )}

                    <span>
                      {photo.guestName
                        ? `— ${photo.guestName}`
                        : "With love from a guest"}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerRule} aria-hidden="true">
          <span />
          <b>J&nbsp;&amp;&nbsp;F</b>
          <span />
        </div>
        <p>Thank you for celebrating this chapter with us.</p>
      </footer>
    </main>
  );
}
