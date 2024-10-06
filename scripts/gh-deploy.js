#!/usr/bin/env node
const { execSync } = require("child_process");
const os = require("os");
const osType = os.type();

const now = new Date();
execSync(
  "gh workflow run deploy.yaml --ref $(git rev-parse --abbrev-ref HEAD)",
  { stdio: "inherit" }
);
getRunUrl();

async function getRunUrl() {
  const [res] = JSON.parse(
    execSync(
      `gh run list --workflow deploy.yaml --commit $(git rev-parse HEAD) --event workflow_dispatch --limit 1 --json url,createdAt`
    ).toString()
  );

  const { url, createdAt } = res;

  if (new Date(createdAt || 0) >= now) {
    console.log(`Opening the workflow run: ${url}`);
    if (osType === "Darwin") {
      execSync(`open ${url}`);
    } else if (osType === "Windows_NT") {
      execSync(`start ${url}`);
    }
  } else {
    console.log("Waiting for the workflow run to start...");
    await new Promise(() => setTimeout(getRunUrl, 5000));
  }
}
