import { execSync } from "child_process";
import { chromium, type FullConfig } from "@playwright/test";
import { initializeApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
// import { signInWithCustomToken } from "firebase/auth";
import { prisma } from "./lib/prisma";

const { NEXT_PUBLIC_FIREBASE_PROJECT_ID } = process.env;

initializeApp({ projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID });

async function globalSetup(config: FullConfig) {
  const user = await prisma.user.findFirstOrThrow();
  await prisma.user.update({
    where: { id: user.id },
    data: { firebaseUid: "E2E_TEST_UID" },
  });
  const adminAuth = getAdminAuth();
  const firebaseUser = await adminAuth.createUser({
    uid: "E2E_TEST_UID",
    displayName: user.name,
    email: user.email,
  });

  await adminAuth.setCustomUserClaims(firebaseUser.uid, {
    roles: user.Roles,
    userId: user.id.toString(),
  });

  const token = await adminAuth.createCustomToken(firebaseUser.uid);

  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL!);
  await page.evaluate(async (token) => {
    await globalThis.signInWithCustomToken(token);
  }, token);

  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
