import type { GlobalSetupContext } from "vitest/node";

export default function setup({ provide }: GlobalSetupContext) {
  const { DATABASE_URL, TEST_DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!TEST_DATABASE_URL) {
    throw new Error("TEST_DATABASE_URL is not set");
  }
  if (DATABASE_URL !== TEST_DATABASE_URL) {
    throw new Error("DATABASE_URL should be set to TEST_DATABASE_URL");
  }
}
