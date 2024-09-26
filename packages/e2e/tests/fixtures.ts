import { test as base } from "@playwright/test";

const { BASE_URL, AUTH_TOKEN } = process.env;

export const test = base.extend<{ forEachTest: void }>({
  forEachTest: [
    async ({ page, context }, use) => {
      await use();
      console.log(`Running ${test.info().title}`);
      page.on("response", async (response) => {
        const url = response.url();
        if (url.includes("accounts:lookup")) {
          const { users } = await response.json();
          console.log(users);
        }
      });

      await page.goto(BASE_URL!);
      await page.evaluate(async (token) => {
        await (globalThis as any).signInWithCustomToken(token);
      }, AUTH_TOKEN);
      await page.waitForURL("**/dashboard");
      await context.storageState({ path: "state.json" });
    },
    { auto: true },
  ],
});
