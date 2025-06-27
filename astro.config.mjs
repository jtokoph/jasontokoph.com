import {
	transformerMetaHighlight,
	transformerNotationDiff,
	transformerNotationFocus,
	transformerNotationWordHighlight,
	transformerRemoveLineBreak,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	site: "https://www.jasontokoph.com",
	trailingSlash: "always",
	vite: { plugins: [tailwindcss()] },
	integrations: [icon()],
	markdown: {
		syntaxHighlight: "shiki",
		shikiConfig: {
			wrap: true,
			themes: {
				light: "one-light",
				dark: "one-dark-pro",
			},
			transformers: [
				transformerMetaHighlight(),
				transformerNotationDiff(),
				transformerNotationFocus(),
				transformerNotationWordHighlight(),
				transformerRemoveLineBreak(),
			],
		},
	},
});
