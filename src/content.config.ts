// Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";
// Import the glob loader
import { glob } from "astro/loaders";
// Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/blog" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      tags: z.array(z.string())
    })
});

const tidbits = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/tidbits" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      tags: z.array(z.string())
    })
});

// Export a single `collections` object to register your collection(s)
export const collections = { blog, tidbits };
