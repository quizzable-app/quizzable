import { type FullConfig } from "@playwright/test";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { prisma } from "./lib/prisma";

const { NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId, TEST_USER_EMAIL } =
  process.env;

initializeApp({ projectId });

async function globalSetup(config: FullConfig) {
  const testUser = await prisma.user.findUniqueOrThrow({
    where: { email: TEST_USER_EMAIL },
  });

  if (!testUser.firebaseUid) {
    await getAuth()
      .createUser({
        displayName: testUser.name,
        email: testUser.email,
      })
      .then(async ({ uid }) => {
        console.log("Created firebase user:", uid);
        await prisma.user.update({
          where: { id: testUser.id },
          data: { firebaseUid: uid },
        });
      });
  }

  const firebaseUser = await getAuth().getUserByEmail(testUser.email);
  await getAuth().setCustomUserClaims(firebaseUser.uid, {
    roles: testUser.Roles,
    userId: testUser.id.toString(),
  });

  process.env.AUTH_TOKEN = await getAuth().createCustomToken(firebaseUser.uid);
}

export default globalSetup;
