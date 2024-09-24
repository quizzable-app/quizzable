import {
  beforeUserCreated,
  beforeUserSignedIn,
  AuthBlockingEvent,
  HttpsError,
} from "firebase-functions/v2/identity";
import { prisma } from "./prisma";

export const beforesignin = beforeUserSignedIn(beforeUserSignedInHandler);
export const beforecreated = beforeUserCreated(beforeUserCreatedHandler);

export async function beforeUserCreatedHandler(
  event: AuthBlockingEvent
): Promise<{
  displayName: string;
  customClaims: {
    userId: string;
    roles: string[];
  };
}> {
  const firebaseUser = event.data;
  if (!firebaseUser.email) {
    throw new HttpsError("invalid-argument", "Email is required");
  }

  let user = await prisma.user.findUnique({
    where: { email: firebaseUser.email },
  });

  if (!user) {
    if (!firebaseUser.displayName) {
      throw new HttpsError("invalid-argument", "Display name is required");
    }
    user = await prisma.user.create({
      data: {
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName,
      },
    });
  } else if (user.firebaseUid) {
    throw new HttpsError("already-exists", "User already exists");
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { firebaseUid: firebaseUser.uid },
    });
  }

  return {
    displayName: user.name,
    customClaims: {
      userId: user.id.toString(),
      roles: user.Roles,
    },
  };
}

export async function beforeUserSignedInHandler(
  event: AuthBlockingEvent
): Promise<{
  displayName: string;
  customClaims: {
    userId: string;
    roles: string[];
  };
}> {
  const firebaseUser = event.data;
  const user = await prisma.user
    .findUniqueOrThrow({
      where: { firebaseUid: firebaseUser.uid },
    })
    .catch((err) => {
      if (err.code === "P2025") {
        throw new HttpsError("not-found", "User not found");
      }
      throw err;
    });

  return {
    displayName: user.name,
    customClaims: {
      userId: user.id.toString(),
      roles: user.Roles,
    },
  };
}
