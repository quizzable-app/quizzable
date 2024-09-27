import { Page } from "playwright";
const { BASE_URL, AUTH_TOKEN } = process.env;

export async function signInToFirebase({ page }: { page: Page }) {
  if (!BASE_URL) throw new Error("BASE_URL is not defined");
  if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN is not defined");

  await page.goto(BASE_URL);
  await page.evaluate(async (token: string) => {
    await (globalThis as any).signInWithCustomToken(token);
  }, AUTH_TOKEN);
  await page.waitForURL("**/dashboard");
}
