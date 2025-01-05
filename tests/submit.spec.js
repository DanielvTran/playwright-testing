// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { expect, test } = require("playwright/test");
const { verifyPageUrl } = require("../lib/utils");

const testPageUrl = "https://news.ycombinator.com/submit";

test("should make sure that we are testing the submit page", async ({ page }) => {
  await verifyPageUrl(page, testPageUrl);
});

test("should prompt to login or signup when on submit page and not logged in", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  // Locate the submit link
  const submitLink = page.locator('a[href="submit"]:has-text("submit")');

  // Click the submit link
  await submitLink.click();

  // Locate login prompt
  const loginPrompt = page.locator('a[href="login"]:has-text("login")');

  // Locate signup prompt
});
