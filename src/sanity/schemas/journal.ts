import { defineField, defineType } from "sanity";

export const journal = defineType({
  name: "journal",
  title: "Journal",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Kort beskrivelse",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mainImage",
      title: "Hovedbilde",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-tekst",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "location",
      title: "Sted",
      type: "string",
    }),
    defineField({
      name: "publishedAt",
      title: "Publisert",
      type: "datetime",
    }),
    defineField({
      name: "body",
      title: "Innhold",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt-tekst",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  orderings: [
    {
      title: "Publisert, nyeste først",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      media: "mainImage",
    },
    prepare({ title, location, media }) {
      return {
        title,
        subtitle: location,
        media,
      };
    },
  },
});
