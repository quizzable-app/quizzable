import { User } from "@prisma/client";
import { expect, test } from "@playwright/test";
import { prisma } from "../lib/prisma";
import { signInToFirebase } from "../utils/signInToFirebase";

const { TEST_USER_ID } = process.env;

let testUser: User;

test.beforeAll(async () => {
  if (!TEST_USER_ID) {
    throw new Error("TEST_USER_ID is not defined");
  }
  testUser = await prisma.user.findFirstOrThrow({
    where: { id: BigInt(TEST_USER_ID) },
  });
});

test.beforeEach(async ({ page }) => {
  await signInToFirebase({ page });
});

test.afterEach(async ({ page }) => {
  // wait for a few seconds to record final state of the test
  await page.waitForTimeout(3000);
});

test("AppState has correct user", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForURL("**/dashboard");
  const json = await page.evaluate(() =>
    window.localStorage.getItem("AppState")
  );
  const { state } = JSON.parse(json!);
  console.log(state);
  expect(state.user.userId).toBe(testUser.id.toString());
  expect(state.user.email).toBe(testUser.email);
  expect(state.user.name).toBe(testUser.name);
  expect(state.user.firebaseUid).toBe(testUser.firebaseUid);
});
