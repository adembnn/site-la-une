/**
 * Configuration de Sanity Studio
 *
 * Sanity Studio est l'interface d'administration où les rédacteurs
 * écrivent et publient les articles. On le configure ici avec :
 * - Le nom du projet (affiché dans le Studio)
 * - L'ID du projet et le dataset (pour savoir OÙ stocker les données)
 * - Les schémas (la STRUCTURE des contenus : articles, auteurs, catégories)
 *
 * Ce fichier est lu par Next.js pour intégrer le Studio dans le site
 * sur la route /studio
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { projectId, dataset } from "./src/sanity/env";

export default defineConfig({
  // Le nom affiché dans le Studio
  name: "la-une-studio",
  title: "La UNE — Studio",

  // Connexion au projet Sanity
  projectId,
  dataset,

  // Plugins :
  // - structureTool : l'interface pour gérer les contenus (liste, édition, etc.)
  // - visionTool : un outil pour tester des requêtes GROQ (le langage de requête de Sanity)
  plugins: [structureTool(), visionTool()],

  // Les schémas qu'on a définis (article, auteur, catégorie)
  schema: {
    types: schemaTypes,
  },
});
