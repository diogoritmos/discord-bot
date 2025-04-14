// import { type BrowserWorker } from "@cloudflare/puppeteer";
import linkedin from "./clients/linkedin/index";

const main = async (env: Env) => {
	const jobs = await linkedin.getJobs(env, {
		keywords: "desenvolvedor frontend",
		maxResults: 10,
	});

	console.log("Jobs:", jobs);
};

export default { main };
