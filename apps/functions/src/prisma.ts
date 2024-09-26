const { DATABASE_URL, TEST_DATABASE_URL, TESTING } = process.env;

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient({
  datasourceUrl: TESTING ? TEST_DATABASE_URL : DATABASE_URL,
});
