export const wedding = {
  couple: {
    nameOne: "Jethro Dionisio",
    nameTwo: "Francisca Domingo",
  },

  date: {
    display: "Sunday, August 16, 2026",
    ceremonyTime: "TBA",
    guestArrivalTime: "TBA",
    receptionTime: "TBA",
  },

  venue: {
    name: "Leanel's Garden Tagaytay City",
    address:
      "Daang Luma Road, Kaybagal North, 4120 Tagaytay City, Cavite, Philippines",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Leanel%27s%20Garden%20Tagaytay%20City",
  },

  dressCode: {
    title: "Pastel Formal",
    description:
      "We invite you to dress in elegant formal attire inspired by soft pastel garden tones. Please avoid white, ivory, cream, and bridal shades.",
  },

  rsvp: {
    deadline: "July 15, 2026",
    contactName: "Wedding Coordinator",
    contactNumber: "09XX XXX XXXX",
  },

  media: {
    heroImage: "/images/hero_new.jpg",

    galleryImages: [
      {
        src: "/images/gallery/01.jpg",
        alt: "Jeth and France together",
      },
      {
        src: "/images/gallery/02.jpg",
        alt: "A quiet moment shared by Jeth and France",
      },
      {
        src: "/images/gallery/03.jpg",
        alt: "Jeth and France celebrating their love",
      },
      {
        src: "/images/gallery/04.jpg",
        alt: "A pre-wedding portrait of Jeth and France",
      },
    ],

    // Leave empty if you do not want the video section to appear yet.
    videoUrl: "/videos/our-story.mp4",
    videoPoster: "/images/gallery/01.jpg",
  },
} as const;