import { expect, test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test("Email fuzzing validation", async ({ page }) => {
  await page.goto("/");

  const emails = fs
    .readFileSync(path.join("src/data/fuzzing/emails.txt"), "utf-8")
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"));

  const invalidEmails: string[] = [];
  const validEmails: string[] = [];
  const paragraph = page.locator("p", {
    hasText: "Email is invalid or already taken",
  });

  for (const email of emails) {
    await page.fill("#email", email),
      await Promise.all([
        page.locator("#email").blur(),
        page.waitForResponse(/email_validity_checks/),
      ]);
    if (await paragraph.isVisible()) {
      await expect(paragraph).toBeVisible();
      console.log(email);
      invalidEmails.push(email);
    } else {
      await expect(paragraph).toBeHidden();
      await page.locator("#email").clear();
      validEmails.push(email);
    }
  }

  fs.writeFileSync(
    path.join("src/output/data/fuzzing/mail.txt"),
    invalidEmails.join("\n")
  );

  fs.writeFileSync(
    path.join("src/output/data/fuzzing/valid-mail.txt"),
    validEmails.join("\n")
  );
});
