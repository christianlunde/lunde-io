import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "Om meg",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Kort setning om hva du gjør, f.eks. \"Product designer building thoughtful digital products.\"",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "profileImage",
      title: "Profilbilde",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "skills",
      title: "Ferdigheter",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "career",
      title: "Karriere",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "company",
              title: "Firma",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Rolle",
              type: "string",
            }),
            defineField({
              name: "year",
              title: "Årstall",
              type: "string",
              description: "F.eks. \"2022\" eller \"2020–2022\"",
            }),
            defineField({
              name: "description",
              title: "Beskrivelse",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "company", subtitle: "role" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "name", media: "profileImage" },
  },
});
