/**
 * COMPOSANT ArticleCard
 *
 * C'est un composant RÉUTILISABLE qui affiche un article sous forme de carte.
 * Il a 3 variantes :
 * - "default"    : carte verticale classique (image en haut, texte en bas)
 * - "large"      : grande carte avec fond dégradé (pour l'article principal)
 * - "horizontal" : carte en ligne (image à gauche, texte à droite)
 *
 * Les données viennent de Sanity, où :
 * - article.auteur est un OBJET { nom, slug } (car c'est une référence)
 * - article.categorie est aussi un OBJET { nom, slug }
 * - article.datePublication est une string ISO (ex: "2026-03-15T10:00:00Z")
 *
 * On utilise toLocaleDateString() pour formater la date en français :
 * "2026-03-15T10:00:00Z" → "15 mars 2026"
 */

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { calculerTempsLecture } from "@/lib/reading-time";

type Article = {
  titre: string;
  slug: string;
  categories?: { nom: string; slug: string }[];
  categorie?: { nom: string; slug: string };
  auteur?: { nom: string; slug: string };
  datePublication?: string;
  categorieSlug?: string;
  date?: string;
  imageCouverture?: any;
  contenu?: any[];
};

type Props = {
  article: Article;
  variant?: "default" | "large" | "horizontal";
};

/**
 * Formate une date ISO en français
 * "2026-03-15T10:00:00Z" → "15 mars 2026"
 */
function formaterDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArticleCard({ article, variant = "default" }: Props) {
  // On prend la PREMIÈRE catégorie du tableau pour l'affichage principal
  // (compatible avec l'ancien format à catégorie unique)
  const premiereCat = article.categories?.[0] || article.categorie;
  const catSlug = premiereCat?.slug || article.categorieSlug || "";
  const catNom = premiereCat?.nom || "";
  const auteurNom = article.auteur?.nom || "";
  const date = formaterDate(article.datePublication) || article.date || "";
  const tempsLecture = article.contenu
    ? `${calculerTempsLecture(article.contenu)} min`
    : "";

  if (variant === "large") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group relative block h-full min-h-[400px] rounded-2xl overflow-hidden shadow-md shadow-bleu-fonce/5 hover:shadow-2xl hover:shadow-bleu-fonce/15 transition-all duration-500"
      >
        {article.imageCouverture ? (
          <Image
            src={urlFor(article.imageCouverture).width(800).quality(75).url()}
            alt={article.titre}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-bleu-fonce via-[#004080] to-bleu transition-all duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-8">
          {catNom && (
            <span className={`border-l-[2px] border-dore pl-2 text-xs font-bold uppercase tracking-widest text-dore mb-3`}>
              {catNom}
            </span>
          )}
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-blanc leading-snug group-hover:text-dore-clair transition-colors duration-300">
            {article.titre}
          </h3>
          <div className="mt-4 flex items-center gap-3 text-sm text-blanc/50">
            {auteurNom && <span>{auteurNom}</span>}
            {auteurNom && date && <span className="w-1 h-1 rounded-full bg-dore" />}
            {date && <span>{date}</span>}
            {tempsLecture && (date || auteurNom) && <span className="w-1 h-1 rounded-full bg-dore" />}
            {tempsLecture && <span>{tempsLecture}</span>}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex flex-col sm:flex-row gap-5 bg-blanc rounded-2xl border border-gris/8 p-5 hover:shadow-xl hover:shadow-bleu-fonce/8 hover:-translate-y-1 transition-all duration-500"
      >
        <div className="relative w-full sm:w-40 h-32 sm:h-auto rounded-xl bg-gradient-to-br from-gris-clair to-gris-clair/50 shrink-0 overflow-hidden">
          {article.imageCouverture ? (
            <Image
              src={urlFor(article.imageCouverture).width(400).quality(75).url()}
              alt={article.titre}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-gris/20 text-xs">Image</span>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          {catNom && (
            <span className={`border-l-[2px] border-dore pl-2 text-xs font-bold uppercase tracking-widest text-dore`}>
              {catNom}
            </span>
          )}
          <h3 className="mt-2 font-serif text-lg font-semibold text-bleu-fonce leading-snug group-hover:text-bleu transition-colors duration-300">
            {article.titre}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-xs text-gris/50">
            {auteurNom && <span>{auteurNom}</span>}
            {auteurNom && date && <span className="w-1 h-1 rounded-full bg-dore" />}
            {date && <span>{date}</span>}
            {tempsLecture && (date || auteurNom) && <span className="w-1 h-1 rounded-full bg-dore" />}
            {tempsLecture && <span>{tempsLecture}</span>}
          </div>
        </div>
      </Link>
    );
  }

  // Variante par défaut : carte verticale
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block bg-blanc rounded-2xl border border-gris/8 overflow-hidden hover:shadow-xl hover:shadow-bleu-fonce/8 hover:-translate-y-2 transition-all duration-500"
    >
      <div className="relative h-48 bg-gradient-to-br from-gris-clair to-gris-clair/50 overflow-hidden">
        {article.imageCouverture ? (
          <Image
            src={urlFor(article.imageCouverture).width(600).quality(75).url()}
            alt={article.titre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-gris/20 text-sm">Image</span>
        )}
      </div>
      <div className="p-5">
        {catNom && (
          <span className={`border-l-[2px] border-dore pl-2 text-xs font-bold uppercase tracking-widest text-dore`}>
            {catNom}
          </span>
        )}
        <h3 className="mt-2 font-serif text-lg font-semibold text-bleu-fonce leading-snug group-hover:text-bleu transition-colors duration-300">
          {article.titre}
        </h3>
        <div className="mt-3 flex items-center gap-2 text-xs text-gris/50">
          {auteurNom && <span>{auteurNom}</span>}
          {auteurNom && date && <span className="w-1 h-1 rounded-full bg-dore" />}
          {date && <span>{date}</span>}
          {tempsLecture && (date || auteurNom) && <span className="w-1 h-1 rounded-full bg-dore" />}
          {tempsLecture && <span>{tempsLecture}</span>}
        </div>
      </div>
    </Link>
  );
}
