import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
	const allPosts = await getCollection("blog");
	const posts = allPosts
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

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
