import * as fs from "fs";
import * as path from "path";
import { expect, test } from "@playwright/test";
import { parse } from "csv-parse/sync";

const records = parse(fs.readFileSync(path.join("src/data/challenge.csv")), {
  columns: true,
  skip_empty_lines: true,
  delimiter: ";",
});

let index: number = 1;
test.use({ testIdAttribute: "ng-reflect-name" });

test("RPG Challenge - input data from csv file", async ({ page }) => {
  await page.goto("https://www.rpachallenge.com/");

  await page.getByRole("button", { name: "Start" }).click();

  for (const record of records) {
    await test.step(`Round ${index}`, async () => {
      await expect(
        page.getByRole("button", { name: `Round ${index}` })
      ).toBeVisible();

      await page.getByTestId("labelFirstName").fill(record.FirstName);
      await page.getByTestId("labelLastName").fill(record.LastName);
      await page.getByTestId("labelCompanyName").fill(record.CompanyName);
      await page.getByTestId("labelRole").fill(record.RoleInCompany);
      await page.getByTestId("labelAddress").fill(record.Address);
      await page.getByTestId("labelEmail").fill(record.Email);
      await page.getByTestId("labelPhone").fill(record.PhoneNumber);
      await page.getByRole("button", { name: "Submit" }).click();
      index++;
    });
  }

  await expect(page.getByRole("button", { name: "Reset" })).toBeVisible();
  await expect(page.locator(".message2")).toBeVisible();
  const time = await page.locator(".message2").innerText();

  //* Only last result
  // fs.writeFile(
  //   "src/output/data/rpg.txt",
  //   `Congratulations! ${time} \n`,
  //   "utf8",
  //   (error) => {
  //     if (error) {
  //       console.error("An error occurred while writing to the file:", error);
  //       return;
  //     }
  //     console.log("File written successfully");
  //   }
  // );

  //* All results are saved
  try {
    fs.writeFileSync(
      path.join("src/output/data/csv-rpg.txt"),
      `Congratulations! ${time} \n`,
      {
        encoding: "utf8",
        flag: "a+",
      }
    );
    console.log("File written successfully");
  } catch (err) {
    console.error(err);
  }
});
