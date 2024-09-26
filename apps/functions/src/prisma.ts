const { DATABASE_URL, TEST_DATABASE_URL, TESTING } = process.env;
const datasourceUrl = TESTING ? TEST_DATABASE_URL : DATABASE_URL;
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient({
  datasourceUrl,
});
