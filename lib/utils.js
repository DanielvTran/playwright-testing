const { expect } = require("@playwright/test");

async function verifyPageUrl(page, url) {
  // Go to the specified URL
  await page.goto(url);

  // Make sure the current URL matches the expected URL
  const currentURL = page.url();
  expect(currentURL).toBe(url);
}

module.exports = { verifyPageUrl };
