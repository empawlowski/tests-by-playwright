import * as fs from "fs";
import * as xlsx from "node-xlsx";
import * as path from "path";
import { expect, test } from "@playwright/test";

const records = xlsx.parse(path.join("src/data/challenge.xlsx"));
const record: string[][] = records[0].data;

test.use({ testIdAttribute: "ng-reflect-name" });

test("RPG Challenge - input data from xlsx file", async ({ page }) => {
  await page.goto("https://www.rpachallenge.com/");

  await page.getByRole("button", { name: "Start" }).click();

  for (let index: number = 1; index < record.length; index++) {
    await test.step(`Round ${index}`, async () => {
      await expect(
        page.getByRole("button", { name: `Round ${index}` })
      ).toBeVisible();
      await page.getByTestId("labelFirstName").fill(record[index][0]);
      await page.getByTestId("labelLastName").fill(record[index][1]);
      await page.getByTestId("labelCompanyName").fill(record[index][2]);
      await page.getByTestId("labelRole").fill(record[index][3]);
      await page.getByTestId("labelAddress").fill(record[index][4]);
      await page.getByTestId("labelEmail").fill(record[index][5]);
      await page.getByTestId("labelPhone").fill(record[index][6].toString());
      await page.getByRole("button", { name: "Submit" }).click();
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
      path.join("src/output/data/xlsx-rpg.txt"),
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
