import {
  AuthBlockingEvent,
  AuthUserRecord,
  HttpsError,
} from "firebase-functions/v2/identity";
import { beforeAll, test, describe, expect } from "vitest";
import { prisma } from "./prisma";
import { User } from "@prisma/client";
import { seed } from "../../../prisma/seed";
import { beforeUserCreatedHandler, beforeUserSignedInHandler } from "./auth";

let testUser: User;

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "Organization" CASCADE;`;
  await seed();
  testUser = await prisma.user.findFirstOrThrow({
    where: { firebaseUid: null },
  });
});

describe("beforecreated", async () => {
  test("should link an existing user to a new Firebase user", async () => {
    const uid = `TEST_UID_${Date.now()}`;
    const event: any = {
      data: {
        uid,
        email: testUser.email,
        emailVerified: true,
        disabled: false,
      },
    };

    const result = await beforeUserCreatedHandler(event as AuthBlockingEvent);
    expect(result.customClaims.userId).toBe(testUser.id.toString());
    expect(result.customClaims.roles).toEqual(["STUDENT"]);
    expect(result.displayName).toBe(testUser.name);

    const updatedUser = await prisma.user.findFirstOrThrow({
      where: { firebaseUid: uid },
    });

    expect(updatedUser.id).toBe(testUser.id);
    expect(updatedUser.id.toString()).toBe(result.customClaims.userId);
    expect(updatedUser.Roles).toEqual(result.customClaims.roles);
  });
});
