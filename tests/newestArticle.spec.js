// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { expect, test } = require("playwright/test");
const { verifyPageUrl } = require("../lib/utils");

const testPageUrl = "https://news.ycombinator.com/newest";

test("should make sure that we are testing the newest page", async ({ page }) => {
  await verifyPageUrl(page, testPageUrl);
});

test("should make sure that articles are sorted based on newest article", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  let timeStamps = [];

  // Fetch and store only 100 articles
  while (timeStamps.length < 100) {
    // Extract the timestamps of rendered articles on page
    const timeStampElements = page.locator(".age");

    const newTimestamps = await timeStampElements.evaluateAll(
      (elements) => elements.map((el) => new Date(el.getAttribute("title").split(" ")[0])) // title="2025-01-03T13:15:50 1735910150"
    );

    // Add new timeStamps to main array
    timeStamps = [...timeStamps, ...newTimestamps];

    // See how many timeStamps have been added
    console.log(`Loaded ${timeStamps.length} articles`);

    // Get next page of articles
    if (timeStamps.length < 100) {
      const moreLink = page.locator(".morelink");
      await moreLink.click();
      await page.waitForLoadState("load");
    }

    // Trim to exactly 100 timeStamps if we got more
    timeStamps = timeStamps.slice(0, 100);
  }

  expect(timeStamps.length).toBe(100);

  // Validate that timeStamps are sorted from newest to oldest
  let isSorted = true;

  for (let i = 1; i < timeStamps.length; i++) {
    if (timeStamps[i - 1] < timeStamps[i]) {
      isSorted = false;
      break;
    }
  }

  expect(isSorted).toBe(true); // Assert that timeStamps are sorted from newest to oldest
});

test("should make sure that articles ranks are unique", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  let articleRanks = [];

  // Fetch and store only 100 articleRanks
  while (articleRanks.length < 100) {
    // Extract the rank of rendered articles on page
    const rankElements = page.locator(".rank");

    const newRanks = await rankElements.allInnerTexts();

    // Add new articleRanks
    articleRanks = [...articleRanks, ...newRanks];

    // See how many articles have been added
    console.log(`Loaded ${articleRanks.length} article ranks`);

    // Get next page of articleRanks
    if (articleRanks.length < 100) {
      const moreLink = page.locator(".morelink");
      await moreLink.click();
    }

    // Trim to exactly 100 articleRanks if we got more
    articleRanks = articleRanks.slice(0, 100);
  }

  // Use a Set to determine if all ranks are unique
  const uniqueRanks = new Set(articleRanks);

  // Validate that all ranks are unique
  const isUnique = uniqueRanks.size === articleRanks.length;

  console.log(articleRanks);

  expect(isUnique).toBe(true); // Assert that article ranks are unique
});

test("should redirect to user profile when author is clicked", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the first element with the class name hnuser
  const authorLink = page.locator(".hnuser").first();

  // Get the user name
  const authorName = await authorLink.innerText();

  // Get the href attribute
  const href = await authorLink.getAttribute("href");

  // Click the user link
  await authorLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Validate the URL
  expect(page.url()).toBe(`https://news.ycombinator.com/${href}`);

  // Check that its the correct user profile
  const userLink = page.locator(".hnuser").first();

  // Get the user name
  const userName = await userLink.innerText();

  // Validate user
  expect(userName).toBe(authorName);
});

test("should redirect to comment section of article when timestamp is clicked", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the timestamp element
  const timestampElement = page.locator(".age").first();

  // Locate the link element
  const timestampLink = timestampElement.locator("a");

  // Get the href attribute
  const href = await timestampLink.getAttribute("href");

  // Click the user link
  await timestampLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Validate the URL
  expect(page.url()).toBe(`https://news.ycombinator.com/${href}`);

  // Get add to comment to confirm on the right page
  const addCommentButton = page.locator('input[type="submit"][value="add comment"]');

  // Make sure that there is an add comment button
  await expect(addCommentButton).toHaveAttribute("value", "add comment");
});

test("should redirect to comment section of article when discuss is clicked", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the discuss element
  const discussLink = page.locator('a:has-text("discuss")').first();

  // Get the href attribute
  const href = await discussLink.getAttribute("href");

  // Click the user link
  await discussLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Validate the URL
  expect(page.url()).toBe(`https://news.ycombinator.com/${href}`);

  // Get add to comment to confirm on the right page
  const addCommentButton = page.locator('input[type="submit"][value="add comment"]');

  // Make sure that there is an add comment button
  await expect(addCommentButton).toHaveAttribute("value", "add comment");
});

test("should redirect to article site when article title is clicked", async ({ page }) => {
  // Go to Hacker News newest section
  await page.goto(testPageUrl);

  // Locate the newest title span
  const newestTitleSpan = page.locator(".titleline");

  // Locate the title link
  const titleLink = newestTitleSpan.locator("a").first();

  // Locate the title name
  const titleName = await titleLink.locator("span").first().innerText();

  // Get the href value which contains the link to the article
  const articleHref = await titleLink.getAttribute("href");

  // Click the job link
  await titleLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Validate the URL
  expect(page.url()).toBe(`https://news.ycombinator.com/${jobHref}`);

  // CHECK THAT JOB ADS ARE FROM THE CORRECT COMPANY
  // Locate all of the jobs from the company
  const jobsFromCompany = page.locator(".titleline .sitebit.comhead a");

  // Get the count of jobs from the company
  const count = await jobsFromCompany.count();

  // Validate that all jobs are from the correct company
  for (let i = 0; i < count; i++) {
    const job = jobsFromCompany.nth(i);
    const jobCompany = await job.innerText();
    expect(jobCompany).toBe(companyName);
  }
});
