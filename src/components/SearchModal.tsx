"use client";

/**
 * COMPOSANT SearchModal
 *
 * Barre de recherche inline dans le header avec Fuse.js.
 *
 * Quand on clique sur la loupe, la barre se déploie dans le header
 * avec une animation. Les résultats s'affichent en dropdown en dessous.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

type SearchArticle = {
  titre: string;
  sousTitre?: string;
  slug: string;
  datePublication?: string;
  categories?: { nom: string; slug: string }[];
  auteur?: { nom: string };
  contenuTexte?: string;
};

// Pondération par ordre de priorité :
// 1. Titre (le plus important)
// 2. Description (sous-titre)
// 3. Contenu de l'article
const fuseOptions = {
  keys: [
    { name: "titre", weight: 0.5 },
    { name: "sousTitre", weight: 0.25 },
    { name: "contenuTexte", weight: 0.15 },
    { name: "auteur.nom", weight: 0.05 },
    { name: "categories.nom", weight: 0.05 },
  ],
  threshold: 0.5,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,  // cherche partout dans la chaîne, pas seulement au début
  findAllMatches: true,   // continue à chercher même après un premier match
};

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<SearchArticle[]>([]);
  const [results, setResults] = useState<SearchArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fuseRef = useRef<Fuse<SearchArticle> | null>(null);

  const loadArticles = useCallback(async () => {
    if (articles.length > 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search");
      const data = await res.json();
      setArticles(data);
      fuseRef.current = new Fuse(data, fuseOptions);
    } catch (err) {
      console.error("Erreur chargement articles pour recherche:", err);
    } finally {
      setLoading(false);
    }
  }, [articles.length]);

  const open = useCallback(() => {
    setIsOpen(true);
    loadArticles();
  }, [loadArticles]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  // Focus sur l'input quand la barre s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Fermer quand on clique en dehors
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  // Raccourci clavier : Ctrl+K ou Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) close();
        else open();
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close]);

  // Recherche Fuse.js
  useEffect(() => {
    if (!fuseRef.current || query.length < 2) {
      setResults([]);
      return;
    }
    const fuseResults = fuseRef.current.search(query, { limit: 8 });
    setResults(fuseResults.map((r) => r.item));
  }, [query]);

  // État fermé : juste la loupe
  if (!isOpen) {
    return (
      <button
        onClick={open}
        className="p-2 text-dore hover:text-blanc transition-colors"
        aria-label="Rechercher"
        title="Rechercher (⌘K)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    );
  }

  // État ouvert : barre de recherche inline
  return (
    <div ref={containerRef} className="relative">
      {/* Barre de recherche inline */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blanc/10 backdrop-blur-sm border border-blanc/20">
        <svg className="w-4 h-4 text-blanc/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher"
          className="w-48 lg:w-64 text-sm text-blanc placeholder:text-blanc/40 outline-none bg-transparent"
        />
        <button
          onClick={close}
          className="p-0.5 text-blanc/50 hover:text-blanc transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Résultats dropdown */}
      {(results.length > 0 || (query.length >= 2 && results.length === 0) || loading) && (
        <div className="absolute top-full right-0 mt-2 w-80 lg:w-96 bg-blanc rounded-xl shadow-2xl shadow-bleu-fonce/20 border border-gris/10 overflow-hidden z-50">
          <div className="max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="px-5 py-6 text-center text-sm text-gris/50">
                Chargement...
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="px-5 py-6 text-center text-sm text-gris/50">
                Aucun résultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
              </div>
            )}

            {results.length > 0 && (
              <ul className="py-2">
                {results.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/articles/${article.slug}`}
                      onClick={close}
                      className="flex flex-col gap-1 px-5 py-3 hover:bg-bleu/5 transition-colors"
                    >
                      <span className="text-sm font-medium text-bleu-fonce leading-snug">
                        {article.titre}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-gris/50">
                        {article.auteur?.nom && <span>{article.auteur.nom}</span>}
                        {article.auteur?.nom && article.categories?.[0] && (
                          <span className="w-1 h-1 rounded-full bg-dore" />
                        )}
                        {article.categories?.[0] && (
                          <span className="text-dore">{article.categories[0].nom}</span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
