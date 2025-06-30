import { OGImageRoute } from 'astro-og-canvas';
import { defaultOGOptions } from './defaultOGOptions';

export const { getStaticPaths, GET } = OGImageRoute({
  // Tell us the name of your dynamic route segment.
  // In this case it’s `route`, because the file is named `[...route].ts`.
  param: 'route',

  pages: {
    "default": {
      title: "JasonTokoph.com",
      description: "Ramblings of a software engineer",
    },
  },

  getImageOptions: (_, page) => ({
    ...defaultOGOptions,
    title: page.title,
    description: page.description,
  }),
});
