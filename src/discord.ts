const sendMessage = async (webhookId: string, token: string, content: string): Promise<void> => {
	const webhookUrl = `https://discord.com/api/webhooks/${webhookId}/${token}`;

	const res = await fetch(webhookUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ content }),
	});

	console.log(`Discord webhook response: ${res.status} ${res.statusText}`);
	if (!res.ok) {
		const responseBody = await res.text();
		console.error(`Error sending message to Discord, body: ${responseBody}`);
		throw new Error(`Failed to send message: ${res.statusText}`);
	}
};

export default { sendMessage };
