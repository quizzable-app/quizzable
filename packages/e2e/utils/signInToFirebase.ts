import { Page } from "playwright";
import { Window } from "web/src/services/firebase/client/auth";
const { BASE_URL, AUTH_TOKEN } = process.env;

export async function signInToFirebase({ page }: { page: Page }) {
  if (!BASE_URL) throw new Error("BASE_URL is not defined");
  if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN is not defined");

  await page.goto(BASE_URL);
  await page.waitForLoadState("networkidle");
  await page.evaluate(async (token: string) => {
    await (window as any as Window).signInWithCustomToken(token);
  }, AUTH_TOKEN);
  await page.waitForURL("**/dashboard");
}
