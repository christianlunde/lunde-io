import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder
    .image(source)
    .auto("format") // Serve WebP/AVIF when browser supports it
    .quality(80); // Good balance between quality and size
}
