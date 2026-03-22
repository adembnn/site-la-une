/**
 * PAGE PROFIL MEMBRE
 *
 * URL : /equipe/marie-dupont
 *
 * Affiche le profil d'un membre + la liste de ses articles.
 * C'est ici qu'on utilise getArticlesByAuteur() pour lier
 * un auteur à ses articles (fonctionnalité que tu avais demandée).
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import MembrePhoto from "@/components/MembrePhoto";
import {
  getAllAuteurSlugs,
  getMembreBySlug,
  getArticlesByAuteur,
} from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export async function generateStaticParams() {
  const slugs = await getAllAuteurSlugs();
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const membre = await getMembreBySlug(slug);
  if (!membre) return { title: "Membre introuvable" };
  return {
    title: `${membre.nom} — ${membre.role || "Membre"}`,
    description: membre.bio || "",
  };
}

export default async function MembrePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // On récupère le profil ET les articles en parallèle
  const [membre, articles] = await Promise.all([
    getMembreBySlug(slug),
    getArticlesByAuteur(slug),
  ]);

  if (!membre) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Link
        href="/equipe"
        className="text-sm text-bleu hover:text-bleu-fonce transition-colors"
      >
        ← L&apos;équipe
      </Link>

      {/* Profil */}
      <AnimateOnScroll>
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <MembrePhoto
              nom={membre.nom}
              photoUrl={membre.photo ? urlFor(membre.photo).width(400).height(400).fit("crop").quality(80).url() : undefined}
              size="lg"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-serif text-3xl font-bold text-bleu-fonce">
              {membre.nom}
            </h1>
            {membre.role && (
              <p className="text-dore font-medium">{membre.role}</p>
            )}
            {membre.promo && (
              <p className="text-sm text-gris/50">{membre.promo}</p>
            )}
            {membre.bio && (
              <p className="mt-3 text-gris leading-relaxed">{membre.bio}</p>
            )}
          </div>
        </div>
      </AnimateOnScroll>

      {/* Articles de ce membre */}
      <section className="mt-12">
        <AnimateOnScroll>
          <h2 className="font-serif text-2xl font-bold text-bleu-fonce mb-6">
            Articles publiés
          </h2>
        </AnimateOnScroll>
        {articles.length === 0 ? (
          <p className="text-gris/60">Aucun article publié pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.map((article: { _id: string }, i: number) => (
              <AnimateOnScroll key={article._id} delay={i * 80}>
                <ArticleCard article={article as any} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
