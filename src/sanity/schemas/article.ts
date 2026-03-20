import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "titre",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "titre", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sousTitre",
      title: "Sous-titre / Chapô",
      type: "text",
      rows: 2,
      description: "Résumé court affiché sous le titre",
    }),
    defineField({
      name: "auteur",
      title: "Auteur",
      type: "reference",
      to: [{ type: "auteur" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Catégories / Rubriques",
      type: "array",
      of: [{ type: "reference", to: [{ type: "categorie" }] }],
      description: "Tu peux sélectionner plusieurs catégories",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "datePublication",
      title: "Date de publication",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imageCouverture",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "estDossier",
      title: "Dossier de la semaine ?",
      type: "boolean",
      description: "Cocher si c'est l'article long de la semaine",
      initialValue: false,
    }),
    defineField({
      name: "contenu",
      title: "Contenu",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Titre 2", value: "h2" },
            { title: "Titre 3", value: "h3" },
            { title: "Citation", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Légende",
              type: "string",
            },
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Date de publication (récent)",
      name: "dateDesc",
      by: [{ field: "datePublication", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "titre",
      subtitle: "auteur.nom",
      media: "imageCouverture",
    },
  },
});
