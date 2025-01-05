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

    // Convert timestamps to a more readable format
    const readableTimeStamps = timeStamps.map((ts) => ts.toLocaleString());

    // See how many timeStamps have been added
    console.log(`Time Stamps at ${timeStamps.length}:`, readableTimeStamps);

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

  // Convert timestamps to a more readable format
  const readableTimeStamps = timeStamps.map((ts) => ts.toLocaleString());

  console.log(`Time Stamps at ${timeStamps.length}:`, readableTimeStamps);
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
    console.log(`Loaded ${articleRanks.length} article ranks:`, articleRanks);

    // Get next page of articleRanks
    if (articleRanks.length < 100) {
      const moreLink = page.locator(".morelink");
      await moreLink.click();
      await page.waitForLoadState("load", { timeout: 10000 }); // Wait for the page to load
    }

    // Trim to exactly 100 articleRanks if we got more
    articleRanks = articleRanks.slice(0, 100);
  }

  // Use a Set to determine if all ranks are unique
  const uniqueRanks = new Set(articleRanks);

  // Validate that all ranks are unique
  const isUnique = uniqueRanks.size === articleRanks.length;

  // See how many articles have been added
  console.log(`Loaded ${articleRanks.length} article ranks:`, articleRanks);

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

  console.log("Author Name on articles page:", authorName);
  console.log("Author Name on author page:", userName);

  // Validate user
  expect(userName).toBe(authorName);
});

test("should redirect to comment section of article when timestamp is clicked", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate article locator
  const articleName = page.locator(".titleline").first();

  // Get article name
  const articleTitle = await articleName.innerText();

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

  // Locate the article title on new page
  const newArticleName = page.locator(".titleline").first();

  // Get article name
  const newArticleTitle = await newArticleName.innerText();

  // Validate the URL
  expect(page.url()).toBe(`https://news.ycombinator.com/${href}`);
  console.log(`Url before clicking on timestamp: https://news.ycombinator.com/${href}`);
  console.log(`Url after clicking on timestamp: ${page.url()}`);

  // Get add to comment to confirm on the right page
  const addCommentButton = page.locator('input[type="submit"][value="add comment"]');

  // Make sure that there is an add comment button
  await expect(addCommentButton).toHaveAttribute("value", "add comment");

  // Make sure that the article title is the same
  expect(newArticleTitle).toBe(articleTitle);
  console.log(`Article title before clicking on timestamp: ${articleTitle}`);
  console.log(`Article title after clicking on timestamp: ${newArticleTitle}`);
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
  console.log(`Url before clicking on discuss: https://news.ycombinator.com/${href}`);
  console.log(`Url after clicking on discuss: ${page.url()}`);

  // Get add to comment to confirm on the right page
  const addCommentButton = page.locator('input[type="submit"][value="add comment"]');

  // Make sure that there is an add comment button
  await expect(addCommentButton).toHaveAttribute("value", "add comment");
});
