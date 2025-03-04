// src/index.ts
import { context, getOctokit } from "@actions/github";
var { GITHUB_TOKEN, TAG_NAME } = process.env;
async function run() {
  if (TAG_NAME === void 0) throw new TypeError("TAG_NAME is not set.");
  if (GITHUB_TOKEN === void 0) throw new TypeError("GITHUB_TOKEN is not set.");
  const prTitle = `\u{1F680} Release: ${TAG_NAME}`;
  const prBody = `This PR updates the \`package.json\` version and \`CHANGELOG.md\` for the new release **${TAG_NAME}**.`;
  const baseBranch = "main";
  const headBranch = `release-${TAG_NAME}`;
  getOctokit(GITHUB_TOKEN).rest.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: prTitle,
    body: prBody,
    base: baseBranch,
    head: headBranch
  }).then((response) => {
    console.log(`PR created: ${response.data.html_url || "N/A"}`);
  }).catch((error) => {
    console.error("Failed to create PR:", error);
    process.exit(1);
  });
}
run();
