import discord from "./discord";
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

		const content = `
		🎬 Novo vídeo no ar!
		Acabou de sair no canal @${env.YOUTUBE_CHANNEL_TITLE} 🔥

		📌 Título: ${latestVideo.title}
		📺 Assista aqui: ${latestVideo.url}

		🔁 Compartilha com quem tá nessa jornada também!
		💬 E comenta lá o que achou ou o que gostaria de ver nos próximos vídeos!
		`.trim();

		await discord.sendMessage(env.DISCORD_WEBHOOK_ID, env.DISCORD_WEBHOOK_TOKEN, content);
	},
} satisfies ExportedHandler<Env>;
