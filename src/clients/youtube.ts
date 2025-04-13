import { XMLParser } from "fast-xml-parser";

interface YoutubeVideoEntry {
	id: string;
	"yt:videoId": string;
	"yt:channelId": string;
	title: string;
	link: "string";
	author: {
		name: string;
		uri: string;
	};
	published: string;
	updated: string;
	"media:group": {
		"media:title": string;
		"media:content": string;
		"media:thumbnail": string;
		"media:description": string;
		"media:comunity": object;
	};
}

interface Video {
	id: string;
	title: string;
	url: string;
	tsPublished: Date;
}

const getRecentVideos = async (channelId: string, maxResults: number = 1): Promise<Video[]> => {
	const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
	const res = await fetch(feedUrl);
	const text = await res.text();

	console.log(`YouTube feed response: ${res.status} ${res.statusText}`);
	if (!res.ok) {
		console.error(`Error fetching YouTube feed, body: ${text}`);
		throw new Error(`Failed to fetch YouTube feed: ${res.statusText}`);
	}

	const parser = new XMLParser();
	const entries = parser.parse(text).feed.entry as YoutubeVideoEntry[];

	return entries
		.map((entry) => ({
			id: entry["yt:videoId"],
			title: entry.title,
			url: `https://www.youtube.com/watch?v=${entry["yt:videoId"]}`,
			tsPublished: new Date(entry.published),
		}))
		.slice(0, maxResults); // They're already sorted by published date
};

export default { getRecentVideos };
