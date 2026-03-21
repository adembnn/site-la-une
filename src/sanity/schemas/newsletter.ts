import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsletter",
  title: "Newsletter",
  type: "document",
  fields: [
    defineField({
      name: "objet",
      title: "Objet du mail",
      type: "string",
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: "envoye",
      title: "Envoyée",
      type: "boolean",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "dateEnvoi",
      title: "Date d'envoi",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Date d'envoi (récent)",
      name: "dateEnvoiDesc",
      by: [{ field: "dateEnvoi", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "objet",
      envoye: "envoye",
      dateEnvoi: "dateEnvoi",
    },
    prepare({ title, envoye, dateEnvoi }) {
      const status = envoye
        ? `Envoyée le ${new Date(dateEnvoi).toLocaleDateString("fr-FR")}`
        : "Brouillon";
      return {
        title: title || "Sans objet",
        subtitle: status,
      };
    },
  },
});
