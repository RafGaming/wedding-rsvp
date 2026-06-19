import Image from "next/image";
import { ScrollProgress } from "@/components/scroll-progress";
import { WeddingCountdown } from "@/components/wedding-countdown";
import { WeddingFaq } from "@/components/wedding-faq";
import { WeddingFilm } from "@/components/wedding-film";
import { WeddingGallery } from "@/components/wedding-gallery";
import { WeddingNav } from "@/components/wedding-nav";
import { wedding } from "@/lib/wedding";

function isTBA(value: string) {
  return value.trim().toUpperCase() === "TBA";
}

export default function Home() {
  const ceremonyTimeText = isTBA(wedding.date.ceremonyTime)
    ? "Timing to follow"
    : wedding.date.ceremonyTime;

  const arrivalText = isTBA(wedding.date.guestArrivalTime)
    ? "Guest arrival details will be announced soon."
    : `Guest arrival begins at ${wedding.date.guestArrivalTime}.`;

  const receptionTimeText = isTBA(wedding.date.receptionTime)
    ? "Timing to follow"
    : wedding.date.receptionTime;

  return (
    <main className="premium-page">
      <ScrollProgress />
      <WeddingNav />

      {/* HERO — EDITORIAL GARDEN ESTATE */}
      <section id="top" className="hero-editorial scroll-mt-24">
        <div className="hero-editorial-rule" aria-hidden="true" />

        <div className="hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">Together with their families</p>

            <p className="hero-pretitle">Joyfully invite you to celebrate</p>

            <h1 className="hero-title">
              <span className="hero-title-name">Jethro</span>
              <span className="hero-title-ampersand">&amp;</span>
              <span className="hero-title-name hero-title-name--second">
                France
              </span>
            </h1>

            <div className="hero-intro-rule" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>

            <p className="hero-copy-text">
              A garden celebration of two lives, one promise, and the people
              who made the journey beautiful.
            </p>

            <div className="hero-metadata">
              <span>{wedding.date.display}</span>
              <span>{wedding.venue.name}</span>
            </div>

            <a href="#story" className="editorial-link">
              <span>View invitation</span>
              <b aria-hidden="true">↓</b>
            </a>
          </div>

          <div className="hero-visual">
            <div className="hero-image-matte">
              <Image
                src={wedding.media.heroImage}
                alt={`${wedding.couple.nameOne} and ${wedding.couple.nameTwo}`}
                width={1920}
                height={1080}
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="hero-image"
              />
            </div>

            <p className="hero-visual-caption">
              Jethro Dionisio &amp; France Domingo
              <span />
              Tagaytay City
            </p>

            <p className="hero-vertical-date" aria-hidden="true">
              August Sixteenth · Two Thousand Twenty-Six
            </p>
          </div>
        </div>

        <div className="hero-bottom-line" aria-hidden="true">
          <span>Leanel&apos;s Garden</span>
          <i />
          <span>Tagaytay City, Philippines</span>
          <i />
          <span>A garden celebration</span>
        </div>
      </section>

      {/* COUNTDOWN */}
      <WeddingCountdown />

      {/* INVITATION */}
      <section id="story" className="invitation-stage scroll-mt-24">
        <Image
          src="/images/F2.png"
          alt=""
          width={1024}
          height={1024}
          aria-hidden="true"
          className="invitation-floral invitation-floral--one"
        />
        <Image
          src="/images/F2.png"
          alt=""
          width={1024}
          height={1024}
          aria-hidden="true"
          className="invitation-floral invitation-floral--two"
        />

        <div className="invitation-card">
          <p className="eyebrow invitation-eyebrow">A day to remember</p>

          <span className="invitation-year" aria-hidden="true">
            2026
          </span>

          <h2 className="invitation-title">
            With joyful hearts,
            <br />
            we invite you to{" "}
            <em>celebrate.</em>
          </h2>

          <p className="invitation-copy">
            We would be honored to share the beginning of our next chapter with
            the people we love most.
          </p>

          <div className="invitation-details">
            <span>{wedding.date.display}</span>
            <i aria-hidden="true" />
            <span>Tagaytay City</span>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section id="details" className="details-stage scroll-mt-24">
        <div className="details-heading">
          <p className="eyebrow">Wedding details</p>
          <h2 className="section-title">
            Everything for the <em>day.</em>
          </h2>
        </div>

        <div className="details-grid">
          <article className="details-card details-card--when">
            <p className="details-card-label">When</p>
            <h3>
              Sunday,
              <br />
              August 16, 2026
            </h3>
            <p>
              Ceremony: {ceremonyTimeText}
              <br />
              {arrivalText}
            </p>
          </article>

          <article className="details-card details-card--where">
            <p className="details-card-label">Where</p>
            <h3>{wedding.venue.name}</h3>
            <p>{wedding.venue.address}</p>
            <a
              href={wedding.venue.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="details-map-link"
            >
              View on Google Maps <span aria-hidden="true">↗</span>
            </a>
          </article>

          <article className="details-card details-card--attire">
            <p className="details-card-label">Attire</p>
            <h3>{wedding.dressCode.title}</h3>
            <p>{wedding.dressCode.description}</p>

            <div className="attire-palette" aria-label="Pastel Formal palette">
              <span className="attire-swatch attire-swatch--sage" />
              <span className="attire-swatch attire-swatch--rose" />
              <span className="attire-swatch attire-swatch--sand" />
              <span className="attire-swatch attire-swatch--lilac" />
            </div>
          </article>
        </div>

        <p className="details-footer-note">
          Reception: {receptionTimeText} · Dinner and celebration to follow
        </p>
      </section>

      {/* ONE FILM MOMENT */}
      <WeddingFilm />

      {/* PRE-WEDDING PORTRAITS */}
      <WeddingGallery />

      {/* FAQ */}
      <WeddingFaq />

      {/* FLORAL TRANSITION */}
      <section aria-hidden="true" className="floral-transition">
        <Image
          src="/images/F1.png"
          alt=""
          width={2048}
          height={768}
          className="floral-transition-image"
        />
      </section>

      {/* RSVP — FINAL EDITORIAL SPREAD */}
      <section id="rsvp" className="rsvp-stage scroll-mt-24">
        <div className="rsvp-layout">
          <div className="rsvp-copy">
            <p className="eyebrow rsvp-eyebrow">RSVP</p>

            <h2>
              Your invitation
              <br />
              <em>awaits.</em>
            </h2>

            <div className="rsvp-copy-rule" aria-hidden="true">
              <span />
              <i />
            </div>

            <p>
              Kindly reserve your place and celebrate this special day with us.
              Please respond on or before {wedding.rsvp.deadline}.
            </p>

            <a href="/rsvp" className="rsvp-button">
              RSVP
            </a>
          </div>

          <div className="rsvp-portrait">
            <div className="rsvp-portrait-matte">
              <Image
                src={wedding.media.galleryImages[0].src}
                alt={`${wedding.couple.nameOne} and ${wedding.couple.nameTwo}`}
                width={1920}
                height={1080}
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="rsvp-portrait-image"
              />
            </div>

            <p className="rsvp-portrait-caption">
              Jethro <span>&amp;</span> France
            </p>

            <p className="rsvp-portrait-side-note" aria-hidden="true">
              August Sixteenth · Two Thousand Twenty-Six
            </p>
          </div>
        </div>
      </section>

      <footer className="wedding-footer">
        <p>
          {wedding.couple.nameOne} <em>&amp;</em> {wedding.couple.nameTwo}
        </p>
        <span>{wedding.date.display}</span>
      </footer>
    </main>
  );
}
