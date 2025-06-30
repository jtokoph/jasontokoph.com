import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';
import { defaultOGOptions } from '../defaultOGOptions';

const collectionEntries = await getCollection('blog');

// Map the array of content collection entries to create an object.
// Converts [{ id: 'post.md', data: { title: 'Example', description: '' } }]
// to { 'post.md': { title: 'Example', description: '' } }
const pages = Object.fromEntries(collectionEntries.map(({ id, data }) => [id, data]));

export const { getStaticPaths, GET } = OGImageRoute({
  // Tell us the name of your dynamic route segment.
  // In this case it’s `route`, because the file is named `[...route].ts`.
  param: 'route',

  pages: pages,

  getImageOptions: (_, page) => ({
    ...defaultOGOptions,
    title: page.title,
    description: page.description,
  }),
});
