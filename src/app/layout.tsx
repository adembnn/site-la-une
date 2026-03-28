import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://launessec.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  title: {
    default: "La UN'e ESSEC | Journal de géopolitique par UN'ESSEC - ESSEC Business School",
    template: "%s | La UN'e ESSEC",
  },
  description:
    "La UN'e, le journal de géopolitique et de diplomatie de l'ESSEC Business School par l'association UN'ESSEC. Analyses, cartes géopolitiques et dossiers sur l'actualité internationale.",
  keywords: ["La UN'e", "La UN'e ESSEC", "UN'ESSEC", "ESSEC", "géopolitique", "diplomatie", "ESSEC Business School", "journal étudiant ESSEC", "relations internationales", "cartes géopolitiques"],
  authors: [{ name: "UN'ESSEC - ESSEC Business School" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "La UN'e par UN'ESSEC",
    title: "La UN'e ESSEC | Journal de géopolitique par UN'ESSEC",
    description: "La UN'e, le journal de géopolitique et de diplomatie de l'ESSEC Business School par UN'ESSEC.",
    images: [{ url: "/logo-unessec.jpg", width: 800, height: 600, alt: "La UN'e ESSEC - Journal UN'ESSEC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "La UN'e ESSEC | Journal de géopolitique par UN'ESSEC",
    description: "La UN'e, le journal de géopolitique et de diplomatie de l'ESSEC Business School par UN'ESSEC.",
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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-bleu-fonce to-[#004080]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-dore blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-blanc">
              Restez informé
            </h2>
            <p className="mt-3 text-blanc/60 text-lg">
              Recevez nos articles chaque semaine dans votre boîte mail.
            </p>
            <NewsletterForm variant="banner" />
          </div>
        </section>
        <Footer />
      </body>
    </html>
  );
}
