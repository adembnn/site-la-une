/**
 * REQUÊTES GROQ
 *
 * GROQ = "Graph-Relational Object Queries"
 * C'est le langage de requête de Sanity (comme SQL pour les bases de données).
 *
 * Syntaxe de base :
 * - *[]           → sélectionne TOUS les documents
 * - *[_type == "article"]  → filtre : uniquement les documents de type "article"
 * - {titre, slug} → projection : ne récupère QUE ces champs (comme SELECT en SQL)
 * - ordre : | order(datePublication desc) → trier par date décroissante
 * - référence : auteur-> signifie "va chercher le document lié" (comme un JOIN en SQL)
 *
 * Exemple concret :
 *   *[_type == "article"] | order(datePublication desc) { titre, auteur->{ nom } }
 *   → "Donne-moi tous les articles, triés du plus récent au plus ancien,
 *      avec leur titre et le nom de l'auteur"
 */

import { client } from "./client";

// ============================================================
// ARTICLES
// ============================================================

/**
 * Récupère TOUS les articles, triés du plus récent au plus ancien.
 *
 * Détail de la requête :
 * - *[_type == "article"]  → filtre les documents de type "article"
 * - | order(datePublication desc)  → trie par date (récent d'abord)
 * - { ... }  → projection : on choisit quels champs récupérer
 * - slug.current  → le slug est un objet { current: "mon-slug" }, on prend juste la valeur
 * - categorie->{ nom, "slug": slug.current }  → on suit la RÉFÉRENCE vers la catégorie
 *   et on récupère son nom et son slug
 * - auteur->{ nom, "slug": slug.current }  → pareil pour l'auteur
 */
/**
 * Version LÉGÈRE pour les pages de listing (accueil, articles, rubriques).
 * Ne récupère PAS le contenu complet (trop lourd pour une liste).
 */
export async function getArticles() {
  return client.fetch(
    `*[_type == "article"] | order(datePublication desc) {
      _id,
      titre,
      sousTitre,
      "slug": slug.current,
      datePublication,
      estDossier,
      imageCouverture,
      "categories": categories[]->{ nom, "slug": slug.current },
      "auteur": auteur->{ nom, "slug": slug.current }
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

/**
 * Version COMPLÈTE avec contenu — uniquement pour les pages individuelles
 * et les endroits où on a besoin du temps de lecture.
 */
export async function getArticlesAvecContenu() {
  return client.fetch(
    `*[_type == "article"] | order(datePublication desc) {
      _id,
      titre,
      sousTitre,
      "slug": slug.current,
      datePublication,
      estDossier,
      imageCouverture,
      contenu,
      "categories": categories[]->{ nom, "slug": slug.current },
      "auteur": auteur->{ nom, "slug": slug.current }
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

/**
 * Récupère UN article par son slug.
 *
 * - slug.current == $slug  → $slug est un PARAMÈTRE qu'on passe à la requête
 *   (comme un "?" en SQL préparé — ça évite les injections)
 * - [0]  → on prend le premier résultat (un slug est unique, donc il n'y en a qu'un)
 * - contenu[]  → le contenu riche (texte, images, etc.)
 */
export async function getArticleBySlug(slug: string) {
  return client.fetch(
    `*[_type == "article" && slug.current == $slug][0] {
      _id,
      titre,
      sousTitre,
      "slug": slug.current,
      datePublication,
      estDossier,
      imageCouverture,
      contenu,
      "categories": categories[]->{ nom, "slug": slug.current },
      "auteur": auteur->{ nom, "slug": slug.current, photo, role, promo }
    }`,
    { slug },
    { next: { revalidate: 60 } },
  );
}

/**
 * Récupère les articles d'une CATÉGORIE donnée.
 *
 * - categorie->slug.current == $slug  → on SUIT la référence vers la catégorie
 *   et on compare son slug. C'est comme un WHERE avec un JOIN en SQL.
 */
export async function getArticlesByCategorie(categorieSlug: string) {
  return client.fetch(
    `*[_type == "article" && $slug in categories[]->slug.current] | order(datePublication desc) {
      _id,
      titre,
      "slug": slug.current,
      datePublication,
      estDossier,
      imageCouverture,
      "categories": categories[]->{ nom, "slug": slug.current },
      "auteur": auteur->{ nom, "slug": slug.current }
    }`,
    { slug: categorieSlug },
    { next: { revalidate: 60 } },
  );
}

/**
 * Récupère les articles d'un AUTEUR donné.
 * Même logique que ci-dessus mais on filtre par auteur.
 */
export async function getArticlesByAuteur(auteurSlug: string) {
  return client.fetch(
    `*[_type == "article" && auteur->slug.current == $slug] | order(datePublication desc) {
      _id,
      titre,
      "slug": slug.current,
      datePublication,
      estDossier,
      imageCouverture,
      "categories": categories[]->{ nom, "slug": slug.current },
      "auteur": auteur->{ nom, "slug": slug.current }
    }`,
    { slug: auteurSlug },
    { next: { revalidate: 60 } },
  );
}

// ============================================================
// TOUS LES SLUGS (pour generateStaticParams)
// ============================================================

/**
 * Next.js a besoin de connaître TOUS les slugs à l'avance pour
 * pré-générer les pages statiques (SSG = Static Site Generation).
 *
 * generateStaticParams() dans chaque page appelle ces fonctions
 * pour dire à Next.js : "voici toutes les URLs possibles".
 */
export async function getAllArticleSlugs() {
  return client.fetch(`*[_type == "article"]{ "slug": slug.current }`);
}

export async function getAllCategorieSlugs() {
  return client.fetch(`*[_type == "categorie"]{ "slug": slug.current }`);
}

export async function getAllAuteurSlugs() {
  return client.fetch(`*[_type == "auteur"]{ "slug": slug.current }`);
}

// ============================================================
// CATÉGORIES
// ============================================================

export async function getCategories() {
  return client.fetch(
    `*[_type == "categorie"] | order(nom asc) {
      _id,
      nom,
      "slug": slug.current,
      description
    }`,
    {},
    { next: { revalidate: 300 } },
  );
}

export async function getCategorieBySlug(slug: string) {
  return client.fetch(
    `*[_type == "categorie" && slug.current == $slug][0] {
      _id,
      nom,
      "slug": slug.current,
      description
    }`,
    { slug },
  );
}

// ============================================================
// AUTEURS (MEMBRES)
// ============================================================

export async function getMembres() {
  return client.fetch(
    `*[_type == "auteur"] | order(nom asc) {
      _id,
      nom,
      "slug": slug.current,
      photo,
      role,
      pole,
      promo,
      bio
    }`,
    {},
    { next: { revalidate: 300 } },
  );
}

/**
 * Récupère tous les articles avec les champs nécessaires pour la recherche.
 * On inclut le contenu pour calculer le temps de lecture côté client.
 */
/**
 * Récupère des articles similaires (même catégorie, sauf l'article actuel).
 * Limité à 4 résultats pour la sidebar "À lire aussi".
 */
export async function getArticlesSimilaires(articleId: string, categorySlugs: string[]) {
  return client.fetch(
    `*[_type == "article" && _id != $id && count((categories[]->slug.current)[@ in $slugs]) > 0] | order(datePublication desc) [0...4] {
      _id,
      titre,
      "slug": slug.current,
      datePublication,
      imageCouverture,
      "categories": categories[]->{ nom, "slug": slug.current },
      "auteur": auteur->{ nom, "slug": slug.current }
    }`,
    { id: articleId, slugs: categorySlugs },
    { next: { revalidate: 60 } },
  );
}

export async function getArticlesForSearch() {
  return client.fetch(
    `*[_type == "article"] | order(datePublication desc) {
      titre,
      sousTitre,
      "slug": slug.current,
      datePublication,
      "categories": categories[]->{ nom, "slug": slug.current },
      "auteur": auteur->{ nom },
      "contenuTexte": pt::text(contenu)
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

export async function getMembreBySlug(slug: string) {
  return client.fetch(
    `*[_type == "auteur" && slug.current == $slug][0] {
      _id,
      nom,
      "slug": slug.current,
      photo,
      role,
      pole,
      promo,
      bio
    }`,
    { slug },
  );
}

export async function getArticlesForRSS() {
  return client.fetch(
    `*[_type == "article"] | order(datePublication desc) [0...20] {
      titre,
      sousTitre,
      "slug": slug.current,
      datePublication,
      "categories": categories[]->{ nom }
    }`,
    {},
    { next: { revalidate: 3600 } },
  );
}
