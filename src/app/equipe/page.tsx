/**
 * PAGE ÉQUIPE
 *
 * Affiche tous les membres de l'association, groupés par pôle.
 *
 * La fonction reduce() regroupe les membres :
 * - Elle parcourt la liste des membres un par un
 * - Pour chaque membre, elle vérifie si le pôle existe déjà dans l'objet
 * - Si oui, elle ajoute le membre au tableau de ce pôle
 * - Si non, elle crée un nouveau tableau pour ce pôle
 *
 * Résultat : { "Bureau": [marie, lucas], "Rédaction": [sarah, ahmed] }
 */

import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import MembrePhoto from "@/components/MembrePhoto";
import { getMembres } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export const metadata = {
  title: "L'équipe",
  description: "Découvrez les membres de l'association UN'ESSEC.",
};

type Membre = {
  _id: string;
  nom: string;
  slug: string;
  photo?: any;
  role: string;
  pole: string;
  promo: string;
};

export default async function EquipePage() {
  const membres: Membre[] = await getMembres();

  // Grouper les membres par pôle
  const poles = membres.reduce(
    (acc, membre) => {
      const pole = membre.pole || "Autre";
      if (!acc[pole]) acc[pole] = [];
      acc[pole].push(membre);
      return acc;
    },
    {} as Record<string, Membre[]>,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <AnimateOnScroll>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-bleu-fonce">
          L&apos;équipe
        </h1>
        <p className="mt-3 text-lg text-gris/70">
          Les membres de l&apos;association UN&apos;ESSEC qui font vivre La UN&apos;e chaque
          semaine.
        </p>
      </AnimateOnScroll>

      {Object.entries(poles).map(([pole, membresDuPole]) => (
        <section key={pole} className="mt-12">
          <AnimateOnScroll>
            {pole !== "Autre" && (
              <h2 className="text-sm font-semibold text-dore uppercase tracking-wider mb-6">
                {pole}
              </h2>
            )}
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {membresDuPole.map((membre, i) => (
              <AnimateOnScroll key={membre._id} delay={i * 40}>
                <Link
                  href={`/equipe/${membre.slug}`}
                  className="group block bg-blanc rounded-2xl border border-gris/8 p-6 hover:shadow-xl hover:shadow-bleu-fonce/8 hover:-translate-y-1 transition-all duration-500"
                >
                  <MembrePhoto
                    nom={membre.nom}
                    photoUrl={membre.photo ? urlFor(membre.photo).width(400).height(400).fit("crop").quality(80).url() : undefined}
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-serif text-lg font-semibold text-bleu-fonce group-hover:text-bleu transition-colors">
                      {membre.nom}
                    </h3>
                    <p className="text-sm text-dore font-medium">
                      {membre.role}
                    </p>
                    <p className="text-xs text-gris/50 mt-1">{membre.promo}</p>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </section>
      ))}

      {membres.length === 0 && (
        <p className="mt-12 text-center text-gris/50">
          Aucun membre ajouté pour le moment.
        </p>
      )}
    </div>
  );
}
