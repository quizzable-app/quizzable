import {
  beforeUserCreated,
  beforeUserSignedIn,
  AuthUserRecord,
  HttpsError,
} from "firebase-functions/v2/identity";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { User } from "@prisma/client";
import { prisma } from "./prisma";

const app = initializeApp();
const auth = getAuth(app);

async function updateFirebaseUser({
  user,
  firebaseUser,
}: {
  user: User;
  firebaseUser: AuthUserRecord;
}) {
  // Update firebaseUser's name to match user's name
  if (firebaseUser.displayName !== user.name) {
    auth
      .updateUser(firebaseUser.uid, {
        displayName: user.name,
      })
      .then((userRecord) => {
        console.log("Successfully updated user", userRecord.toJSON());
      })
      .catch((error) => {
        console.log("Error updating user:", error);
      });
  }
}

export const beforecreated = beforeUserCreated(async (event) => {
  const firebaseUser = event.data;
  if (!firebaseUser.email) {
    throw new HttpsError("invalid-argument", "Email is required");
  }

  let user = await prisma.user.findUnique({
    where: { email: firebaseUser.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName!,
      },
    });
  } else if (user.firebaseUid && user.firebaseUid !== firebaseUser.uid) {
    throw new HttpsError("already-exists", "User already exists");
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { firebaseUid: firebaseUser.uid },
    });
  }

  await updateFirebaseUser({ user, firebaseUser });

  return {
    customClaims: {
      userId: user.id.toString(),
      roles: user.Roles,
    },
  };
});

export const beforesignin = beforeUserSignedIn(async (event) => {
  const firebaseUser = event.data;
  const user = await prisma.user.findUniqueOrThrow({
    where: { firebaseUid: firebaseUser.uid },
  });

  await updateFirebaseUser({ user, firebaseUser });

  return {
    customClaims: {
      userId: user.id.toString(),
      roles: user.Roles,
    },
  };
});
