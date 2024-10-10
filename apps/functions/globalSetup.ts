import type { GlobalSetupContext } from "vitest/node";

export default function setup({ provide }: GlobalSetupContext) {
  const { TEST_DATABASE_URL } = process.env;
  if (!TEST_DATABASE_URL) {
    throw new Error("TEST_DATABASE_URL must be set");
  }
}
