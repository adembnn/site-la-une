/**
 * PAGE ARTICLE INDIVIDUEL
 *
 * URL : /articles/mon-article
 *
 * Cette page utilise les "Dynamic Routes" de Next.js :
 * - Le dossier s'appelle [slug] (avec des crochets)
 * - Next.js passe le slug comme paramètre : { params: { slug: "mon-article" } }
 * - En Next.js 16, params est une PROMISE qu'on doit await
 *
 * generateStaticParams() dit à Next.js quelles pages pré-générer :
 * → il demande à Sanity la liste de tous les slugs d'articles
 * → Next.js génère une page HTML pour chacun (= SSG)
 *
 * Le contenu riche de Sanity utilise le format "Portable Text" :
 * c'est un tableau d'objets qui décrivent le texte (paragraphes, titres, gras, etc.)
 * On utilise @portabletext/react pour le convertir en HTML.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getAllArticleSlugs } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { PortableText } from "@portabletext/react";
import { formaterTempsLecture } from "@/lib/reading-time";
import ImageLightbox from "@/components/ImageLightbox";

/**
 * Composants personnalisés pour Portable Text.
 * Permet d'afficher les images insérées dans le corps de l'article.
 */
const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <ImageLightbox
            src={urlFor(value).width(1200).quality(80).url()}
            alt={value.alt || "Image de l'article"}
            width={1200}
            height={675}
            className="rounded-lg w-full h-auto"
          />
          {value.alt && (
            <figcaption className="mt-2 text-center text-sm text-gris/60 italic">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

/**
 * generateStaticParams : dit à Next.js quelles URLs pré-générer.
 * Sans ça, Next.js ne saurait pas que /articles/mon-article existe.
 */
export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

/**
 * generateMetadata : génère les balises <title> et <meta description>
 * pour le SEO. Chaque article a son propre titre dans l'onglet du navigateur.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };
  return {
    title: article.titre,
    description: article.sousTitre || "",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. On récupère le slug depuis l'URL
  const { slug } = await params;

  // 2. On demande l'article à Sanity
  const article = await getArticleBySlug(slug);

  // 3. Si l'article n'existe pas, on affiche une page 404
  if (!article) notFound();

  // 4. On formate la date en français
  const dateFormatee = new Date(article.datePublication).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" },
  );

  // 5. On calcule le temps de lecture
  const tempsLecture = article.contenu
    ? formaterTempsLecture(article.contenu)
    : "";

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* En-tête de l'article */}
      <div className="mb-8">
        {/* Affiche toutes les catégories de l'article */}
        {article.categories && article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.categories.map((cat: { nom: string; slug: string }) => (
              <Link
                key={cat.slug}
                href={`/rubriques/${cat.slug}`}
                className="text-sm font-semibold text-bleu uppercase tracking-wider hover:text-bleu-fonce"
              >
                {cat.nom}
              </Link>
            ))}
          </div>
        )}
        <h1 className="mt-2 font-serif text-3xl md:text-4xl font-bold text-bleu-fonce leading-tight">
          {article.titre}
        </h1>
        {article.sousTitre && (
          <p className="mt-3 text-lg text-gris/70">{article.sousTitre}</p>
        )}
        <div className="mt-4 flex items-center gap-3 text-sm text-gris/60">
          {article.auteur && (
            <Link
              href={`/equipe/${article.auteur.slug}`}
              className="font-medium text-bleu-fonce hover:text-bleu"
            >
              {article.auteur.nom}
            </Link>
          )}
          <span>·</span>
          <span>{dateFormatee}</span>
          {tempsLecture && (
            <>
              <span>·</span>
              <span>{tempsLecture}</span>
            </>
          )}
          {article.estDossier && (
            <>
              <span>·</span>
              <span className="text-dore font-medium">
                Dossier de la semaine
              </span>
            </>
          )}
        </div>
      </div>

      {/* Image de couverture — cliquable pour agrandir */}
      {article.imageCouverture && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <ImageLightbox
            src={urlFor(article.imageCouverture).width(1200).quality(80).url()}
            alt={article.titre}
            width={1200}
            height={675}
            sizes="(max-width: 896px) 100vw, 896px"
            className="w-full h-auto object-cover rounded-2xl"
            priority
          />
        </div>
      )}

      {/* Séparateur doré */}
      <div className="h-0.5 bg-dore w-16 mb-8" />

      {/* Contenu riche (Portable Text) */}
      {article.contenu && (
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-bleu-fonce prose-a:text-bleu prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-10 prose-h3:mb-3 prose-p:leading-relaxed">
          <PortableText value={article.contenu} components={portableTextComponents} />
        </div>
      )}

      {/* Lien retour */}
      <div className="mt-12 pt-8 border-t border-gris/10">
        <Link
          href="/articles"
          className="text-sm font-medium text-bleu hover:text-bleu-fonce transition-colors"
        >
          ← Tous les articles
        </Link>
      </div>
    </article>
  );
}
