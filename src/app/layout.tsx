import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://site-la-une-w8a6.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "La UNE ESSEC | Journal de géopolitique par Unessec - ESSEC Business School",
    template: "%s | La UNE ESSEC",
  },
  description:
    "La UNE, le journal de géopolitique et de diplomatie de l'ESSEC Business School par l'association Unessec. Analyses, cartes géopolitiques et dossiers sur l'actualité internationale.",
  keywords: ["La UNE", "La UNE ESSEC", "Unessec", "ESSEC", "géopolitique", "diplomatie", "ESSEC Business School", "journal étudiant ESSEC", "relations internationales", "cartes géopolitiques"],
  authors: [{ name: "Unessec - ESSEC Business School" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "La UNE par Unessec",
    title: "La UNE ESSEC | Journal de géopolitique par Unessec",
    description: "La UNE, le journal de géopolitique et de diplomatie de l'ESSEC Business School par Unessec.",
    images: [{ url: "/logo-unessec.jpg", width: 800, height: 600, alt: "La UNE ESSEC - Journal Unessec" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "La UNE ESSEC | Journal de géopolitique par Unessec",
    description: "La UNE, le journal de géopolitique et de diplomatie de l'ESSEC Business School par Unessec.",
    images: ["/logo-unessec.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "7vIh-kZyes_kcIjYWdMaSYjN36fPsWp30mHtzEZ1MIc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
