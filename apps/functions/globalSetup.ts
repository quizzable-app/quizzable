import type { GlobalSetupContext } from "vitest/node";

export default function setup({ provide }: GlobalSetupContext) {
  const { DATABASE_URL, TEST_DATABASE_URL } = process.env;
  if (!TEST_DATABASE_URL) {
    throw new Error("TEST_DATABASE_URL must be set");
  }
  if (TEST_DATABASE_URL !== DATABASE_URL) {
    throw new Error("DATABASE_URL must be set to TEST_DATABASE_URL");
  }
}
