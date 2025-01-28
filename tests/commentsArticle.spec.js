const { expect, test } = require("playwright/test");
const { verifyPageUrl } = require("../lib/utils");

const testPageUrl = "https://news.ycombinator.com/newcomments";

test("should make sure that we are testing the newcomments page", async ({ page }) => {
  await verifyPageUrl(page, testPageUrl);
});

test("should make sure that comments are sorted based on newest comments", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  let comments = [];

  // Fetch and store only 100 comments
  while (comments.length < 100) {
    // Extract the comments of rendered articles on page
    const commentsSpan = page.locator(".age");

    const newComments = await commentsSpan.evaluateAll(
      (elements) => elements.map((el) => new Date(el.getAttribute("title").split(" ")[0])) // title="2025-01-03T13:15:50 1735910150"
    );

    // Add new comments to main array
    comments = [...comments, ...newComments];

    // See how many comments have been added
    console.log(`Loaded ${comments.length} comments`);

    // Get next page of comments
    if (comments.length < 100) {
      const moreLink = page.locator(".morelink");
      await moreLink.click();
      await page.waitForLoadState("load");
    }

    // Trim to exactly 100 comments if we got more
    comments = comments.slice(0, 100);
  }

  expect(comments.length).toBe(100);

  // Validate that comments are sorted from newest to oldest
  let isSorted = true;

  for (let i = 1; i < comments.length; i++) {
    if (comments[i - 1] < comments[i]) {
      isSorted = false;
      break;
    }
  }

  expect(isSorted).toBe(true); // Assert that comments are sorted from newest to oldest
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

test("should redirect to reply section of comment when timestamp is clicked", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the timestamp element
  const timestampElement = page.locator(".age").first();

  // Locate the link element
  const timestampLink = timestampElement.locator("a");

  // Locate the comment container element
  const commentContainerElement = page.locator(".comment").first();

  // Locate the comment element
  const commentElement = commentContainerElement.locator("div").first();

  // Get the comment text
  const commentText = await commentElement.innerText();

  // Get the href attribute
  const href = await timestampLink.getAttribute("href");

  // Click the user link
  await timestampLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Validate the URL
  expect(page.url()).toBe(`https://news.ycombinator.com/${href}`);

  // Get the comment text
  const testCommentText = await commentElement.innerText();

  // Get add to comment to confirm on the right page
  const addCommentButton = page.locator('input[type="submit"][value="reply"]');

  // Make sure that there is an add comment button
  await expect(addCommentButton).toHaveAttribute("value", "reply");

  // Compare the comment text
  expect(testCommentText).toBe(commentText);
});

test("should redirect to comment section of article when '| on: {article title}' is clicked", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the article title element
  const articleTitleSpan = page.locator('span.onstory:has-text(" | on: ")').first();

  // Get article locator
  const articleLocator = articleTitleSpan.locator("a");

  // Get the href article id
  const href = await articleLocator.getAttribute("href");

  // Get the href inner text
  let hrefText = await articleLocator.innerText();

  // Remove trailing 3 full stops
  hrefText = hrefText.replace(/\.\.\.$/, "");

  // Click the article title link
  await articleLocator.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Make sure that the redirected page is the article page of the correct id
  expect(page.url()).toBe(`https://news.ycombinator.com/${href}`);

  // Get add to comment to confirm on the right page
  const addCommentButton = page.locator('input[type="submit"][value="add comment"]');

  // Make sure that there is an add comment button
  await expect(addCommentButton).toHaveAttribute("value", "add comment");

  // Get title of article from comments page
  const articleTitleElement = page.locator(".titleline");

  // Get the href inner text
  const articleTitle = await articleTitleElement.locator("a").first().innerText();

  // Validate that the article title is the same as the one on the comments page
  expect(articleTitle).toContain(hrefText);
});
