/**
 * PAGE RUBRIQUE
 *
 * URL : /rubriques/europe
 *
 * Affiche tous les articles d'une catégorie donnée.
 * Pagination : 12 articles par page.
 */

import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import {
  getAllCategorieSlugs,
  getCategorieBySlug,
  getArticlesByCategorie,
} from "@/sanity/queries";
import Link from "next/link";

const ARTICLES_PAR_PAGE = 12;

export async function generateStaticParams() {
  const slugs = await getAllCategorieSlugs();
  return slugs.map((s: { slug: string }) => ({ categorie: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const cat = await getCategorieBySlug(categorie);
  if (!cat) return { title: "Rubrique introuvable" };
  return {
    title: cat.nom,
    description: `Articles de La UNE sur ${cat.nom}`,
  };
}

export default async function RubriquePage({
  params,
  searchParams,
}: {
  params: Promise<{ categorie: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { categorie } = await params;
  const sp = await searchParams;
  const pageActuelle = Math.max(1, parseInt(sp.page || "1", 10));

  const [cat, articles] = await Promise.all([
    getCategorieBySlug(categorie),
    getArticlesByCategorie(categorie),
  ]);

  if (!cat) notFound();

  // Pagination
  const totalPages = Math.ceil(articles.length / ARTICLES_PAR_PAGE);
  const debut = (pageActuelle - 1) * ARTICLES_PAR_PAGE;
  const articlesPagines = articles.slice(debut, debut + ARTICLES_PAR_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Link
        href="/articles"
        className="text-sm text-bleu hover:text-bleu-fonce transition-colors"
      >
        ← Tous les articles
      </Link>
      <AnimateOnScroll>
        <h1 className="mt-4 font-serif text-3xl md:text-4xl font-bold text-bleu-fonce">
          {cat.nom}
        </h1>
      </AnimateOnScroll>

      {articles.length === 0 ? (
        <p className="mt-8 text-gris/60">
          Aucun article dans cette rubrique pour le moment.
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesPagines.map((article: { _id: string }, i: number) => (
              <AnimateOnScroll key={article._id} delay={i * 40}>
                <ArticleCard article={article as any} />
              </AnimateOnScroll>
            ))}
          </div>

          <Pagination
            currentPage={pageActuelle}
            totalPages={totalPages}
            basePath={`/rubriques/${categorie}`}
          />
        </>
      )}
    </div>
  );
}
