import { type FullConfig } from "@playwright/test";
import { initializeApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { prisma } from "./lib/prisma";

const { NEXT_PUBLIC_FIREBASE_PROJECT_ID } = process.env;
const testUid = "E2E_TEST_UID";

initializeApp({ projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID });

async function globalSetup(config: FullConfig) {
  const testUser = await prisma.user.findFirstOrThrow();
  await prisma.user.update({
    where: { id: testUser.id },
    data: { firebaseUid: testUid },
  });

  const adminAuth = getAdminAuth();
  const firebaseUser = await adminAuth.createUser({
    uid: testUid,
    displayName: testUser.name,
    email: testUser.email,
  });

  await adminAuth.setCustomUserClaims(firebaseUser.uid, {
    roles: testUser.Roles,
    userId: testUser.id.toString(),
  });

  process.env.AUTH_TOKEN = await adminAuth.createCustomToken(firebaseUser.uid);
  process.env.TEST_USER_ID = testUser.id.toString();
  process.env.TEST_USER_EMAIL = testUser.email;
  process.env.TEST_USER_NAME = testUser.name;
  process.env.TEST_USER_FIREBASE_UID = testUid;
}

export default globalSetup;
