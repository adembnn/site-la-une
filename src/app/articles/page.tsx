/**
 * PAGE LISTE DES ARTICLES
 *
 * Affiche tous les articles avec des filtres par rubrique.
 * Pagination : 12 articles par page, avec sélecteur de page en bas.
 */

import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getArticles, getCategories } from "@/sanity/queries";
import Link from "next/link";

const ARTICLES_PAR_PAGE = 12;

export const metadata = {
  title: "Tous les articles",
  description: "Retrouvez tous les articles de La UN'e, le journal de l'UN'ESSEC.",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const pageActuelle = Math.max(1, parseInt(params.page || "1", 10));

  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  // Pagination
  const totalPages = Math.ceil(articles.length / ARTICLES_PAR_PAGE);
  const debut = (pageActuelle - 1) * ARTICLES_PAR_PAGE;
  const articlesPagines = articles.slice(debut, debut + ARTICLES_PAR_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <AnimateOnScroll>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-bleu-fonce">
          Tous les articles
        </h1>
      </AnimateOnScroll>

      {/* Filtres par rubrique */}
      <AnimateOnScroll delay={100}>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/articles"
            className="px-4 py-2 rounded-full text-sm font-medium bg-bleu-fonce text-blanc"
          >
            Tout
          </Link>
          {categories.map((cat: { nom: string; slug: string }) => (
            <Link
              key={cat.slug}
              href={`/rubriques/${cat.slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gris-clair text-gris hover:bg-bleu hover:text-blanc transition-colors"
            >
              {cat.nom}
            </Link>
          ))}
        </div>
      </AnimateOnScroll>

      {/* Grille d'articles */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articlesPagines.map((article: any, i: number) => (
          <AnimateOnScroll key={article._id} delay={i * 80}>
            <ArticleCard article={article} />
          </AnimateOnScroll>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="mt-12 text-center text-gris/50">
          Aucun article publié pour le moment.
        </p>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pageActuelle}
        totalPages={totalPages}
        basePath="/articles"
      />
    </div>
  );
}
