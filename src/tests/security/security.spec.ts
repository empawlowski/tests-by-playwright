import { expect, test } from "@playwright/test";

test.describe("Security tests", () => {
  const baseUrl: string = "https://www.saucedemo.com/";
  test("Cross-Site Scripting (XSS)", async ({ page }) => {
    const scripts: string[] = [
      "<script>alert('XSS');</script>",
      '<IFRAME SRC="javascript:alert("XSS");"></IFRAME>',
    ];
    const textError: string =
      "Username and password do not match any user in this service";

    await page.goto(baseUrl);

    for (const script of scripts) {
      await page.fill("#user-name", script);
      await page.fill("#password", "secret_sauce");
      await page.click("#login-button");
      await expect
        .soft(page.locator(".error-message-container"))
        .toContainText(textError);
      await page.click(".error-button");
    }
  });

  test("SQL Injection", async ({ page }) => {
    const injections: string[] = ["/", '" OR "" = "', "1' ORDER BY 1--+"];
    const textError: string =
      "Username and password do not match any user in this service";

    await page.goto(baseUrl);

    for (const injection of injections) {
      await page.fill("#user-name", injection);
      await page.fill("#password", injection);
      await page.click("#login-button");
      await expect
        .soft(page.locator(".error-message-container"))
        .toContainText(textError);
    }
  });

  test("Masking of sensitive information", async ({ page }) => {
    const passwordField = page.locator("#password");
    await page.goto(baseUrl);

    await expect(passwordField).toHaveAttribute("type", "password");
  });

  test("Network Secure Headers", async ({ page }) => {
    // Capture network responses
    const headersList = [
      {
        header: "strict-transport-security",
        message: "Strict-Transport-Security",
      },
      {
        header: "content-security-policy",
        message: "Content-Security-Policy",
      },
      {
        header: "permissions-policy",
        message: "Permissions-Policy",
      },
      {
        header: "x-content-type-options",
        message: "X-Content-Type-Options",
      },
      {
        header: "referrer-policy",
        message: "Referrer-Policy",
      },
      {
        header: "cache-control",
        message: "Cache-Control",
      },
      {
        header: "clear-site-data",
        message: "Clear-Site-Data",
      },
      {
        header: "permissions-policy",
        message: "Permissions-Policy",
      },
      {
        header: "x-xss-protection",
        message: "X-XSS-Protection",
      },
      { header: "x-frame-options", message: "X-Frame-Options" },
    ];

    const headerAssertions: Array<() => void> = [];

    page.on("response", async (response) => {
      const headers = response.headers();
      const urlMessage = `Header missing for URL: ${response.url()}`;

      // headerAssertions.push(() => {
      //   expect
      //     .soft(
      //       headers["strict-transport-security"],
      //       `${urlMessage} - Strict-Transport-Security`
      //     )
      //     .toBeTruthy();
      //   expect
      //     .soft(
      //       headers["content-security-policy"],
      //       `${urlMessage} - Content-Security-Policy`
      //     )
      //     .toBeTruthy();
      //   expect
      //     .soft(
      //       headers["x-content-type-options"],
      //       `${urlMessage} - X-Content-Type-Options`
      //     )
      //     .toBeTruthy();
      //   expect
      //     .soft(headers["referrer-policy"], `${urlMessage} - Referrer-Policy`)
      //     .toBeTruthy();
      //   expect
      //     .soft(headers["cache-control"], `${urlMessage} - Cache-Control`)
      //     .toBeTruthy();
      //   expect
      //     .soft(headers["clear-site-data"], `${urlMessage} - Clear-Site-Data`)
      //     .toBeTruthy();
      //   expect
      //     .soft(
      //       headers["permissions-policy"],
      //       `${urlMessage} - Permissions-Policy`
      //     )
      //     .toBeTruthy();
      //   expect
      //     .soft(headers["x-xss-protection"], `${urlMessage} - X-XSS-Protection`)
      //     .toBeTruthy();
      //   expect
      //     .soft(headers["x-frame-options"], `${urlMessage} - X-Frame-Options`)
      //     .toBeTruthy();
      // });

      for (const { header, message } of headersList) {
        headerAssertions.push(() => {
          expect
            .soft(headers[header], `${urlMessage} - ${message}`)
            .toBeTruthy();
        });
      }
    });

    // Navigate to the page
    await page.goto(baseUrl);

    // Run all header assertions
    headerAssertions.forEach((assertion) => assertion());
  });

  test("Secure Cookies", async ({ page, context }) => {
    const USERNAME = "standard_user";
    const PASSWORD = "secret_sauce";

    await page.goto(baseUrl);
    await page.fill("#user-name", USERNAME);
    await page.fill("#password", PASSWORD);
    await page.click("#login-button");

    // Get all cookies
    const cookies = await context.cookies();
    console.log("sessionCookie: ", cookies);

    // Find the session cookie
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "session-username"
    );

    // Assert cookie exists
    expect(sessionCookie).toBeTruthy();

    // Assert HttpOnly flag is set
    expect.soft(sessionCookie?.httpOnly).toBe(true);

    // Assert Secure flag is set
    expect.soft(sessionCookie?.secure).toBe(true);
  });

  test("Session Cookie Manipulation", async ({ page, context }) => {
    const USERNAME = "standard_user";
    const PASSWORD = "secret_sauce";

    await page.goto(baseUrl);

    await page.fill("#user-name", USERNAME);
    await page.fill("#password", PASSWORD);
    await page.click("#login-button");

    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    // Delete session-id cookie
    // await context.clearCookies({ name: "session-username" });
    await context.clearCookies();

    // Refresh the page
    await page.reload();

    // Verify redirected to login page
    await expect(page).toHaveURL(baseUrl);

    // Perform login again
    await page.fill("#user-name", USERNAME);
    await page.fill("#password", PASSWORD);
    await page.click("#login-button");
  });
});

test.describe("Security tests for OWASP Juice Shop!", () => {
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
