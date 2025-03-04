import { test, expect } from "@playwright/test";

// https://www.npmjs.com/package/rebrowser-patches
// https://www.browserless.io/

test.skip("If I bot?", async ({ page }) => {
  await page.goto("https://www.browserscan.net/");
  await page.addLocatorHandler(
    page.getByText("Welcome to BrowserScan"),
    async () => {
      await page.getByRole("button", { name: "Consent", exact: true }).click();
    }
  );
  await expect(page.getByText("Bot Detection: Yes Detection")).toBeVisible();
});

test("If I still bot?", async ({ page }) => {
  await page.goto("https://fingerprint.com/products/bot-detection/");

  await expect(page.locator("p", { hasText: "Detected" })).toBeVisible();
});
