import test from "@playwright/test";

test.describe("Security tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://juice-shop.herokuapp.com/#/");

    await page.addLocatorHandler(
      page.getByText("Welcome to OWASP Juice Shop!"),
      async () => {
        await page.getByLabel("Close Welcome Banner").click();
      }
    );
  });

  test("XSS for search field", async ({ page }) => {
    // Arrange
    const xss: string = '<iframe src="javascript:alert(`xss`)">';

    // Act
    await page.locator("mat-search-bar").click();
    await page.locator("#mat-input-0").first().fill(xss);
    await page.keyboard.press("Enter");

    // Assert
    page.on("dialog", (dialog) => {
      console.log("Dialog message: ", dialog.message());
      console.log("Type of dialog: ", dialog.type());
      dialog.accept();
    });
  });
});
