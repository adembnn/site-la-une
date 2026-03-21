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
import { SendNewsletterAction } from "./src/sanity/actions/sendNewsletter";

export default defineConfig({
  name: "la-une-studio",
  title: "La UN'e — Studio",

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === "newsletter") {
        return [SendNewsletterAction, ...prev];
      }
      return prev;
    },
  },
});
