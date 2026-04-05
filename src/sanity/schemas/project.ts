import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Prosjekter",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Kort beskrivelse",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "Lenke",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Rekkefølge",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Rekkefølge",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
