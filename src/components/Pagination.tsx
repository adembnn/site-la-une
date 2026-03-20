/**
 * COMPOSANT PAGINATION — Style barre dorée élégante
 *
 * Fond bleu foncé arrondi, numéros dorés, page active avec fond doré.
 */

import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const getHref = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  return (
    <div className="mt-12 mb-12 flex flex-col items-center gap-4">
      <nav className="inline-flex items-center gap-1 bg-bleu-fonce rounded-2xl px-4 py-3 shadow-lg shadow-bleu-fonce/20" aria-label="Pagination">
        {/* Précédent */}
        {currentPage > 1 ? (
          <Link
            href={getHref(currentPage - 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-dore hover:bg-blanc/10 transition-all"
            aria-label="Page précédente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Précédent</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-blanc/20 cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Précédent</span>
          </span>
        )}

        {/* Séparateur */}
        <div className="w-px h-6 bg-blanc/10 mx-2" />

        {/* Numéros */}
        {pages.map((page, i) => {
          if (page === "...") {
            return (
              <span key={`dots-${i}`} className="flex items-center justify-center w-12 h-10 text-blanc/30 text-sm">
                …
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={getHref(page)}
              className={`flex items-center justify-center w-12 h-10 rounded-xl text-base font-bold transition-all duration-300 ${
                isActive
                  ? "bg-dore text-bleu-fonce shadow-md shadow-dore/30"
                  : "text-dore hover:bg-blanc/10"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}

        {/* Séparateur */}
        <div className="w-px h-6 bg-blanc/10 mx-2" />

        {/* Suivant */}
        {currentPage < totalPages ? (
          <Link
            href={getHref(currentPage + 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-dore hover:bg-blanc/10 transition-all"
            aria-label="Page suivante"
          >
            <span className="hidden sm:inline">Suivant</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-blanc/20 cursor-not-allowed">
            <span className="hidden sm:inline">Suivant</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </nav>
    </div>
  );
}
