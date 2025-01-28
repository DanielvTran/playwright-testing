const { expect, test } = require("playwright/test");
const { verifyPageUrl } = require("../lib/utils");

const testPageUrl = "https://news.ycombinator.com/news";

test("should make sure that we are testing the news page", async ({ page }) => {
  await verifyPageUrl(page, testPageUrl);
});

test("should make sure that all nav links are black on main page", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the nav container
  const navContainer = page.locator(".pagetop");

  // Extract the nav links
  const navLinks = navContainer.locator("a");

  // Get count of nav links
  const navLinksCount = await navLinks.count();

  for (let i = 0; i < navLinksCount; i++) {
    const link = navLinks.nth(i);
    const linkColor = await link.evaluate((element) => {
      return getComputedStyle(element).color;
    });
    expect(linkColor).toBe("rgb(0, 0, 0)");
  }
});

test("should make sure new link is white when active", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the news link
  const newLink = page.locator('a[href="newest"]:has-text("new")');

  // Get the color of the new link
  const linkColor = await newLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the new link is black
  expect(linkColor).toBe("rgb(0, 0, 0)");

  // Click the new link
  await newLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Get the color of the new link after clicking
  const newLinkColor = await newLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the new link is white
  expect(newLinkColor).toBe("rgb(255, 255, 255)");

  // Assert that the page URL is correct
  expect(page.url()).toBe("https://news.ycombinator.com/newest");
});

test("should make sure past link is white when active", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locator the past link
  const pastLink = page.locator('a[href="front"]:has-text("past")');

  // Get the color of the past link
  const linkColor = await pastLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the past link is black
  expect(linkColor).toBe("rgb(0, 0, 0)");

  // Click the past link
  await pastLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Get locator of the date
  const dateElement = page.locator("font");

  // Get colour of the date
  const dateColor = await dateElement.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the date is white
  expect(dateColor).toBe("rgb(255, 255, 255)");

  // Assert that the page URL is correct
  expect(page.url()).toBe("https://news.ycombinator.com/front");
});

test("should make sure comments link is white when active", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the comments link
  const commentsLink = page.locator('a[href="newcomments"]:has-text("comments")');

  // Get the color of the comments link
  const linkColor = await commentsLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the comments link is black
  expect(linkColor).toBe("rgb(0, 0, 0)");

  // Click the comments link
  await commentsLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Get the color of the comments link after clicking
  const newCommentsColor = await commentsLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the comments link is white
  expect(newCommentsColor).toBe("rgb(255, 255, 255)");

  // Assert that the page URL is correct
  expect(page.url()).toBe("https://news.ycombinator.com/newcomments");
});

test("should make sure ask link is white when active", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the ask link
  const askLink = page.locator('a[href="ask"]:has-text("ask")');

  // Get the color of the ask link
  const linkColor = await askLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the ask link is black
  expect(linkColor).toBe("rgb(0, 0, 0)");

  // Click the ask link
  await askLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Get the color of the ask link after clicking
  const newAskColor = await askLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the ask link is white
  expect(newAskColor).toBe("rgb(255, 255, 255)");

  // Assert that the page URL is correct
  expect(page.url()).toBe("https://news.ycombinator.com/ask");
});

test("should make sure show link is white when active", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the show link
  const showLink = page.locator('a[href="show"]:has-text("show")');

  // Get the color of the show link
  const linkColor = await showLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the show link is black
  expect(linkColor).toBe("rgb(0, 0, 0)");

  // Click the show link
  await showLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Get the color of the show link after clicking
  const newShowColor = await showLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the show link is white
  expect(newShowColor).toBe("rgb(255, 255, 255)");

  // Assert that the page URL is correct
  expect(page.url()).toBe("https://news.ycombinator.com/show");
});

test("should make sure jobs link is white when active", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the jobs link
  const jobsLink = page.locator('a[href="jobs"]:has-text("jobs")');

  // Get the color of the jobs link
  const linkColor = await jobsLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the jobs link is black
  expect(linkColor).toBe("rgb(0, 0, 0)");

  // Click the jobs link
  await jobsLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Get the color of the jobs link after clicking
  const newJobsColor = await jobsLink.evaluate((element) => {
    return getComputedStyle(element).color;
  });

  // Assert that the color of the jobs link is white
  expect(newJobsColor).toBe("rgb(255, 255, 255)");

  // Assert that the page URL is correct
  expect(page.url()).toBe("https://news.ycombinator.com/jobs");
});
