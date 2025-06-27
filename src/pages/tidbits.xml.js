import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
	const allTidbits = await getCollection("tidbits");
	const tidbits = allTidbits
		.filter((tidbit) => !tidbit.data.draft)
		.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

	return rss({
		title: "Jason Tokoph | Tidbits",
		description: "My Software Engineering Tidbits",
		site: context.site,
		items: tidbits.map((tidbit) => ({
			title: tidbit.data.title,
			link: `/tidbits/${tidbit.id}/`,
			pubDate: tidbit.data.pubDate,
			description: tidbit.data.description,
		})),
		customData: "<language>en-us</language>",
	});
}
