import browserPage from "./browserPage";
import { clickOnNextPageButton, scrollToBottom, wait } from "./utils";

interface JobSearchArgs {
	keywords: string;
	maxResults: number;
}

interface Job {
	id: string;
	title: string;
}

const getJobs = async (env: Env, args: JobSearchArgs): Promise<Job[]> => {
	const { browser, page } = await browserPage.init(env);

	console.log("Going to LinkedIn login page...");
	await page.goto("https://www.linkedin.com/login");

	console.log("Waiting for login page to load...");
	await page.waitForNetworkIdle();

	const url = page.url();
	const isLoggedIn = !url.endsWith("/login");

	if (!isLoggedIn) {
		await browser.close();
		throw new Error("Not logged in to LinkedIn. Please check your credentials.");
	}

	console.log("Searching for Pesquisar input...");
	await page.waitForSelector('input[placeholder="Pesquisar"]');

	console.log("Typing keywords...");
	await page.type('input[placeholder="Pesquisar"]', args.keywords);

	console.log("Taking screenshot...");
	const img = await page.screenshot();
	await env.KV_BINDING.put(url, img, {
		expirationTtl: 60 * 5,
	});

	console.log("Waiting for Ver todos os resultados...");
	await page.waitForSelector('::-p-text("Ver todos os resultados")');

	console.log("Clicking Ver todos os resultados...");
	await page.click('::-p-text("Ver todos os resultados")');

	await page.waitForSelector("ul.search-reusables__filter-list");
	await page.click('button::-p-text("Vagas")');

	// This is where we'll set other countries
	// For now is just a confirmation that the page is loaded
	await page.waitForSelector('[id^="jobs-search-box-location"]');

	// let pageNumber = 1;
	let nextPageMethod = 1;

	const jobCardSelector = '.scaffold-layout__list-container li div[data-view-name="job-card"]';
	const jobs: Job[] = [];

	while (true) {
		await page.waitForSelector(jobCardSelector);
		await wait(2000);
		await scrollToBottom(page, ".scaffold-layout__list-container");

		const currentIncompleteJobs: Job[] = await page.$$eval(jobCardSelector, (jobCards) =>
			jobCards.map((jobCard) => {
				const id = jobCard.getAttribute("data-job-id") || "Unknown";
				const title =
					jobCard.querySelector(".job-card-list__title--link span:nth-child(1) > strong")
						?.textContent || "Unknown";

				return { id, title };
			}),
		);

		jobs.push(...currentIncompleteJobs);
		if (jobs.length >= args.maxResults) {
			break;
		}

		const { hasHitLastPage, methodThatWorked } = await clickOnNextPageButton(page, nextPageMethod);

		if (hasHitLastPage) {
			break;
		}
		nextPageMethod = methodThatWorked;
		// pageNumber++;
	}

	await browser.close();

	return jobs.slice(0, args.maxResults);
};

export default { getJobs };
