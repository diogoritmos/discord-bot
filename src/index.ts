import contentAnnouncer from "./contentAnnouncer";

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
			default:
				throw new Error(`Unknown cron event: ${event.cron}`);
		}
	},
} satisfies ExportedHandler<Env>;
