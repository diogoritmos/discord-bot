import { type Page, type ElementHandle, type BoundingBox } from "@cloudflare/puppeteer";

export const getHostname = (url: string) => {
	return new URL(url).hostname;
};

export const wait = async (ms: number) => {
	return await new Promise((resolve) => setTimeout(resolve, ms));
};

const getBoundingBox = async (elementHandle: ElementHandle): Promise<BoundingBox> => {
	const boundingBox = await elementHandle.boundingBox();
	if (boundingBox) {
		return boundingBox;
	} else {
		throw new Error("Failed to find bounding box for provided element");
	}
};

const scrollDown = async (page: Page, boundingBox: BoundingBox): Promise<void> => {
	await page.mouse.move(boundingBox.x + 2, boundingBox.y + 2);
	await page.mouse.wheel({ deltaY: 300 });
};

export const scrollToBottom = async (page: Page, selector: string): Promise<void> => {
	const sectionToScroll = await page.waitForSelector(selector);
	if (!sectionToScroll) {
		return;
	}

	const maxScrolls = 10;
	const delayBetweenScrollsMills = 200;

	const boundingBox = await getBoundingBox(sectionToScroll as ElementHandle);

	for (let i = 0; i < maxScrolls; i++) {
		await scrollDown(page, boundingBox);
		await wait(delayBetweenScrollsMills);
	}
};

export const clickOnNextPageButton = async (
	page: Page,
	method: number,
): Promise<{ hasHitLastPage: boolean; methodThatWorked: number }> => {
	const retval = { hasHitLastPage: false, methodThatWorked: method };
	let currentMethod = method;

	if (currentMethod === 1) {
		try {
			await page.waitForSelector(".jobs-search-pagination__button--next");
			const nextButton = await page.$(".jobs-search-pagination__button--next");
			if (nextButton) {
				await nextButton.click();
			} else {
				retval.hasHitLastPage = true;
			}

			return retval;
		} catch (e) {
			currentMethod++;
		}
	}

	if (currentMethod === 2) {
		try {
			await page.waitForSelector(".jobs-search-results-list__pagination");
			const hasHitLastPage = await page.$$eval(
				".jobs-search-results-list__pagination ul li",
				(pageNumbers) => {
					for (let i = 0; i < pageNumbers.length; i++) {
						if (pageNumbers[i].className.includes("selected")) {
							const nextButton = pageNumbers[i + 1]?.querySelector("button");
							if (nextButton) {
								nextButton.click();
								return false;
							} else {
								return true;
							}
						}
					}

					return false;
				},
			);

			retval.hasHitLastPage = hasHitLastPage;
			retval.methodThatWorked = 2;

			return retval;
		} catch (e) {
			return { hasHitLastPage: true, methodThatWorked: 2 };
		}
	}

	throw new Error("No method worked to click on the next page button");
};
