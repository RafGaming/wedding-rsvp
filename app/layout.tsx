import type { Metadata } from "next";
import { Bodoni_Moda, DM_Sans } from "next/font/google";
import { wedding } from "@/lib/wedding";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${wedding.couple.nameOne} & ${wedding.couple.nameTwo} | Wedding Invitation`,
  description: `Celebrate the wedding of ${wedding.couple.nameOne} and ${wedding.couple.nameTwo} on ${wedding.date.display}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodoni.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}