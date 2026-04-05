import { client } from "./client";

export async function getJournalPosts() {
  try {
    return await client.fetch(
      `*[_type == "journal"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        location,
        publishedAt,
        tags
      }`
    );
  } catch {
    return [];
  }
}

export async function getJournalPost(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "journal" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        location,
        publishedAt,
        body,
        tags
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function getAbout() {
  try {
    return await client.fetch(
      `*[_type == "about"][0] {
        _id,
        name,
        tagline,
        bio,
        profileImage,
        skills,
        career
      }`
    );
  } catch {
    return null;
  }
}

export async function getProjects() {
  try {
    return await client.fetch(
      `*[_type == "project"] | order(order asc) {
        _id,
        title,
        description,
        url
      }`
    );
  } catch {
    return [];
  }
}
