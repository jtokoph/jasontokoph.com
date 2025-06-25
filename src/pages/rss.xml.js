import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
	const posts = await getCollection("blog");
	return rss({
		title: "Jason Tokoph | Blog",
		description: "My Software Engineering Blog",
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			link: `/${post.id}/`,
			pubDate: post.data.pubDate,
			description: post.data.description,
		})),
		customData: "<language>en-us</language>",
	});
}
