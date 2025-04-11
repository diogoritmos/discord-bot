import youtube from "./youtube";

export default {
	async fetch(req) {
		const url = new URL(req.url);
		url.pathname = "/__scheduled";
		url.searchParams.append("cron", "* * * * *");
		return new Response(
			`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`,
		);
	},

	async scheduled(event, env, ctx): Promise<void> {
		const latestVideo = (await youtube.getRecentVideos(env.YOUTUBE_CHANNEL_ID))[0];

		console.log(latestVideo);
	},
} satisfies ExportedHandler<Env>;
