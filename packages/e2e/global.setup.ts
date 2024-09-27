import { type FullConfig } from "@playwright/test";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { prisma } from "./lib/prisma";

const { FIREBASE_PROJECT_ID } = process.env;
const testUid = "E2E_TEST_UID";

initializeApp({ projectId: FIREBASE_PROJECT_ID });

async function globalSetup(config: FullConfig) {
  const testUser = await prisma.user.findFirstOrThrow();
  await prisma.user.update({
    where: { id: testUser.id },
    data: { firebaseUid: testUid },
  });

  const firebaseUser = await getAuth().createUser({
    uid: testUid,
    displayName: testUser.name,
    email: testUser.email,
  });

  await getAuth().setCustomUserClaims(firebaseUser.uid, {
    roles: testUser.Roles,
    userId: testUser.id.toString(),
  });

  process.env.AUTH_TOKEN = await getAuth().createCustomToken(firebaseUser.uid);
  process.env.TEST_USER_ID = testUser.id.toString();
}

export default globalSetup;
