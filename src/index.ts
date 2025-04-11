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
		const lastNotifiedVideoId = await env.KV_BINDING.get("lastNotifiedVideoId");

		if (latestVideo.id === lastNotifiedVideoId) {
			console.log("No new videos to notify.");
			return;
		}

		const content = `
		🎬 Novo vídeo no ar!
		Acabou de sair no canal @${env.YOUTUBE_CHANNEL_TITLE} 🔥

		📌 Título: ${latestVideo.title}
		📺 Assista aqui: ${latestVideo.url}

		🔁 Compartilha com quem tá nessa jornada também!
		💬 E comenta lá o que achou ou o que gostaria de ver nos próximos vídeos!
		`.trim();

		await discord.sendMessage(env.DISCORD_WEBHOOK_ID, env.DISCORD_WEBHOOK_TOKEN, content);
		console.log(`Notified about new video: ${latestVideo.title}`);

		await env.KV_BINDING.put("lastNotifiedVideoId", latestVideo.id);
		console.log(`Updated last notified video ID to: ${latestVideo.id}`);
	},
} satisfies ExportedHandler<Env>;
