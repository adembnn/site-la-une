import { defineField, defineType } from "sanity";

export default defineType({
  name: "auteur",
  title: "Auteur",
  type: "document",
  fields: [
    defineField({
      name: "nom",
      title: "Nom complet",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "nom", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "role",
      title: "Rôle",
      type: "string",
      description: "Ex: Président(e), Rédacteur en chef, Rédacteur...",
    }),
    defineField({
      name: "pole",
      title: "Pôle",
      type: "string",
      options: {
        list: [
          { title: "Bureau", value: "Bureau" },
          { title: "Rédaction", value: "Rédaction" },
          { title: "Communication", value: "Communication" },
          { title: "Événements", value: "Événements" },
        ],
      },
    }),
    defineField({
      name: "promo",
      title: "Promo",
      type: "string",
      description: "Ex: E25, E26...",
    }),
    defineField({
      name: "bio",
      title: "Biographie",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "nom", subtitle: "role", media: "photo" },
  },
});
