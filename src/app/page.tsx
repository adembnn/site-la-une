/**
 * PAGE D'ACCUEIL
 *
 * C'est une page "Server Component" (par défaut dans Next.js App Router).
 * Ça veut dire que le code s'exécute côté SERVEUR, pas dans le navigateur.
 *
 * Avantage : on peut faire des appels à Sanity directement ici avec await,
 * sans useEffect ni useState. C'est plus simple et plus performant.
 *
 * Le flux :
 * 1. Next.js exécute cette fonction côté serveur
 * 2. getArticles() envoie une requête GROQ à Sanity
 * 3. Sanity répond avec les articles en JSON
 * 4. On passe les données aux composants React
 * 5. Next.js génère le HTML et l'envoie au navigateur
 */

import Link from "next/link";
import Image from "next/image";
import ArticleCard from "@/components/ArticleCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NewsletterForm from "@/components/NewsletterForm";
import { getArticles } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export default async function Home() {
  // On récupère TOUS les articles depuis Sanity (triés par date)
  const articles = await getArticles();

  // === LOGIQUE DE TRI PAR SEMAINE ===
  //
  // 1. On calcule le début de la semaine actuelle (lundi 00h00)
  // 2. On cherche les articles publiés CETTE semaine
  // 3. Si aucun article cette semaine → on prend ceux de la semaine dernière
  // 4. Les articles plus anciens vont dans "Tous nos articles"

  const maintenant = new Date();
  // getDay() : 0=dimanche, 1=lundi... On veut le lundi comme début de semaine
  const jourSemaine = maintenant.getDay();
  const decalage = jourSemaine === 0 ? 6 : jourSemaine - 1; // dimanche = 6 jours en arrière
  const debutSemaine = new Date(maintenant);
  debutSemaine.setDate(maintenant.getDate() - decalage);
  debutSemaine.setHours(0, 0, 0, 0);

  // Début de la semaine dernière (7 jours avant le début de cette semaine)
  const debutSemaineDerniere = new Date(debutSemaine);
  debutSemaineDerniere.setDate(debutSemaine.getDate() - 7);

  // Articles de cette semaine
  let articlesSemaine = articles.filter(
    (a: any) => new Date(a.datePublication) >= debutSemaine,
  );

  // Si aucun article cette semaine → on prend ceux de la semaine dernière
  if (articlesSemaine.length === 0) {
    articlesSemaine = articles.filter(
      (a: any) => {
        const date = new Date(a.datePublication);
        return date >= debutSemaineDerniere && date < debutSemaine;
      },
    );
  }

  // Le dossier = le dernier article de la semaine ayant la catégorie "Article long"
  const articleLong = articlesSemaine.find(
    (a: any) =>
      a.categories?.some(
        (cat: { slug: string }) => cat.slug === "article-long",
      ),
  );

  // Articles courts de la semaine (tous sauf le dossier)
  const articlesCourts = articlesSemaine.filter(
    (a: any) => a._id !== articleLong?._id,
  );

  // La dernière carte publiée (catégorie "cartes")
  const derniereCarte = articles.find(
    (a: any) =>
      a.categories?.some(
        (cat: { slug: string }) => cat.slug === "cartes",
      ),
  );

  // Articles anciens = tous ceux qui ne sont PAS dans la semaine affichée
  const idsAffiches = new Set(articlesSemaine.map((a: any) => a._id));
  const articlesAnciens = articles.filter(
    (a: any) => !idsAffiches.has(a._id),
  );

  return (
    <div>
      {/* Hero plein écran avec gradient overlay */}
      {articleLong && (
        <section className="relative min-h-[85vh] flex items-end overflow-hidden">
          {/* Image de fond de l'article */}
          {articleLong.imageCouverture ? (
            <>
              <Image
                src={urlFor(articleLong.imageCouverture).width(1920).quality(80).url()}
                alt={articleLong.titre}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              {/* Gradient sombre par-dessus l'image pour la lisibilité du texte */}
              <div className="absolute inset-0 bg-gradient-to-t from-bleu-fonce via-bleu-fonce/80 to-bleu-fonce/30" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-bleu-fonce via-[#004080] to-bleu-fonce" />
          )}

          <div className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
            <AnimateOnScroll>
              <p className="border-l-[3px] border-dore pl-3 text-dore text-base font-bold uppercase tracking-widest mb-6">
                Dossier de la semaine
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={100}>
              <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-blanc text-balance tracking-tight">
                {articleLong.titre}
              </h1>
            </AnimateOnScroll>
            {articleLong.auteur && (
              <AnimateOnScroll delay={150}>
                <p className="mt-4 text-base font-sans font-medium text-blanc/50 tracking-wide uppercase">
                  Par {articleLong.auteur.nom}
                </p>
              </AnimateOnScroll>
            )}
            <AnimateOnScroll delay={200}>
              <p className="mt-4 text-xl text-blanc/60 leading-relaxed text-balance font-sans font-light">
                {articleLong.sousTitre}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/articles/${articleLong.slug}`}
                  className="group inline-flex items-center gap-2 bg-dore text-bleu-fonce font-semibold px-8 py-4 rounded-xl hover:bg-blanc hover:shadow-xl hover:shadow-dore/20 transition-all duration-300"
                >
                  Lire le dossier
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="flex items-center gap-3 text-sm text-blanc/40">
                  <span>
                    {new Date(articleLong.datePublication).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" className="w-full">
              <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
            </svg>
          </div>
        </section>
      )}

      {/* Notre dernière carte */}
      {derniereCarte && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-8">
          <AnimateOnScroll>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-bleu-fonce">
                Notre dernière carte
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-dore/40 to-transparent" />
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <Link href={`/articles/${derniereCarte.slug}`} className="group block">
              <div className="bg-dore-clair/30 rounded-2xl p-6 md:p-10 border border-dore/20 hover:shadow-xl hover:shadow-dore/10 transition-all duration-500">
                {/* Image centrée — taille réelle, bordure dorée */}
                <div className="rounded-xl overflow-hidden border-2 border-dore/30 shadow-lg shadow-bleu-fonce/5">
                  {derniereCarte.imageCouverture ? (
                    <Image
                      src={urlFor(derniereCarte.imageCouverture).width(1600).quality(85).url()}
                      alt={derniereCarte.titre}
                      width={1600}
                      height={933}
                      sizes="(max-width: 1280px) 100vw, 1200px"
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gris/20 bg-gris-clair">Image</div>
                  )}
                </div>
                {/* Séparateur doré */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-dore/50 to-transparent mt-8 mb-6" />
                {/* Infos en dessous — centré */}
                <div className="text-center">
                  <span className="text-dore text-xs font-bold uppercase tracking-widest">
                    Cartes
                  </span>
                  <h3 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-bleu-fonce leading-snug group-hover:text-bleu transition-colors duration-300">
                    {derniereCarte.titre}
                  </h3>
                  <div className="mt-4 flex items-center justify-center gap-3 text-sm text-gris/50">
                    {derniereCarte.auteur?.nom && <span>{derniereCarte.auteur.nom}</span>}
                    {derniereCarte.auteur?.nom && derniereCarte.datePublication && (
                      <span className="w-1 h-1 rounded-full bg-dore" />
                    )}
                    {derniereCarte.datePublication && (
                      <span>
                        {new Date(derniereCarte.datePublication).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div className="mt-8 text-center">
              <Link
                href="/rubriques/cartes"
                className="group inline-flex items-center justify-center gap-3 bg-dore text-bleu-fonce font-semibold px-8 py-4 rounded-xl hover:bg-blanc hover:shadow-xl hover:shadow-dore/20 transition-all duration-300"
              >
                Toutes nos cartes
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimateOnScroll>
        </section>
      )}

      {/* Articles courts — grille asymétrique */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <AnimateOnScroll>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-bleu-fonce">
              Cette semaine
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-dore/40 to-transparent" />
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {articlesCourts[0] && (
            <AnimateOnScroll className="lg:col-span-7 lg:row-span-2">
              <ArticleCard article={articlesCourts[0]} variant="large" />
            </AnimateOnScroll>
          )}
          {articlesCourts[1] && (
            <AnimateOnScroll delay={100} className="lg:col-span-5">
              <ArticleCard article={articlesCourts[1]} variant="horizontal" />
            </AnimateOnScroll>
          )}
          {articlesCourts[2] && (
            <AnimateOnScroll delay={200} className="lg:col-span-5">
              <ArticleCard article={articlesCourts[2]} variant="horizontal" />
            </AnimateOnScroll>
          )}
          {articlesCourts[3] && (
            <AnimateOnScroll delay={300} className="lg:col-span-12">
              <ArticleCard article={articlesCourts[3]} variant="horizontal" />
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* Tous nos articles — les articles des semaines précédentes */}
      {articlesAnciens.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 border-t border-gris/10">
          <AnimateOnScroll>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-bleu-fonce">
                  Tous nos articles
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-dore/40 to-transparent" />
              </div>
              <Link
                href="/articles"
                className="text-sm font-medium text-bleu hover:text-bleu-fonce transition-colors"
              >
                Voir tout →
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesAnciens.slice(0, 6).map((article: any, i: number) => (
              <AnimateOnScroll key={article._id} delay={i * 80}>
                <ArticleCard article={article} />
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll>
            <div className="mt-12 text-center">
              <Link
                href="/articles"
                className="group inline-flex items-center justify-center gap-2 bg-dore text-bleu-fonce font-semibold px-8 py-4 rounded-xl hover:bg-blanc hover:shadow-xl hover:shadow-dore/20 transition-all duration-300"
              >
                Lire plus
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </AnimateOnScroll>
        </section>
      )}

      {/* Bandeau newsletter */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bleu-fonce to-[#004080]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-dore blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <AnimateOnScroll>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-blanc">
              Restez informé
            </h2>
            <p className="mt-3 text-blanc/60 text-lg">
              Recevez nos articles chaque semaine dans votre boîte mail.
            </p>
            <NewsletterForm variant="banner" />
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
