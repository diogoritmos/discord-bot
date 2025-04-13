import discord from "./clients/discord";
import youtube from "./clients/youtube";

const main = async (env: Env) => {
	console.log("Fetching latest video from YouTube...");
	const latestVideo = (await youtube.getRecentVideos(env.YOUTUBE_CHANNEL_ID))[0];

	console.log("Getting last notified video ID from KV...");
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

	console.log(`Sending notification to Discord about new video ${latestVideo.title}...`);
	await discord.sendMessage(
		env.DISCORD_CONTENT_ANNOUNCER_WEBHOOK_ID,
		env.DISCORD_CONTENT_ANNOUNCER_WEBHOOK_TOKEN,
		content,
	);

	console.log(`Updating last notified video ID to ${latestVideo.id}...`);
	await env.KV_BINDING.put("lastNotifiedVideoId", latestVideo.id);
};

export default { main };
