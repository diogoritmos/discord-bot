import puppeteer, { type BrowserWorker } from "@cloudflare/puppeteer";
import blockedHosts from "./blockedHosts";
import { getHostname } from "./utils";

const LI_AT_COOKIE = "REPLACE_WITH_YOUR_COOKIE_VALUE";

const USER_AGENT =
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

const init = async (env: Env) => {
	console.log("Launching browser...");
	const browser = await puppeteer.launch(env.MYBROWSER as BrowserWorker);

	console.log("Opening page...");
	const page = await browser.newPage();

	console.log("Setting cookies...");
	await page.setCookie({
		name: "li_at",
		value: LI_AT_COOKIE,
		domain: ".www.linkedin.com",
	});

	console.log("Setting user agent...");
	await page.setUserAgent(USER_AGENT);

	const blockedResources = [
		"image",
		"media",
		"font",
		"texttrack",
		"object",
		"beacon",
		"csp_report",
		"imageset",
	];

	const blockedHosts = getBlockedHosts();
	const blockedResourcesByHost = ["script", "xhr", "fetch", "document"];

	await page.setRequestInterception(true);

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	page.on("request", async (req) => {
		if (blockedResources.includes(req.resourceType())) {
			await req.abort();
			return;
		}

		const hostname = getHostname(req.url());

		if (blockedResourcesByHost.includes(req.resourceType()) && hostname && blockedHosts[hostname]) {
			await req.abort();
			return;
		}

		await req.continue();
	});

	await page.setViewport({
		width: 1200,
		height: 720,
	});

	return { browser, page };
};

const getBlockedHosts = (): Record<string, boolean> => {
	const blockedHostsArray = blockedHosts.split("\n");

	let blockedHostsObject = blockedHostsArray.reduce<Record<string, boolean>>((prev, curr) => {
		const frags = curr.split(" ");

		if (frags.length > 1 && frags[0] === "0.0.0.0") {
			prev[frags[1].trim()] = true;
		}

		return prev;
	}, {});

	blockedHostsObject = {
		...blockedHostsObject,
		"static.chartbeat.com": true,
		"scdn.cxense.com": true,
		"api.cxense.com": true,
		"www.googletagmanager.com": true,
		"connect.facebook.net": true,
		"platform.twitter.com": true,
		"tags.tiqcdn.com": true,
		"dev.visualwebsiteoptimizer.com": true,
		"smartlock.google.com": true,
		"cdn.embedly.com": true,
	};

	return blockedHostsObject;
};

export default { init };
