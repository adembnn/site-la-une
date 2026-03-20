/**
 * Page du Sanity Studio
 *
 * Cette page affiche l'interface d'administration Sanity.
 * Le chemin [[...tool]] est un "catch-all" optionnel en Next.js :
 * - /studio           → affiche le Studio (page d'accueil)
 * - /studio/structure  → affiche l'outil de structure
 * - /studio/vision     → affiche l'outil de requêtes
 *
 * NextStudio est un composant fourni par next-sanity qui intègre
 * automatiquement le Studio dans ton app Next.js.
 */

"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
