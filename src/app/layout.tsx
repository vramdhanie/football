import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_DESCRIPTION =
  "Vincent Ramdhanie's personal tracker for his favourite European football teams — " +
  "fixtures, results, standings, and top scorers across the Premier League, " +
  "Bundesliga, La Liga, and Ligue 1.";

export const metadata: Metadata = {
  metadataBase: new URL("https://football.vincentramdhanie.com"),
  title: {
    default: "My Football — Vincent Ramdhanie",
    template: "%s — My Football",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: "Vincent Ramdhanie", url: "https://vincentramdhanie.com" }],
  creator: "Vincent Ramdhanie",
  manifest: "/site.webmanifest",
  openGraph: {
    title: "My Football — Vincent Ramdhanie",
    description: SITE_DESCRIPTION,
    url: "https://football.vincentramdhanie.com",
    siteName: "My Football",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
