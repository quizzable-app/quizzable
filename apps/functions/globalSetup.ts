import type { GlobalSetupContext } from "vitest/node";

export default function setup({ provide }: GlobalSetupContext) {
  const { DATABASE_URL, TEST_DATABASE_URL } = process.env;
  if (!(DATABASE_URL || TEST_DATABASE_URL)) {
    throw new Error("DATABASE_URL or TEST_DATABASE_URL must be set");
  }
}
