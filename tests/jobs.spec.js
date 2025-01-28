const { expect, test } = require("playwright/test");
const { verifyPageUrl } = require("../lib/utils");

const testPageUrl = "https://news.ycombinator.com/jobs";

test("should make sure that we are testing the jobs page", async ({ page }) => {
  await verifyPageUrl(page, testPageUrl);
});

test("should make sure that jobs are sorted based on newest job posting", async ({ page }) => {
  // Go to Hacker News jobs section
  await page.goto(testPageUrl);

  let jobsTimeStamps = [];

  // Fetch and store only first 100 jobs
  while (jobsTimeStamps.length < 100) {
    // Extract the jobs of rendered articles on page
    const timeStampElements = page.locator(".age");

    const newTimestamps = await timeStampElements.evaluateAll(
      (elements) => elements.map((el) => new Date(el.getAttribute("title").split(" ")[0])) // title="2025-01-03T13:15:50 1735910150"
    );

    // Add new timeStamps to main array
    jobsTimeStamps = [...jobsTimeStamps, ...newTimestamps];

    // See how many timeStamps have been added
    console.log(`Loaded ${jobsTimeStamps.length} jobs`);

    // Get next page of jobs
    if (jobsTimeStamps.length < 100) {
      const moreLink = page.locator(".morelink");
      await moreLink.click();
      await page.waitForLoadState("load");
    }

    // Trim to exactly 100 timeStamps if we got more
    jobsTimeStamps = jobsTimeStamps.slice(0, 100);
  }

  expect(jobsTimeStamps.length).toBe(100);

  // Validate that timeStamps are sorted from newest to oldest
  let isSorted = true;

  for (let i = 1; i < jobsTimeStamps.length; i++) {
    if (jobsTimeStamps[i - 1] < jobsTimeStamps[i]) {
      isSorted = false;
      break;
    }
  }

  expect(isSorted).toBe(true); // Assert that jobsTimeStamps are sorted from newest to oldest
});

test("should make sure that jobs ranks are unique", async ({ page }) => {
  // Go to Hacker News
  await page.goto(testPageUrl);

  let jobRanks = [];

  // Fetch and store only 100 jobRanks
  while (jobRanks.length < 100) {
    // Extract the rank of rendered jobs on page
    const rankElements = page.locator(".rank");

    const newRanks = await rankElements.allInnerTexts();

    // Add new jobRanks
    jobRanks = [...jobRanks, ...newRanks];

    // See how many jobs have been added
    console.log(`Loaded ${jobRanks.length} job ranks`);

    // Get next page of jobRanks
    if (jobRanks.length < 100) {
      const moreLink = page.locator(".morelink");
      await moreLink.click();
    }

    // Trim to exactly 100 jobRanks if we got more
    jobRanks = jobRanks.slice(0, 100);
  }

  // Use a Set to determine if all ranks are unique
  const uniqueRanks = new Set(jobRanks);

  // Validate that all ranks are unique
  const isUnique = uniqueRanks.size === jobRanks.length;

  console.log(jobRanks);

  expect(isUnique).toBe(true); // Assert that job ranks are unique
});

test("should redirect to correct job ad url when job title clicked", async ({ page }) => {
  // Go to Hacker News jobs section
  await page.goto(testPageUrl);

  // Locate the job title span
  const jobTitleSpan = page.locator(".titleline");

  // Locate the job ad link
  const jobLink = jobTitleSpan.locator("a").first();

  // Get the href value which contains the link to the job ad
  const jobHref = await jobLink.getAttribute("href");

  // Click the job link
  await jobLink.click();

  // Wait for the page to load
  await page.waitForLoadState("load");

  // Validate the URL
  expect(page.url()).toBe(jobHref);
});

test("should redirect to a page showing all job ads from specific company", async ({ page }) => {
  // Go to Hacker News jobs section
  await page.goto(testPageUrl);

  // Locate the job title span
  const jobTitleSpan = page.locator(".titleline");

  // Locate the company span
  const companySpan = jobTitleSpan.locator(".sitebit.comhead").first();

  // Locate the company link
  const jobLink = companySpan.locator("a").first();

  // Locate the company name
  const companyName = await jobLink.locator("span").first().innerText();

  // Get the href value which contains the link to the job ads from that specific company
  const jobHref = await jobLink.getAttribute("href");

  // Click the job link
  await jobLink.click();

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
