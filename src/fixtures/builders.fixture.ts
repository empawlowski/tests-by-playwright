import { Configuration } from "@_src/config/configuration";
import { test as buildersTest } from "@playwright/test";
import MailSlurp from "mailslurp-client";

interface Builders {
  mail: MailSlurp;
}

export const builders = buildersTest.extend<Builders>({
  mail: async ({}, use) => {
    const mailslurp = new MailSlurp({
      // apiKey: process.env.MAILSLURP_API_KEY as string,
      apiKey: process.env.MAILSLURP_API_KEY || Configuration.mailSlurpApiKey,
    });
    await use(mailslurp);
  },
});
