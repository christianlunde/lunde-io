import { defineField, defineType } from "sanity";

export const destination = defineType({
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      name: "country",
      title: "Country",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Short description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "mapCenter",
      title: "Map center coordinates",
      type: "object",
      fields: [
        defineField({ name: "lat", title: "Latitude", type: "number" }),
        defineField({ name: "lng", title: "Longitude", type: "number" }),
      ],
    }),
    defineField({
      name: "places",
      title: "Places",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  "Café",
                  "Restaurant",
                  "Bar",
                  "Hotel",
                  "Shop",
                  "Experience",
                  "Museum",
                  "Nature",
                  "Street food",
                  "Viewpoint",
                ],
              },
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "address",
              title: "Address",
              type: "string",
            }),
            defineField({
              name: "googleMapsUrl",
              title: "Google Maps URL",
              type: "url",
            }),
            defineField({
              name: "coordinates",
              title: "Coordinates",
              type: "object",
              fields: [
                defineField({ name: "lat", title: "Latitude", type: "number" }),
                defineField({ name: "lng", title: "Longitude", type: "number" }),
              ],
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "publishedAt",
              title: "Visit date",
              type: "date",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "category",
              media: "image",
            },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Title A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      country: "country",
      media: "coverImage",
    },
    prepare({ title, country, media }) {
      return {
        title,
        subtitle: country,
        media,
      };
    },
  },
});
