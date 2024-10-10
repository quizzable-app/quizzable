const { DATABASE_URL, TEST_DATABASE_URL } = process.env;
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient({
  datasourceUrl: TEST_DATABASE_URL ?? DATABASE_URL,
});
