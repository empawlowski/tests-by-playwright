// import { expect, test } from "@playwright/test";
// import MailSlurp from "mailslurp-client";

// const mailslurp: MailSlurp = new MailSlurp({
//   apiKey: "e026ae285bdcff9c9dd6504b820dfb5ec22257484a379a18a2bbf0c1bb5859d0",
// });

// test("Check send email", async () => {
//   const inbox = await mailslurp.createInbox();
//   const options = {
//     to: [inbox.emailAddress],
//     subject: "Hello",
//     body: "Welcome",
//   };
//   await mailslurp.sendEmail(inbox.id, options);

//   const secondEmail = await mailslurp.waitController.waitForLatestEmail({
//     inboxId: inbox.id,
//     unreadOnly: true,
//   });

//   expect(secondEmail.subject).toContain("Hello");
// });

// test("Send email", async () => {
//   const inbox = await mailslurp.createInbox();
//   const firstEmail = await mailslurp.sendEmail(inbox.id, {
//     to: [inbox.emailAddress],
//     subject: "test",
//   });

//   const secondEmail = await mailslurp.waitController.waitForLatestEmail({
//     inboxId: inbox.id,
//     unreadOnly: true,
//   });

//   console.log(firstEmail.subject);
//   console.log(secondEmail.subject);

//   expect(secondEmail.subject).toContain("test");
// });

// test("Control existing inbox", async () => {
//   const inboxId: string = "73f433d5-8ef2-461c-b2c9-8cbd4f7a0f8b";
//   const secondInboxId: string = "03940486-5f16-4565-b398-95c8d5ab7159";
//   const inbox = await mailslurp.inboxController.getInbox({ inboxId: inboxId });
//   console.log(inbox.emailAddress);
//   // expect(inbox.emailAddress).toEqual('03940486-5f16-4565-b398-95c8d5ab7159@mailslurp.biz');
//   const emails = await mailslurp.inboxController.getEmails({
//     inboxId: inboxId,
//   });
//   console.log(emails);
// });

// test("Send to existing inbox", async () => {
//   const inboxId: string = "03940486-5f16-4565-b398-95c8d5ab7159";
//   const inbox = await mailslurp.inboxController.getInbox({ inboxId: inboxId });
//   console.log(inbox.emailAddress);
//   // expect(inbox.emailAddress).toEqual('03940486-5f16-4565-b398-95c8d5ab7159@mailslurp.biz');
//   const emails = await mailslurp.inboxController.getEmails({
//     inboxId: inboxId,
//   });
//   console.log(emails.length);

//   const send = await mailslurp.sendEmail(inbox.id, {
//     to: [inbox.emailAddress],
//     subject: "Hello from tests",
//     body: "Body text",
//   });

//   // await mailslurp.waitController.waitForLatestEmail({
//   //   inboxId: inboxId,
//   //   timeout: 120_000,
//   //   unreadOnly: true,
//   // });

//   const email = await mailslurp.waitForLatestEmail(inboxId, 120_000, true);
//   expect(email.body).toContain("Body text");

//   const emailsSecond = await mailslurp.inboxController.getEmails({
//     inboxId: inboxId,
//   });
//   console.log(emailsSecond.length);
//   // expect(emailsSecond.length).toEqual(15);
// });

// test("Send to existing inbox - main", async () => {
//   const inboxId: string = "73f433d5-8ef2-461c-b2c9-8cbd4f7a0f8b";
//   const inbox = await mailslurp.inboxController.getInbox({ inboxId: inboxId });
//   console.log(inbox.emailAddress);
//   // expect(inbox.emailAddress).toEqual('03940486-5f16-4565-b398-95c8d5ab7159@mailslurp.biz');
//   const emails = await mailslurp.inboxController.getEmails({
//     inboxId: inboxId,
//   });
//   console.log(emails.length);

//   const send = await mailslurp.sendEmail(inbox.id, {
//     to: [inbox.emailAddress],
//     subject: "Hello from tests 2025",
//     body: "Body text 2025",
//   });

//   // const email = await mailslurp.waitController.waitForLatestEmail({
//   //   inboxId: inboxId,
//   //   timeout: 120_000,
//   //   unreadOnly: true,
//   // });

//   const email = await mailslurp.waitForLatestEmail(inboxId, 120_000, true);
//   // const email = await mailslurp.waitForLatestEmail(inboxId);
//   // expect(email.body).toContain('Body text');
//   console.log(email.id);
//   console.log(email.subject);
//   console.log(email.body);
//   // expect(email.body).toBe('Body text');
//   // expect(email.body).toEqual('Body text');
//   // expect(email.body).toContain(send.body);

//   const emailsSecond = await mailslurp.inboxController.getEmails({
//     inboxId: inboxId,
//   });
//   console.log(emailsSecond.length);
//   // expect(emailsSecond.length).toEqual(15);
// });

// test("Get inbox id", async () => {
//   const inbox = await mailslurp.createInbox();
//   console.log(inbox.id);

//   // await mailslurp.inboxController.getInbox();
//   console.log(inbox.emailAddress);
// });
