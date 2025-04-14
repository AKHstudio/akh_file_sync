const { GITHUB_TOKEN, TAG_NAME } = process.env;
import { summary } from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run() {
    if (TAG_NAME === undefined) throw new TypeError('TAG_NAME is not set.');
    if (GITHUB_TOKEN === undefined) throw new TypeError('GITHUB_TOKEN is not set.');

    const octokit = getOctokit(GITHUB_TOKEN);

    octokit.rest.repos
        .listReleases({
            owner: context.repo.owner,
            repo: context.repo.repo,
        })
        .then(({ data }) => {
            const draftRelease = data.find((release) => release.name?.includes(TAG_NAME) && release.draft);
            if (draftRelease) {
                octokit.rest.repos
                    .deleteRelease({
                        owner: context.repo.owner,
                        repo: context.repo.repo,
                        release_id: draftRelease.id,
                    })
                    .then(async (res) => {
                        console.log('✅️ Draft release deleted successfully:', res.status);
                        await summary.addHeading('✅️ Draft Release Deleted').addRaw('Draft release deleted successfully.').write();
                    })
                    .catch(async (error) => {
                        console.error('❌️ Failed to delete draft release:', error);
                        await summary
                            .addHeading('❌️ Failed to delete draft release')
                            .addCodeBlock(JSON.stringify(error, null, 2), 'json')
                            .write();
                    });
            } else {
                console.log('No draft release found with the specified tag name.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

run();
