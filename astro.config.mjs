import {
    transformerMetaHighlight,
    transformerNotationDiff,
    transformerNotationFocus,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkBehead from "remark-behead";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://www.jasontokoph.com",
    trailingSlash: "always",
    vite: { plugins: [tailwindcss()] },
    integrations: [icon(), sitemap()],
    markdown: {
        syntaxHighlight: "shiki",
        remarkPlugins: [[remarkBehead, { minDepth: 2 }]],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
        shikiConfig: {
            wrap: false,
            themes: {
                light: "one-light",
                dark: "one-dark-pro",
            },
            transformers: [
                transformerNotationHighlight(),
                transformerMetaHighlight(),
                transformerNotationDiff(),
                transformerNotationFocus(),
                transformerNotationWordHighlight(),
            ],
        },
    },
});