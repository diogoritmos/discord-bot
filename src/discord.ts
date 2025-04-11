const sendMessage = async (webhookId: string, token: string, content: string): Promise<void> => {
	const webhookUrl = `https://discord.com/api/webhooks/${webhookId}/${token}`;
	console.log(`Sending message to Discord webhook: ${webhookUrl}`);

	const res = await fetch(webhookUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ content }),
	});

	console.log(`Discord webhook response: ${res.status} ${res.statusText}`);
	if (!res.ok) {
		console.error(`Error sending message to Discord: ${res.statusText}`);
		// Log the response body for debugging
		const responseBody = await res.text();
		console.error(`Response body: ${responseBody}`);
		throw new Error(`Failed to send message: ${res.statusText}`);
	}
};

export default { sendMessage };
