import { SendEmailOptions } from "mailslurp-client";
import { expect, test } from "../../fixtures/base.fixture";
import { faker } from "@faker-js/faker";

test.describe("MailSlurp Action", () => {
  let inboxId: string = "";
  let emailAddress: string = "";

  test.beforeEach("Create new inbox", async ({ mail }) => {
    // Create new inbox
    const inbox = await mail.createInbox();
    inboxId = inbox.id;
    emailAddress = inbox.emailAddress;

    console.log(inboxId);
    console.log(emailAddress);
  });

  test("Send mail to existed inbox", async ({ mail }) => {
    // Get existed inbox
    const getInbox = await mail.getInbox(inboxId);

    // Check if inbox is empty
    const getEmails = await mail.getEmails(getInbox.id);
    console.log(getEmails.length);

    // Create email options
    const options: SendEmailOptions = {
      to: [emailAddress],
      subject: faker.lorem.sentence(5),
      body: faker.lorem.words({ min: 15, max: 25 }),
    };

    // Send new email with options details
    const sentEmail = await mail.sendEmail(getInbox.id, options);

    // Wait for email to be received
    await mail.waitForLatestEmail(getInbox.id, 120_000, true);
    expect(sentEmail.to).toContain(emailAddress);
    expect(sentEmail.subject).toContain(options.subject);
    expect(sentEmail.body).toContain(options.body);

    // Check if inbox has received email
    const getSentEmail = await mail.getEmails(getInbox.id);
    console.log(getSentEmail.length);
  });
});
