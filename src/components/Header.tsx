"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SearchModal from "./SearchModal";

const rubriques = [
  { nom: "Europe", slug: "europe" },
  { nom: "Moyen-Orient & Afrique du Nord", slug: "moyen-orient-and-afrique-du-nord" },
  { nom: "Asie", slug: "asie" },
  { nom: "France", slug: "france" },
  { nom: "Etats-Unis", slug: "ameriques" },
  { nom: "Chine", slug: "chine" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bleu-fonce">
      <div className="h-0.5 bg-gradient-to-r from-dore/0 via-dore to-dore/0 animate-shimmer" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Titre */}
          <Link href="/" className="group flex items-center gap-3 whitespace-nowrap">
            <Image
              src="/logo-unessec.jpg"
              alt="Logo UN'ESSEC"
              width={44}
              height={44}
              className="rounded-full"
            />
            <span>
              <span className="font-serif text-2xl font-bold tracking-tight text-blanc">La UN&apos;e</span>
              {" "}
              <span className="text-[10px] text-dore italic">par UN&apos;ESSEC</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Recherche */}
            <SearchModal />
            <Link
              href="/articles"
              className="relative text-sm font-medium text-blanc/80 hover:text-blanc transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-dore after:transition-all after:duration-300 hover:after:w-full"
            >
              Articles
            </Link>
            <Link
              href="/rubriques/cartes"
              className="relative text-sm font-medium text-blanc/80 hover:text-blanc transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-dore after:transition-all after:duration-300 hover:after:w-full"
            >
              Nos cartes
            </Link>
            <Link
              href="/rubriques/article-court"
              className="relative text-sm font-medium text-blanc/80 hover:text-blanc transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-dore after:transition-all after:duration-300 hover:after:w-full"
            >
              Articles courts
            </Link>
            <Link
              href="/rubriques/article-long"
              className="relative text-sm font-medium text-blanc/80 hover:text-blanc transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-dore after:transition-all after:duration-300 hover:after:w-full"
            >
              Articles longs
            </Link>
            <div className="relative group">
              <button className="relative text-sm font-medium text-blanc/80 hover:text-blanc transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-dore after:transition-all after:duration-300 hover:after:w-full">
                Rubriques
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl border border-blanc/10 bg-blanc/90 backdrop-blur-xl shadow-2xl shadow-bleu-fonce/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="p-2">
                  {rubriques.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/rubriques/${r.slug}`}
                      className="block px-4 py-2.5 rounded-lg text-sm text-gris hover:bg-bleu/10 hover:text-bleu-fonce transition-all duration-200"
                    >
                      {r.nom}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/equipe"
              className="relative text-sm font-medium text-blanc/80 hover:text-blanc transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-dore after:transition-all after:duration-300 hover:after:w-full"
            >
              Notre équipe
            </Link>
            <Link
              href="/a-propos"
              className="relative text-sm font-medium text-blanc/80 hover:text-blanc transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-dore after:transition-all after:duration-300 hover:after:w-full"
            >
              À propos
            </Link>
          </nav>

          {/* Recherche mobile + Bouton menu mobile */}
          <div className="flex items-center gap-1 md:hidden">
            <SearchModal mobile />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-blanc/80 hover:text-dore transition-colors"
              aria-label="Menu"
            >
              <svg
                className={`w-6 h-6 transition-transform duration-300 ${menuOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile animé */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-bleu-fonce/95 backdrop-blur-md border-t border-blanc/10 px-4 pb-4">
          <Link
            href="/articles"
            className="block py-3 text-sm text-blanc/80 hover:text-dore transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Articles
          </Link>
          <Link
            href="/rubriques/cartes"
            className="block py-3 text-sm text-blanc/80 hover:text-dore transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Nos cartes
          </Link>
          <Link
            href="/rubriques/article-court"
            className="block py-3 text-sm text-blanc/80 hover:text-dore transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Articles courts
          </Link>
          <Link
            href="/rubriques/article-long"
            className="block py-3 text-sm text-blanc/80 hover:text-dore transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Articles longs
          </Link>
          <p className="py-2 text-xs font-semibold text-dore uppercase tracking-wider">
            Rubriques
          </p>
          {rubriques.map((r) => (
            <Link
              key={r.slug}
              href={`/rubriques/${r.slug}`}
              className="block py-2 pl-4 text-sm text-blanc/70 hover:text-dore transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {r.nom}
            </Link>
          ))}
          <Link
            href="/equipe"
            className="block py-3 text-sm text-blanc/80 hover:text-dore transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Notre Équipe
          </Link>
          <Link
            href="/a-propos"
            className="block py-3 text-sm text-blanc/80 hover:text-dore transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            À propos
          </Link>
        </nav>
      </div>
    </header>
  );
}
