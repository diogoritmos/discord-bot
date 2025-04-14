import contentAnnouncer from "./contentAnnouncer";
import exerciseRanker from "./exerciseRanker";
import jobFinder from "./jobFinder";

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
		switch (event.cron) {
			case "*/5 * * * *":
				await contentAnnouncer.main(env);
				break;
			case "0 22 * * SUN":
				await exerciseRanker.main(env);
				break;
			case "0 10 * * MON-FRI":
				await jobFinder.main(env);
				break;
			default:
				throw new Error(`Unknown cron event: ${event.cron}`);
		}
	},
} satisfies ExportedHandler<Env>;
