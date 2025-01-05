const { expect } = require("@playwright/test");

async function verifyPageUrl(page, url) {
  // Go to the specified URL
  await page.goto(url);

  // Make sure the current URL matches the expected URL
  const currentURL = page.url();

  try {
    expect(currentURL).toBe(url);
    console.log(`Passed: ${currentURL} matches ${url}`);
  } catch (error) {
    console.error(`Failed: ${currentURL} does not match ${url}`);
    throw error;
  }
}

module.exports = { verifyPageUrl };
