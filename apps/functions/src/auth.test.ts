import { AuthBlockingEvent, HttpsError } from "firebase-functions/v2/identity";
import { beforeAll, test, expect, suite } from "vitest";
import { prisma } from "./prisma";
import { User } from "@prisma/client";
import { seed } from "../../../prisma/seed";
import { beforeUserCreatedHandler, beforeUserSignedInHandler } from "./auth";

let testUser: User;
const testUid = `TEST_UID`;

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "Organization" CASCADE;`;
  await seed();
  testUser = await prisma.user.findFirstOrThrow({
    where: { firebaseUid: null },
  });
});

suite("auth.test.ts", { sequential: true }, async () => {
  suite("beforeUserCreatedHandler", async () => {
    test("should not allow a new user to be created without a name", async () => {
      const event: any = {
        data: {
          uid: "NEW_UID",
          email: "email@example.com",
          emailVerified: true,
          disabled: false,
          displayName: undefined,
        },
      };

      try {
        await beforeUserCreatedHandler(event as AuthBlockingEvent);
        throw new Error("Should not reach here");
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpsError);
        expect(err.code).toBe("invalid-argument");
        expect(err.message).toBe("Display name is required");
      }
    });

    test("should create a new user with the correct inputs", async () => {
      const event: any = {
        data: {
          uid: "NEW_UID",
          email: "email@example.com",
          emailVerified: true,
          disabled: false,
          displayName: "New User",
        },
      };

      const result = await beforeUserCreatedHandler(event as AuthBlockingEvent);
      expect(result.displayName).toBe(event.data.displayName);
      expect(result.customClaims.userId).toBeDefined();
      expect(result.customClaims.roles).toEqual([]);
    });

    test("should link an existing user to a new firebaseUser", async () => {
      const event: any = {
        data: {
          uid: testUid,
          email: testUser.email,
          emailVerified: true,
          disabled: false,
        },
      };

      const result = await beforeUserCreatedHandler(event as AuthBlockingEvent);
      expect(result.customClaims.userId).toBe(testUser.id.toString());
      expect(result.customClaims.roles).toEqual(testUser.Roles);
      expect(result.displayName).toBe(testUser.name);

      const updatedUser = await prisma.user.findFirstOrThrow({
        where: { firebaseUid: testUid },
      });

      expect(updatedUser.id).toBe(testUser.id);
      expect(updatedUser.id.toString()).toBe(result.customClaims.userId);
      expect(updatedUser.Roles).toEqual(result.customClaims.roles);
    });

    test("should not allow a user with an existing firebaseUid to create a new firebaseUser", async () => {
      const event: any = {
        data: {
          uid: testUid,
          email: testUser.email,
          emailVerified: true,
          disabled: false,
        },
      };
      try {
        await beforeUserCreatedHandler(event as AuthBlockingEvent);
        throw new Error("Should not reach here");
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpsError);
        expect(err.code).toBe("already-exists");
        expect(err.message).toBe("User has already been linked to Firebase");
      }
    });

    test("should not allow a user without an email address to create a new firebaseUser", async () => {
      const event: any = {
        data: {
          uid: testUid,
          email: undefined,
          emailVerified: true,
          disabled: false,
        },
      };
      try {
        await beforeUserCreatedHandler(event as AuthBlockingEvent);
        throw new Error("Should not reach here");
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpsError);
        expect(err.code).toBe("invalid-argument");
        expect(err.message).toBe("Email is required");
      }
    });
  });

  suite("beforeUserSignedInHandler", async () => {
    test("should sign in an existing user and correctly set customClaims", async () => {
      const event: any = {
        data: {
          uid: testUid,
          email: testUser.email,
          emailVerified: true,
          disabled: false,
        },
      };

      const result = await beforeUserSignedInHandler(
        event as AuthBlockingEvent
      );
      expect(result.customClaims.userId).toBe(testUser.id.toString());
      expect(result.customClaims.roles).toEqual(testUser.Roles);
      expect(result.displayName).toBe(testUser.name);
    });

    test("should throw an error if a user isn't found with the specified uid", async () => {
      const event: any = {
        data: {
          uid: "NON_EXISTENT_UID",
          email: testUser.email,
          emailVerified: true,
          disabled: false,
        },
      };

      try {
        await beforeUserSignedInHandler(event as AuthBlockingEvent);
        throw new Error("Should not reach here");
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpsError);
        expect(err.code).toBe("not-found");
        expect(err.message).toBe("User not found");
      }
    });
  });
});
