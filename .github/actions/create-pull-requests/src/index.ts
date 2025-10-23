const { GITHUB_TOKEN, TAG_NAME } = process.env;
import { summary } from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run() {
    if (TAG_NAME === undefined) throw new TypeError('TAG_NAME is not set.');
    if (GITHUB_TOKEN === undefined) throw new TypeError('GITHUB_TOKEN is not set.');

    const prTitle = `🚀 Release: ${TAG_NAME}`;
    const prBody = `This PR updates the \`package.json\` version and \`CHANGELOG.md\` for the new release **${TAG_NAME}**.`;
    const baseBranch = 'main';
    const headBranch = `release-${TAG_NAME}`;

    getOctokit(GITHUB_TOKEN)
        .rest.pulls.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            title: prTitle,
            body: prBody,
            base: baseBranch,
            head: headBranch,
        })
        .then(async (response) => {
            console.log(`PR created: ${response.data.html_url || 'N/A'}`);
            await summary
                .addHeading('✅️ Pull Request Created')
                .addLink('View PR', response.data.html_url || 'N/A')
                .write();
        })
        .catch(async (error) => {
            console.error('Failed to create PR:', error);
            await summary
                .addHeading('❌️ Failed to create PR')
                .addCodeBlock(JSON.stringify(error, null, 2), 'json')
                .write();
            process.exit(1);
        });
}

run();
