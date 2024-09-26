import { test } from "./fixtures";
import { expect } from "@playwright/test";

const {
  TEST_USER_EMAIL,
  TEST_USER_ID,
  TEST_USER_NAME,
  TEST_USER_FIREBASE_UID,
} = process.env;

test("has correct user", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForURL("**/dashboard");
  const json = await page.evaluate(() =>
    window.localStorage.getItem("AppState")
  );
  const { state } = JSON.parse(json!);
  expect(state.user.userId).toBe(TEST_USER_ID);
  expect(state.user.email).toBe(TEST_USER_EMAIL);
  expect(state.user.name).toBe(TEST_USER_NAME);
  expect(state.user.firebaseUid).toBe(TEST_USER_FIREBASE_UID);
});
